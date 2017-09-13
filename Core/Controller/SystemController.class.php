<?php
/**
 * Author: HongBinfu 
 * Date: 14-10-14
 * Time: 上午11:46
 */
defined("WOWOSTAR") or exit();
class SystemController extends Controller
{
    public function getSystemInfo()
    {
        return !empty($_SESSION["_SYSTEM_INFO"])?$_SESSION["_SYSTEM_INFO"]:false;
    }
    /**
     *
     */
    public function loadSystemInfoToSession()
    {
        $limitInfoStr = self::$CAR->GetServerInfo();
        //解析返回值
        $limitInfo = json_decode($limitInfoStr,true);
        $isReg = false;
        $isTrial = true;
        if($limitInfo && $limitInfo['ret']==0)
        {
            $isReg = true;
            $isTrial = $limitInfo['IS_TRIAL'];
        }
        $_SESSION['_SYSTEM_INFO']=array();
		
        $version = "DLP V5.1.0.0.5672";
		
        $type=$isTrial?"试用版":"授权版";
        $_SESSION['_SYSTEM_INFO']['IS_REG']=$isReg;
        $_SESSION['_SYSTEM_INFO']['IS_TRIAL_NAME']=$isTrial?"是":"否";
        $_SESSION['_SYSTEM_INFO']['VERSION']=$version;
        $_SESSION['_SYSTEM_INFO']['VERSION_TYPE']=$type;
        $_SESSION['_SYSTEM_INFO']['VERSION_INFO']=$version."  <span id='u-version-type'>".$type."</span>";
        $_SESSION['_SYSTEM_INFO']['COMPANY_NAME']=isset($limitInfo['COMPANY'])?$limitInfo['COMPANY']:"";
        //到期时间
        $expire = isset($limitInfo['EXPIRE'])?$limitInfo['EXPIRE']:0;
        $expirationDate = 0;
        if(method_exists(self::$CAR,"GetTimeOut")){
            $exp = self::$CAR->GetTimeOut();
            $exp=json_decode($exp,true);
            $expirationDate = $exp['TIME']/86400;
        }else{
            if($expire>time())
            {
                $expirationDate = ceil(($expire - time())/86400);
            }
        }

        if($expirationDate<=5)
        {
            $expirationDate = "<span style='color:red;'>".$expirationDate."</span>";
        }
        //剩余天数
        $_SESSION['_SYSTEM_INFO']['EXPIRATION_DATE']=$expirationDate;
        $_SESSION['_SYSTEM_INFO']['EXPIRE']=isset($limitInfo['EXPIRE'])?$limitInfo['EXPIRE']:"";
        $_SESSION['_SYSTEM_INFO']['MAX_CLIENT']=isset($limitInfo['MAX_CLIENT'])?$limitInfo['MAX_CLIENT']:"";
    }

    /**
     * 制作机器码
     */
    public function createMachineCode()
    {
        $company = $this->getParams("company");
        if(empty($company))
        {
           $this->_error(-2);
        }
        $ret=self::$CAR->CreateMachineCode($company);
       //$ret = array("ret"=>0,"MACHINE_CODE"=>"sssssssssssssaxacsscasxa");
        if(!empty($ret))
        {
            $ret = json_decode($ret,true);
            if(isset($ret['MACHINE_CODE']) && !empty($ret['MACHINE_CODE']))
            {
                $code = md5(uniqid());
                $file = TEMP_PATH.$code.".".$this->getConfig('DOWNLOAD_FILE_TYPE');
                file_put_contents($file,$ret['MACHINE_CODE']);
                $ret = array("code"=>$code,"ret"=>0);
            }
        }
        else{
            $ret = array("ret"=>-2);
        }
        $this->_ajaxReturn($ret);
    }
    /*
     * 注册
     */
    public function doReg()
    {
        /*$company = $this->getParams("company",false);
        $regCode = $this->getParams("regCode",false);
        if($company===false || $regCode===false || !isset($_FILES) || empty($_FILES))
        {
            $this->_error(-2);
        }*/
        $uuid = md5(uniqid("",true));
        Common::vendor("Upload");
        $fileInfo = $_FILES['licenseFile'];
        if(empty($fileInfo))
        {
            $this->_error(-2);
        }
        $fileArr['file'] = $fileInfo['tmp_name'];
        $fileArr['name'] = $fileInfo['name'];
        $fileArr['size'] = $fileInfo['size'];
        $fileArr['type'] = $fileInfo['type'];
        $limitFileType = "*";
        $fileName = $uuid.'.' . Common::getFileType($fileInfo['name']);
        $savePath =  $this->getConfig('TEMP_PATH');
        $filePath = $savePath.$fileName;
        $upload = new upload($fileArr, $fileName, $savePath, $limitFileType, 0, 1024 * 1024 * $this->getConfig('IMPORT_LICENSE_FILE_SIZE'));
        if (!$upload->run())
        {
            $msg = $this->getLang('uploadFileError')[$upload->errno];
            $this->_ajaxReturn(array("ret"=>-1,"error_info"=>$msg),'json');
        }
        //读取注册信息
        $license = file_get_contents($filePath);
        unlink($filePath);
        $ret = self::$CAR->SetServerLimit($license);

        /**
         * 注册操作
         */
        //$ret['ret']=0;
        $res = json_decode($ret,true);
        if($res && $res['ret']==0)
        {
            $this->loadSystemInfoToSession();
        }
        $this->_ajaxReturn($ret);
    }
    private function _rand($length)
    {
        $key="";
        $pattern='1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLOMNOPQRSTUVWXYZ';
        for($i=0;$i<$length;$i++)
        {
            $key .= $pattern[mt_rand(0,35)];    //生成php随机数
        }
        return $key;
    }
    public function makeUninstall()
    {
        $code = $this->getParams("code",false);
        if($code === false)
        {
            $this->_error(-2);
        }
        $get = self::$CAR->CheckUninstallCode($code);
        $res = json_decode($get,true);
        $ret= array("ret"=>-2,"error_info"=>$this->getLang('uninstallCodeError'));
        if($res && $res['ret']==0)
        {
            $ret=array();
            $ret['ret']=0;
            $ret['code']=$res['UNINSTALL_CODE'];
            $ret['time']=date("Y-m-d H:i:s",$res['END_TIME']);
            //$res['START_TIME']
        }
        $this->_ajaxReturn($ret);
    }
}
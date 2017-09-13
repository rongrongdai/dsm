<?php
/**
 *  用户模块
 */
defined("WOWOSTAR") or exit();
class UserController extends Controller
{

    public function index()
    {
        $this->display();
    }
    function __init()
    {

    }

    /**
     * 查看用户列表
     */
    public function getUserList()
    {
        //组的guParentGroupGuid
        $ParentGroupGuid=$this->getParams('ParentGroupGuid');
        /*if( empty($ParentGroupGuid) )
        {
            $this->_ajaxReturn('{"total":0,"rows":[]}');
        }*/

        $ShowDeleted = $this->getParams('ShowDeleted',0,'int');
        if($ShowDeleted!=0 && !$this->_isAdmin())
        {
            $ShowDeleted = 0;
        }
        $ShowFrozen = $this->getParams('ShowFrozen',0,'int');
        // 分页变量
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');
        $sort = $this->getParams('sort',"loginname");
        $order = $this->getParams('order','asc');


        $start=$rows * ($page-1);
        $count=$rows;
        $orderColumn=1;
        $ordertype = 0;

        if( $sort != '' )
        {
            if( $sort == 'loginname' )
            {
                $orderColumn=1;
            }
            else if( $sort == 'displayname' )
            {
                $orderColumn=2;
            }
            else if( $sort == 'online' )
            {
                $orderColumn = 3;
            }
            else if( $sort == 'group')
            {
                $orderColumn = 4;
            }
            else if( $sort == 'offlineduration' )
            {
                $orderColumn = 5;
            }
            else if( $sort == 'deleted_status' )
            {
                $orderColumn = 6;
            }
        }


        if( $order == "desc" ){
            $ordertype = 1;
        }

        $searchOnline = true;
        $searchOffline = true;

        $isOnline=$this->getParams('IsOnline',0,'int');
        if($isOnline)
        {
            if($_REQUEST['IsOnline']==1)
            {
                $searchOnline = true;
                $searchOffline = false;
            }
            else if($isOnline==2)
            {
                $searchOnline = false;
                $searchOffline = true;
            }
        }
        $searchOfflineTime1 = '';
        $searchOfflineTime2 = '';
        $searchOfflineType=0;
        $key=$this->getParams('Key',false) !==false ? "*".$this->getParams('Key')."*":"";
        $noIncludeAdmin = true;
        if($ParentGroupGuid == "_NoGroupUser_")
        {
            $ret =self::$CAR->ListGroupByPattern( self::$SID , "*_NoGroupUser_*" , 0 );

			$res = json_decode($ret,true);
			if($res['Ret'])
			{
				$this->_ajaxReturn($ret);
			}
			else
			{
				$noGroupUsers = array();

				foreach($res['Group'] as $k=>$v)
				{
					$ret1 = self::$CAR->ListUserSumaryEx( self::$SID, $v['id'],$key, 0, 1000000, $orderColumn, $ordertype,
                        $searchOnline, $searchOffline,$ShowFrozen,$ShowDeleted, $searchOfflineTime1, $searchOfflineTime2, $searchOfflineType,$noIncludeAdmin);
					$res1 = json_decode($ret1,true);
                    //L(var_export($v['id'],true),__FILE__,__LINE__);
					if($res1['ret'] == 0 && !empty($res1['rows']))
					{
						foreach($res1['rows'] as $kk =>$vv)
						{
							$noGroupUsers[] = $vv;
						}
					}
				}
			    $retArr = array(
					"total"=>count($noGroupUsers),
					"rows" => $noGroupUsers
				);
				$this->_ajaxReturn($retArr);
			}
			
        }
		else
		{
			$ret = self::$CAR->ListUserSumaryEx( self::$SID, $ParentGroupGuid,$key, $start, $count, $orderColumn, $ordertype,
            $searchOnline, $searchOffline,$ShowFrozen,$ShowDeleted, $searchOfflineTime1, $searchOfflineTime2, $searchOfflineType ,$noIncludeAdmin);
			if( !isset($ret) || $ret=='' )
			{
				$this->_ajaxReturn('{"total":0,"rows":[]}');
			}
			else
			{
				$this->_ajaxReturn($ret);
			}
		}
        
    }

    /**
     * 获取角色树
     */

    public function getRoleTree()
    {
        Common::controller('Role')->getRoleTree();
    }

    /**
     * 添加员工
     */

    public function addUser()
    {
        $guid = $this->getParams('Adduser_ParentGuid',false);
        $name=$this->getParams('Adduser_UserName',false);
        $displayname=$this->getParams('Adduser_DisplayName',false);
        $password=$this->getParams('Adduser_Password',false);
        $RoleID = $this->getParams('RoleID');
        if( $guid===false || $name===false || $displayname===false || $password===false )
        {
            $this->_error(-2);
        }
        //L();
        $ret = self::$CAR->AddUser( self::$SID, $guid, $name, $displayname, $password ,$RoleID);
        $this->_ajaxReturn($ret);
    }

    /**
     * 编辑员工
     */
    public function editUser()
    {
        $guid=$this->getParams('guid');
        $displayname=$this->getParams('DisplayName');
        $pwd=$this->getParams('Password');
        $groupStr=$this->getParams('group');
        $group = explode(",",$groupStr);
        $RoleID = $this->getParams('RoleID');
        if( empty($guid) )
        {
            $this->_error(-2);
        }

        $guidArr = explode( ',', $guid );
        $guids = $guidArr;
        $groupArr=$group;
        if( count($guidArr)==0 )
        {
            $this->_ajaxReturn('{"ret":0,"rows":[],"total":0}');
        }
        $guidArr=json_encode($guidArr);

        if( count($group) > 0 )
        {
            $group = json_encode($group);
        }
        else
        {
            $group='';
        }
        $displayname = count($guids)<=1?$displayname:'';
        $group =count($guids)<=1?$group:'';
        // 执行
        $ret = self::$CAR->ModifyUserInfo( self::$SID, $guidArr, $displayname, $pwd, $group ,$RoleID);
        //$res = json_decode($ret,true);
        //L(var_export($guids,true),__FILE__,__LINE__);
        foreach($guids as $i)
        {
            $tmp = 1;
            foreach($groupArr as $v)
            {
                $iRet = self::$CAR->MoveUserToGroup(self::$SID,$i,$v,$tmp);
                $tmp=0;
            }
        }
        $this->_ajaxReturn($ret);
    }

    /**
     * 删除员工
     */
    public function delUser()
    {
        $usersStr = $this->getParams('Users',array(),'array');
        if(empty($usersStr))
        {
            $this->_error(-2);
        }
        $users = json_encode( $usersStr );
        $bIsDel = $this->getParams('IsDelUser',1,'int');
        $bIsRestore = $this->getParams('IsRestore',0,'int');
        if($bIsDel == 3 && $bIsRestore==1)
        {
            $iRet = self::$CAR->DeleteUser( self::$SID,$users,0, 1 );
            $iRet = self::$CAR->DeleteUser( self::$SID,$users,1, 1 );
        }
        else
        {
            $iRet = self::$CAR->DeleteUser( self::$SID,$users,$bIsDel, $bIsRestore );
        }
        $this->_ajaxReturn($iRet);
    }

    /**
     * 导入员工
     */
    public function importUser()
    {
        $importType=$this->getParams('import_type',1,'int');
        //文件导入
        if( $importType == 1 ){

            /*if (IsNotEmpty($_FILES) && IsNotEmpty($_FILES["file"]) && $_FILES["file"]["size"] < 1024 * 1024 * (int)$this->getConfig('IMPORT_USER_FILE_SIZE')){
                //只允许上传50M文件
                if ($_FILES["file"]["error"] > 0){
                    $this->_ajaxReturn('{"ret":-10, "error_code":'.$_FILES["file"]["error"].'}');
                } else {
                    //如果目录不存在创建目录
                    if(!file_exists($this->getConfig('TEMP_PATH'))){
                        function createFolder($path) {
                            if (!file_exists($path)) {
                                createFolder(dirname($path));
                                mkdir($path, 0777);
                            }
                        }
                        createFolder($this->getConfig('TEMP_PATH'));
                    }
                    $uniqid = md5(uniqid(self::$SID,true));
                    $fileName = $_FILES["file"]["name"]; //获取上传的文件名称
                    $fileType = pathinfo($fileName, PATHINFO_EXTENSION);//获取后缀
                    $savePath =  $this->getConfig('TEMP_PATH') . $uniqid. '.' . $fileType;
                    $savePath = iconv('UTF-8', 'GB2312', $savePath);
                    $tmpPath = $_FILES["file"]["tmp_name"];
                    move_uploaded_file($tmpPath, $savePath);
                }
            } else {
                $this->_ajaxReturn('{"ret":-10, "error_info":"'.sprintf($this->getLang('exceededFileSizeLimit'),$this->getConfig('IMPORT_USER_FILE_SIZE')).'"}');
            }*/
            //检查参数
            $guid = $this->getParams('guid','');
            if(!isset($_FILES))
            {
                $this->_error(-2,'json');
            }
            $uuid = md5(uniqid("",true));
            Common::vendor("Upload");
            $fileArr['file'] = $_FILES['file']['tmp_name'];
            $fileArr['name'] = $_FILES['file']['name'];
            $fileArr['size'] = $_FILES['file']['size'];
            $fileArr['type'] = $_FILES['file']['type'];
            $limitFileType = $this->getConfig('IO_USER_FILE_TYPE');
            $fileName = $uuid.'.' . Common::getFileType($_FILES['file']['name']);
            $savePath =  $this->getConfig('TEMP_PATH');
            $filePath = $savePath.$fileName;
            $upload = new upload($fileArr, $fileName, $savePath, $limitFileType, 0, 1024 * 1024 * $this->getConfig('IMPORT_USER_FILE_SIZE'));
            if (!$upload->run())
            {
                $msg = $this->getLang('uploadFileError')[$upload->errno];
                $this->_ajaxReturn(array("ret"=>-1,"error_info"=>$msg),'json');
            }
            //转换成绝对路径
            $filePath =  realpath($filePath);
            $ret = self::$CAR->ImportOrglizeFromFile(self::$SID, $filePath, $guid);
            unlink($filePath);
        } else {
            //域导入
            $guid = $this->getParams('guid');
            $ret = self::$CAR->ImportOrglizeFromAd(self::$SID, $guid);
        }
        $this->_ajaxReturn($ret,'json');
    }

    /**
     * 导出员工
     */
    public function exportUser()
    {
        $savePath =  realpath($this->getConfig('TEMP_PATH'));
        $uniqid = md5(uniqid('',true));
        $fileType = $this->getConfig('DOWNLOAD_FILE_TYPE');
        $fileName = $uniqid. '.' . $fileType;
        $savePath =  $savePath . DIRECTORY_SEPARATOR . $fileName;
        $guid = $this->getParams('guid');
        $ret = self::$CAR->ExportOrglizeToFile(self::$SID, $savePath, $guid);
        $result = json_decode($ret);
        if($result->ret){
            $this->_ajaxReturn($ret);
        }

        //首判断给定的文件存在与否
        if(!file_exists($savePath)){
            $this->_ajaxReturn('{"ret":-10, "error_info":'.$this->getLang('fileDoesNotExist').'}');
        }
        $this->_ajaxReturn(array(
            "ret"=>0,
            "code"=>$uniqid
        ));
		
    }

    /**
     * 生成离线授权文件
     */
    public function generateOfflineFile()
    {

        $savePath =  realpath($this->getConfig('TEMP_PATH'));
        $guid = array();
        if($this->getParams('guid',false) !== false){
            $guid = explode(",",$this->getParams('guid'));
        }
        $loginname = array();
        if($this->getParams('loginname',false) !== false){
            $loginname = explode(",",$this->getParams('loginname'));
        }
        $displayname = array();
        if($this->getParams('displayname',false) !== false){
            $displayname = explode(",",$this->getParams('displayname'));
        }
        $pwd = $this->getParams('checkPwd');
        $beginTime = $this->getParams('timeStart',false) !== false ?date('Y-m-d-H-i', strtotime($this->getParams('timeStart'))):"";
        $endTime = $this->getParams('timeEnd',false) !== false ?date('Y-m-d-H-i', strtotime($this->getParams('timeEnd'))):"";
        $timeLong = $this->getParams('timeLong',0,'int');
        $checkType = (!empty($timeLong) && !empty($beginTime) && !empty($endTime)) ? 3 : (empty($timeLong) ? 2 : 1);
        $data = array(
            'BeginTime' => $beginTime,
            'EndTime' => $endTime,
            'TimeCanOffLinePerMin' => $timeLong,
            'OfflineCheckType'=>$checkType
        );
        $json = json_encode($data);

        $exportPath=array();
        $fileType = $this->getConfig('DOWNLOAD_FILE_TYPE');
        foreach($guid as $k => $v)
        {
            $uniqid = md5(uniqid('',true));
            $fileName = $uniqid. '.' . $fileType;
            $path =  $savePath.DIRECTORY_SEPARATOR . $fileName;
            //$realPath =  realpath($path);
            $exportPath[$k]['uuid']=$uniqid;
            $exportPath[$k]['path']=$path;
            //$exportPath[$k]['realpath']=$realPath;
            $exportPath[$k]['guid']=$v;
            $exportPath[$k]['displayname']=$displayname[$k];
            $exportPath[$k]['loginname']=$loginname[$k];
            $retStr = self::$CAR->ExportOfflinePolicy(self::$SID, $v, $path, $pwd, $json);
            $res = json_decode($retStr,true);
            if($res['ret']!=0)
            {
                $this->_error($res['ret']);
            }
        }

        //集合文件的uuid
        $exportFileUUID=md5(uniqid('',true));
        //集合文件的path
        $exportFile = $savePath.DIRECTORY_SEPARATOR.$exportFileUUID.".".$fileType;
        //文件总数
        $exportFileCount = count($exportPath);
        //压缩包内的文件类型
        $itemType = $this->getConfig('USER_OFFLINE_FILE_TYPE');
        if($exportFileCount>1)
        {
            $zip = new ZipArchive;
            $res = $zip->open($exportFile, ZipArchive::CREATE);
            foreach($exportPath as $a=>$b)
            {
                $itemName = $b['loginname']."(".$b['displayname'].").". $itemType;
                $zip->addFile($b['path'],iconv('UTF-8','GBK',$itemName));
            }
            $zip->close();
            foreach($exportPath as $c=>$d)
            {
                unlink($d['path']);
            }
        }
        else if($exportFileCount == 1)
        {
            $exportFile = $exportPath[0]['path'];
            $exportFileUUID = $exportPath[0]['uuid'];
        }
        else
        {
            $this->_ajaxReturn(-1);
        }
        //首判断给定的文件存在与否
        if(!file_exists($exportFile)){
            $this->_ajaxReturn('{"ret":-10, "error_info":"'.$this->getLang('fileDoesNotExist').'"}');
        }

        $this->_ajaxReturn(array(
            "ret"=>0,
            "code"=>$exportFileUUID
        ));
    }

    
}
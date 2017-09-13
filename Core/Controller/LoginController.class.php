<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-18
 * Time: 上午10:56
 *
 * 登陆模块
 *
 */
defined("WOWOSTAR") or exit();
class LoginController extends Controller
{
    public function doLogin()
    {
        //载入权限
        //$this->_destroySession();
        $ip=$_SERVER['REMOTE_ADDR'] . ':' . $_SERVER['REMOTE_PORT'];
        $name=$this->getParams('name');
        $password=$this->getParams('password');
        $ret=self::$CAR->Login(
            $name,
            $password,
            self::$SID,
            strtoupper($_SERVER['HTTP_USER_AGENT']),
            $ip);

	    if($ret == 0)
		{
            $loadUserInfo = $this->loadUserInfoToSession();

            if(intval($loadUserInfo) == -1)
            {
                self::$CAR->Logoff(self::$SID);
                $this->_destroySession();
                $this->_ajaxReturn(array(
                    "ret"=>-1,
                    "error_info"=>$this->getConfig('loginPermissionDenied')
                ));
            }
            else if($loadUserInfo == true)
            {
                $this->_ajaxReturn(array("ret"=>0));
            }
            else
            {
                self::$CAR->Logoff(self::$SID);
                $this->_destroySession();
                $this->_ajaxReturn(array(
                    "ret"=>-1,
                    "error_info"=>$this->getConfig('userInfoLoadFailed')
                ));
            }

		}else{
            $this->_ajaxReturn(array("ret"=>$ret));
        }
    }

    //加载用户信息到session
    public function loadUserInfoToSession()
    {
        $userInfo = self::$CAR->GetUserLoginName(self::$SID);
        if(empty($userInfo))
        {
            return false;
        }
        $authRet=self::$CAR->GetCurrentUserAppOperatorLevelWithOutUniqueKey(self::$SID);
        $authRes = json_decode($authRet,true);
        if($authRes['ret']==0)
        {
            $userInfo['Auth']=isset($authRes['Result']['AppOperatorLevel'])?$authRes['Result']['AppOperatorLevel']:array();
        }
        else
        {
            return false;
        }

        $userInfo['IsAdmin'] = $userInfo['LoginName'] == $this->getConfig('SUPER_ADMIN') ? true:false;
        $hashRight = 0;
        foreach($userInfo['Auth'] as $k =>$v)
        {
            if(intval($v['Level'])>0)
            {
                $hashRight++;
                break;
            }
        }
        //判断是否至少拥有一个权限
        if(!$userInfo['IsAdmin'] && $hashRight==0)
        {
            return -1;
        }

        $_SESSION['_USER_INFO'] = $userInfo;
        $this->loadSystemInfoToSession();
        return true;
    }

    /**
     * 加载系统信息到session
     */
    public function loadSystemInfoToSession()
    {
        Common::controller("System")->loadSystemInfoToSession();
    }
    public function doLogout($isReturn=false)
    {
        self::$CAR->Logoff(self::$SID);
        $this->_destroySession();
        if($isReturn)
        {
            return true;
        }
        else{
            $this->_ajaxReturn('{"ret":0}');
        }
    }

    private function _destroySession()
    {
        $_SESSION = array();
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time()-42000, '/');
        }
        // 最后彻底销毁session.
        session_destroy();
        unset($_SESSION);
    }
    static function isLogin()
    {
        return self::$CAR->CheckSessionOnline(self::$SID);
    }
    public function checkLogin()
    {
        $b = self::$CAR->CheckSessionOnline(self::$SID);
        echo $b?1:0;
    }

    public function keepAlive()
    {
        $b = self::$CAR->CheckSessionOnline(self::$SID);
        echo (bool)$b?1:-1;
    }
	
	/**
     * 修改当前用户密码
     */
    public function changeMyPassword(){
        //ChangeMyPassword（ session , oldpwd , newpwd );
        $old = $this->getParams("oldPwd",false);
        $new = $this->getParams("newPwd",false);
         if($old===false)
        {
            $this->_errorInfo($this->getConfig('pleaseEnterOldPwd'));
        }
        if($new===false)
        {
            $this->_errorInfo($this->getConfig('pleaseEnterNewPwd'));
        }
        $ret = self::$CAR->ChangeMyPassword(self::$SID,$old,$new);
        $this->_ajaxReturn($ret);
    }
}
<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-14
 * Time: 下午1:36
 */
defined("WOWOSTAR") or exit();
class Controller
{
    static $CAR=false;
    static $SID;
    protected $_params=array();
    protected $_config=array();
    protected $_lang=array();
    //是否检查权限注册
    public $_checkLimit=true;
    //需要权限控制的方法名（已经废弃不建议使用）
    protected $_reg=array();
    //不需要权限控制的方法名（已经废弃不建议使用）
    protected $_public=array();
    static $VIEW;
    static $CACHE;
    static $CONTROLLER_MODEL;
    protected $_limitGroupAll="";
    protected $_limitGroup="";
    //对象初始化
    public function __construct($options=array())
    {
        $this->_runCar();
        $this->_loadVariable();
        $this->_loadOption($options);
        $this->_loadControllerModel();
        //私密模块禁止前端访问
        if($this->_checkLimit && $this->_isPrivateController())
        {
            Common::_404();
        }
        //如果不是公共模块就检查登录或检查权限
        if(!$this->_isPublicController())
        {
            //检查是否登录
            if(!$this->_isLogin())
            {
                //$this->_errorInfo($this->getLang('loginInfoFailed'));
                Common::redirect("Index","index");
            }
            //检查权限
            if($this->_checkLimit && !$this->_checkLimit())
            {
                if(__ACTION__=="index")
                {
                    $this->view($this->getLang('noOperationPermissions'));exit;
                }
                else
                {
                    $this->_errorInfo($this->getLang('noOperationPermissions'));
                }
            }
        }
        //清除缓存
        $this->_clearCache();
        $this->__init();
    }

    /**
     * 载入视图类
     */
    private function _loadView()
    {
        if(!class_exists("View"))
        {
            require_once LIB_PATH."View.class.php";
        }
        if(empty(self::$VIEW))
        {
            self::$VIEW = new View($this->getConfig('TEMPLATE_FILE_SUFFIX'));
        }
    }
    /**
     * 载入模块数据模型
     */
    private function _loadControllerModel()
    {
        if(empty(self::$CONTROLLER_MODEL))
        {
            self::$CONTROLLER_MODEL = Common::model("Controller");
        }
    }
    /**
     * 载入缓存类
     */
    private function _loadCache($group="")
    {
        if(!class_exists("Cache"))
        {
            require_once LIB_PATH."Cache.class.php";
        }
        if(empty(self::$CACHE))
        {
            self::$CACHE = new Cache($group);
        }
    }

    /**
     * 清除缓存
     */
    protected function _clearCache()
    {
        if(self::$CONTROLLER_MODEL->isEditController($this->_limitGroupAll))
        {
            $cacheGroup = self::$CONTROLLER_MODEL->getClearCacheGroup(__CONTROLLER__);
            $cacheObj = $this->useCache($cacheGroup);
            $cacheObj->clear("",$cacheGroup);
        }
    }
    /**
     * 解决A方法跨模块调用权限控制问题
     * 载入配置选型
     * @param $options
     */
    protected function _loadOption($options)
    {
        if(isset($options['checkLimit']))
        {
            $this->_checkLimit = $options['checkLimit'];
        }
    }
    //检查权限
    protected function _checkLimit()
    {
        $this->_limitGroupAll = self::$CONTROLLER_MODEL->getCheckGroup(__CONTROLLER__,__ACTION__);
        if(strstr($this->_limitGroupAll,"PUBLIC"))
        {
            return true;
        }
        $groupArr = explode("_",$this->_limitGroupAll);
        $this->_limitGroup = $groupArr[0];
        return $this->_hasRight(__ACTION__) || $this->_hasRight($this->_limitGroup);
    }
    //获取权限点key
    protected function _getAuthKey($methodName)
    {
        $key = false;
        foreach($this->_reg as $k=>$v)
        {
            if(in_array($methodName,$v))
            {
                $key = $k;
                break;
            }
        }
        return $key;
    }

    /**
     * 判断当前用户是否是超级管理员
     * @return mixed
     */
    protected function _isAdmin(){
        return $_SESSION['_USER_INFO']['IsAdmin'];
    }
    //判断是否有某个权限点
    protected function _hasRight($key)
    {
        if(empty($key))
        {
           return false;
        }
        if($this->_isAdmin()){
            return true;
        }
        $auth = $_SESSION['_USER_INFO']['Auth'];
        $hasRight = false;
        foreach($auth as $k=>$v)
        {
            if($v['UniqueKey'] == $key)
            {
                if(intval($v['Level'])>0)
                {
                    $hasRight = true;
                    break;
                }
            }
            if($v['UniqueKey'] == ($key."All"))
            {
                if(intval($v['Level'])>0)
                {
                    $hasRight = true;
                }
                break;
            }
        };
        return $hasRight;
    }
    //检查是否是公共模块（免登陆）
    private function _isPublicController()
    {
        return in_array(__CONTROLLER__,self::$CONTROLLER_MODEL->getPublicController());
    }
    //判断是否是私有模块
    private function _isPrivateController()
    {
        return in_array(__CONTROLLER__,self::$CONTROLLER_MODEL->getPrivateController());
    }
    //载入CAR类
    private function _runCar()
    {
        if(empty(self::$CAR))
        {
            self::$CAR = new Car();
        }
        self::$SID=$this->_getSID();
    }
    //载入必要的环境变量
    private function _loadVariable()
    {
        //前端参数GET POST REQUEST
        $this->_params=$GLOBALS['_PARAMS'];
        //配置项
        $this->_config=$GLOBALS['_CONFIG'];
        //语言包
        $this->_lang=$GLOBALS['_LANG'];
    }
    //获取配置
    protected function getConfig($key="")
    {
        if(empty($key))
        {
            return $this->_config;
        }
        else
        {
            return isset($this->_config[$key])?$this->_config[$key]:null;
        }
    }
    //设置配置
    protected function setConfig($key,$value)
    {
        $this->_config[$key] = $value;
    }
    //获取语言
    protected function getLang($key)
    {
        Common::getParams();
        if(empty($key))
        {
            return $this->_lang;
        }
        else
        {
            return isset($this->_lang[$key])?$this->_lang[$key]:null;
        }
    }
    //设置语言
    protected function setLang($key,$value)
    {
        $this->_lang[$key] = $value;
    }

    //获取前端参数
    protected function getParams($key="",$default="",$dataType="str",$array="request")
    {
            if($array == "request")
            {
                $array=$this->_params;
        }

        if(empty($key))
        {
            return $array;
        }
        else
        {
            $parse = $dataType."val";
            if( !is_array($array) || !isset($array[$key]))
            {
                return $default;
            }
            $notEmpty = ($array[$key] === 0 || $array[$key] === "0" || !empty($array[$key])) ? true:false;
            return $notEmpty?$parse($array[$key]):$default;
        }
    }
    //子类可以调用该初始化函数
    protected function __init()
    {

    }
    //返回json数据
    protected function _ajaxReturn($ret,$type='')
    {
        Common::ajaxReturn($ret,$type);
    }
    //返回错误码
    protected function _error($code,$type='')
    {
        $this->_ajaxReturn('{"ret":'.$code.'}',$type);
    }

    protected function _errorInfo($info,$type='')
    {
        $this->_ajaxReturn('{"ret":-2,"error_info":"'.$info.'"}',$type);
    }

    //获取session id
    protected function _getSID()
    {
        if( isset($_SESSION) && isset($_SESSION['_SID']) )
        {
            return $_SESSION['_SID'];
        }
        else
        {
            $sid=session_id();
            $sid = $sid."_".$_SERVER['REMOTE_ADDR'];
            $_SESSION['_SID'] = $sid;
            return $sid;
        }
    }
    //检查是否已经登陆
    protected function _isLogin()
    {
        $b = self::$CAR->CheckSessionOnline(self::$SID);
        return (boolean)$b;
    }

    /*===============[view]=================*/
    protected function display($group="",$template="")
    {
        $this->_loadView();
        if(!empty($group) && empty($template))
        {
            self::$VIEW->display(__CONTROLLER__,$group);
        }
        else if(empty($group) && empty($template))
        {
            self::$VIEW->display(__CONTROLLER__,__ACTION__);
        }
        else
        {
            self::$VIEW->dispaly($group,$template);
        }
    }
    protected function assign($key,$value="")
    {
        $this->_loadView();
        self::$VIEW->assign($key,$value);
    }
    protected function view($content)
    {
        $this->_loadView();
        self::$VIEW->view($content);
    }

    /**
     * 使用缓存
     * @param string $group
     * @return mixed
     */
    protected function useCache($group="")
    {
        $this->_loadCache($group);
        self::$CACHE->expirationTime = $this->getConfig('CACHE_FILE_LIVE_TIME');
        return self::$CACHE;
    }
    /*===============[view]=================*/

}
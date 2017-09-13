<?php
/**
 * Created by HongBinfu.
 * Date: 14-8-14
 * Time: 上午9:55
 */
defined("CORE_PATH") or exit();
//判断php运行模式
define('IS_CGI',substr(PHP_SAPI, 0,3)=='cgi' ? 1 : 0 );
define('IS_WIN',strstr(PHP_OS, 'WIN') ? 1 : 0 );
define('IS_CLI',PHP_SAPI=='cli'? 1   :   0);
if(!IS_CLI) {
    // 当前文件名
    if(!defined('_PHP_FILE_')) {
        if(IS_CGI) {
            //CGI/FASTCGI模式下
            $_temp  = explode('.php',$_SERVER['PHP_SELF']);
            define('_PHP_FILE_',    rtrim(str_replace($_SERVER['HTTP_HOST'],'',$_temp[0].'.php'),'/'));
        }else {
            define('_PHP_FILE_',    rtrim($_SERVER['SCRIPT_NAME'],'/'));
        }
    }
    if(!defined('__ROOT__')) {
        // 网站URL根目录
        if( "CORE" == strtoupper(basename(dirname(_PHP_FILE_))) ) {
            $_root = dirname(dirname(_PHP_FILE_));
        }else {
            $_root = dirname(_PHP_FILE_);
        }
        define('__ROOT__',   (($_root=='/' || $_root=='\\')?'':$_root));
    }
}
define("WOWOSTAR","WOWOSTAR");
//定义路径常量（经常用的到的路径）
define("CONTROLLER_PATH",CORE_PATH."Controller/");
define("LIB_PATH",CORE_PATH."Lib/");
define("MODEL_PATH",CORE_PATH."MODEL/");
define("TEMPLATE_PATH",CORE_PATH."View/");
define("COMMON_PATH",CORE_PATH."Common/");
define("DATA_PATH",CORE_PATH."Data/");
define("LANG_PATH",CORE_PATH."Lang/");
define("VENDOR_PATH",CORE_PATH."Vendor/");
define("RUNTIME_PATH",CORE_PATH."Runtime/");
define("SMARTY_PATH",RUNTIME_PATH."Smarty/");
if(!is_dir(RUNTIME_PATH))
{
	@mkdir(RUNTIME_PATH);
}
/*if(!is_file(RUNTIME_PATH.".htaccess"))
{
    @copy(CORE_PATH.".htaccess",RUNTIME_PATH.".htaccess");
}*/
define("WIDGET_PATH",CORE_PATH."Widget/");
if(!is_dir(WIDGET_PATH))
{
	@mkdir(WIDGET_PATH);
}
define("CACHE_PATH",RUNTIME_PATH."Cache/");
if(!is_dir(CACHE_PATH))
{
	@mkdir(CACHE_PATH);
}
define("LOG_PATH",RUNTIME_PATH."Log/");
if(!is_dir(LOG_PATH))
{
	@mkdir(LOG_PATH);
}
define("TEMP_PATH",RUNTIME_PATH."Temp/");
if(!is_dir(TEMP_PATH))
{
	@mkdir(TEMP_PATH);
}
//配置文件全局变量
//引入配置文件
$config = require_once COMMON_PATH."config.php";
$GLOBALS['_CONFIG'] = array_change_key_case($config,CASE_UPPER);
//载入基本语言包
$GLOBALS['_LANG'] = require_once LANG_PATH.$GLOBALS['_CONFIG']['LANG']."/base.lang.php";

//引入基本的处理函数
require_once COMMON_PATH."common.php";
if(!class_exists("Common"))
{
    require_once LIB_PATH."Common.class.php";
}
require_once COMMON_PATH."phpSetting.php";
//前端参数过滤
$GLOBALS['_SAFE_REQUEST']=$_REQUEST;
if(isset($GLOBALS['_SAFE_REQUEST']))
{
    array_walk_recursive($GLOBALS['_SAFE_REQUEST'],array("Common","filterParams"));
}
//获取前端提交的参数
$GLOBALS['_PARAMS'] = Common::getParams();
//URL路由器
$c=ucfirst(Common::getParams($GLOBALS['_CONFIG']['URL_CONTROLLER_PARAM'],$GLOBALS['_CONFIG']['DEFAULT_CONTROLLER']));
$a=lcfirst(Common::getParams($GLOBALS['_CONFIG']['URL_ACTION_PARAM'],$GLOBALS['_CONFIG']['DEFAULT_ACTION']));
require_once LIB_PATH."Controller.class.php";

$include_onceControllerFile = CONTROLLER_PATH."".$c."Controller.class.php";

if(!file_exists($include_onceControllerFile))
{
    Common::_404();
}
require_once $include_onceControllerFile;
$GLOBALS['_CONTROLLER']=$c;
$GLOBALS['_ACTION'] = $a;
define("__CONTROLLER__",$c);
define("__ACTION__",$a);
$controllerStr = $c."Controller";


if(class_exists($controllerStr))
{
    $controller= new $controllerStr();
    if(method_exists($controller,$GLOBALS['_ACTION']))
    {
        $controller->$GLOBALS['_ACTION']();
    }
    else
    {
        Common::_404();
    }
}
else
{
    Common::_404();
}

<?php
/**
 * 【常规配置文件】
 */
defined("WOWOSTAR") or exit();
return array(
    "DEBUG"=>true,
    "LANG"=>"zh-cn",
    "VERSION"=>"Ver:5.2 Build 0814 授权版",
    "URL_CONTROLLER_PARAM"=>"_c",
    "URL_ACTION_PARAM"=>"_a",
    "DEFAULT_CONTROLLER"=>"Index",
    "DEFAULT_ACTION"=>"index",
    "AJAX_RETURN_TYPE"=>"json",
    "JSONP_CALLBACK_KEY"=>"callback",
    "LOG_PATH"=>"./Runtime/Log/",
    "LOG_SINGLE_FILE_SIZE"=>2,
    "TEMP_PATH"=>TEMP_PATH,
    //导入员工文件大小限制(M)
    "IMPORT_USER_FILE_SIZE"=>2,
    "IMPORT_STRATEGY_FILE_SIZE"=>2,
    "IMPORT_ROLE_FILE_SIZE"=>2,
    "IO_USER_FILE_TYPE"=>array('wsv','txt'),
    "IO_ROLE_FILE_TYPE"=>array('role',"txt"),
    "USER_OFFLINE_FILE_TYPE"=>"wow",
    //公共模块（不需要登陆验证的模块）
    "PUBLIC_CONTROLLER"=>array("Index","Public","Login","Server","Download","Auth"),
    //私有模块 （只提供给控制器之间调用）
    "PRIVATE_CONTROLLER"=>array("Controller","View"),
    "LOGIN_PAGE"=>"./index.php",
    "DOWNLOAD_FILE_TYPE"=>"dl",
    "IO_STRATEGY_FILE_TYPE"=>array("xml"),
	"SUPER_ADMIN"=>"admin",
    //临时文件生存时间（秒为单位）
    "TEMP_FILE_LIVE_TIME"=>600,
    //授权文件大小限制
    "IMPORT_LICENSE_FILE_SIZE"=>2,
    /**
     * 模板配置
     */
    //模板后缀文件
    "TEMPLATE_FILE_SUFFIX"=>".html",
    "TPL_CACHE_FILE_SUFFIX"=>".cache",
    "CACHE_FILE_LIVE_TIME"=>3600,
    //private、must-revalidate、max-age
    "HTTP_CACHE_CONTROL"=>"no-cache,must-revalidate",
    "DEFAULT_CHARSET"=>"UTF-8",
    "TMPL_CONTENT_TYPE"=>"text/html",
    "IMPORT_EMAIL_LIST_FILE_SIZE"=>2,
    "IMPORT_EMAIL_LIST_FILE_TYPE"=>array('txt')
);
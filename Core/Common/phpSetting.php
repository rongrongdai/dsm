<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-26
 * Time: 下午3:41
 */

defined("WOWOSTAR") or exit();
set_error_handler(array("Common","throwExceptionHandler"));
//时区
date_default_timezone_set('PRC');
//取消运行时间限制
set_time_limit(0);
//开启session
//setcookie(session_name(), session_id(), time() + 60, "/");
//session_set_cookie_params( 12*60*60 );//设置cookie的有效期
//session_cache_expire(12*60);//设置session的有效期
if(!isset($_SESSION))
{
    session_start();
}


if(!APP_DEBUG)
{
    error_reporting(0);
}

//post提交大小
ini_set("post_max_size ","150M");
ini_set("upload_max_filesize","150M");

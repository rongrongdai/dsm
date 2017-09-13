<?php
defined("WOWOSTAR") or exit();
/**
 * 兼容性函数处理
 * 原文件是用来装载常用的函数，现在把常用的函数归类到Lib>Common.class.php里面
 */
if(!function_exists('boolval'))
{
    function boolval($str)
    {
        return $str=='0' || $str=='false' ||$str=='failed'||$str=='no' || empty($str) ? false:true;
    }
}
if(!function_exists('arrayval'))
{
    function arrayval($arr)
    {
        return $arr;
    }
}
if(!function_exists('splitval'))
{
    function splitval($val)
    {
        return explode(",",$val);
    }
}
?>
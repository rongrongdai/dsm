<?php

defined("WOWOSTAR") or exit();
/**
 *  方便模板里调用的函数
 */


/**
 * 判断是否是超级管理员
 */
function isAdmin()
{
    return $_SESSION['_USER_INFO']['IsAdmin'];
}
function hasRight($key)
{
    $auth = $_SESSION['_USER_INFO']['Auth'];
    if($_SESSION['_USER_INFO']['IsAdmin'])return true;
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

function rightEcho($key,$right="",$noRight="")
{
    $hasRight = hasRight($key);
    $echo  = $hasRight?$right:$noRight;
    echo $echo;
}
function disable($key,$attr="z-disabled")
{
    rightEcho($key,"",$attr);
}
function hide($key,$attr="f-dn")
{
    rightEcho($key,"",$attr);
}
function checkbox_checked($key,$value)
{
    return $key==$value||(is_array($value)&&$key==$value[$key])?"checked='checked'":"";
}


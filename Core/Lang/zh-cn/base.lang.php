<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-15
 * Time: 下午2:05
 * 语言包: 简体中文
 *
 */
defined("WOWOSTAR") or exit();
return array(
    "loginInfoFailed"=>"登录信息失效",
    "exceededFileSizeLimit"=>"文件大小不允许超过%uM",
    "fileDoesNotExist"=>"文件不存在",
    "user"=>"员工",
    "role"=>"角色",
    "strategy"=>"策略",
    "setting"=>"设置",
    "log"=>"日志",
    "FileTypeError"=>"文件类型错误",
    "dataNull" =>"没有数据",
    "unknownTypeOfOperation"=>"未知操作类型",
    "uploadFileError"=>array(
        1 => '文件类型错误',
        2 => '目录不可写',
        3 => '文件已存在',
        4 => '未知错误',
        5 => '文件大小超过限制'
    ),
	"loginPermissionDenied"=>"对不起，你没有进入系统的权限",
    "userInfoLoadFailed"=>"用户信息加载失败",
    "noOperationPermissions"=>"对不起，你没有权限进行该操作",
    "canNotSyncSystemStrategy"=>"不能同步到系统自带的策略模板",
    "userRootGroupExist"=>"用户组根节点已经存在",
    "pleaseEnterOldPwd"=>"原密码不能为空",
    "pleaseEnterNewPwd"=>"新密码不能为空",
	"uninstallCodeError"=>"客户端机器码错误",
    "dataLoadFailed"=>"数据加载失败,错误代码%d",
    "paramsError"=>"提交参数有误",
    "notHasSelected"=>"没有可添加的内容了",
    "canNotModifySystemRole"=>"不能修改系统自带的角色"
);
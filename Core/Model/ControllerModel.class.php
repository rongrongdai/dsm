<?php
/**
 * Author: HongBinfu 
 * Date: 14-10-22
 * Time: 下午7:02
 *
 * 模块模型
 */

defined("WOWOSTAR") or exit();
class ControllerModel extends Model{
    /**
     * 公共模块
     * @var array
     */
    private $_public=array("Index","Public","Login","Server","Download","Auth");
    /**
     * 私有模块
     * @var array
     */
    private $_private=array();
    /**
     * 权限分组
     * @var array
     */
    private $_limit=array(
        "User"=>array(
            "UserPageView"=>array(
                "index","getUserList","exportUser","getRoleTree"
            ),
            "UserPageEdit"=>array(
                "editUser"
            ),
            "UserPageEditAll"=>array(
                "addUser","delUser","importUser","generateOfflineFile"
            ),
            "PUBLIC"=>array(
                "changeMyPassword"
            )
        ),
        "UserGroup"=>array(
            "UserPageView"=>array(
                "getUserGroupTree"
            ),
            "UserPageEdit"=>array(
                "editUserGroup"
            ),
            "UserPageEditAll"=>array(
                //添加用户组
                "addUserGroup",
                //添加用户组跟节点
                "addUserRootGroup",
                "delUserGroup"
            )
        ),
        "Strategy"=>array(
            "StrategyPageView"=>array(
                "index","getStrategyGroupTree","getStrategyList","exportStrategy","getUserGroupTree"
            ),
            "StrategyPageEdit"=>array(
                "editGroupStrategy","editStrategy"
            ),
            "StrategyPageEditAll"=>array(
                "addStrategy","delStrategy","importStrategy","copyStrategyToGroup","delGroupStrategy","syncStrategy",
                "changeGroupStrategyOrder","groupStrategyToTop","groupStrategyToBottom","copyGroupStrategyToGroup"
            )
        ),
        "BehaviorControl"=>array(
            "BehaviorControlPageView"=>array(
                "index","getMenu","getList","addWebItemPage","addIMItemPage","getUserTree"
            ),
            "BehaviorControlPageEdit"=>array(
                "edit","editPage"
            ),
            "BehaviorControlPageEditAll"=>array(
                'add',"addPage","delete","bindUserOrGroupPolicy","unbindUserOrGroupPolicy"
            )
        ),
        "Role"=>array(
            "RolePageView"=>array(
                "index","getRoleTypeTree","getRoleTree","getRoleList","getUserGroupTree","exportRole"
            ),
            "RolePageEdit"=>array(
                "editRole","editGroup"
            ),
            "RolePageEditAll"=>array(
                "addRoleAndType","applyRole","addGroup","disableRole","delRole","importRole","delGroup"
            )
        ),
        "Setting"=>array(
            "SettingPageView"=>array(
                "index","getSettingTree","getBusinessSetting","getOtherSetting","getProcessSetting","getUserGroupTree",
                "getSystemProcess","getProcessApplyUserGroupTree","getProcessStepUserGroupTree","getEmailWhiteList","getRoleTree"
            ),
            "SettingPageEdit"=>array(
                "setAdsSetting","setBusinessSetting","setOtherSetting","setProcessSetting","addWhiteListPage","saveWhiteList","editWhiteListPage","importWhiteList","exportWhiteList","deleteWhiteList"
            ),
            "SettingPageEditAll"=>array(
                "resetProcessSetting"
            )
        ),
        "Log"=>array(
            "LogPageView"=>array(
                "index","getClientLog","getAdminLog","getProcessLog"
            ),
            "LogPageEdit"=>array(

            ),
            "LogPageEditAll"=>array(

            )
        ),
        "System"=>array(
            "SettingPageEditAll"=>array(
                "makeRegCode","doReg","makeUninstall"
            ),
            "PUBLIC"=>array(
                "loadSystemInfoToSession"
            )
        )
    );

    /**
     * 获取所有公共模块
     */
    public function getPublicController()
    {
        return $this->_public;
    }

    /**
     * 获取所有私有模块
     */
    public function getPrivateController()
    {
        return $this->_private;
    }
    /**
     * 获取控制器方法对应的权限分组
     * @param $m
     * @param $a
     * @return bool|int|string
     */
    public function getCheckGroup($m,$a,$all=true){
        if(isset($this->_limit[$m]) && !empty($this->_limit[$m]))
        {
            foreach($this->_limit[$m] as $k=>$v)
            {
                if(in_array($a,$v))
                {
                    if($all)
                    {
                        return $k;
                    }
                    else
                    {
                        $group = explode("_",$k);
                        return $group[0];
                    }
                }
            }
        }
        return false;
    }
    public function isEditController($checkGroupName)
    {
        return strstr($checkGroupName,"Edit") || strstr($checkGroupName,"EDIT");
    }
    /**
     * 获取清除缓存的组
     * 说明：有些模块之间有联系，必须关联清除缓存保证数据最新
     * @param $controller
     */
    public function getClearCacheGroup($controller)
    {
        $group = array($controller);
        if(isset($this->_cache[$controller]) && empty($this->_cache[$controller]))
        {
            $group = array_merge($group,$this->_cache[$controller]);
        }
        return $group;
    }
    /**
     * 缓存清除关系维护
     * @var array
     */
    private $_cache=array(
        "User"=>array("Role"),
        "Role"=>array("User")
    );
}
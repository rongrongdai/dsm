<?php
/**
 * Author: HongBinfu 
 * Date: 14-12-8
 * Time: 上午10:41
 * data category
 */

return array(
    array("controller"=>"User","url"=>"index.php?_c=User","auth"=>"UserPageView","img"=>"icon-menu-user","title"=>"用户管理"),
    array("controller"=>"Strategy","url"=>"index.php?_c=Strategy","auth"=>"StrategyPageView","img"=>"icon-menu-strategy","title"=>"策略管理"),
    array("controller"=>"BehaviorControl","url"=>"index.php?_c=BehaviorControl","auth"=>"BehaviorControlPageView","img"=>"icon-menu-behavior-control","title"=>"行为管控"),
    array("controller"=>"Role","url"=>"index.php?_c=Role","auth"=>"RolePageView","img"=>"icon-menu-role","title"=>"角色管理"),
    array("controller"=>"Setting","url"=>"index.php?_c=Setting","auth"=>"SettingPageView","img"=>"icon-menu-setting","title"=>"系统配置"),
    array("controller"=>"Log","url"=>"index.php?_c=Log","auth"=>"LogPageView","img"=>"icon-menu-log","title"=>"日志审计")
);
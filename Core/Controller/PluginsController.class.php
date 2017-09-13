<?php
/**
 * Author: HongBinfu 
 * Date: 14-9-3
 * Time: 上午11:34
 */

/**
 * Class PluginsController 插件数据接口类
 */
defined("WOWOSTAR") or exit();
class PluginsController extends Controller
{
     public function __init()
     {
         //检查是否登录
         if(!$this->_isLogin())
         {
             $this->_error(-44);
         }
     }
}
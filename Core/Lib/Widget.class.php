<?php
/**
 * Author: HongBinfu 
 * Date: 14-11-18
 * Time: 下午5:32
 */
class Widget{
    static $VIEW;
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
            $suffix = Common::config("TEMPLATE_FILE_SUFFIX");
            //exit(TEMPLATE_PATH."Widget/");
            self::$VIEW = new View($suffix,TEMPLATE_PATH."Widget/");
        }
    }
    /*===============[view]=================*/
    protected function display($group,$template)
    {
        $this->_loadView();
        self::$VIEW->display($group,$template);
    }
    protected function view($content)
    {
        $this->_loadView();
        self::$VIEW->view($content);
    }
    protected function assign($key,$value="")
    {
        self::$VIEW->assign($key,$value);
    }
}
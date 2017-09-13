<?php
/**
 * Author: HongBinfu 
 * Date: 14-10-16
 * Time: 下午5:00
 *
 * 主页
 *
 */
defined("WOWOSTAR") or exit();
class IndexController extends Controller
{
    public function index()
    {
        /**
         * 加载系统信息到session
         */
        $System = Common::controller("System");
        if(!$System->getSystemInfo())
        {
            $System->loadSystemInfoToSession();
        }
        $Login = Common::controller("Login");
        if(!$Login::isLogin())
        {
            $this->display("login");
        }
        else
        {
            $index = $this->getIndexController();
            if($index)
            {
                Common::redirect($index,"index");
            }
            else
            {
                Common::controller("Login","doLogout",array(true));
                Common::redirect("Index","index");
            }
        }
    }

    /**
     * 获取默认的展示的栏目
     * @return bool|string
     */
    protected function getIndexController()
    {
        if($this->_isAdmin())
        {
            return "User";
        }
        $allCategory = Common::getArrayData("Index","category");
        foreach($allCategory as $c)
        {
            if($this->_hasRight($c['auth']))
            {
                return $c['controller'];
            }
        }
        return false;
    }
    /**
     * 浏览器不支持页面
     */
    public function canNotSupport()
    {
        $this->display();
    }
    public function version(){
        echo "4.0.12";
    }
}
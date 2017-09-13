<?php
/**
 *  测试模块
 */
defined("WOWOSTAR") or exit();
class TestController extends Controller
{

    public function index(){
        $name = $this->getParams("name");
        $params = $this->getParams("params");
        $extractSID = $this->getParams("noSID");
        if(method_exists(self::$CAR,$name)){
            $args = [];
            if(empty($extractSID)){
                $args[]=self::$SID;
            }
            $pList = explode(",",$params);
            foreach($pList as $value){
                list($var,$type) = explode(":",$value);
                if($type)settype($var,$type);
                $args[]=$var;
            }
            $ret = call_user_func_array(array(self::$CAR,$name),$args);
            var_dump(@json_decode($ret,true));
        }else{
            echo "参数错误";
        }
    }

    
}
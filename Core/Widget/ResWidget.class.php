<?php
/**
 * Author: HongBinfu 
 * Date: 14-11-18
 * Time: 下午5:40
 * 
 * 资源获取
 */

class ResWidget extends Widget{
	 protected $_map=array();
	 public $_mapPath = "./map.json";
	 public function __construct(){
		if(empty($this->_map) && file_exists($this->_mapPath))
		{
			$this->_map = json_decode(file_get_contents($this->_mapPath),true);
		}
		
	 }
     public function get($res){
	 //var_dump($res);exit;
         if(!empty($this->_map) && isset($this->_map['res'][$res]['uri']))
		 {
			return $this->_map['res'][$res]['uri'];
		 }
		 else{
			return $res;
		 }
     }
	 public function view($res)
	 {
		echo $this->get($res);
	 }
}
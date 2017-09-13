<?php
/**
 * Author: HongBinfu 
 * Date: 14-11-18
 * Time: 下午5:40
 */

class PageWidget extends Widget{
     public function pageToolbar($row=50,$showCheckbox=true){
         $this->assign("row",$row);
         $this->assign("showCheckbox",$showCheckbox);
         $this->display("Page","pageToolbar");
     }
}
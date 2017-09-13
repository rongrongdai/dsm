<?php
/**
 * Author: HongBinfu 
 * Date: 14-11-19
 * Time: 下午1:52
 */

class BodyWidget extends Widget{

    public function commonHeader()
    {
        $this->display("Body","commonHeader");
    }
    public function commonTopMenu()
    {
        $this->assign("menu",Common::getArrayData("Index","category"));
        $this->display("Body","commonTopMenu");
    }
    public function commonFooter()
    {
        $this->display("Body","commonFooter");
    }
}
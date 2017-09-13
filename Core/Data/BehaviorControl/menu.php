<?php
/**
 * Author: HongBinfu
 * Date: 14-8-20
 * Time: 下午5:09
 */
//请勿修改ID,如有添加内容请另起ID
return array(
    array(
        "id"=>-1,
        "text"=>"行为管控",
        "pid"=>'',
        "leaf"=>false,
        "icon"=>"icon-behavior-root",
        "children"=>array(
            array(
                "id"=>0,
                "text"=>"基础权限控制",
                "pid"=>'',
                "icon"=>"icon-behavior-0",
                "leaf"=>true
            ),
            array(
                "id"=>2,
                "text"=>"网页浏览控制",
                "pid"=>'',
                "icon"=>"icon-behavior-2",
                "leaf"=>true
            ),
            /*array(
                "id"=>13,
                "text"=>"应用软件控制",
                "pid"=>'',
                "leaf"=>true
            ),*/
            array(
                "id"=>1,
                "text"=>"即时通信控制",
                "pid"=>'',
                "icon"=>"icon-behavior-1",
                "leaf"=>true
            )
        )
    )
);
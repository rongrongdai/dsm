<?php
/**
 * Created by PhpStorm.
 * User: wowostar
 * Date: 2015/9/18
 * Time: 17:33
 */

header('Access-Control-Allow-Origin:*');
// 响应类型
//header('Access-Control-Allow-Methods:*');
//header('Access-Control-Max-Age:60');
// 响应头设置
//header('Access-Control-Allow-Headers:*');
//header('Access-Control-Allow-Credentials:true');

echo json_encode(["success"=>true]);
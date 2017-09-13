<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-21
 * Time: 下午3:37
 *
 * 日志模块
 */
defined("WOWOSTAR") or exit();
class LogController extends Controller
{
    public function index()
    {
        $this->display();
    }
    /**
     * 获取流程日志
     */
    public function getClientLog()
    {
        $TotalCount = $this->getParams('TotalCount',1,'int');
        $StrUserName = $this->getParams('StrUserName');
        //模糊搜索
        if( !empty($StrUserName) )
        {
            $StrUserName = "*".trim($StrUserName)."*";
        }

        $BeginTime = $this->getParams('BeginTime');

        $EndTime = $this->getParams('EndTime');

        $OperatorCode = $this->getParams('OperatorCode');
        $OrderIndex = -1;
        $sort = $this->getParams("sort");
        switch( $sort )
        {
            case "ID":
                $OrderIndex = 0;
                break;
            case "UserIP":
                $OrderIndex = 1;
                break;
            case "UserMac":
                $OrderIndex = 2;
                break;
            /*case 3:
                $OrderIndex = 3;
                //strOutCondition += " order by UserMac ";
                break;*/
            case "FileName":
                $OrderIndex = 4;
                break;
            /*case 5:
                $OrderIndex = 5;
                //strSql += " order by ";
                break;*/
            case "RecordTime":
                $OrderIndex = 6;
                break;
            default:
                $OrderIndex = 6;
                break;
        }



        $OrderType = $this->getParams('order',"desc");

        $Desc = $OrderType=="desc"?1:0;

        // 分页变量
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');

        $start=$rows * ($page-1);
        $count=$rows;

        if($this->getParams('EXPORT',false,'bool'))
        {
            Common::vendor('PHPExcel');
            $exportData=$this->getParams('EXPORT_DATA',array(),'str');
            if(!empty($exportData))
            {
                $exportData=json_decode($exportData,true);
            }
            else
            {
                $ret = self::$CAR->QueryClientLog( self::$SID, 0, $TotalCount, $TotalCount, $OrderIndex, $Desc, $StrUserName, $BeginTime, $EndTime, $OperatorCode);
                $res=json_decode($ret,true);
                if($res['ret']==0)
                {
                    $exportData=$res['Result']['LogInfoList'];
                }
                else
                {
                    $this->_ajaxReturn($ret);
                }
            }

            if(!empty($exportData))
            {
                $objPHPExcel = new PHPExcel();
                $objPHPExcel->setActiveSheetIndex(0);
                $activeSheet=$objPHPExcel->getActiveSheet();
                $activeSheet->setCellValue('A1', '账号');
                $activeSheet->setCellValue('B1', 'IP地址');
                $activeSheet->setCellValue('C1', 'MAC地址');
                $activeSheet->setCellValue('D1', '用户名');
                $activeSheet->setCellValue('E1', '操作类型');
                $activeSheet->setCellValue('F1', '操作时间');
                $logType=Common::getArrayData('Log','clientLogType');
                $logType["error"] = $this->getLang("unknownTypeOfOperation");
                $rowIndex=2;
                foreach($exportData as $k=>$v)
                {

                    $activeSheet->setCellValue('A'.$rowIndex, $this->getParams("UserLoginName","","str",$v));
                    $activeSheet->setCellValue('B'.$rowIndex, $this->getParams("UserIP","","str",$v));
                    $activeSheet->setCellValue('C'.$rowIndex, $this->getParams("UserMac","","str",$v));
                    $activeSheet->setCellValue('D'.$rowIndex, $this->getParams("UserDisplayName","","str",$v));
                    $activeSheet->setCellValue('E'.$rowIndex, $logType[$this->getParams("LogType","error","str",$v)]);
                    $activeSheet->setCellValue('F'.$rowIndex, $this->getParams("RecordTime","","str",$v));
                    $rowIndex++;
                }
                $objWriter = new PHPExcel_Writer_Excel5($objPHPExcel);
                $filename = md5(uniqid("",true));
                $file = $this->getConfig('TEMP_PATH').$filename.".".$this->getConfig('DOWNLOAD_FILE_TYPE');
                $objWriter->save($file);
                $e['ret'] = file_exists($file) ? 0 : -1;
                $e['code'] = $filename;
                $this->_ajaxReturn($e);
            }
            else
            {
                $ret=array();
                $ret['error_info'] = $this->getLang('dataNull');
                $ret['ret']= -2;
                $this->_ajaxReturn($ret);
            }

        }
        else
        {
            $ret = self::$CAR->QueryClientLog( self::$SID, $start, $count, $TotalCount, $OrderIndex, $Desc, $StrUserName, $BeginTime, $EndTime, $OperatorCode);
            $this->_ajaxReturn($ret);
        }
    }
    //管理员日志
    public function getAdminLog()
    {
        $ret['Result']['AdminOP']=array(
            array(
                "OperatorLoginName"=>"aasdfasdfasdf",
                "OperatorDisplayName"=>"asdfasdf33jusisjkks",
                "OperatorCode"=>10,
                "OperatorTime"=>1442396258
            ),
            array(
                "OperatorLoginName"=>"aasdfasdfasdf",
                "OperatorDisplayName"=>"asdfasdf33jusisjkks",
                "OperatorCode"=>15,
                "OperatorTime"=>1442396258,
            ),
            array(
                "OperatorLoginName"=>"aasdfasdfasdf",
                "OperatorDisplayName"=>"asdfasdf33jusisjkks",
                "OperatorCode"=>12,
                "OperatorTime"=>1442396258,
            )
        );
        $ret['ret']=0;
        $this->_ajaxReturn($ret);

        exit;

        $TotalCount = $this->getParams('TotalCount',1,'int');
        $StrUserName = $this->getParams('StrUserName');
        if( !empty($StrUserName) )
        {
            $StrUserName = "*".trim($StrUserName)."*";
        }

        $BeginTime = $this->getParams('BeginTime');

        $EndTime = $this->getParams('EndTime');

        $OperatorCode = $this->getParams('OperatorCode');

        $Order = $this->getParams('order');


        $Desc = 1;

        if($Order=="asc")
        {
            $Desc=0;
        }

        // 分页变量
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');

        $start=$rows * ($page-1);
        $count=$rows;
        if($this->getParams('EXPORT',false,'bool'))
        {
            Common::vendor('PHPExcel');
            $exportData=$this->getParams('EXPORT_DATA',array(),'str');
            if(!empty($exportData))
            {
                $exportData=json_decode($exportData,true);
            }
            else
            {
                $ret = self::$CAR->QueryAdminOPLog( self::$SID, $start, $TotalCount, $TotalCount,$Desc,"", $StrUserName, $BeginTime, $EndTime );
                $res=json_decode($ret,true);
                if($res['ret']==0)
                {
                    $exportData=$res['Result']['AdminOP'];
                }
                else
                {
                    $this->_ajaxReturn($ret);
                }
            }
            if(!empty($exportData))
            {
                $objPHPExcel = new PHPExcel();
                $objPHPExcel->setActiveSheetIndex(0);
                $activeSheet=$objPHPExcel->getActiveSheet();
                $activeSheet->setCellValue('A1', '账号');
             /*   $activeSheet->setCellValue('B1', 'IP地址');
                $activeSheet->setCellValue('C1', 'MAC地址');*/
                $activeSheet->setCellValue('B1', '用户名');
                $activeSheet->setCellValue('C1', '操作类型');
                $activeSheet->setCellValue('D1', '操作时间');
                $OperatorCode=Common::getArrayData('Log','operateCode');
                $OperatorCode['error'] = $this->getLang('unknownTypeOfOperation');
                $rowIndex=2;
                foreach($exportData as $k=>$v)
                {
                    $activeSheet->setCellValue('A'.$rowIndex, $this->getParams('OperatorLoginName','','str',$v));
             /*       $activeSheet->setCellValue('B'.$rowIndex, $this->getParams('OperatorIP','','str',$v));
                    $activeSheet->setCellValue('C'.$rowIndex, $this->getParams('OperatorMAC','','str',$v));*/
                    $activeSheet->setCellValue('B'.$rowIndex, $this->getParams('OperatorDisplayName','','str',$v));
                    $activeSheet->setCellValue('C'.$rowIndex, $OperatorCode[$this->getParams('OperatorCode','error','str',$v)]);
                    $activeSheet->setCellValue('D'.$rowIndex, $this->getParams('OperatorTime','','str',$v));
                    $rowIndex++;
                }
                $objWriter = new PHPExcel_Writer_Excel5($objPHPExcel);
                $filename = md5(uniqid("",true));
                $file = $this->getConfig('TEMP_PATH').$filename.".".$this->getConfig('DOWNLOAD_FILE_TYPE');
                $objWriter->save($file);
                $e['ret'] = file_exists($file) ? 0 : -1;
                $e['code'] = $filename;
                $this->_ajaxReturn($e);
            }
            else
            {
                $ret = array();
                $ret['error_info'] = $this->getLang('dataNull');
                $ret['ret']= -2;
                $this->_ajaxReturn($ret);

            }

        }
        else
        {

            $ret = self::$CAR->QueryAdminOPLog( self::$SID, $start, $count, $TotalCount,$Desc,"", $StrUserName, $BeginTime, $EndTime );
            $this->_ajaxReturn($ret);
        }
    }

    public function getProcessLog()
    {
        $TotalCount = $this->getParams('TotalCount',1,'int');
        $StrUserName = $this->getParams('StrUserName');
        if( !empty($StrUserName) )
        {
            $StrUserName = "*".trim($StrUserName)."*";
        }

        $BeginTime = $this->getParams('BeginTime');

        $EndTime = $this->getParams('EndTime');

        $OperatorCode = $this->getParams('OperatorCode');





        // 分页变量
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');

        $start=$rows * ($page-1);
        $count=$rows;

        /*$QueryStruct='';
        if( isset($_REQUEST) && isset($_REQUEST['QueryStruct']) )
        {
            $QueryStruct=$_REQUEST['QueryStruct'];
            "PROCESSING": 1,
            "PROCESSED": 1,
        }*/
        $QueryArr=array();
        $QueryArr['START']=(int)$start;
        $QueryArr['COUNT']=(int)$count;
        $QueryArr['PROCESSING']=1;
        $QueryArr['PROCESSED']=1;
        $sort = $this->getParams('sort','StepStartTime');
        $order = $this->getParams('order','desc');

        //排序
        if(!empty($sort) && !empty($order))
        {
            $QueryArr['ORDER'] = $sort." ".$order;
        }
        if(!empty($BeginTime))$QueryArr['POSTTIME1']=$BeginTime;
        if(!empty($EndTime))$QueryArr['POSTTIME2']=$EndTime;


        if($this->getParams('EXPORT',false,'bool'))
        {
            $QueryArr['COUNT']=(int)$TotalCount;
            $QueryStruct=json_encode($QueryArr);
            Common::vendor('PHPExcel');
            $exportData=$this->getParams('EXPORT_DATA',array(),'str');
            if(!empty($exportData))
            {
                $exportData=json_decode($exportData,true);
            }
            else
            {
                $ret = self::$CAR->QueryFlowLog( self::$SID,$QueryStruct);
                $res=json_decode($ret,true);
                if($res['ret']==0)
                {
                    $exportData=$res['RESULT'];
                }
                else
                {
                    $this->_ajaxReturn($res);
                }
            }
            if(!empty($exportData))
            {
                $objPHPExcel = new PHPExcel();
                $objPHPExcel->setActiveSheetIndex(0);
                $activeSheet=$objPHPExcel->getActiveSheet();
                $activeSheet->setCellValue('A1', '账号');
                $activeSheet->setCellValue('B1', '流程名');
                $activeSheet->setCellValue('C1', '发起人');
                $activeSheet->setCellValue('D1', '发起时间');
                $activeSheet->setCellValue('E1', '结果');
                $rowIndex=2;
                foreach($exportData as $k=>$v)
                {

                    $activeSheet->setCellValue('A'.$rowIndex, $this->getParams("USER_LOGINNAME","","str",$v));
                    $activeSheet->setCellValue('B'.$rowIndex, $this->getParams("FLOWNAME","","str",$v));
                    $activeSheet->setCellValue('C'.$rowIndex, $this->getParams("USER_DISPLAYNAME","","str",$v));
                    $submitTime = $this->getParams("SUBMITTIME",false,"int",$v);
                    //L(var_export(date("Y-m-d H:i:s",$submitTime),true),__FILE__,__LINE__);
                    $submitTime = $submitTime!==false ? date("Y-m-d H:i:s",$submitTime) : "";
                    $activeSheet->setCellValue('D'.$rowIndex, $submitTime);
                    if($v['FINALRESULT']==0)
                    {
                        $result="处理中";
                    }
                    else if($v['FINALRESULT']==1)
                    {
                        $result="通过";
                    }
                    else
                    {
                        $result="退回";
                    }
                    $activeSheet->setCellValue('E'.$rowIndex, $result);
                    $rowIndex++;
                }

                $objWriter = new PHPExcel_Writer_Excel5($objPHPExcel);
                $filename = md5(uniqid("",true));
                $file = $this->getConfig('TEMP_PATH').$filename.".".$this->getConfig('DOWNLOAD_FILE_TYPE');
                $objWriter->save($file);
                $e['ret'] = file_exists($file) ? 0 : -1;
                $e['code'] = $filename;
                $this->_ajaxReturn($e);
            }
            else
            {
                //L(var_export($ret,true),__FILE__,__LINE__);
                $ret = array();
                $ret['error_info'] = $this->getLang('dataNull');
                $ret['ret']= -2;
                $this->_ajaxReturn($ret);

            }
        }
        else
        {
            $QueryStruct=json_encode($QueryArr);
            $ret = self::$CAR->QueryFlowLog( self::$SID,$QueryStruct);
            $this->_ajaxReturn($ret);
        }
    }

    //日志列表
    public function getLogList()
    {
        $data=array();
        $data["ret"]=0;
        $data["rows"]=array(
            ["logid"=>"1","acc"=>"zhangsan","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","OptContent"=>"c:\\aaa.txt","att"=>"4MB","Description"=>"成功"],
            ["logid"=>"2","acc"=>"lis","name"=>"李四","IP"=>"127.0.0.1","MAC"=>"","logtype"=>"2","OptTime"=>"2015/04/13 14:00","OptContent"=>"用户登录","att"=>"","Description"=>"成功"],
            ["logid"=>"3","acc"=>"wangwu","name"=>"王五","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"3","OptTime"=>"2015/01/13 13:00","OptContent"=>"c:\\aaa.txt","att"=>"4MB","Description"=>"成功"],
            ["logid"=>"4","acc"=>"zhaoliu","name"=>"赵六","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"4","OptTime"=>"2015/01/13 13:00","OptContent"=>"a.txt|b.doc|c.xls","att"=>"4MB","Description"=>"成功"],
        ["logid"=>"5","acc"=>"haoliu","name"=>"赵六","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"5","OptTime"=>"2015/01/13 13:00","OptContent"=>"a.txt|b.doc|c.xls","att"=>"4MB","Description"=>"成功"],

         ["logid"=>"6","acc"=>"zhaolu","name"=>"赵六","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"6","OptTime"=>"2015/01/13 13:00","OptContent"=>"a.txt|b.doc|c.xls","att"=>"4MB","Description"=>"成功"]

        );
        $data["total"]=count($data["rows"]);
        $this->_ajaxReturn($data);
    }
    //日志列表详细-手动解密
    public function  getDecryptDetail()
    {
        //var_dump(array("a"=>23));exit;
        $logid=$this->getParams("id");
        if(empty($logid)){
            $this->_ajaxReturn(array("ret"=>-1));
        }
        /*$data=array();
        $data["ret"]="0";
        $logid=$this->getParams("logid");
        $data=array();
        $data["ret"]=0;
        $data["rows"]=array(
            ["logid"=>"1","acc"=>"zs","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","DecryptAcc"=>"lis","DecryptName"=>"李四"],
            ["logid"=>"2","acc"=>"lis","name"=>"李四","IP"=>"192.168.1.222","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/02/14 13:00","DecryptAcc"=>"wangwu","DecryptName"=>"王五"]
            );*/
        /*$data["total"]=count($data["rows"]);

        $detail=array();
        for($i=0;$i<=count($data["rows"]);$i++)
        {
            if($data["rows"][$i]["logid"]===$logid)
            {
                $detail=$data["rows"][$i];
            }
        }*/
        $ret['data']=["logid"=>"1","acc"=>"zs","name"=>"李四","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","DecryptAcc"=>"lis","DecryptName"=>"李四"];
        $ret['ret']=0;
        $this->_ajaxReturn($ret);
    }
    //日志列表详细-文件授权
    public  function getAuthorizeDetail()
    {
        $logid = $this->getParams("id");
        if (empty($logid)) {
            $this->_ajaxReturn(array("ret" => -1));
            $logid = $this->getParams("logid");
            $data = array();
            $data["ret"] = 0;
            $data["rows"] = array(
                ["logid" => "1", "acc" => "zs", "name" => "张三", "IP" => "192.168.1.1", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/01/13 13:00", "AuthorizeAcc" => "lis", "AuthorizeName" => "李四", "AuthorizeType" => "只加密"],
                ["logid" => "2", "acc" => "lis", "name" => "李四", "IP" => "192.168.1.222", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/02/14 13:00", "AuthorizeAcc" => "wangwu", "AuthorizeName" => "王五", "AuthorizeType" => "只加密/加密附带授权"]
            );
            $data["total"] = count($data["rows"]);

            $detail = array();
            for ($i = 0; $i <= count($data["rows"]); $i++) {
                if ($data["rows"][$i]["logid"] === $logid) {
                    $detail = $data["rows"][$i];
                }
            }

            $ret['data'] = ["logid" => "1", "acc" => "zs", "name" => "张三", "IP" => "192.168.1.1", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/01/13 13:00", "AuthorizeAcc" => "lis", "AuthorizeName" => "李四", "AuthorizeType" => "只加密"];
            $ret['ret'] = 0;
            $this->_ajaxReturn($ret);
        }
    }
    //日志列表详细-白名单详情
    public  function getEmailDetail()
    {
        $logid = $this->getParams("logid");
//        $data=array();
//        $data["ret"]="0";
//        $data["rows"]=array(
//            ["logid"=>"1","acc"=>"zs","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","SendEmail"=>"23@qq.com","Addressee"=>"2222@qq.com","CopySend"=>"234234@qq.com","EmailTheme"=>"测试测试测试"],
//            ["logid"=>"2","acc"=>"lis","name"=>"李四","IP"=>"192.168.1.222","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/02/14 13:00","SendEmail"=>"11113@qq.com","Addressee"=>"2333331@qq.com","CopySend"=>"23423423@qq.com","EmailTheme"=>"是短发是的撒地方"]
//        );
//        $data["total"]=count($data["rows"]);
//
//        $detail=array();
//        for($i=0;$i<=count($data["rows"]);$i++)
//        {
//            if($data["rows"][$i]["logid"]===$logid)
//            {
//                $detail=$data["rows"][$i];
//            }
//        }
//        if(count($detail)>0)
//        {
//            $this->_ajaxReturn($detail);
//        }
//        else
//        {
//            $this->_ajaxReturn("-1");
//        }
        if (empty($logid)) {
            $this->_ajaxReturn(array("ret" => -1));
            $data = array();
            $data["ret"] = 0;
            $data["rows"] = array(
                ["logid" => "1", "acc" => "zs", "name" => "张三", "IP" => "192.168.1.1", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/01/13 13:00", "SendEmail" => "23@qq.com", "Addressee" => "2222@qq.com", "CopySend" => "234234@qq.com", "EmailTheme" => "测试测试测试"],
                ["logid" => "2", "acc" => "lis", "name" => "李四", "IP" => "192.168.1.222", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/02/14 13:00", "SendEmail" => "11113@qq.com", "Addressee" => "2333331@qq.com", "CopySend" => "23423423@qq.com", "EmailTheme" => "是短发是的撒地方"]
            );
            $data["total"] = count($data["rows"]);

            $detail = array();
            for ($i = 0; $i <= count($data["rows"]); $i++) {
                if ($data["rows"][$i]["logid"] === $logid) {
                    $detail = $data["rows"][$i];
                }
            }
            $ret['data'] = ["logid" => "1", "acc" => "zs", "name" => "张三", "IP" => "192.168.1.1", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/01/13 13:00", "SendEmail" => "23@qq.com", "Addressee" => "2222@qq.com", "CopySend" => "234234@qq.com", "EmailTheme" => "测试测试测试"];
            $ret['ret'] = 0;
            $this->_ajaxReturn($ret);

        }
    }
    //日志列表详细-文件外发详情
    public  function getFileSendDetail()
    {
        $logid=$this->getParams("logid");
//        $data=array();
//        $data["ret"]="0";
//        $data["rows"]=array(
//            ["logid"=>"1","acc"=>"zs","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","Action"=>"密码认证","EffTime"=>"10","AllPrint"=>"1","ShowTime"=>"1","Delete"=>"1","EffNumber"=>"10","AllUpdata"=>"1"],
//            ["logid"=>"2","acc"=>"lis","name"=>"李四","IP"=>"192.168.1.222","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/02/14 13:00","Action"=>"密码认证","EffTime"=>"10","AllPrint"=>"0","ShowTime"=>"0","Delete"=>"0","EffNumber"=>"10","AllUpdata"=>"1"]
//        );
//        $data["total"]=count($data["rows"]);
//
//        $detail=array();
//        for($i=0;$i<=count($data["rows"]);$i++)
//        {
//            if($data["rows"][$i]["logid"]===$logid)
//            {
//                $detail=$data["rows"][$i];
//            }
//        }
//        if(count($detail)>0)
//        {
//            $this->_ajaxReturn($detail);
//        }
//        else
//        {
//            $this->_ajaxReturn("-1");
//        }
        if(empty($logid)){
            $this->_ajaxReturn(array("ret"=>-1));
        }
        $ret['data']= ["logid"=>"1","acc"=>"zs","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","Action"=>"密码认证","EffTime"=>"10","AllPrint"=>"1","ShowTime"=>"1","Delete"=>"1","EffNumber"=>"10","AllUpdata"=>"1"];
        $ret['ret']=0;
        $this->_ajaxReturn($ret);
    }

    //日志列表详细-解密申请详细
    public  function getDecryptApplyDetail()
    {
        $logid=$this->getParams("logid");
//        $data=array();
//        $data["ret"]="0";
//        $data["rows"]=array(
//            ["logid"=>"1","acc"=>"zs","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","Process"=>"解密申请默认流程","ApprovalEmp"=>"李四","State"=>"1","ApplyReason"=>"发给客户","ReplyNews"=>"同意发送"],
//            ["logid"=>"2","acc"=>"lis","name"=>"李四","IP"=>"192.168.1.222","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/02/14 13:00","Process"=>"解密申请默认流程","ApprovalEmp"=>"王五","State"=>"0","ApplyReason"=>"发给客户","ReplyNews"=>"不能发送给客户"]
//        );
//        $data["total"]=count($data["rows"]);
//
//        $detail=array();
//        for($i=0;$i<=count($data["rows"]);$i++)
//        {
//            if($data["rows"][$i]["logid"]===$logid)
//            {
//                $detail=$data["rows"][$i];
//            }
//        }
//        if(count($detail)>0)
//        {
//            $this->_ajaxReturn($detail);
//        }
//        else
//        {
//            $this->_ajaxReturn("-1");
//        }
        $data=array();
        $data["ret"]=0;
        $data["rows"]=array(
            ["logid"=>"1","acc"=>"zs","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","Process"=>"解密申请默认流程","ApprovalEmp"=>"李四","State"=>"1","ApplyReason"=>"发给客户","ReplyNews"=>"同意发送"],
            ["logid"=>"2","acc"=>"lis","name"=>"李四","IP"=>"192.168.1.222","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/02/14 13:00","Process"=>"解密申请默认流程","ApprovalEmp"=>"王五","State"=>"0","ApplyReason"=>"发给客户","ReplyNews"=>"不能发送给客户"]
        );
        $data["total"]=count($data["rows"]);

        if(empty($logid)){
            $this->_ajaxReturn(array("ret"=>-1));
        }
        $ret['data']=   ["logid"=>"1","acc"=>"zs","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","Process"=>"解密申请默认流程","ApprovalEmp"=>"李四","State"=>"1","ApplyReason"=>"发给客户","ReplyNews"=>"同意发送"];
        $ret['ret']=0;
        $this->_ajaxReturn($ret);
    }
    //日志列表详细-外发申请详情
    public  function getFileApplyDetail()
    {
        $logid = $this->getParams("logid");
//        $data=array();
//        $data["ret"]="0";
//
//        $data["rows"]=array(
//            ["logid"=>"1","acc"=>"zs","name"=>"张三","IP"=>"192.168.1.1","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/01/13 13:00","Process"=>"解密申请默认流程","ApprovalEmp"=>"李四","State"=>"1","ApplyReason"=>"发给客户","ReplyNews"=>"同意发送","Action"=>"密码认证","EffTime"=>"10","AllPrint"=>"1","ShowTime"=>"1","Delete"=>"1","EffNumber"=>"10","AllUpdata"=>"1"],
//            ["logid"=>"2","acc"=>"lis","name"=>"李四","IP"=>"192.168.1.222","MAC"=>"00:00:00:00:00","logtype"=>"1","OptTime"=>"2015/02/14 13:00","Process"=>"解密申请默认流程","ApprovalEmp"=>"王五","State"=>"0","ApplyReason"=>"发给客户","ReplyNews"=>"不能发送给客户","Action"=>"密码认证","EffTime"=>"10","AllPrint"=>"0","ShowTime"=>"0","Delete"=>"0","EffNumber"=>"6","AllUpdata"=>"1"]
//        );
//        $data["total"]=count($data["rows"]);
//
//        $detail=array();
//        for($i=0;$i<=count($data["rows"]);$i++)
//        {
//            if($data["rows"][$i]["logid"]===$logid)
//            {
//                $detail=$data["rows"][$i];
//            }
//        }
//        if(count($detail)>0)
//        {
//            $this->_ajaxReturn($detail);
//        }
//        else
//        {
//            $this->_ajaxReturn("-1");
//        }
        if (empty($logid)) {
            $this->_ajaxReturn(array("ret" => -1));
            $data = array();
            $data["ret"] = 0;

            $data["rows"] = array(
                ["logid" => "1", "acc" => "zs", "name" => "张三", "IP" => "192.168.1.1", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/01/13 13:00", "Process" => "解密申请默认流程", "ApprovalEmp" => "李四", "State" => "1", "ApplyReason" => "发给客户", "ReplyNews" => "同意发送", "Action" => "密码认证", "EffTime" => "10", "AllPrint" => "1", "ShowTime" => "1", "Delete" => "1", "EffNumber" => "10", "AllUpdata" => "1"],
                ["logid" => "2", "acc" => "lis", "name" => "李四", "IP" => "192.168.1.222", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/02/14 13:00", "Process" => "解密申请默认流程", "ApprovalEmp" => "王五", "State" => "0", "ApplyReason" => "发给客户", "ReplyNews" => "不能发送给客户", "Action" => "密码认证", "EffTime" => "10", "AllPrint" => "0", "ShowTime" => "0", "Delete" => "0", "EffNumber" => "6", "AllUpdata" => "1"]
            );
            $data["total"] = count($data["rows"]);

            $detail = array();
            for ($i = 0; $i <= count($data["rows"]); $i++) {
                if ($data["rows"][$i]["logid"] === $logid) {
                    $detail = $data["rows"][$i];
                }
            }
            $ret['data'] = ["logid" => "1", "acc" => "zs", "name" => "张三", "IP" => "192.168.1.1", "MAC" => "00:00:00:00:00", "logtype" => "1", "OptTime" => "2015/01/13 13:00", "Process" => "解密申请默认流程", "ApprovalEmp" => "李四", "State" => "1", "ApplyReason" => "发给客户", "ReplyNews" => "同意发送", "Action" => "密码认证", "EffTime" => "10", "AllPrint" => "1", "ShowTime" => "1", "Delete" => "1", "EffNumber" => "10", "AllUpdata" => "1"];
            $ret['ret'] = 0;
            $this->_ajaxReturn($ret);

            if (count($detail) > 0) {
                $this->_ajaxReturn($detail);
            } else {
                $this->_ajaxReturn("-1");
            }
        }
    }


  /*  //客户端日志
QueryClientLog2
&pSessionID, &iLenOfSessionID ,/连接ID string/
&iInIndex,/记录开始索引，全部查询为-1 int /
&iInCount,/记录条数,全部查询为-1 int /
&iOrderIndex , /排序索引，0为登录名，1为显示名，2为时间，3 为ip，4 为日志类型，5 为文件描述，int /
&bDesc ,/是不是降序,默认升序bool/
&iLogTypeIndex,/日志类型匹配int/
&pStrInLoginName , &iLenLoginName ,/登录名string/
&pStrInIp , &iLenIp ,/ip匹配sring/
&pStrInKey , &iLenKey ,/关键字匹配string/
&pStrInBeginTime ,&iLenStrInBeginTime ,/时间匹配开始时间string/
&pStrInEndTime , &iLenStrInEndTime/时间匹配终止时间 string/


//管理端日志
QueryAdminOPLog2 //服务端查询
&pSessionID, &iLenOfSessionID ,/连接ID string/
&iInIndex,/记录开始索引，全部查询为-1 int /
&iInCount,/记录条数,全部查询为-1 int /
&iOrderIndex , /排序索引，0为登录名，1为显示名，2为时间，3 为ip，4 为日志类型，5 为文件描述，int /
&bDesc ,/是不是降序,默认升序bool/
&iLogTypeIndex,/日志类型匹配int/
&pStrInLoginName , &iLenLoginName ,/登录名string/
&pStrInIp , &iLenIp ,/ip匹配sring/
&pStrInKey , &iLenKey ,/关键字匹配string/
&pStrInBeginTime ,&iLenStrInBeginTime ,/时间匹配开始时间string/
&pStrInEndTime , &iLenStrInEndTime/时间匹配终止时间 string/*/

    //客户端日志数据定义
    public function getClientLogDetail()
    {
        $data=array();
        $detail=array();
        $data["ret"]=0;
        $detail["LogInfoList"]=array(
            [
            "attach"=>"1",
            "filedesc"=>
                ["DecryptName"=>"baokun","filter"=>"*.*","OperationObjects"=>"E:\\hk,E:\\hk,E:\\hk,E:\\hk,E:\\hk,E:\\hk,E:\\hk,E:\\hk"],
            "filejson"=>["atach"=>"1","count"=>"8","filelist"=>[
                ["clientname"=>"红红火火恍恍惚惚.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h0-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h12-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h13-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"],
                ["clientname"=>"h1-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt","servername"=>"{5B405150-A084-480A-871F-4F8946895290}"]

            ]
            ]
            ,
            "id"=>"39",
            "ipaddress"=>"192.168.3.228",
            "logdesc"=>"",
            "logguid"=>"{5B405150-A084-480A-871F-4F8946895290}",
            "loginname"=>"baokunbaokunbaokunbaokunbaokun",
            "logtype"=>"1",
            "remark"=>"",
            "remark1"=>"",
            "uptime"=>"2016-01-25 15:19:29",
            "userguid"=>"70694194-358e-f64c-b97f-eadbaef82c0c",
            "username"=>"鲍鲲"
        ],
            [
                "attach"=>"1",
                "filedesc"=>
                    ["DecryptName"=>"baokun","filter"=>"*.*","OperationObjects"=>"E:\\hk,E:\\hk,E:\\hk,E:\\hk,E:\\hk,E:\\hk,E:\\hk,E:\\hk"],
                "filejson"=>null
                ,
                "id"=>"138",
                "ipaddress"=>"192.168.3.228",
                "logdesc"=>"",
                "logguid"=>"{5B405150-A084-480A-871F-4F8946895290}",
                "loginname"=>"范德萨发过的功夫大使馆非官方大哥分官方个",
                "logtype"=>"1",
                "remark"=>"",
                "remark1"=>"",
                "uptime"=>"2016-01-25 15:19:29",
                "userguid"=>"70694194-358e-f64c-b97f-eadbaef82c0c",
                "username"=>"鲍鲲"
            ]
        );
        $data["Result"]=$detail;
        //echo json_decode($data);
        //var_dump( $data["Result"]["LogInfoList"][3]);

        $this->_ajaxReturn($data);

    }

    //服务端日志定义
    public function getServerLogDetail()
    {
        $data=array();
        $detail=array();
        $data["ret"]=0;
        $detail["LogInfoList"]=array([
            "ID"=>"2",
            "displayname"=>"sd",
            "ipaddress"=>"df",
            "loginname"=>"df",
            "opdescribe"=>"sd",
            "optype"=>"1",
            "uptime"=>"2016-01-26 10:50:38"
        ],[
            "ID"=>"3",
            "displayname"=>"ddd",
            "ipaddress"=>"ddd",
            "loginname"=>"ddddf",
            "opdescribe"=>"sdddd",
            "optype"=>"2",
            "uptime"=>"2016-01-26 10:50:38"
        ],[
            "ID"=>"4",
            "displayname"=>"aa",
            "ipaddress"=>"aa",
            "loginname"=>"aa",
            "opdescribe"=>"ddscsdf",
            "optype"=>"1",
            "uptime"=>"2016-01-26 10:50:38"
        ],[
            "ID"=>"5",
            "displayname"=>"bb",
            "ipaddress"=>"bb",
            "loginname"=>"bb",
            "opdescribe"=>"bb",
            "optype"=>"4",
            "uptime"=>"2016-01-26 10:50:38"
        ],[
            "ID"=>"6",
            "displayname"=>"cc",
            "ipaddress"=>"cc",
            "loginname"=>"cc",
            "opdescribe"=>"cc",
            "optype"=>"3",
            "uptime"=>"2016-01-26 10:50:38"
        ],[
            "ID"=>"7",
            "displayname"=>"assa",
            "ipaddress"=>"asd",
            "loginname"=>"dafafd",
            "opdescribe"=>"ssadvcd",
            "optype"=>"4",
            "uptime"=>"2016-01-26 10:50:38"
        ],[
            "ID"=>"8",
            "displayname"=>"sersdf",
            "ipaddress"=>"sdac",
            "loginname"=>"advxc",
            "opdescribe"=>"erwqdf",
            "optype"=>"2",
            "uptime"=>"2016-01-26 10:50:38"
        ]);
        $data["Result"]=$detail;
        $newdata=json_encode($data);
        $this->_ajaxReturn($newdata);
    }
/*

    //客户端日志
QueryClientLog2
&pSessionID, &iLenOfSessionID ,/连接ID string/
&iInIndex,/记录开始索引，全部查询为-1 int /
&iInCount,/记录条数,全部查询为-1 int /
&iOrderIndex , /排序索引，0为登录名，1为显示名，2为时间，3 为ip，4 为日志类型，5 为文件描述，int /
&bDesc ,/是不是降序,默认升序bool/
&iLogTypeIndex,/日志类型匹配int/
&pStrInLoginName , &iLenLoginName ,/登录名string/
&pStrInIp , &iLenIp ,/ip匹配sring/
&pStrInKey , &iLenKey ,/关键字匹配string/
&pStrInBeginTime ,&iLenStrInBeginTime ,/时间匹配开始时间string/
&pStrInEndTime , &iLenStrInEndTime/时间匹配终止时间 string/*/
    //客户端日志数据定义
    public function getClientLogDetail2()
    {
        $sessid=self::$SID;
        $page = $this->getParams('page',1,'int');//第几页
        $rows = $this->getParams('rows',15,'int');//每页多少条
        $OrderIndex=$this->getParams('OrderIndex',2,'int');//排序索引
        $order = $this->getParams('order');//默认升序
        $sortIndex=$this->getParams('sort');
        $Start=$rows * ($page-1);//从第N条记录开始分页
        $LogTypeIndex=$this->getParams('LogTypeIndex',0,'int');//日志类型
        $StrInLoginName=$this->getParams('LoginName','');
        $StrIP=$this->getParams('StrIP','');
        $StrInKey=$this->getParams('StrInKey','');
        $BeginTime=$this->getParams('BeginTime','');
        $EndTime=$this->getParams('EndTime','');
        switch($sortIndex)
        {
            case "username":
                $OrderIndex=1;
                break;
            case "uptime":
                $OrderIndex=2;
                break;
            case "ipaddress":
                $OrderIndex=3;
                break;
            case "loginname":
                $OrderIndex=0;
                break;
        }

        switch($order)
        {
            case "asc":
                $order=0;
                break;
            default:
                $order=1;
        }

        /*var_dump($OrderIndex);
        var_dump($order);exit;*/
        if($EndTime!="")
        {
            $EndTime=$EndTime." 23:59:59";
        }
        $data=self::$CAR->QueryClientLog2($sessid,$Start,$rows,$OrderIndex,$order,$LogTypeIndex,$StrInLoginName,$StrIP,$StrInKey,$BeginTime,$EndTime);
        $this->_ajaxReturn($data);
        //echo self::$CAR->QueryClientLog2('12345678',1,1,1,1,1,'','','','','');


    }
    /*
        //管理端日志
        QueryAdminOPLog2 //服务端查询
        &pSessionID, &iLenOfSessionID ,/连接ID string/
        &iInIndex,/记录开始索引，全部查询为-1 int /
        &iInCount,/记录条数,全部查询为-1 int /
        &iOrderIndex , /排序索引，0为登录名，1为显示名，2为时间，3 为ip，4 为日志类型，5 为文件描述，int /
        &bDesc ,/是不是降序,默认升序bool/
        &iLogTypeIndex,/日志类型匹配int/
        &pStrInLoginName , &iLenLoginName ,/登录名string/
        &pStrInIp , &iLenIp ,/ip匹配sring/
        &pStrInKey , &iLenKey ,/关键字匹配string/
        &pStrInBeginTime ,&iLenStrInBeginTime ,/时间匹配开始时间string/
        &pStrInEndTime , &iLenStrInEndTime/时间匹配终止时间 string*/
    //服务端日志定义
    public function getServerLogDetail2()
    {
        $sessid=self::$SID;
        $page = $this->getParams('page',1,'int');//记录开始索引，全部查询为-1 int /
        $row = $this->getParams('rows',15,'int');//记录条数,全部查询为-1 int /
        $sortIndex=$this->getParams('sort');
        $OrderIndex=$this->getParams('OrderIndex',2,'int'); //排序索引，0为登录名，1为显示名，2为时间，3 为ip，4 为日志类型，5 为文件描述，int /
        $order = $this->getParams('order');//是不是降序,默认升序bool/
        $Start=$row * ($page-1);//从第N条记录开始分页
        $LogTypeIndex=$this->getParams('LogTypeIndex',0,'int');//日志类型int
        $StrInLoginName=$this->getParams('LoginName','');//登录名string/
        $StrIP=$this->getParams('StrIP','');//ip匹配sring/
        $StrInKey=$this->getParams('StrInKey','');//关键字匹配string/
        $BeginTime=$this->getParams('BeginTime','');//时间匹配开始时间string/
        $EndTime=$this->getParams('EndTime','');//时间匹配终止时间 string*/

        switch($sortIndex)
        {
            case "displayname":
                $OrderIndex=1;
                break;
            case "uptime":
                $OrderIndex=2;
                break;
            case "ipaddress":
                $OrderIndex=3;
                break;
            case "loginname":
                $OrderIndex=0;
                break;
        }

        switch($order)
        {
            case "asc":
                $order=0;
                break;
            default:
                $order=1;
        }
        //var_dump($order);exit;
        if($EndTime!="")
        {
            $EndTime=$EndTime." 23:59:59";
        }

        $data=self::$CAR->QueryAdminOPLog2($sessid,$Start,$row,$OrderIndex,$order,$LogTypeIndex,$StrInLoginName,$StrIP,$StrInKey,$BeginTime,$EndTime);
        $this->_ajaxReturn($data);
    }
    public function getFileDownload()
    {
        $savePath =  realpath($this->getConfig('TEMP_PATH'));
        $uniqid = md5(uniqid('',true));
        $fileType = $this->getConfig('DOWNLOAD_FILE_TYPE');
        $fileName = $uniqid. '.' . $fileType;
        $filePath =  $savePath . DIRECTORY_SEPARATOR . $fileName;
        $servername = $this->getParams('servername');
        $ret = self::$CAR->MyDownLoadFileFuc(self::$SID, $filePath, $servername);
        $result = json_decode($ret);
        if($result->ret){
            $this->_ajaxReturn($ret);
        }

        if(!file_exists($savePath)){
            $this->_ajaxReturn('{"ret":-10, "error_info":'.$this->getLang('fileDoesNotExist').'}');
        }
        $this->_ajaxReturn(array(
            "ret"=>0,
            "code"=>$uniqid
        ));
    }

}
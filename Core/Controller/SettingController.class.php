<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-20
 * Time: 下午4:53
 */
defined("WOWOSTAR") or exit();
class SettingController extends Controller
{
    public function index()
    {
        $adsData = $this->_getAdsSetting();
        $this->assign("ads",$adsData['Result']);
        $errorInfo = $this->getLang('dataLoadFailed');
        $this->assign("adsError",$adsData['ret']!=0?sprintf($errorInfo,$adsData['ret']):"");
        $bsData = $this->_getBusinessSetting();
        $this->assign("bs",$bsData);
        $this->assign("bsError",$bsData['ret']!=0?sprintf($errorInfo,$bsData['ret']):"");
        $otherData = $this->_getOtherSetting();
        $fileBack = $otherData['FileBack'];
        $ProtectFile = $otherData['ProtectFile'];
        //$ProtectFile["TickTime"]= $ProtectFile["TickTime"]*60;
        $this->assign("fileBack",$fileBack);
        $this->assign("protectFile",$ProtectFile);
        $this->assign("otherSettingError",$otherData['ret']!=0?sprintf($errorInfo,$otherData['ret']):"");
        $this->display();
    }
    /*
     * 部门树
     */
    public function getUserGroupTree()
    {
        Common::controller('UserGroup')->getUserGroupTree();
    }

//ListUserToAssignToFlow
    /**
     * 获取流程使用人员树
     */
    public function getProcessApplyUserGroupTree()
    {
        $guid=$this->getParams('id');
        $processGuid=$this->getParams('processGuid');
        $processType=$this->getParams('processType',false,'int');
        if($processType === false)
        {
            $this->_error(-2);
        }
        $include_onceUser = $this->getParams('include_onceUser',0,'int');
        $include_onceGroup = $this->getParams('include_onceGroup',0,'int');
        $ret = self::$CAR->ListUserToAssignToFlow( self::$SID, $processGuid,$guid , $include_onceGroup ,$include_onceGroup ,$processType);
        //L($ret,__FILE__,__LINE__);
        $this->_ajaxReturn($ret);
    }

    public function getProcessStepUserGroupTree()
    {
        //$guid=$this->getParams('id');
        //$processGuid=$this->getParams('processGuid');
        //$processType=$this->getParams('processType',false,'int');
        /*if($processType === false)
        {
            $this->_error(-2);
        }*/
        //$include_onceUser = $this->getParams('include_onceUser',0,'int');
        //$include_onceGroup = $this->getParams('include_onceGroup',0,'int');
        $ret = self::$CAR->ListAduitToAssignToFlow( self::$SID, '','',0,0);
        //L($ret,__FILE__,__LINE__);
        $this->_ajaxReturn($ret);
    }


    /**
     * 获取设置树列表
     */
    public function getSettingTree()
    {
        $data  = Common::getArrayData('Setting','settingTree');
        $ret['data']=$data;
        $this->_ajaxReturn($ret);
    }

    /**
     * 获取业务参数配置
     */
    private function _getBusinessSetting()
    {
        $data=array();
        $code=0;
        //水印
        $ret = self::$CAR->GetWaterString(self::$SID);
        $ret = json_decode($ret,true);
        $data= array_merge($data,$ret['Result']);
        if($ret['ret']!=0&&$ret['ret']!=13)
        {
            $code=$ret['ret'];
        }
        //拷贝
        $ret = self::$CAR->GetCopyPara(self::$SID);
        $ret = json_decode($ret,true);
        $data= array_merge($data,$ret['Result']);
        if($ret['ret']!=0&&$ret['ret']!=13)
        {
            $code=$ret['ret'];
        }

        //短期离线时长
        $ret = self::$CAR->GetShortOfflineTime(self::$SID);
        $ret = json_decode($ret,true);
        $data= array_merge($data,$ret['Result']);
        if($ret['ret']!=0&&$ret['ret']!=13)
        {
            $code=$ret['ret'];
        }

        // 获取文件外发参数
        $ret = self::$CAR->GetFileOutInfo(self::$SID);
        $ret = json_decode($ret,true);
        $data= array_merge($data,$ret['Result']);
        if($ret['ret']!=0&&$ret['ret']!=13)
        {
            $code=$ret['ret'];
        }
        //$array = json_encode($array);
        $data['ret']=$code;
        return $data;
    }


    /**
     * 设置业务参数
     */
    private function _setBusinessSetting($params)
    {
        //水印
        $data = array(
            'WaterMarkStr' => $this->getParams('WaterMarkStr','','str',$params)
        );
        $json = json_encode($data);

        $ret = self::$CAR->SetWaterString(self::$SID, $json);
        $ret = json_decode($ret,true);
        $array['water'] = $ret;

        //拷贝
        $data = array(
            'CopyCount' => $this->getParams('CopyCount',0,'int',$params),
            'CopyLength' => $this->getParams('CopyLength',0,'int',$params),
        );
        $json = json_encode($data);
        $ret = self::$CAR->SetCopyPara(self::$SID, $json);
        $ret = json_decode($ret,true);
        $array['copy'] = $ret;

        //短期离线时间
        $data = array(
            'OfflineShortTime' => $this->getParams('OfflineShortTime',0,'int',$params),
        );
        $json = json_encode($data);
        $ret = self::$CAR->SetShortOfflineTime(self::$SID, $json);
        $ret = json_decode($ret,true);
        $array['time'] = $ret;

        //文件外发参数
        $fileOutPwd = $this->getParams('SS_FILEOUT_PWD',0,'int',$params);
        $fileOutMachingcode = $this->getParams('SS_FILEOUT_MACHINECODE',0,'int',$params);
        $fileOutMakeexe = $this->getParams('SS_FILEOUT_MAKEEXE',0,'int',$params);
        $fileOutAutodel = $this->getParams('SS_FILEOUT_AUTODEL',0,'int',$params);
        $fileOutModify = $this->getParams('SS_FILEOUT_MODIFY',0,'int',$params);
        $fileOutPrint = $this->getParams('SS_FILEOUT_PRINT',0,'int',$params);
        $fileOutShowtime = $this->getParams('SS_FILEOUT_SHOWREMAINTIME',0,'int',$params);

        $data = array(
            'SS_FILEOUT_PWD' => $fileOutPwd,
            'SS_FILEOUT_MACHINECODE' => $fileOutMachingcode,
            'SS_FILEOUT_MAKEEXE' => $fileOutMakeexe,
            'SS_FILEOUT_AUTODEL' => $fileOutAutodel,
            'SS_FILEOUT_MODIFY' => $fileOutModify,
            'SS_FILEOUT_PRINT' => $fileOutPrint,
            'SS_FILEOUT_SHOWREMAINTIME' => $fileOutShowtime,
            'SS_FILEOUT_AVAILABLE_TIME' =>  $this->getParams('SS_FILEOUT_AVAILABLE_TIME','','str',$params),
            'SS_FILEOUT_AVAILABLE_TIMES' => $this->getParams('SS_FILEOUT_AVAILABLE_TIMES','','str',$params)
        );
        /*isset($_POST['SS_FILEOUT_PWD']) ? $fileOutPwd = 1 : $fileOutPwd = 0;
        isset($_POST['SS_FILEOUT_MACHINECODE'])? $fileOutMachingcode = 1 : $fileOutMachingcode = 0;
        isset($_POST['SS_FILEOUT_MAKEEXE']) ? $fileOutMakeexe = 1 : $fileOutMakeexe = 0;
        isset($_POST['SS_FILEOUT_AUTODEL']) ? $fileOutAutodel = 1 : $fileOutAutodel = 0;
        isset($_POST['SS_FILEOUT_MODIFY']) ? $fileOutModify = 1 : $fileOutModify = 0;
        isset($_POST['SS_FILEOUT_PRINT']) ? $fileOutPrint = 1 : $fileOutPrint = 0;
        isset($_POST['SS_FILEOUT_SHOWREMAINTIME']) ? $fileOutShowtime = 1 : $fileOutShowtime = 0;

        $data = array(
            'SS_FILEOUT_PWD' => $fileOutPwd,
            'SS_FILEOUT_MACHINECODE' => $fileOutMachingcode,
            'SS_FILEOUT_MAKEEXE' => $fileOutMakeexe,
            'SS_FILEOUT_AUTODEL' => $fileOutAutodel,
            'SS_FILEOUT_MODIFY' => $fileOutModify,
            'SS_FILEOUT_PRINT' => $fileOutPrint,
            'SS_FILEOUT_SHOWREMAINTIME' => $fileOutShowtime,
            'SS_FILEOUT_AVAILABLE_TIME' => $_POST['SS_FILEOUT_AVAILABLE_TIME'],
            'SS_FILEOUT_AVAILABLE_TIMES' => $_POST['SS_FILEOUT_AVAILABLE_TIMES'],
        );
        $json = json_encode($data);*/
        $json = json_encode($data);
        //$car = new Car;
        $ret = self::$CAR->SetFileOutInfo(self::$SID,$json);
        $ret = json_decode($ret,true);
        $array['out'] = $ret;
        $array = json_encode($array);

        return $array;

    }

    public function businessSetting()
    {

        $type = $this->getParams('type');
        if($type == 'get'){
            $ret = $this->_getBusinessSetting();
        } else {
            $params = $this->getParams();
            $ret = $this->_setBusinessSetting($params);
        }
        $this->_ajaxReturn($ret);
    }
    //获取业务配置
    public function getBusinessSetting()
    {
        $ret = $this->_getBusinessSetting();
        $this->_ajaxReturn($ret);
    }
    //设置业务配置
    public function setBusinessSetting()
    {
        $params = $this->getParams();
        $ret = $this->_setBusinessSetting($params);
        $this->_ajaxReturn($ret);
    }

    /**
     * 其他设置
     */
    public function otherSetting()
    {
        $type = $this->getParams('type');
        if($type == 'get'){
            $ret = self::$CAR->GetAdsParam(self::$SID);
        } else {
            $data = array(
                'AdsSvIP' => $this->getParams('AdsSvIP'),
                'AdsDns' => $this->getParams('AdsDns'),
                'LogName' => $this->getParams('LogName'),
                'PassWord' => $this->getParams('PassWord'),
            );
            $json = json_encode($data);
            $ret = self::$CAR->SetAdsParam(self::$SID, $json);
        }
        $this->_ajaxReturn($ret);
    }

    /**
     * 获取域参数配置
     * @return mixed
     */
    private function _getAdsSetting()
    {
        $ret = self::$CAR->GetAdsParam(self::$SID);
        return json_decode($ret,true);
    }
    public function setAdsSetting(){
        $data = array(
            'AdsSvIP' => $this->getParams('AdsSvIP'),
            'AdsDns' => $this->getParams('AdsDns'),
            'LogName' => $this->getParams('LogName'),
            'PassWord' => $this->getParams('PassWord'),
        );
        $json = json_encode($data);
        $ret = self::$CAR->SetAdsParam(self::$SID, $json);
        $this->_ajaxReturn($ret);
    }
    /**
     * 获取其他配置
     */
    private function _getOtherSetting()
    {
        $json = json_encode(array(
            "FileBack"=>true,
            "ProtectFile"=>true
        ));
        $ret = self::$CAR->GetCommParam(self::$SID,$json);
        /*$ret = json_encode(array(
            "FileBack"=>array(
                "EMaxSize"=>11,
                "ESentensPer"=>20,
                "ESentens"=>20,
                "EDelTime"=>10,
                "EIntervalTime"=>2,
                "EBackFile"=>1,
                "EDelFile"=>true,
                "ESuffix"=>array(".doc",".docx"),
                "NMaxSize"=>11,
                "NSentensPer"=>20,
                "NSentens"=>20,
                "NDelTime"=>10,
                "NIntervalTime"=>2,
                "NBackFile"=>true,
                "NDelFile"=>true,
                "NSuffix"=>array(".doc",".docx"),
                "DMaxSize"=>11,
                "DSentensPer"=>20,
                "DSentens"=>20,
                "DDelTime"=>10,
                "DIntervalTime"=>2,
                "DBackFile"=>1,
                "DDelFile"=>true,
                "DSuffix"=>array(".doc",".docx",".docx"),
            ),
            "ProtectFile"=>array(
                "TickTime"=>10
            ),
            "ret"=>0
        ));*/
        #"MaxCount" 备份最大数
#define  BACKMAXSIZE "MaxSize"     备份最大大小 m
#define  SENTENSPER	"SentensPer" 备份空间比列 %
#define  SENTENS	"Sentens"   备份空间大小 M
#define  DELTIME    "DelTime"       删除时间 小时
#define  INTERVALTIME "IntervalTime" 备份间隔时间 小时
#define  BACKFILE	"BackFile"  TRUE  为开启
#define  DELFILE	"DelFile"	TRUE 为开启
#define  Suffix		"Suffix"

        return json_decode($ret,true);

    }
    private function explodeStr($str)
    {
        //var_dump($str);exit;
        //$typeFunc = $type."Val";
        if(!empty($str))
        {
            return  explode(",",$str);
        }
        return $str;
    }
    /**
     * 设置其他配置
     */
    public function setOtherSetting()
    {
        $switch_time=$this->getParams("switch_time");

        if($switch_time!="on")
        {
            $TickTime=0;
        }
        else
        {
            $TickTime=$this->getParams("TickTime",null,"int");
        }
        //$TickTime=$TickTime/60;
        //var_dump(array('a'=>$TickTime));exit;
        $json = json_encode(array(
            "FileBack"=>array(
                "EMaxSize"=>$this->getParams("EMaxSize",null,"int"),
                "ESentensPer"=>$this->getParams("ESentensPer",null,"int"),
                "ESentens"=>$this->getParams("ESentens",null,"int"),
                "EDelTime"=>$this->getParams("EDelTime",null,"int"),
                "EIntervalTime"=>$this->getParams("EIntervalTime",null,"int"),
                "EBackFile"=>$this->getParams("EBackFile",0,"int"),
                "EDelFile"=>$this->getParams("EDelFile",null,"int"),
                "ESuffix"=>$this->explodeStr($this->getParams("ESuffix",null)),
                "NMaxSize"=>$this->getParams("NMaxSize",null,"int"),
                "NSentensPer"=>$this->getParams("NSentensPer",null,"int"),
                "NSentens"=>$this->getParams("NSentens",null,"int"),
                "NDelTime"=>$this->getParams("NDelTime",null,"int"),
                "NIntervalTime"=>$this->getParams("NIntervalTime",null,"int"),
                "NBackFile"=>$this->getParams("NBackFile",null,"int"),
                "NDelFile"=>$this->getParams("NDelFile",null,"int"),
                "NSuffix"=>$this->explodeStr($this->getParams("NSuffix",null)),
                "DMaxSize"=>$this->getParams("DMaxSize",null,"int"),
                "DSentensPer"=>$this->getParams("DSentensPer",null,"int"),
                "DSentens"=>$this->getParams("DSentens",null,"int"),
                "DDelTime"=>$this->getParams("DDelTime",null,"int"),
                "DIntervalTime"=>$this->getParams("DIntervalTime",null,"int"),
                "DBackFile"=>$this->getParams("DBackFile",0,"int"),
                "DDelFile"=>$this->getParams("DDelFile",null,"int"),
                "DSuffix"=>$this->explodeStr($this->getParams("DSuffix",null)),
            ),
            "ProtectFile"=>array(
                "TickTime"=>$TickTime
            )
        ));
        $ret = self::$CAR->SetCommParam(self::$SID, $json);
        //$ret = $json;
        $this->_ajaxReturn($ret);
    }

    /**
     * 获取流程设置数据
     */
    private function _getProcessSetting($guid)
    {
        //水印
        $ret = self::$CAR->ListOneFlow(self::$SID,$guid);
        $res = json_decode($ret,true);
        $ec=array();
        if(!$res['ret'])
        {
            $ec['ret']=0;
            $ec['FlowInfo']= isset($res['Result'])?$res['Result']['FlowInfo']:null;
            $ec['FlowStepInfo']=array();
            if(isset($ec['FlowInfo']['FlowStep']) && !empty($ec['FlowInfo']['FlowStep']))
            {
                $sCount=count($ec['FlowInfo']['FlowStep']);
                for($a=0;$a<=$sCount;$a++)
                {
                    $sRet = self::$CAR->ListAudit(self::$SID, $guid, $a);
                    $sRes = json_decode($sRet,true);
                    $ec['FlowStepInfo'][]=$sRes['Result']['UserOrGroup'];
                }
            }

            $tRet=self::$CAR->GetFlowType(self::$SID,$guid);
            $tRes = json_decode($tRet,true);
            if(!$tRes['ret'])
            {
                $ec['FlowTypeInfo']=$tRes['Result'];
            }
            $tRet=self::$CAR->GetFlowAssigningToUser( self::$SID , $guid);
            $tRes = json_decode($tRet,true);
            if(!$tRes['ret'])
            {
                $ec['UserOrGroup']=$tRes['Result']['UserOrGroup'];
            }
            $tRet=self::$CAR->GetFlowAssigningToLevel( self::$SID , $guid);
            $tRes = json_decode($tRet,true);
            if(!$tRes['ret'])
            {
                $ec['Role']=$tRes['Result'];
            }

        }
        else
        {
            return $ret;
        }
        return json_encode($ec);
    }

    private function _setProcessSetting($params)
    {
        $data  = $this->getParams('data','','str',$params);
        if(isset($_REQUEST['data']) && !empty($_REQUEST['data']))
        {
            $jsData = $data;
            $data=json_decode($data,true);
            if($this->getParams('isAdd',false,'str',$params))
            {

                $ret1 = self::$CAR->CreateNewFlowFromJson( self::$SID , $jsData);
                $res1=json_decode($ret1);
                if($res1->ret)
                {
                    return $ret1;
                }
            }
            else
            {
                //=========编辑模式==============
                foreach($data['STEP'] as $k =>$v)
                {
                    $stepJson=json_encode($v);
                    $stepRet=self::$CAR->SetFlowStepInfo(self::$SID,$data['GUID'],$k,$stepJson);
                    $stepRes=json_decode($stepRet);
                    if($stepRes->ret)
                    {
                        return $stepRet;
                    }
                }
            }


            if(isset($data['TYPE']))
            {
                $flowType=(int)$data['TYPE'];
                $ret1 = self::$CAR->SetFlowType( self::$SID , $data['GUID'], $flowType, 0);
                $res1=json_decode($ret1);
                if($res1->ret)
                {
                    return $ret1;
                }
            }

            $ids=[];

            //先清空原先绑定的用户
            self::$CAR->AssignFlowToUser( self::$SID , $data['GUID'], '{"UserOrGroupGuid":["AUTO"]}' );
            if(!empty($data['SS_APPROVAL_GROUP']))
            {
                $ids=array_merge($ids,explode(",",$data['SS_APPROVAL_GROUP']));
            }
            if(!empty($data['SS_APPROVAL_AUDI']))
            {
                $ids=array_merge($ids,explode(",",$data['SS_APPROVAL_AUDI']));
            }
            //绑定用户
            if(count($ids)>0)
            {
                $json=array();
                $json['UserOrGroupGuid'] = $ids;
                $json = json_encode($json);
                $ret2 = self::$CAR->AssignFlowToUser( self::$SID , $data['GUID'], $json );
                $res2 = json_decode($ret2);
                if($res2->ret)
                {
                    return $ret2;
                }
            }

            //绑定角色等级
			$json=array();
			$json['FlowLevel']=array((int)$data['SS_APPROVAL_ROLE']);
			$json=json_encode($json);
			$ret2=self::$CAR->AssignFlowToLevel( self::$SID , $data['GUID'], $json);
			$res2=json_decode($ret2);
			if($res2->ret)
			{
				return $ret2;
			}


            if(!empty($data['DEFAULT']))
            {
                $retd = self::$CAR->SetFlowToDefault( self::$SID , $data['GUID'] );
                $resd = json_decode($retd);
                if($resd->ret)
                {
                    return $retd;
                }
            }
            foreach($data['STEP'] as  $k => $v )
            {
                $json=json_encode($v['AUDI']);
                $ret = self::$CAR->SetAudit( self::$SID, $data['GUID'],$k,$json,1);
                $res = json_decode($ret);
                if($res->ret)
                {
                    return $ret;
                }
            }
            return $ret;
        }
    }

    /**
     * 流程设置
     */
    public function processSetting()
    {
        $type = $this->getParams('type');
        $guid = $this->getParams('guid');
        if($type == 'get' && !empty($guid)){
            $ret = $this->_getProcessSetting($guid);
            $this->_ajaxReturn($ret);
        }
        else if($type == 'reset' && !empty($guid))
        {
            $ret=self::$CAR->DeleteOneFlow(self::$SID,$guid);
            $this->_ajaxReturn($ret);
        } else {
            $params = $this->getParams();
            $ret = $this->_setProcessSetting($params);
            $this->_ajaxReturn($ret);
        }
    }

    /**
     * 获取流程配置
     */
    public function getProcessSetting()
    {
        $guid = $this->getParams('guid');
        $ret = $this->_getProcessSetting($guid);
        $this->_ajaxReturn($ret);
    }

    /**
     * 设置流程设置
     */
    public function setProcessSetting()
    {
        $params = $this->getParams();
        $ret = $this->_setProcessSetting($params);
        $this->_ajaxReturn($ret);
    }

    /**
     * 重置流程配置
     */
    public function resetProcessSetting()
    {
        $guid = $this->getParams('guid');
        $ret=self::$CAR->DeleteOneFlow(self::$SID,$guid);
        $this->_ajaxReturn($ret);
    }



    /**
     * 获取流程唯一的用户或组
     */
    public function getProcessUniqueUserAndGroup()
    {
        //self::$CARListUserToAssignToFlow( self::$SID ,strFlowGuid , strParentGroupGuid , bIncludeGroup ,bIncludeUser);

    }


    /**
     * 获取系统自带的流程
     */
    public function getSystemProcess()
    {
        $type = $this->getParams('type',false);
        if($type ===  false)
        {
            $this->_error(-2);
        }
        else
        {
            $data = Common::getArrayData('Setting','systemProcess');
            if(!isset($data[$type]))
            {
                $this->_error(-2);
            }
            else
            {
                $this->_ajaxReturn($data[$type]);
            }
        }
    }
    public function test(){
        $ret = self::$CAR->GetRoleInfo(self::$SID,"72da464a-2970-41a1-ba08-69e59ba8aca8");
        var_export($ret);
    }
    /**
     * 列表页数据
     */
    public function getEmailWhiteList()
    {
        $retStr = self::$CAR->LoadEmailCfg(self::$SID);
        $res = json_decode($retStr,true);
        $data = array();
        if(!empty($res))
        {
            foreach($res as $k=>$v){
                $tmp = $v;
                if($k=="ret")
                {
                    continue;
                }
                elseif($k=="default")
                {
                    $tmp['name']="全局配置";
                    $tmp['id']=$k;
                    $tmp['from_white_list_view'] = implode(",",$tmp['from_white_list']);
                    $tmp['to_white_list_view'] = implode(",",$tmp['to_white_list']);
                }
                else
                {
                    $findRole = self::$CAR->GetRoleInfo(self::$SID,$k);
                    $roleInfo = json_decode($findRole,true);
                    if(!empty($roleInfo['Result']))
                    {
                        $tmp['name']=$roleInfo['Result']['RoleName'];
                    }
                    else{
                        $tmp['name']="";
                    }
                    $tmp['from_white_list_view'] = implode(",",$tmp['from_white_list']);
                    $tmp['to_white_list_view'] = implode(",",$tmp['to_white_list']);
                    $tmp['id']=$k;
                }
                $data[]=$tmp;
            }
        }
        //模拟分页处理
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');
        Common::vendor("DataList");
        $sort = $this->getParams('sort',"RecordeTime");
        $order = $this->getParams('order',"desc");
        $keyword = $this->getParams('Keyword');
        $dataList = new DataList($data,$page,$rows,$sort,$order,$keyword,array("name","from_white_list_view","to_white_list_view"));
        //Common::log($ar['result']);
        $ret['rows'] = $dataList->getData();
        $ret['total'] = count($data);
        $ret['ret'] = $res['ret'];
        $this->_ajaxReturn($ret);
    }
    public function getRoleTree(){
        Common::controller('Role')->getRoleTree();
    }
    public function addWhiteListPage()
    {
        $this->display();
    }
    public function saveWhiteList()
    {
        $roleID = $this->getParams("role_id","");
        $data = $this->getWhiteListData();
        //var_export($data);exit;
        $ret = self::$CAR->SaveEmailCfg(self::$SID,$roleID,$data);
        $this->_ajaxReturn($ret);
    }
    public function deleteWhiteList(){
        $id = $this->getParams("id",array(),"split");
        if(empty($id))
        {
            $this->_error(-2);
        }
        else
        {
            foreach($id as $v){
                if($v=="default")
                {
                    $v="";
                }
                $retStr = self::$CAR->SaveEmailCfg(self::$SID,$v,"");
                $res = json_decode($retStr,true);
                if($res['ret']!=0)
                {
                    $this->_error($res['ret']);
                }
            }
            $this->_ajaxReturn(array("ret"=>0));
        }
    }
    private function getWhiteListData(){
        $from_white_list = $this->getParams("from_white_list",array(),"split");
        $to_white_list = $this->getParams("to_white_list",array(),"split");
        $keep_sent = $this->getParams("keep_sent",1,"int");
        $log_attachemts = $this->getParams("log_attachemts",1,"int");
        $data = array(
            "from_white_list"=>$from_white_list,
            "to_white_list"=>$to_white_list,
            "keep_sent"=>$keep_sent,
            "log_attachemts"=>$log_attachemts,
            "default_smtp"=>"",
            "default_account"=>"",
            "default_pwd"=>"",
            "default_email_template"=>""
        );
       return json_encode($data);
    }
    public function editWhiteListPage()
    {
        $data = $this->getParams("data");
        if(empty($data))
        {
            $this->_error(-2);
        }
        $data = json_decode($data,true);
        $this->assign("data",$data);
        $this->display();
    }
    public function importWhiteList()
    {
        if(!isset($_FILES))
        {
            $this->_error(-2,'json');
        }
        //var_dump($_FILES);exit();
        $uuid = md5(uniqid("",true));
        Common::vendor("UploadFile");
        $savePath =  $this->getConfig('TEMP_PATH');
        $upload = new UploadFile();// 实例化上传类
        $upload->allowExts = array("txt");
        $upload->maxSize  = $this->getConfig('IMPORT_EMAIL_LIST_FILE_SIZE')*1024*1024 ;// 设置附件上传大小
        $upload->allowExts  = $this->getConfig('IMPORT_EMAIL_LIST_FILE_TYPE');// 设置附件上传类型
        $upload->savePath =  $savePath;// 设置附件上传目录
        if(!$upload->upload()) {
            $msg = $upload->getErrorMsg();
            $this->_ajaxReturn(array("ret"=>-1,"error_info"=>$msg),'json');
        }
        $info = $upload->getUploadFileInfo()[0];
        $path = $info["savepath"].$info['savename'];
        $content = file_get_contents($path);
        if(json_encode($content)=='null'){
            $content =  iconv('GBK', 'UTF-8', $content);
        }
        @unlink($path);
        $data_tmp = explode(",",$content);
        $data=array();
        ///^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        ///^((\w)|([\u4e00-\u9fa5]))+(((\.)|(\-))((\w)|([\u4e00-\u9fa5]))+)*@(\w)+(\.\w+)*(((\.)|(\-))[a-zA-Z]+)+$/,
        ///^(\\w|[\\u4e00-\\u9fa5])+((\\.|\\-)\\w+)*@(\\w)+(\\.\\w+)*((\\.|\\-)[a-zA-Z]+)+$/
        if(!empty($data_tmp))
        {
            foreach($data_tmp as $v)
            {
                //var_dump(array("a"=>"2"));
                if(preg_match("/^((\\w)|([\x7f-\xff]))+(((\\.)|(\\-))((\\w)|([\x7f-\xff]))+)*@((\\w)|([\x7f-\xff]))+(((\\.)|(\\-))((\\w)|([\x7f-\xff]))+)*((\\.)([a-zA-Z]|[\x7f-\xff])+)+$/",$v))
                {
                    $data[]=$v;
                }
            }
        }

        $this->_ajaxReturn(array("ret"=>count($data)>0?0:30000,"data"=>$data));
    }

    public function exportWhiteList()
    {
        $savePath =  realpath($this->getConfig('TEMP_PATH'));
        $uniqid = md5(uniqid('',true));
        $fileType = $this->getConfig('DOWNLOAD_FILE_TYPE');
        $fileName = $uniqid. '.' . $fileType;
        $filePath =  $savePath . DIRECTORY_SEPARATOR . $fileName;
        $data = $this->getParams('data');
        if(empty($data))
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("paramsError")));
        }
        file_put_contents($filePath,$data);
        //首判断给定的文件存在与否
        if(!file_exists($filePath)){
            $this->_ajaxReturn('{"ret":-10, "error_info":'.$this->getLang('fileDoesNotExist').'}');
        }
        $this->_ajaxReturn(array(
            "ret"=>0,
            "code"=>$uniqid
        ));
    }

    /*
     * 获取工作模式
     */
    public function getWorkModeList()
    {
        $retStr = self::$CAR->QueryWorkingModInfo(self::$SID,"" , 0 , 0 , 1 , 0 , 0 , 1 , 0 , 1000000);
        $res = json_decode($retStr,true);
        $data = array();
        if(!empty($res) && isset($res['WorkingModeList']) && !empty($res['WorkingModeList']))
        {
            $data = $res['WorkingModeList'];
            /*foreach($res as $k=>$v){
                $tmp = $v;
                if($k=="ret")
                {
                    continue;
                }
                elseif($k=="default")
                {
                    $tmp['name']="全局配置";
                    $tmp['id']=$k;
                    $tmp['from_white_list_view'] = implode(",",$tmp['from_white_list']);
                    $tmp['to_white_list_view'] = implode(",",$tmp['to_white_list']);
                }
                else
                {
                    $findRole = self::$CAR->GetRoleInfo(self::$SID,$k);
                    $roleInfo = json_decode($findRole,true);
                    if(!empty($roleInfo['Result']))
                    {
                        $tmp['name']=$roleInfo['Result']['RoleName'];
                    }
                    else{
                        $tmp['name']="";
                    }
                    $tmp['from_white_list_view'] = implode(",",$tmp['from_white_list']);
                    $tmp['to_white_list_view'] = implode(",",$tmp['to_white_list']);
                    $tmp['id']=$k;
                }
                $data[]=$tmp;
            }*/
        }
        //模拟分页处理
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');
        Common::vendor("DataList");
        $sort = $this->getParams('sort',"xx");
        $order = $this->getParams('order',"desc");
        $keyword = $this->getParams('Keyword');
        //var_dump($data);exit;
        $dataList = new DataList($data,$page,$rows,$sort,$order,$keyword,array("RoleName"));
        //Common::log($ar['result']);
        $ret['rows'] = $dataList->getData();
        $ret['total'] = count($data);
        $ret['ret'] = $res['ret']?$res['ret']:0;
        $this->_ajaxReturn($ret);
    }


    public function getNoPolicyRoleTree(){
        // 分页变量
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('row',0,'int');
        $sort = $this->getParams('sort');
        $order = $this->getParams('order','asc');

        $start=$rows * ($page-1);
        $count=$rows;
        $orderColumn=0;
        $ordertype = $order == "asc"?1:0;

        if( $sort != '' )
        {
            if( $sort == 'RoleID' )
            {
                $orderColumn=1;
            }
            else if( $sort == 'RoleName' )
            {
                $orderColumn=2;
            }
            else if( $sort == 'ParentTypeID' )
            {
                $orderColumn = 3;
            }
            else if( $sort == 'SpecialRight')
            {
                $orderColumn = 4;
            }
            else if( $sort == 'OperatorLevel' )
            {
                $orderColumn = 5;
            }
        }

        $ParentTypeID=$this->getParams('ParentTypeID');
        $FullInfo = $this->getParams('FullInfo',1,'int');
        $Condition = $this->getParams('Condition');
        $IncludeSubType = $this->getParams('IncludeSubType',0,'int');
        // 执行
        $ret = self::$CAR->getNoPolicyRoleTree( self::$SID, $ParentTypeID, $FullInfo, $Condition, $start, $count, $orderColumn, $ordertype ,$IncludeSubType );
        $this->_ajaxReturn($ret);
    }


    public function workModePage(){
        $roleID = $this->getParams("RoleID");
        $roleName = $this->getParams("RoleName");
        if(!empty($roleID)){
            $ret = self::$CAR->GetWorkingModInfo(self::$SID,$roleID);
            $res = json_decode($ret,true);
            if($res['ret']==0){
                $day = array("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday");
                $everyday=true;
                $is24=false;
                $timeList = array();
                foreach($day as $v){
                    if(!isset($res[$v]) || empty($res[$v])){
                        $everyday=false;
                        break;
                    }
                }
                foreach($day as $v){
                    if(isset($res[$v]) && !empty($res[$v])){
                        $timeList=$res[$v];
                        foreach($res[$v] as $i){
                            if($i['StartTime']=="00:00:00" && $i['EndTime']=="23:59:59"){
                                $is24=true;
                                break;
                            }
                        }
                        break;
                    }
                }
                //var_dump($res);
                $this->assign("data",$res);
                $this->assign("timeList",$timeList);
                $this->assign("everyday",$everyday);
                $this->assign("is24",$is24);
                $this->assign("RoleName",$roleName);
            }
        }else{
            $this->assign("everyday",true);
            $this->assign("is24",true);
        }

        $this->display("workModePage");
    }
    public function saveWorkMode(){
        $data = $this->getParams("data");
        $isEdit = $this->getParams("IsEdit");
        $ret = $isEdit?self::$CAR->ModifyWorkingModInfo(self::$SID,$data):self::$CAR->AddWorkingModInfo(self::$SID,$data);
        $this->_ajaxReturn($ret);
    }

    public function deleteWorkMode(){
        $id = $this->getParams("id");
        if(!empty($id)){
            $ids = explode(",",$id);
            $data['RoleID']=$ids;
            $ret = self::$CAR->DeleteWorkingModInfo( self::$SID , json_encode($data) );
            $this->_ajaxReturn($ret);
        }
    }


}
<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-15
 * Time: 上午9:47
 *
 * 角色模块
 */
defined("WOWOSTAR") or exit();
class BehaviorControlController extends Controller
{
    public function index()
    {
        $this->display();
    }
    public function getMenu()
    {
        $data  = Common::getArrayData('BehaviorControl','menu');
        $ret['data']=$data;
        $this->_ajaxReturn($ret);
    }
    /**
     * 获取部门树
     */
    public function getUserTree()
    {
        Common::controller('UserGroup')->getUserGroupTree();
    }
    /**
     * 列表页数据
     */
    public function getList()
    {
        $type = $this->getParams('type',-1);
        $user = $this->getParams("user","");
        if(empty($user))
        {
            $allData = self::$CAR->ListActionControlPolicy(self::$SID,$type);
            $allData = json_decode($allData,true);
            $allData = $allData['PolicyList'];
            $data=array();
            if($type==-1)
            {
                foreach($allData as $k=>$v){
                    foreach($v as $kk=>$vv){
                        $vv['PolicyType']=$this->typeID[$k];
                        $data[]=$vv;
                    }
                }
            }
            else{
                foreach($allData as $k=>$v)
                {
                    $v['PolicyType']=$type;
                    $data[]=$v;
                }

            }
        }
        else
        {
            $data= array();
            $policyType = array_values($this->typeID);
            foreach($policyType as $v)
            {
                $tmpRet = self::$CAR->GetUserActionControlPolicy(self::$SID,$v,$user);
                $tmpRes = json_decode($tmpRet,true);
                if($tmpRes['ret']!=0)
                {
                    $this->_error($tmpRes['ret']);
                }
                elseif(!empty($tmpRes['Result']))
                {
                    $tmpRes['Result']['PolicyType']=$v;
                    $data[] = $tmpRes['Result'];
                }
            }
        }

        //模拟分页处理
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');
        Common::vendor("DataList");
        $sort = $this->getParams('sort',"RecordeTime");
        $order = $this->getParams('order',"desc");
        $keyword = $this->getParams('Keyword');
        $dataList = new DataList($data,$page,$rows,$sort,$order,$keyword,array("PolicyName","PolicyDescribe"));
        //Common::log($ar['result']);
        $ret['rows'] = $dataList->getData();
        $ret['total'] = count($data);
        $this->_ajaxReturn($ret);
    }
    private $typeID = array("IOCtl"=>0,"IMCtl"=>1,"WebCtl"=>2);

    private $typeLink=array(
        0=>"Base",
        2=>"Internet",
        1=>"Communication"
    );
    /**
     * 添加页面
     */
    public function addPage()
    {
        $id = $this->getParams("id",false,"int");
        if($id===false)
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("paramsError")));
        }
        if(!isset($this->typeLink[$id]))
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("paramsError")));
        }
        $this->display("addPage_".$this->typeLink[$id]);
    }
    public function addWebItemPage()
    {
        $type = $this->getParams("type",false);
        $sel = $this->getParams("sel");
        if($type===false)
        {
            $this->_error(-2);
        }
        $retStr = self::$CAR->ListDefaultWebSite(self::$SID,$type);
        $ret = json_decode($retStr,true);
        //var_export($ret);exit;
        $list=array();
        if($ret['ret']!=0)
        {
            $this->_error($ret['ret']);
        }
        else
        {
            $list = $ret['Result']['WebGroupMember'];
        }
        $sel = explode(",",$sel);
        $data = array();
        if(!empty($sel))
        {
            foreach($list as $v)
            {
                if(!in_array($v['WebPageAddr'],$sel))
                {
                    $data[] = $v;
                }
            }
        }
        else{
            $data = $list;
        }
        if(empty($data))
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("notHasSelected")));
        }
        $this->assign("data",$data);
        $this->display();
    }

    /**
     * 添加
     */
    public function add()
    {
        $type = $this->getParams("PolicyType",0);
        //行为管控类型(0:IO,1:IM,2:WEB
        $data=false;
        switch($type){
            case 0:
            $data = $this->getIOData();
                break;
            case 1:
                $data = $this->getIMData();
                break;
            case 2:
                $data = $this->getWEBData();
                break;
        }
        if($data===false)
        {
            $this->_error(-2);
        }
        $ret = self::$CAR->AddNewActionControlPolicy(self::$SID ,$type,$data,1);
        /*$retData = json_decode($retStr,true);
        $ret['ret']=$retData['Ret'];*/
        $this->_ajaxReturn($ret);
    }
    public function edit()
    {
        $type = $this->getParams("PolicyType",0,'int');
        $id = $this->getParams("PolicyID",false);
        //var_dump($this->getParams());exit;
        if($id===false)
        {
            $this->_error(-2);
        }
        //行为管控类型(0:IO,1:IM,2:WEB
        $data=false;
        switch($type){
            case 0:
                $data = $this->getIOData();
                break;
            case 1:
                $data = $this->getIMData();
                break;
            case 2:
                $data = $this->getWEBData();
                break;
        }
        if($data===false)
        {
            $this->_error(-2);
        }
        //var_export($data);exit;
        $ret = self::$CAR->AddNewActionControlPolicy(self::$SID ,$type,$data,0);
        /*$retData = json_decode($retStr,true);
        $ret['ret']=$retData['Ret'];*/
        $this->_ajaxReturn($ret);
    }
    private function getIOData(){
        $data=array(
            "PolicyName"=>$this->getParams("PolicyName"),
            "IsBlackPolicy"=>$this->getParams("IsBlackPolicy",0,'int'),
            "PolicyDescribe"=>$this->getParams("PolicyDescribe"),
            "PolicyContent"=>array(
                "IsForbidPrint"=> $this->getParams('IsForbidPrint',1,"int"),
                "IsForbidInternet"=> $this->getParams('IsForbidInternet',1,"int"),
                "IsForbidUdisk"=> $this->getParams('IsForbidUdisk',1,"int")
            )
        );
        $PolicyID = $this->getParams("PolicyID");
        if(!empty($PolicyID))
        {
            $data['PolicyID']=$PolicyID;
        }
        return json_encode($data);
    }
    private function parseQQ(&$value)
    {
        return intval($value);
    }
    private function getIMData(){
        $QQAcountList = $this->getParams('QQAcountList',array(),"array");
        array_map($QQAcountList,array($this,"parseQQ"));
        $SkypeAcountList = $this->getParams('SkypeAcountList',array(),"array");
        $AliAcountList = $this->getParams('AliAcountList',array(),"array");
        $data=array(
            "PolicyName"=>$this->getParams("PolicyName"),
            "PolicyDescribe"=>$this->getParams("PolicyDescribe"),
            "IsBlackPolicy"=>$this->getParams("IsBlackPolicy",0,'int'),
            "PolicyContent"=>array(
                "QQAcountList"=>array_values($QQAcountList) ,
                "SkypeAcountList"=> array_values($SkypeAcountList),
                "AliAcountList"=> array_values($AliAcountList)
            )
        );
        $PolicyID = $this->getParams("PolicyID");
        if(!empty($PolicyID))
        {
            $data['PolicyID']=$PolicyID;
        }
        return json_encode($data);
    }
    /**
     * 获取WEB类型的表单数据
     * @return string
     */
    private function getWEBData()
    {
        $SelfDefKind = $this->getParams('SelfDefKind',array(),"array");
        $ShopKind = $this->getParams('ShopKind',array(),"array");
        $DoorKind = $this->getParams('DoorKind',array(),"array");
        $VideoKind = $this->getParams('VideoKind',array(),"array");
        $SNSKind = $this->getParams('SNSKind',array(),"array");
        $data=array(
            "PolicyName"=>$this->getParams("PolicyName"),
            "PolicyDescribe"=>$this->getParams("PolicyDescribe"),
            "IsBlackPolicy"=>$this->getParams("IsBlackPolicy",0,'int'),
            "PolicyContent"=>array(
                "SelfDefKind"=>array_values($SelfDefKind) ,
                "ShopKind"=> array_values($ShopKind),
                "DoorKind"=> array_values($DoorKind),
                "VideoKind"=> array_values($VideoKind),
                "SNSKind"=> array_values($SNSKind)
            )
        );
        $PolicyID = $this->getParams("PolicyID");
        if(!empty($PolicyID))
        {
            $data['PolicyID']=$PolicyID;
        }
        return json_encode($data);
    }
    /**
     * 编辑页面
     */
    public function editPage(){
        $type = $this->getParams("type",false,"int");
        $id = $this->getParams("id",false);

        if($id===false || $type===false)
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("paramsError")));
        }
        if(!isset($this->typeLink[$type]))
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("paramsError")));
        }

        $ret = self::$CAR->GetActionControlPolicy(self::$SID,$type,$id);
        $ret =json_decode($ret,true);
        $data= array();
        if($ret['ret']!=0)
        {

            $this->_error($ret['ret']);
        }
        else
        {
            if(empty($ret['PolicyContext']))
            {
                $this->_error(13);
            }
            $data = $ret['PolicyContext'];
        }
        //var_export($data);exit;
        $this->assign("data",$data);
        $this->display("editPage_".$this->typeLink[$type]);
    }

    /**
     * 删除数据
     */
    public function delete()
    {
        $id = $this->getParams("id");
        $data = array();
        $ids = explode(",",$id);
        foreach($ids as $v)
        {
            //类型ID|GUID,类型ID|GUID,类型ID|GUID
            $temp = explode("|",$v);
            if(count($temp)<2)
            {
                continue;
            }
            $data[]=$temp;
        }
        if(empty($data))
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("paramsError")));
        }
        foreach($data as $v)
        {
            $retStr = self::$CAR->DeleteActionControlPolicy(self::$SID ,$v[0] ,$v[1]);
            $ret = json_decode($retStr,true);
            if($ret['ret']!=0)
            {
                $this->_error($ret['ret']);
            }
        }
        $this->_ajaxReturn(array("ret"=>0));
    }

    public function bindUserOrGroupPolicy(){
        $user = $this->getParams("user",false);
        $policy = $this->getParams("policy",false);
        if($user===false || $policy===false)
        {
            $this->_error(-2);
        }
        else
        {
            $userData = explode(",",$user);
            $userData = json_encode($userData);
            $policyData = explode(",",$policy);
            foreach($policyData as $v){
                $vv = explode("|",$v);
                if(count($vv)==2)
                {
                    $ret = self::$CAR->BindActionControlToUserOrGroup(self::$SID,$vv[0],$userData,$vv[1]);
                    $res = json_decode($ret,true);
                    if($res['ret']!=0)
                    {
                        $this->_error($res['ret']);
                    }
                }
            }
            $this->_ajaxReturn(array("ret"=>0));
        }
    }
    public function unbindUserOrGroupPolicy()
    {
        $id = $this->getParams("id");
        $data = array();
        $ids = explode(",",$id);
        $user = $this->getParams("user");
        if(empty($user))
        {
            $this->_error(-2);
        }
        $userData = explode(",",$user);
        $userData = json_encode($userData);
        foreach($ids as $v)
        {
            //类型ID|GUID,类型ID|GUID,类型ID|GUID
            $temp = explode("|",$v);
            if(count($temp)<2)
            {
                continue;
            }
            $data[]=$temp;
        }
        if(empty($data))
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("paramsError")));
        }
        foreach($data as $v)
        {
            $retStr = self::$CAR->UnBindActionControlToUserOrGroup(self::$SID ,$v[0],$userData ,$v[1]);
            $ret = json_decode($retStr,true);
            if($ret['ret']!=0)
            {
                $this->_error($ret['ret']);
            }
        }
        $this->_ajaxReturn(array("ret"=>0));
    }
}
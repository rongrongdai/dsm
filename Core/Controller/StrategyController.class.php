<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 14-8-12
 * Time: 上午11:11
 */

/**
 * Class StrategyController
 * 策略模块控制器
 */
defined("WOWOSTAR") or exit();
class StrategyController extends Controller
{
    private $_protectSystemStrategy=false;
    public function __init()
    {
        /**
         * 清除缓存
         */
        /*if(in_array(__ACTION__,$this->_reg["StrategyPageEdit"]) || in_array(__ACTION__,$this->_reg["StrategyPageEditAll"]))
       {
           $cacheObj = $this->useCache("strategy");
           $cacheObj->clear("","strategy");
       }*/
    }

    /**
     * 策略主界面
     */
    public function index()
    {
        $this->display();
    }

    /**
     * 添加策略组的界面
     */
    public function addGroupPage(){
        $this->display();
    }
    /**
     * 编辑策略组的界面
     */
    public function editGroupPage(){
        $this->display();
    }
    /*
     *  获取策略组树
     */
    public function  getStrategyGroupTree()
    {
        $id = $this->getParams('id');
        $lv = $this->_parseId($id);
        $lv1= $lv[0];
        $lv2= $lv[1];
        $lv3= $lv[2];
        if($lv1=='' && $lv2 != '' )
        {
            $this->_error(-2);
        }
        if( $lv1 != '' && $lv2 =='' && $lv3 != '' )
        {
            $this->_error(-2);
        }
        $ret = self::$CAR->ListPolicyLibrary( self::$SID, $lv1, $lv2, $lv3 );
        $res = json_decode($ret,true);
        if(isset($res['ret']) && $res['ret'] == 0)
        {
            if(isset($res['result']) && !empty($res['result']) && $this->_protectSystemStrategy)
            {
                $systemStrategy = Common::getArrayData('Strategy','systemStrategy');
                array_walk($res['result'],array($this,'_addSystemStrategyMark'),$systemStrategy);
            }
        }
        $this->_ajaxReturn($res);
    }
    //给系统策略做标记
    private function _addSystemStrategyMark(&$rows,$k,$params)
    {
        $lv = $this->_parseId($rows['id']);
        $count = count(array_filter($lv));
        if(in_array($lv[$count-1],$params))
        {
            $rows['isSystem'] = true;
        }
        else
        {
            $rows['isSystem'] = false;
        }
    }

    /**
     * 解析id
     * @param string $id 策略的id 第一级=>第二级=>第三级
     * @return array
     */
    private function _parseId($id="")
    {
        $lv1 = '';
        $lv2 = '';
        $lv3 = '';
        if(!empty($id))
        {
            $lv1 = $id;
        }
        if( $lv1 != '' )
        {
            //$lv1 = htmlspecialchars($lv1,ENT_NOQUOTES );
            //=&amp;gt
            /**
             * 说明：
             * 因为使用$this->getParams()
             * 该函数获取的前端参数是默认经过html过滤的，所以“=>”拆分符在这里要做多重处理
             */
            $split = "=&gt;";
            if(strstr($lv1,"=>"))
            {
                $split = "=>";
            }
            if(strstr($lv1,"=&amp;gt"))
            {
                $split = "=&amp;gt";
            }
            $arr=explode($split, $lv1 );
            $iCount=count($arr);
            if( $iCount>0 && trim($arr[0])=='' )
            {
                array_splice( $arr, 0,1 );
                $iCount=count($arr);
            }

            if( $iCount == 1 )
            {
                $lv1 = $arr[0];
            }
            else if( $iCount == 2 )
            {
                $lv1 = $arr[0];
                $lv2 = $arr[1];
            }
            else if( $iCount==3)
            {
                $lv1 = $arr[0];
                $lv2 = $arr[1];
                $lv3 = $arr[2];
            }
        }
        return array($lv1,$lv2,$lv3);
    }

    /*
     * 部门树
     */
    public function getUserGroupTree()
    {
        Common::controller('UserGroup')->getUserGroupTree();
    }

    //模拟字符搜索
    private function _findByName($v)
    {
        $findStr = $v['text'];
        //关联更多的自动进行模糊查询
        if(isset($v['data'])&&isset($v['data']['common']))
        {
            //备注
            $common = $v['data']['common'];
            if(isset($common['comment'])&&!empty($common['comment']))
            {
                $findStr .=$common['comment'];
            }
            //受控进程
            if(isset($common['Process'])&&!empty($common['Process']))
            {
                $findStr .= implode("",$common['Process']);
            }
            //受控文件
            if(isset($common['file'])&&!empty($common['file']))
            {
                $findStr .= implode("",$common['file']);
            }
        }
        if(!is_array($v))
        {
            return false;
        }
        else if
        (
            Common::isNotEmpty($this->getParams('Keyword'))
            &&
            !strstr(strtolower($findStr),strtolower($this->getParams('Keyword')))
        )
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    /**
     * 列出策略模板
     * @param $data
     * @param string $lv1
     * @param string $lv2
     * @param string $lv3
     */
    private function _listPolicyLibrary(&$data,$systemStrategy,$lv1="",$lv2="",$lv3="")
    {
            $ret = self::$CAR->ListPolicyLibrary( self::$SID, $lv1, $lv2, $lv3 );
            $res = json_decode($ret,true);
            $data['ret'] = $res['ret'];
            if(!empty($res) && $res['ret'] == 0 && count($res['result'])>0)
            {
                 foreach($res['result'] as $k=>$v)
                 {
                    $lv = $this->_parseId($v['id']);
                    $noHasNull = count(array_filter($lv))>0;
                    if($noHasNull && !empty($lv[2]))
                    {
                        //$systemStrategy = Common::getArrayData('Strategy','systemStrategy');
                        if($this->_protectSystemStrategy && in_array($lv[2],$systemStrategy))
                        {
                            $v['isSystem']=true;
                        }
                        else
                        {
                            $v['isSystem']=false;
                        }
                        /*$json = str_replace("=&gt;","=>",json_encode(array($v['id'])));
                        $findGroup = self::$CAR->FindPolicyAffectedGroup( self::$SID, $json);
                        L($findGroup);
                        $findGroup = json_decode($findGroup,true);
                        if($findGroup['ret']==0 && isset($findGroup['results']) && !empty($findGroup['results']))
                        {
                            $v['affectGroup'] = true;
                        }
                        else
                        {
                            $v['affectGroup'] = false;
                        }*/
                        $data['result'][] = $v;
                    }
                    else if($noHasNull)
                    {
                        $this->_listPolicyLibrary($data,$systemStrategy,$lv[0], $lv[1], $lv[2]);
                    }
                 }
            }
    }

    /**
     * 列出员工组的策略
     */
    private function _listGroupPolicy($guid)
    {
        $ret = self::$CAR->ListGroupPolicy( self::$SID,$guid ,true);
        $res = json_decode($ret,true);
        $res['result']=array();
        if(isset($res['rows']) && count($res['rows'])>0)
        {
            foreach($res['rows'] as $k=>$v)
            {
                $rows['id'] = $v['id'];
                $rows['text'] = $v['name'];
                $rows['data'] = array();
                $lv =$this->_parseId($v['id']);
                $iRet = self::$CAR->ListGroupPolicy_JustOnePolicy( self::$SID, $guid, $lv[0], $lv[1], $lv[2] );
                $iRes = json_decode($iRet,true);
                if($iRes['ret']==0 && isset($iRes['result']))
                {
                    $rows['data'] = $iRes['result'];
                }
                if(empty($rows['data']))
                {
                    continue;
                }
                $res['result'][]=$rows;
            }
            unset($res['rows']);
        }
        if(!empty($res['result']))
        {
            usort($res['result'],array($this,"_groupStrategyOrderHandler"));
            $last = count($res['result'])-1;
            //标记排序后最顶位置
            $res['result'][0]['isFirst']=true;
            //标记排序后最底位置
            $res['result'][$last]['isLast']=true;
        }
        return $res;

    }

    private function _groupStrategyOrderHandler($a,$b){
        $c = $a['data'];
        $d = $b['data'];
        if($c['top']==true && $d['top']==false)
        {
            return -1;
        }
        else if($c['top']==false && $d['top']==true)
        {
            return 1;
        }
        if($c['index'] == $d['index'])
        {
            return 0;
        }
        return ($c['index']>$d['index'])? 1:-1;
    }
    //拉丁字母对比
    private function _latinComparison($a,$b,$index=0,$order="asc")
    {
        if(!isset($a[$index])&&isset($b[$index]))
        {
            return $order=="asc"?-1:1;
        }
        if(isset($a[$index])&&!isset($b[$index]))
        {
            return $order=="asc"?1:-1;
        }
        if(!isset($a[$index])&&!isset($b[$index]))
        {
            return 0;
        }
        $aS = ord($a[$index]);
        $bS = ord($b[$index]);

        if($aS==$bS)
        {
            $index++;
            return $this->_latinComparison($a,$b,$index,$order);
           /* if($index<=mb_strlen($a,"utf8")&&$index<=mb_strlen($b,"utf8"))
            {
                return $this->_latinComparison($a,$b,$index,$order);
            }
            else
            {
                return 0;
            }*/
        }
        else
        {
            if($order=="asc"){
                return $aS>$bS?1:-1;
            }
            else
            {
                return $aS>$bS?-1:1;
            }
        }
    }

    /**
     * 策略排序
     * @param $a
     * @param $b
     * @return int
     */
    private function _listPolicyLibraryOrderHandler($a,$b)
    {

        $sort = $this->getParams("sort","text");
        $order = $this->getParams("order","asc");
        //$one = iconv("utf-8","gb2312//IGNORE",$a[$sort]);
        //$two = iconv("utf-8","gb2312//IGNORE",$b[$sort]);
        //import("Pinyin");
        //$pinyin = new Pinyin();
        $one = strtolower($a[$sort]);
        $two = strtolower($b[$sort]);
        //$one = $pinyin->output($one);
        //$two = $pinyin->output($two);
        return $this->_latinComparison($one,$two,0,$order);
        /*L($a[$sort].":".$one."    ".$b[$sort].":".$two);
        if ($one == $two) return 0;
        if($order=="desc")
        {
            return ($one > $two) ? -1 : 1;
        }
        else
        {
            return ($one > $two) ? 1 : -1;
        }*/
        /*$tmp = array($one,$two);
        $order=="asc"?sort($tmp):asort($tmp);
        return $tmp[0]==$one ? -1:1;*/

        //return $s;
        /*if($aS==$bS)
        {
            return 0;
        }
        if($order=="asc")
        {
            return $aS>$bS?1:-1;
        }
        if($order=="desc")
        {
            return $aS>$bS?-1:1;
        }*/
    }
    /**
     * 获取策略列表
     */
    public function getStrategyList()
    {
        $mode = $this->getParams("mode","template");
        $ar = array("ret"=>-1,"result"=>array());
        //$ar = json_decode( $ret, true );
        $ret=array();
        $cacheKey = md5($this->getParams("mode").$this->getParams("id").$this->getParams("guid"));
        $cacheObj = $this->useCache("strategy");
        $cacheData = $cacheObj->cache($cacheKey,"","strategy");
        if(!empty($cacheData))
        {
            //$this->_ajaxReturn($cacheData);
            $ar['result'] = $cacheData;
        }
        else
        {
            if($mode == "template")
            {
                $lv=$this->_parseId($this->getParams('id'));
                $systemStrategy = Common::getArrayData('Strategy','systemStrategy');
                $this->_listPolicyLibrary($ar,$systemStrategy,$lv[0], $lv[1], $lv[2]);
            }
            elseif($mode == "group")
            {
                $guid = $this->getParams("guid",false);
                //Common::log($guid);
                if($guid === false)
                {
                    $this->_error(-2);
                }
                $ar = $this->_listGroupPolicy($guid);
            }
            $cacheObj->cache($cacheKey,$ar['result'],"strategy");
        }
        $keyword = $this->getParams("Keyword");
        if(!empty($keyword))
        {
            $ar['result']=array_filter($ar['result'],array($this,'_findByName'));
        }
        $ar['result']=array_values($ar['result']);
        $ret['total'] = count($ar['result']);
        if($mode == "template")
        {

            $sort = $this->getParams("sort","text");
            $order = $this->getParams("order","asc");
            $od = $order=="asc"?SORT_ASC:SORT_DESC;
            $sortTable = array();
            foreach($ar['result'] as $k=>$v)
            {
                $sortTable[$k]=strtolower($v[$sort]);
            }
            array_multisort($sortTable,$od,$ar['result']);
            /*$sort = $this->getParams("sort","text");
            $order = $this->getParams("asc");
            $od = $order=="asc"?SORT_ASC:SORT_DESC;
            ArraySortByKey($ar['result'],$sort,$od);*/
            //usort($ar['result'],array($this,"_listPolicyLibraryOrderHandler"));
        }
        //模拟分页处理
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');

        Common::vendor("DataList");
        $dataList = new DataList($ar['result'],$page,$rows);
        //Common::log($ar['result']);
        $ret['rows'] = $dataList->getData();
        /*$start=$rows * ($page-1);
        $count=$start+$rows;

        if($ret['total']<=$count)
        {
            $count=$ret['total'];
        }
        $ret['rows']=array();
        for($a=$start;$a<$count;$a++)
        {
            $tmp = $ar['result'][$a];
            if(isset($ar['result'][$a-1]))
            {
                $tmp['prev'] = $ar['result'][$a-1];
            }
            if(isset($ar['result'][$a+1]))
            {
                $tmp['next'] = $ar['result'][$a+1];
            }
            $ret['rows'][]=$tmp;
        }*/

        //if($ar['result'][$a])
        $ret = json_encode($ret);
            /*$guid = $this->getParams("guid",false);
            if($guid === false)
            {
                $this->_error(-2);
            }
            $ret = $this->_listGroupPolicy($guid);*/
           // L($ret,__FILE__,__LINE__);
        $this->_ajaxReturn($ret);
    }

    private function _makePolicyDetailArray( $list_content, $isCommon, $key, &$arr )
    {
        if( isset($list_content) )
        {
            $t=explode('|',$list_content );
            $tmpArray=array();
            foreach( $t as $v )
            {
                $tmp=trim($v);
                if( $tmp != '' )
                {
                    if( !in_array( $tmp, $tmpArray, true ) )
                        array_push( $tmpArray, $tmp );
                }
            }
            if( count($tmpArray) != 0 )
            {
                if( $isCommon )
                {
                    $arr['common'][$key]=$tmpArray;
                }
                else
                {
                    $arr['exception'][$key]=$tmpArray;
                }
            }
        }
    }
    private function _makePolicyDetailString( $content, $isCommon, $key, &$arr )
    {
        if( $isCommon )
        {
            $arr['common'][$key]=$content;
        }
        else
        {
            $arr['exception'][$key]=$content;
        }
    }
    private function _makePolicyDetailBool( $input_arr, $key, $isCommon, &$arr )
    {
        $bValue = false;
        if( isset($input_arr[$key]))
        {
            if( $input_arr[$key] )
                $bValue = true;
        }

        if( $isCommon )
        {
            $t = 'b' . substr( $key, 7 );
            $arr['common'][$t]=$bValue;
        }
        else
        {
            $t = 'b' . substr( $key, 10 );
            $arr['exception'][$t]=$bValue;
        }

    }

    //新增策略模板
    public function addStrategy($mode="")
    {
        $lv1 = $this->getParams('AddPolicyGroupName');
        $lv2 = $this->getParams('AddPolicySoftwareGroup');
        $lv3 = '';
        if( $lv1 == '' )
        {
            $lv1 = $this->getParams('Detail_AddPolicyGroupName');
        }
        if( $lv1 == '' )
        {
            $this->_error(-2);
        }

        if( $lv2 =='')
        {
            $lv2 = $this->getParams('Detail_AddPolicySoftwareGroup');
        }

        if( $this->getParams('AddPolicyDetail_name',false) !== false )
        {
            // 细节参数
            $arr=array();

            $arr['name']=$this->getParams('AddPolicyDetail_name');
            $systemStrategy = Common::getArrayData('Strategy','systemStrategy');
            if($this->_protectSystemStrategy && in_array($arr['name'],$systemStrategy))
            {
                $this->_error(-88);
            }
            if( isset($GLOBALS['_PARAMS']['Common_ProcessList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_ProcessList'], true, 'Process', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Common_FileList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_FileList'], true, 'file', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Common_Finger']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_Finger'], true, 'finger', $arr );
            }
            if(  isset($GLOBALS['_PARAMS']['Common_Comment'])  )
            {
                $this->_makePolicyDetailString( $GLOBALS['_PARAMS']['Common_Comment'], true, 'comment', $arr );
            }
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_DecryptWhenRead', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_EncryptWhenCreateAndOverwrite', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_EncryptWhenEdit', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_DecryptWhenWriteAndOverwrite', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_RejectEdit', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_RejectAllOperation', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_Passthrough', true, $arr );

            ////////////////////// 例外 ///////
            if( isset($GLOBALS['_PARAMS']['Exception_ProcessList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_ProcessList'], false, 'Process', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Exception_FileList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_FileList'], false, 'file', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Exception_Finger']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_Finger'], false, 'finger', $arr );
            }
            if(  isset($GLOBALS['_PARAMS']['Exception_Comment'])  )
            {
                $this->_makePolicyDetailString( $GLOBALS['_PARAMS']['Exception_Comment'], false, 'comment', $arr );
            }
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_DecryptWhenRead', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_EncryptWhenCreateAndOverwrite', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_EncryptWhenEdit', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_DecryptWhenWriteAndOverwrite', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_RejectEdit', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_RejectAllOperation', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_Passthrough', false, $arr );

            if( count($arr) == 0 )
            {
                $this->_error(-2);
            }

            $lv3 = json_encode( $arr );
            if( $lv3 == '' )
            {
                $this->_error(-2);
            }
        }
        $ret = self::$CAR->AddPolicyLibrary( self::$SID, $lv1, $lv2, $lv3 );
        $this->_ajaxReturn($ret);
    }

    public function editStrategy(){
        //$this->addStrategy();
        $lv1 = $this->getParams('AddPolicyGroupName');
        $lv2 = $this->getParams('AddPolicySoftwareGroup');
        $lv3 = '';
        if( $lv1 == '' )
        {
            $lv1 = $this->getParams('Detail_AddPolicyGroupName');
        }
        if( $lv1 == '' )
        {
            $this->_error(-2);
        }

        if( $lv2 =='')
        {
            $lv2 = $this->getParams('Detail_AddPolicySoftwareGroup');
        }

        if( $this->getParams('AddPolicyDetail_name',false) !== false )
        {
            // 细节参数
            $arr=array();

            $arr['name']=$this->getParams('AddPolicyDetail_name');
            $systemStrategy = Common::getArrayData('Strategy','systemStrategy');
            if($this->_protectSystemStrategy && in_array($arr['name'],$systemStrategy))
            {
                $this->_error(-88);
            }
            if( isset($GLOBALS['_PARAMS']['Common_ProcessList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_ProcessList'], true, 'Process', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Common_FileList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_FileList'], true, 'file', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Common_Finger']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_Finger'], true, 'finger', $arr );
            }
            if(  isset($GLOBALS['_PARAMS']['Common_Comment'])  )
            {
                $this->_makePolicyDetailString( $GLOBALS['_PARAMS']['Common_Comment'], true, 'comment', $arr );
            }
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_DecryptWhenRead', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_EncryptWhenCreateAndOverwrite', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_EncryptWhenEdit', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_DecryptWhenWriteAndOverwrite', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_RejectEdit', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_RejectAllOperation', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_Passthrough', true, $arr );

            ////////////////////// 例外 ///////
            if( isset($GLOBALS['_PARAMS']['Exception_ProcessList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_ProcessList'], false, 'Process', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Exception_FileList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_FileList'], false, 'file', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Exception_Finger']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_Finger'], false, 'finger', $arr );
            }
            if(  isset($GLOBALS['_PARAMS']['Exception_Comment'])  )
            {
                $this->_makePolicyDetailString( $GLOBALS['_PARAMS']['Exception_Comment'], false, 'comment', $arr );
            }
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_DecryptWhenRead', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_EncryptWhenCreateAndOverwrite', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_EncryptWhenEdit', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_DecryptWhenWriteAndOverwrite', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_RejectEdit', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_RejectAllOperation', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_Passthrough', false, $arr );

            if( count($arr) == 0 )
            {
                $this->_error(-2);
            }

            $lv3 = json_encode( $arr );
            if( $lv3 == '' )
            {
                $this->_error(-2);
            }
        }
        $old = $this->getParams('PolicyID',false);
        if($old===false)
        {
            $this->_error(-2);
        }
        $oldLv = $this->_parseId($old);
        $newLv1 = $oldLv[0]!=$lv1?$lv1:"";
        $newLv2 = $oldLv[1]!=$lv2?$lv2:"";
        $ret = self::$CAR->ModifyPolicyLibrary(self::$SID,$oldLv[0],$newLv1,$oldLv[1],$newLv2,$lv3);
        $this->_ajaxReturn($ret);
    }

    /**
     * 编辑组的策略
     */
    public function editGroupStrategy()
    {
        $lv1 = '';
        $lv2 = '';
        $lv3 = '';
        $NewDataJson = '';
        $GroupGuid = $this->getParams('GroupID');
        $policyID=$this->getParams('PolicyID');
        if( $GroupGuid == '' )
        {
            $this->_error(-2);
        }

        if( $policyID == '' )
        {
            $this->_error(-2);
        }
        if( $policyID != '' )
        {
            $arr=$this->_parseId($policyID);
            $lv1 = $arr[0];
            $lv2 = $arr[1];
            $lv3 = $arr[2];
        }
        if( isset($GLOBALS['_PARAMS']) && isset($GLOBALS['_PARAMS']['AddPolicyDetail_name']) )
        {
            // 细节参数
            $arr=array();

            $arr['name']=$GLOBALS['_PARAMS']['AddPolicyDetail_name'];
            //排序
            $arr['index']=$GLOBALS['_PARAMS']['index'];
            $arr['stayontop']=$GLOBALS['_PARAMS']['stayontop'];
            if( isset($GLOBALS['_PARAMS']['Common_ProcessList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_ProcessList'], true, 'Process', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Common_FileList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_FileList'], true, 'file', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Common_Finger']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Common_Finger'], true, 'finger', $arr );
            }
            if(  isset($GLOBALS['_PARAMS']['Common_Comment'])  )
            {
                $this->_makePolicyDetailString( $GLOBALS['_PARAMS']['Common_Comment'], true, 'comment', $arr );
            }
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_DecryptWhenRead', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_EncryptWhenCreateAndOverwrite', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_EncryptWhenEdit', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_DecryptWhenWriteAndOverwrite', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_RejectEdit', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_RejectAllOperation', true, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Common_Passthrough', true, $arr );

            ////////////////////// 例外 ///////
            if( isset($GLOBALS['_PARAMS']['Exception_ProcessList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_ProcessList'], false, 'Process', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Exception_FileList']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_FileList'], false, 'file', $arr );
            }
            if( isset($GLOBALS['_PARAMS']['Exception_Finger']) )
            {
                $this->_makePolicyDetailArray( $GLOBALS['_PARAMS']['Exception_Finger'], false, 'finger', $arr );
            }
            if(  isset($GLOBALS['_PARAMS']['Exception_Comment'])  )
            {
                $this->_makePolicyDetailString( $GLOBALS['_PARAMS']['Exception_Comment'], false, 'comment', $arr );
            }
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_DecryptWhenRead', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_EncryptWhenCreateAndOverwrite', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_EncryptWhenEdit', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_DecryptWhenWriteAndOverwrite', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_RejectEdit', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_RejectAllOperation', false, $arr );
            $this->_makePolicyDetailBool( $GLOBALS['_PARAMS'], 'Exception_Passthrough', false, $arr );

            if( count($arr) == 0 )
            {
                $this->_error(-2);
            }

            $NewDataJson = json_encode( $arr );
            if( $NewDataJson == '' )
            {
                $this->_error(-2);
            }
        }
        else
        {
            $this->_error(-2);
        }
        //L($NewDataJson,__FILE__,__LINE__);
        $ret = self::$CAR->EditGroupPolicy( self::$SID, $GroupGuid, $lv1, $lv2, $lv3, $NewDataJson );
        $this->_ajaxReturn($ret);
    }

    /**
     * 删除策略
     */
    public function delStrategy()
    {
        //$systemStrategy = include_once($this->systemStrategyFile);
        $systemStrategy = Common::getArrayData('Strategy','systemStrategy');
        $ret='{"ret":-2}';
        $getIds=$this->getParams('ids',false,'array');
		
        if($getIds !== false)
        {
            foreach($getIds as $k=>$v)
            {
                $ids= $this->_parseId($v);
                if($this->_protectSystemStrategy && in_array($ids[2],$systemStrategy))
                {
                    $this->_error(-88);
                }
                $ret = self::$CAR->DelPolicyLibrary( self::$SID,$ids[0],$ids[1],$ids[2]);
                $res = json_decode($ret,true);
                if($res['ret']!=0)
                {
                    $this->_ajaxReturn($ret);
                }
            }
        }
        $this->_ajaxReturn($ret);
    }

    /**
     * 删除组上的策略
     */
    public function delGroupStrategy()
    {
        $getIds=$this->getParams('ids',false,'array');
        $groupId = $this->getParams("groupId",false);
        if($groupId === false)
        {
            $this->_error(-2);
        }
        $ids=array();
        foreach($getIds as $v)
        {
            $id = $this->_parseId($v);
            $ids[]=$id;
        }
        if(empty($ids))
        {
            $this->_error(-2);
        }
        $idsJson = json_encode($ids);
        $ret = self::$CAR->RemoveGroupPolicy(self::$SID,$groupId,$idsJson);
        $this->_ajaxReturn($ret);
    }

    /**
     * 导入策略
     */
    public function importStrategy()
    {

        if(!isset($_FILES))
        {
            $this->_error(-2,'json');
        }
        $uuid = md5(uniqid("",true));
		Common::vendor("Upload");
        $fileArr['file'] = $_FILES['file']['tmp_name'];
        $fileArr['name'] = $_FILES['file']['name'];
        $fileArr['size'] = $_FILES['file']['size'];
        $fileArr['type'] = $_FILES['file']['type'];
        $limitFileType = $this->getConfig('IO_STRATEGY_FILE_TYPE');
        $fileName = $uuid.'.' . Common::getFileType($_FILES['file']['name']);
        $savePath =  $this->getConfig('TEMP_PATH');
        $filePath = $savePath.$fileName;
        $upload = new upload($fileArr, $fileName, $savePath, $limitFileType, 0, 1024 * 1024 * $this->getConfig('IMPORT_STRATEGY_FILE_SIZE'));
        if (!$upload->run())
        {
            $msg = $this->getLang('uploadFileError')[$upload->errno];
            $this->_ajaxReturn(array("ret"=>-1,"error_info"=>$msg),'json');
        }
        //转换成绝对路径
        $filePath =  realpath($filePath);
        //$ret = self::$CAR->LoadPolicyTemplateData(self::$SID, $filePath);
        $isOverwrite = $this->getParams('overwrite',false,'bool');
        $ret = self::$CAR->LoadPolicyTemplateDataEx(self::$SID, $filePath,$isOverwrite);
        unlink($filePath);
        $this->_ajaxReturn(array('ret'=>$ret),'json');
    }

    /**
     * 导出策略
     */
    public function exportStrategy()
    {
        $savePath = realpath($this->getConfig('TEMP_PATH'));
        $uniqid = md5(uniqid('',true));
        $fileType = $this->getConfig('DOWNLOAD_FILE_TYPE');
        $fileName = $uniqid. '.' . $fileType;
        $filePath =  $savePath.DIRECTORY_SEPARATOR .$fileName;
        $getIds = $this->getParams('ids',false,'array');
        if($getIds)
        {
            $params['parm']=array();
            foreach($getIds as $v)
            {
                $lv = $this->_parseId($v);
				$tmp = array("lv1guid"=>$lv[0],"lv2guid"=>$lv[1]);
				$tmp['name']=!empty($lv[2])?array($lv[2]):array();
                $params['parm'][]=$tmp;
            }

            //$lv1Name  = $lv[0];  // 需要导出的一级节点(必填 不能为空)
            //$lv2Name  = $lv[1]; // 选填 如果忽略此参数直接传递''空字符
            //$nameJson =  '{"name": ["notepad", "wordpad"]}';

            $nameJson = json_encode($params);
            //json格式表示需要导出的节点，如果字符为空则导出所有节点
			//L(var_export($lv1Name,true),__FILE__,__LINE__);
			//L(var_export($lv2Name,true),__FILE__,__LINE__);
			//L(var_export($nameJson,true),__FILE__,__LINE__);
            $ret = self::$CAR->ExportPolicyTemplateFileEx(self::$SID, $filePath,$nameJson);
        }
        else
        {
            $ret = self::$CAR->ExportPolicyTemplateFile(self::$SID, $filePath);
        }
        $result = json_decode($ret);
        if($result->ret){
            $this->_ajaxReturn($ret);
        }
        //首判断给定的文件存在与否
        if(!file_exists($filePath)){
            $this->_ajaxReturn('{"ret":-10, "error_info":'.$this->getLang('fileDoesNotExist').'}');
        }
        $this->_ajaxReturn(array(
            "ret"=>0,
            "code"=>$uniqid
        ));
    }

    /**
     * 下发策略
     */
    public function copyStrategyToGroup()
    {
        $policy=$this->getParams('policy',array(),'array');
        $group=$this->getParams('group',array(),'array');
        if( !is_array($policy) )
        {
            $this->_error(-2);
        }

        $ar = array();
        foreach( $policy as $p )
        {
            $v=$this->_parseId($p);
            if( null==$v || !is_array($v) || count($v) <= 3 )
            {
                array_push( $ar, $v );
            }
        }
        if( count($ar) == 0 )
        {
            $this->_error(-2);
        }

        $policy = json_encode($ar);
        unset($ar);
        $group = json_encode( $group );

        // 执行
        $ret = self::$CAR->CopyPolicyLibraryToGroup2( self::$SID, $policy, $group );
        $res = json_decode($ret,true);
        if(!isset($res['ret']))
        {
            foreach($res as $v)
            {
                if($v['ret']!=0)
                {
                    $this->_ajaxReturn($v);
                }
            }
            $res['ret']=0;
        }
        $this->_ajaxReturn($res);

    }

    /**
     * 同步策略
     */

    public function syncStrategy()
    {
        $mode = $this->getParams('mode');
        $getIds = $this->getParams("ids",false,"array");
		if($getIds===false)
		{
			$this->_error(-2);
		}
        if($mode == "group")
        {
            $groupId = $this->getParams('groupId');
            $policy=array();
            $systemStrategy = Common::getArrayData('Strategy','systemStrategy');

            foreach($getIds as $v)
            {
                $ids = $this->_parseId($v);
                if($this->_protectSystemStrategy && in_array($ids[2],$systemStrategy))
                {
                    $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang('canNotSyncSystemStrategy')));
                }
                if(count($ids)==3)
                {
                    $policy[]=$ids;
                }
            }

            if(count($policy)<=0)
            {
                $this->_error(-2);
            }
            $json = json_encode($policy);
            //L(var_export($Policy,true),__FILE__,__LINE__);
            $ret = self::$CAR->CopyGroupPolicyToLibrary( self::$SID, $groupId, $json );
        }
        else
        {
            //$ids = $this->_parseId($getIds[0]);
            //$policy=$ids;
			//在控制器接口处已经过滤了html，json里面的=>需要反过滤
            $json = str_replace("=&gt;","=>",json_encode($getIds));
            $ret = self::$CAR->FindPolicyAffectedGroup( self::$SID, $json);
			$res = json_decode($ret,true);
			if($res['ret']==0 && isset($res['results']))
			{
			    $ret='{"ret":0}';
				foreach($res['results'] as $v )
				{
				    if(!empty($v['groups']))
					{
						$groups = array();
						foreach($v['groups'] as $vv)
						{
							$groups[]=$vv['guid'];
						}
						$group = json_encode($groups);
						$policyId = $this->_parseId($v['old']);
						$policy = json_encode(array($policyId));
						$ret = self::$CAR->CopyPolicyLibraryToGroup2( self::$SID, $policy, $group);
						$rs = json_encode($ret,true);
						if($rs['ret']!=0)
						{
							$this->_ajaxReturn($ret);
						}
					}
				}
				//L(var_export($ret,true),__FILE__,__LINE__);

			}
            
            //$Policy = json_encode($this->_parseId($id));
            //$ret = self::$CAR->FindPolicyAffectedGroup( self::$SID, $Policy );
        }
        $this->_ajaxReturn($ret);
    }

    /**
     * 改变组策略的顺序
     * src:源策略的ID（必须） target:目标策略的ID（必须） group:组的ID（必须）
     */
    public function changeGroupStrategyOrder()
    {
        $groupId = $this->getParams('group',false);
        //src--target src与target排序位置调换
        $src = $this->getParams('src',false);
        $target = $this->getParams('target',false);
        if($groupId===false || $src===false || $target===false)
        {
            $this->_error(-2);
        }
        $srcId = $this->_parseId($src);
        $targetId = $this->_parseId($target);
        if(count($srcId)!=3 || count($targetId)!=3)
        {
            $this->_error(-2);
        }
        $ret = self::$CAR->SwapPolicyOnGroup( self::$SID, $groupId,$srcId[0],$srcId[1],$srcId[2],$targetId[0],$targetId[1],$targetId[2]);
        $this->_ajaxReturn($ret);
    }

    /**
     * 组策略置顶
     *
     * id:置顶策略的ID（必须） group:组的ID（必须）
     */

    public function groupStrategyToTop()
    {
        $groupId = $this->getParams('group',false);
        $id = $this->getParams('id',false);
        if($groupId===false || $id===false)
        {
            $this->_error(-2);
        }
        $lv = $this->_parseId($id);
        if(count($lv)!=3)
        {
            $this->_error(-2);
        }
        $ret = self::$CAR->MovePolicyInGroupToTopOrBottom( self::$SID,$groupId,$lv[0],$lv[1],$lv[2],true);
        $this->_ajaxReturn($ret);
    }

    /**
     * 置底
     */
    public function groupStrategyToBottom()
    {
        $groupId = $this->getParams('group',false);
        $id = $this->getParams('id',false);
        if($groupId===false || $id===false)
        {
            $this->_error(-2);
        }
        $lv = $this->_parseId($id);
        if(count($lv)!=3)
        {
            $this->_error(-2);
        }
        $ret = self::$CAR->MovePolicyInGroupToTopOrBottom( self::$SID,$groupId,$lv[0],$lv[1],$lv[2],false);
        $this->_ajaxReturn($ret);
    }

    /**
     * 拷贝组上的策略
     */
    public function copyGroupStrategyToGroup()
    {
        $policy=$this->getParams('policy',array(),'array');
        $dstGroup=$this->getParams('dstGroup',array(),'array');
        $srcGroup=$this->getParams('srcGroup');
        $replace=$this->getParams('replace',0,'int');
        if( !is_array($policy) || empty($srcGroup) || empty($dstGroup) )
        {
            $this->_error(-2);
        }
        $ar = array();
        foreach( $policy as $p )
        {
            if($p == $srcGroup)continue;
            $v=$this->_parseId($p);
            if( null==$v || !is_array($v) || count($v) <= 3 )
            {
                array_push( $ar, $v );
            }
        }
        if( count($ar) == 0 )
        {
            $this->_error(-2);
        }
        $policy = json_encode($ar);
        unset($ar);
        $dstGroup = json_encode( $dstGroup );
        //echo ($policy);exit;
        //var_export($srcGroup);exit;
        //var_export($dstGroup);
        //var_export((bool)$replace);
        //exit;
        // 执行
        $ret = self::$CAR->CopyGroupPolicy( self::$SID,$srcGroup, $dstGroup, $policy ,(bool)$replace );
        $res = json_decode($ret,true);
        if(!isset($res['ret']))
        {
            foreach($res as $v)
            {
                if($v['ret']!=0)
                {
                    $this->_ajaxReturn($v);
                }
            }
            $res['ret']=0;
        }
        $this->_ajaxReturn($res);

    }
}
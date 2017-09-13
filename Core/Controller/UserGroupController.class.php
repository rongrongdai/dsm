<?php
/**
 * 用户组模块
 */
defined("WOWOSTAR") or exit();
class UserGroupController extends Controller
{
     /*
      * 获取用户组树
      */
     public function getUserGroupTree()
     {
         $guid=$this->getParams('id');
         $include_onceUser = $this->getParams('include_onceUser',0,'int');
         $ret = self::$CAR->ListGroup( self::$SID, $guid , $include_onceUser );
         $res = json_decode($ret,true);
         if((empty($guid)||$guid=="00000003-0000-0000-0000-000000000003") && empty($res))
         {
             $this->_ajaxReturn(array("ret"=>0,"rootEmpty"=>true));
         }
         $this->_ajaxReturn($ret);
     }

    /**
     * 新增用户组
     */
    public function addUserGroup()
     {
         //组的guParentGroupGuid
         $ParentGroupGuid=$this->getParams('ParentGroupGuid');
        //新的组名
         $GroupName=$this->getParams('GroupName');
         if( empty($GroupName) )
         {
             $this->_error(-2);
         }
         if( strtolower(trim($GroupName)) == 'deleteduser')
         {
             // 不能新建 DeletedUser 组
             $this->_error(-4);
         }
         $GroupDesciprt=$this->getParams('GroupDescript');
         $GroupType=$this->getParams('GroupType',0,'int');
         $bAutoCreateDeletedUser=$this->getParams('bShouldCreateDeletedUserGroup',0,'int');
         $ret = self::$CAR->AddGroup( self::$SID, $ParentGroupGuid, $bAutoCreateDeletedUser, $GroupName, $GroupDesciprt, $GroupType );
         $res = json_decode($ret,true);
         if($res['ret']==0 && isset($res['main']) && isset($res['main']['id']))
         {
             $users = $this->getParams('Users',false,'array');
             $guidArr = "";
             if(is_array($users))
             {
                 foreach($users as $i)
                 {
                     $iRet = self::$CAR->MoveUserToGroup(self::$SID,$i,$res['main']['id'],1);
                 }
             }
         }
         //返回结果
         $this->_ajaxReturn($ret);
     }

    /*
     * 编辑用户组
     */
     public function editUserGroup()
     {
         $guid=$this->getParams('Modify_Guid');
         if(empty($guid))
         {
             $this->_error(-2);
         }

         $GroupName=$this->getParams('GroupName');
         if(empty($GroupName))
         {
             $this->_error(-2);
         }
         $GroupDesciprt=$this->getParams('GroupDescript');
         $GroupType=$this->getParams('GroupType',0,'int');
         $ret = self::$CAR->EditGroup( self::$SID, $guid, $GroupName, $GroupDesciprt, $GroupType );
         $this->_ajaxReturn($ret);
     }

    /**
     * 删除用户组
     */

    public function delUserGroup()
    {
        $guid=$this->getParams('guid');
        if( empty($guid) )
        {
            $this->_error(-2);
        }
        //$ret = self::$CAR->ListUserSumary( self::$SID, $guid,'', 0, 1000000, 0, 0,true, true,true,true, '', '', 0 );
        $ret = self::$CAR->DeleteGroup( self::$SID, $guid );
        $this->_ajaxReturn($ret);
    }

    /**
     * 添加用户组更节点
     */
    public function addUserRootGroup()
    {
        //检查有无根节点
        $ret = self::$CAR->ListGroup( self::$SID, "" ,0);
        $res = json_decode($ret,true);
        if(empty($res))
        {
            $this->addUserGroup();
        }
        else
        {
            $this->_ajaxReturn(array("ret"=>-3,"error_info"=>$this->getLang('userRootGroupExist')));
        }
    }
}
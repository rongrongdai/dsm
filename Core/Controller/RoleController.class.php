<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-15
 * Time: 上午9:47
 *
 * 角色模块
 */
defined("WOWOSTAR") or exit();
class RoleController extends Controller
{
    public function index()
    {
        $this->display();
    }

    /**
     * 添加角色组界面
     */
    public function addGroupPage(){
        $this->display();
    }
    public function addGroup(){
        $name = $this->getParams("name");
        $pid = $this->getParams("pid");
        if(empty($name) || empty($pid))
        {
            $this->_error(-2);
        }
        $ret = self::$CAR->AddRoleType(self::$SID,$pid ,$name ,'',1);
        $this->_ajaxReturn($ret);
    }
    public function editGroup(){
        $name = $this->getParams("name");
        $pid = $this->getParams("pid");
        $id = $this->getParams("id");
        if(empty($name) || empty($id))
        {
            $this->_error(-2);
        }
        $ret = self::$CAR->AddRoleType(self::$SID,$pid ,$name ,$id,0);
        $this->_ajaxReturn($ret);
    }
    public function delGroup(){
        $id = $this->getParams("id");
        if(empty($id))
        {
            $this->_error(-2);
        }
        $ret = self::$CAR->DeleteRoleType(self::$SID,$id);
        $this->_ajaxReturn($ret);
    }
    /**
     * 编辑角色组界面
     */
    public function editGroupPage(){
        $this->display();
    }
    /**
     *  获取角色类型树
     */
    public function getRoleTypeTree()
    {
        $ParentTypeID=$this->getParams('ParentTypeID');
        $IncludeSubType=$this->getParams('IncludeSubType',0,'int');
        $ret = self::$CAR->GetRoleTypeTree( self::$SID, $ParentTypeID, $IncludeSubType );
        $this->_ajaxReturn($ret);
    }
    /**
     *  获取角色树
     */
    public function getRoleTree()
    {
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
        $ret = self::$CAR->GetRoleTree( self::$SID, $ParentTypeID, $FullInfo, $Condition, $start, $count, $orderColumn, $ordertype ,$IncludeSubType );
        $this->_ajaxReturn($ret);
    }
    //GetUserRoleInfo
    /**
     * 获取角色列表
     */
    public function getRoleList()
    {
        // 分页变量
        $page = $this->getParams('page',0,'int');
        $rows = $this->getParams('rows',0,'int');
        $sort = $this->getParams('sort',"RoleName");
        $order = $this->getParams('order','asc');
       // L($sort);
        $ordertype = $order == 'asc'? 0:1;


        $start=$rows * ($page-1);
        $count=$rows;
        $orderColumn=1;

        if( $sort != '' )
        {
            if( $sort == 'RoleID' )
            {
                $orderColumn=0;
            }
            else if( $sort == 'RoleName' )
            {
                $orderColumn=1;
            }
            else if( $sort == 'ParentTypeID' )
            {
                $orderColumn = 3;
            }
            else if( $sort == 'TypeName' )
            {
                $orderColumn = 4;
            }
            else if( $sort == 'SpecialRight')
            {
                $orderColumn = 5;
            }
            else if( $sort == 'OperatorLevel' )
            {
                $orderColumn = 6;
            }
            else if( $sort == 'HasApply' )
            {
                $orderColumn = 7;
            }
            else if( $sort == 'Remark' )
            {
                $orderColumn = 8;
            }
        }


        $ParentTypeID=$this->getParams('ParentTypeID');

        $FullInfo = $this->getParams('FullInfo',1,'int');

        $Condition = $this->getParams('Condition');

        // 执行
        $ret = self::$CAR->GetRoleList( self::$SID, $ParentTypeID, $FullInfo, $Condition, $start, $count, $orderColumn, $ordertype);

        $this->_ajaxReturn($ret);
    }
    /*
     * 部门树
     */
    public function getUserGroupTree()
    {
        Common::controller('UserGroup')->getUserGroupTree();
    }
    /**
     * 新增角色
     */

    public function addRoleAndType()
    {
        $ParentRoleTypeID = $this->getParams('ParentRoleTypeID');
        $RoleTypeName = $this->getParams('RoleTypeName');
        $jsStr = $this->getParams('jsStr');
        $ret = self::$CAR->AddRoleAndType( self::$SID, $ParentRoleTypeID, $RoleTypeName, $jsStr );
        $this->_ajaxReturn($ret);
    }
	/*
	 * 修改角色
	 */
	public function editRole()
	{
		$RoleID=$this->getParams('RoleID');
        $findRole = self::$CAR->GetRoleInfo(self::$SID,$RoleID);
        $roleInfo = json_decode($findRole,true);
        if(!empty($roleInfo['Result']) && $roleInfo['Result']['ForbiddenModify']==1)
        {
            $this->_ajaxReturn(array("ret"=>-2,"error_info"=>$this->getLang("canNotModifySystemRole")));
        }
		$jsStr = $this->getParams('JsStr');
		
		$RoleName = $this->getParams('RoleTypeName');
		
		// 执行
		$ret = self::$CAR->ModifyRole( self::$SID, $RoleID, $jsStr, $RoleName);
		$this->_ajaxReturn($ret);	
	}
	/**
	 *  启用角色
	 */
	public function applyRole()
	{
		$RoleID=$this->getParams('RoleID',false);
		if($RoleID === false)
		{
			$this->_ajaxReturn(-2);
		}		
		$ret = self::$CAR->ApplyRole(self::$SID,true,$RoleID);
		$this->_ajaxReturn($ret);
	}
    /**
	 *  禁用角色
	 */
	public function disableRole()
	{
		$RoleID=$this->getParams('RoleID',false);
		if($RoleID === false)
		{
			$this->_ajaxReturn(-2);
		}
		$ret = self::$CAR->ApplyRole(self::$SID,false,$RoleID);
		$this->_ajaxReturn($ret);
	}
	
	/**
	 *  删除角色
	 */
	 
	public function delRole(){
		$RoleID=$this->getParams('RoleID');
		$ret = self::$CAR->DeleteRole( self::$SID , $RoleID);
		$this->_ajaxReturn($ret);	
		
	}

    /**
     * 导出角色
     */
    public function exportRole()
    {
        $savePath =  realpath($this->getConfig('TEMP_PATH'));
        $uniqid = md5(uniqid('',true));
        $fileType = $this->getConfig('DOWNLOAD_FILE_TYPE');
        $fileName = $uniqid. '.' . $fileType;
        $filePath =  $savePath . DIRECTORY_SEPARATOR . $fileName;
        $guid = $this->getParams('guid');
        $ret = self::$CAR->ExportRole(self::$SID, $filePath, $guid, true, true);
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
     * 导入角色
     */
    public function importRole()
    {
        $guid = $this->getParams('guid','');
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
        $limitFileType = $this->getConfig('IO_ROLE_FILE_TYPE');
        $fileName = $uuid.'.' . Common::getFileType($_FILES['file']['name']);
        $savePath =  $this->getConfig('TEMP_PATH');
        $filePath = $savePath.$fileName;

        $upload = new upload($fileArr, $fileName, $savePath, $limitFileType, 0, 1024 * 1024 * $this->getConfig('IMPORT_ROLE_FILE_SIZE'));
        if (!$upload->run())
        {
            $msg = $this->getLang('uploadFileError')[$upload->errno];
            $this->_ajaxReturn(array("ret"=>-1,"error_info"=>$msg),'json');
        }
        //转换成绝对路径
        $filePath =  realpath($filePath);
        $ret = self::$CAR->ImportRole(self::$SID, $guid, $filePath );
        unlink($filePath);
        $this->_ajaxReturn($ret);
    }

}
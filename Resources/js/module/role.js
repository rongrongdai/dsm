function role(){
    var contentContainer=$("#m-content-container-role");
    var toolbar=$("#u-main-toolbar-role");
    var formBtnPanel=contentContainer.find(".m-btn");
    var formPanel = $(".u-form-panel");
    var listPanel =$(".m-content-item-list");
    var roleTree=$("#menu-container-role").ajaxTree({
        url:API.role.getRoleTypeTree,
        idProperty:'RoleTypeID',
        textProperty:'TypeName',
        pidProperty:'ParentTypeID',
        icon:['icon-role-lv1','icon-role-lv2'],
        extraParams:{IncludeSubType:0},
        rootLocked:false,

        enableFloatMenu:true,
        floatMenu:[{icon:"u-users-tree-add",handler:function(data,node,tree){
            /*formPanel.ajaxPanel({
                url:API.role.addGroupPage,
                params:{pid:data.id},
                hidePanel:listPanel,
                success:function(me,oldPanel)
                {
                    me.find(".u-panel-title").collapsePanel();
                    me.find(".u-btn-cancel").click(function(){
                        me[0].bf.close();
                    });
                },
                error: $.ajaxCommonCallback
            });*/
            var config = {
                title: L.pleaseInputRoleGroupName,
                placeHolder:L.pleaseInputRoleGroupName,
                validate:function(val){
                    return /^[\w\u4e00-\u9fa5\-\s]+$/.test(val);
                },validateMsg:L.pleaseInputCommonString
            };
            layer.prompt(config,function(name){
                $.fastAction(API.role.addGroup,{name:name,pid:data.RoleTypeID},function(ret,suc){
                    if(suc)
                    {
                        location.reload();
                    }
                });
            });

        }},{icon:"u-users-tree-edit",handler:function(data,node,tree){
            /*formPanel.ajaxPanel({
                url:API.role.editGroupPage,
                params:{id:data.id},
                hidePanel:listPanel,
                success:function(me,oldPanel)
                {
                    me.find(".u-panel-title").collapsePanel();
                    me.find(".u-btn-cancel").click(function(){
                        me[0].bf.close();
                    });
                },
                error: $.ajaxCommonCallback
            });*/
            var config = {
                title: L.pleaseInputRoleGroupName,
                placeHolder:L.pleaseInputRoleGroupName,
                validate:function(val){
                    return /^[\w\u4e00-\u9fa5\-\s]+$/.test(val);
                },validateMsg:L.pleaseInputCommonString,
                val:data.TypeName
            };
            layer.prompt(config,function(name){
                $.fastAction(API.role.editGroup,{name:name,pid:data.ParentTypeID,id:data.RoleTypeID},function(ret,suc){
                    if(suc)
                    {
                        location.reload();
                    }
                });
            });
        }},{
            icon:"u-users-tree-del",handler:function(data){
                layer.confirm(L.delConfirm,function(){
                    $.fastAction(API.role.delGroup,{id:data.RoleTypeID},function(ret,suc){
                        if(suc)
                        {
                            location.reload();
                        }
                    });
                });
            }
        }],
        floatMenuFilter:function(node){
            var data= node.data();
            return data.level>1;
        },
        parseData:function(data)
        {
            if(data.Result && data.Result.RoleTypeList)
            {
                return data.Result.RoleTypeList;
            }
            else
            {
                return [];
            }
        }
    });
    //自定义角色节点添加
    $("#menu-container-role").bind("afterNodeRender",function(e,_node,_me,_obj){
        var data = _node.data();
        if(data.TypeName=="自定义角色"){
            var menuBtnDom = document.createElement("a");
            var menuBtn =$(menuBtnDom);
            menuBtn.addClass("u-dept-tree-menu-root");

            menuBtn.click(function(){
                var config = {
                    title: L.pleaseInputRoleGroupName,
                    placeHolder:L.pleaseInputRoleGroupName,
                    validate:function(val){
                        return /^[\w\u4e00-\u9fa5\-\s]+$/.test(val);
                    },validateMsg:L.pleaseInputCommonString
                };
                layer.prompt(config,function(name){
                    $.fastAction(API.role.addGroup,{name:name,pid:data.RoleTypeID},function(ret,suc){
                        if(suc)
                        {
                            location.reload();
                        }
                    });
                });
                return false;
            });
            /*_node.hover(function(){
                menuBtn.show();
            },function(){
                menuBtn.hide();
            });*/
            _node.append(menuBtnDom);
        }
    });
    function getSpecialStr(val)
    {
        val = parseInt(val);
        var str=[];
		if((val & 4096) >0)str.push("审批权限");
		if((val & 65536) >0)str.push("委托权限");
		if((val & 4) >0)str.push("解密权限");
		if((val & 256) >0)str.push("文件授权");
        if((val & 32) >0)str.push("文件打印");
        if((val & 32768) >0)str.push("文件外发");
		if((val & 2) >0)str.push("截屏操作");
		if((val & 8192) >0)str.push("使用截屏工具");
        if((val & 1024) >0)str.push("密码修改");
        if((val & 64) >0)str.push("拷贝粘贴");
        if((val & 16384) >0)str.push("离线解密");
        if((val & 512) >0)str.push("隐藏右键菜单");
        if((val & 2048) >0)str.push("不显示加密锁");
        if((val&262144) >0)str.push("查看删除备份");
        if((val&131072) >0)str.push("落地加密");
        if((val&524288) >0)str.push("U-Key授权");
        if((val&1048576) >0)str.push("白名单设置");
        return str.join(",");
    }

    function getRightStr(v)
    {
        var AppOperatorLevel={
            /*AddUserGroup:'添加用户组',
             EditUserGroup:'编辑用户组',
             DelUserGroup:'删除用户组',
             ImportUserGroup:'导入用户组',
             ExportUserGroup:'导出用户组',

             AddUser:'添加用户',
             EditUser:'编辑用户',
             DisableUser:'冻结用户',
             DelUser:'删除用户',*/
            UserPageView:'用户界面查看',
            UserPageEdit:'用户界面修改',
            UserPageEditAll:'用户界面完全控制',
            /*AddStrategyGroup:'新增策略组',
             EditStrategyGroup:'编辑策略组',
             DelStrategyGroup:'删除策略组',
             AddStrategy:'新增策略',
             EditStrategy:'编辑策略',
             DelStrategy:'删除策略',
             ImportStrategy:'导入策略',
             ExportStrategy:'导出策略',*/
            StrategyPageView:'策略界面查看',
            StrategyPageEdit:'策略界面修改',
            StrategyPageEditAll:'策略界面完全控制',
            BehaviorControlPageView:'行为管控界面查看',
            BehaviorControlPageEdit:'行为管控界面修改',
            BehaviorControlPageEditAll:'行为管控界面完全控制',
            /*AddRole:'添加角色',
             EditRole:'编辑角色',
             DelRole:'删除角色',
             ImportRole:'导入角色',
             exportRole:'导出角色',*/
            RolePageView:'角色界面查看',
            RolePageEdit:'角色界面修改',
            RolePageEditAll:'角色界面完全控制',
            /*BusinessSetting:'业务配置',
             LogSetting:'日志配置',
             ProcessSetting:'流程配置',
             OtherSetting:'其他配置',*/
            SettingPageView:'系统设置界面查看',
            SettingPageEdit:'系统设置界面修改',
            SettingPageEditAll:'系统设置界面完全控制',
            /* ClientLog:'客户日志',
             ProcessLog:'流程日志',
             AdminLog:'管理员日志',*/
            LogPageView:'日志界面查看',
            LogPageEdit:'日志界面修改',
            LogPageEditAll:'日志界面完全控制'
        };
        var str=[];
        if(v)
        {
            $.each(v,function(k,v){
                if(v.Level == 1 && AppOperatorLevel[v.UniqueKey])
                {
                    str.push(AppOperatorLevel[v.UniqueKey]);
                }
            });
        }
        return str.join(",");
    }
    var list=$("#u-ajax-table-container-role").ajaxTable({
        url:API.role.getRoleList,
        rows:50,
        idProperty:'RoleID',
        parseTotal:function(data){
            return data.Result.TotalCount;
        },
        selMark:'',
        columns:[
            {
                xtype:'checkbox',width:35
            },
            {
                dataIndex:'RoleName',text:'角色名称',width:160,sort:'RoleName'
            },
            {
                dataIndex:'AppOperatorLevel',text:'应用权限',width:150,renderer:function(v){
                var str=getRightStr(v);
                var arr = str.split(",");
                var div = document.createElement("div");
                var suffix = arr.length>1?"...":"";
                var view = arr[0]+suffix;
                $(div).attr({title:arr.join(",")}).text(view);
                return div;
                /*var spanDom=document.createElement("span");
                 var span=$(spanDom);
                 span.attr("title",str).text(str);
                 return spanDom;*/
            }
            },
            {
                dataIndex:'SpecialRight',text:'特殊权限',width:150,renderer:function(v)
            {
                var str=getSpecialStr(v);
                var arr = str.split(",");
                var div = document.createElement("div");
                var suffix = arr.length>1?"...":"";
                var view = arr[0]+suffix;
                $(div).attr({title:arr.join(",")}).text(view);
                return div;
                /*var spanDom=document.createElement("span");
                 var span=$(spanDom);
                 span.attr("title",str).text(str);
                 return spanDom;*/
            }
            },
            {
                dataIndex:'HasApply',text:'角色状态'/*,align:'center'*/,renderer:function(v)
            {
                return v!=0?"已启用":"未启用";
            },sort:'HasApply'
            },
            {
                dataIndex:'OperatorLevel',text:'角色等级'/*,align:'center'*/,renderer:function(v)
            {
                return v==1?"一级":v==2?"二级":v==3?"三级":"";
            },sort:'OperatorLevel'
            },
            {
                dataIndex:'Remark',text:'备注',width:150,sort:'Remark'
            }
        ],
        autoLoad:false,
        parseData:function(data)
        {
            if(data.Result && data.Result.RoleNameList)
            {
                return data.Result.RoleNameList;
            }
            else
            {
                return [];
            }
        }

    });

    var listPageToolbar=$("#u-page-toolbar-role").pageToolbar({
        table:list
    });
    /**
     *  选择角色组的时候自动关联相应的数据
     */
    function linkListHandler(){
        //hideRoleDeptFilterBox();
        $("#u-search-input").attr("value","");
        var condition={RoleInfo:{Condition:[[]]}};
        if(list.extraParams.Condition)
        {
            condition= $.evalJSON(list.extraParams.Condition);
        }
        condition.RoleInfo.Condition[0][0]=[];
        list.extraParams.Condition= $.toJSON(condition);
        if(list.me.is(":hidden"))
        {
            list.loadRemark=false;
        }
        var roleType=roleTree.sels.join(",");
        list.extraParams.ParentTypeID=roleType;
        list.loadPage(1);
    }
    function linkList(){
        if(list.me.is(":hidden"))
        {
            //list.loadRemark=false;
            layer.confirm(L.cancelOperationConfirm,function(){
                contentContainer.find(".u-btn-cancel").trigger("click");
                linkListHandler();
            });
        }
        else
        {
            linkListHandler();
        }
    }
    roleTree.onSelectChange.add(linkList);
    //roleTree.onFirstLoad.add(linkList);

    function selectBtn(me,targetCls){
        toolbar.find("."+ $.bf.config.selectedCls).removeClass($.bf.config.selectedCls);
        contentContainer.find(".m-content-item").hide();
        me.addClass($.bf.config.selectedCls);
        contentContainer.find("."+targetCls).fadeIn();
        formBtnPanel.fadeIn();
    }
    var copyRoleInput=$("#u-copy-role");
    copyRoleInput.ajaxTreeSelect({
        url:API.role.getRoleTree,
        idProperty:'RoleTypeID',
        textProperty:'TypeName',
        pidProperty:'ParentTypeID',
        uniPrefix:'role_',
        emptyNode:false,
        onBeforeSelect:function(n){
            if(n.data("isRole"))
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        parseData:function(data)
        {
            if(data.Result)
            {
                var rData=[];
                data.Result.RoleTypeList ? rData=rData.concat(data.Result.RoleTypeList):"";
                var role=[];
                if(data.Result.RoleNameList)
                {
                    role= $.map(data.Result.RoleNameList,function(v){
                        v.RoleTypeID= "role_"+v.RoleID;
                        v.TypeName= v.RoleName;
                        v.isRole=true;
                        v.checkable=true;
                        v.leaf=true;
                        return v;
                    });
                }
                role ? rData=rData.concat(role):"";
                return rData;
            }
            else
            {
                return [];
            }
        }
    });
    copyRoleInput.bind({
        onTreeSelectChange:function(me,input,node,obj)
        {
            var data = node.data();
            if(!node.isSelected())
            {
                data = false;
            }
            autoLoadRight(data);
        }
    });
    var parentRoleType=$("#u-belong-role");
    parentRoleType.ajaxTreeSelect({
        url:API.role.getRoleTypeTree,
        idProperty:'RoleTypeID',
        textProperty:'TypeName',
        pidProperty:'ParentTypeID',
        extraParams:{IncludeSubType:0},
        rootId:'',
        showCheckbox:true,
        itemClickSelect:false,
        emptyNode:false,
        selMode:'single',
        parseData:function(data)
        {
            if(data.Result && data.Result.RoleTypeList)
            {
                if(data.Result.RoleTypeList[0].TypeName=="系统角色")
                {
                    data.Result.RoleTypeList.splice(0,1);
                }
                return data.Result.RoleTypeList;
            }
            else
            {
                return [];
            }
        }
    });
    $("#u-form-add-role").validate({
        rules:{
            level:{
                required:true
            }
        },
        errorPlacement:function(error,element) {
            if(element.is(":radio,:checkbox"))
            {
                element.parents("li:first").append(error);
            }
            else
            {
                element.after(error);
            }
        }
    });
    function addRoleHandler(me)
    {
        $(".u-page-limit-li").show();
        $("#u-panel-title-role").text(L.addRole);
        var form=$("#u-form-add-role");
        //console.log("addRole");
        //console.log(parentRoleType[0].tree);
        //parentRoleType[0].setDefaultValue({text:'',value:''});
        //copyRoleInput[0].setDefaultValue({text:'',value:''});
        var validator=form.validate();
        validator.resetForm();
        form.clearForm();
        $("#disable-white-list").attr("checked",true).trigger("change");
        if(roleTree.hasSelect())
        {
            var prNode = roleTree.getSelectNodes();
            var prData = prNode.data();
			var reg = /系统角色|默认角色/gi;
			if(!reg.test(prData.TypeName)){
				parentRoleType[0].setDefaultValue({text:prData.TypeName,value:prData.RoleTypeID});
			}
            
        }
        //$("[name=level]:first").attr("checked",true);
        selectBtn(me,"m-content-item-form-role-add");
        $(".u-btn-ok").bind({
            click:function(){
                if($(this).isDisabled())
                {
                    return false;
                }
                if(validator.form())
                {

                    var data={};
                    var tmp={};
                    var special=0;
                    $("input.special-input:checked").each(function(){
                        special =special | parseInt($(this).val());
                    });
                    var copyRole=$("#u-copy-role").val();
                    tmp.RoleName=$("#u-role-name").val();
                    data.RoleTypeName=$("#u-role-type-name").val();
                    tmp.SpecialRight=special;
                    tmp.OperatorLevel=parseInt($("[name=level]:checked").val());
                    tmp.Remark=$("#u-role-remark").val();
                    tmp.strInRolePath="系统角色\\\\"+copyRole;
                    data.ParentRoleTypeID=$("[name=ParentTypeID]").val();
                    var appOperatorLevel=[];
                    $("#u-get-setting").find("input[name]").each(function(){
                        var key=$(this).attr("name");
                        var level=$(this).is(":checked")?1:0;
                        var a={ UniqueKey:key,Level:level };
                        appOperatorLevel.push(a);
                    });
                    tmp.AppOperatorLevel=appOperatorLevel;
                    data.jsStr= $.toJSON(tmp);
                    $.fastAction(API.role.addRoleAndType,data,function(data,res){
                        if(res)
                        {
                            contentContainer.find(".u-btn-cancel").trigger("click");
                            if($("#u-role-type-name").val())
                            {
                                roleTree.load();
                            }
                            list.loadPage(1);
                        }
                    });
                }
            }
        });
    }
    $("#add-role").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var me=$(this);
        if(me.isSelected())
        {
            return;
        }
        if(toolbar.find("."+$.bf.config.selectedCls).length>0)
        {
            layer.confirm(L.cancelOperationConfirm,function(){
                $(".u-btn-cancel").trigger("click");
                layer.closeAll();
            });
        }
        else
        {
            addRoleHandler(me);
        }
    });

    $(".sel-group").ajaxTreeSelect({
        url:API.role.getRoleTypeTree,
        idProperty:'RoleTypeID',
        textProperty:'TypeName',
        pidProperty:'ParentTypeID',
        extraParams:{IncludeSubType:0},
        rootId:'',
        showCheckbox:true,
        itemClickSelect:false,
        treeContainerCss:{zIndex:100000000},
        emptyNode:false,
        parseData:function(data)
        {
            if(data.Result && data.Result.RoleTypeList)
            {
                if(data.Result.RoleTypeList[0].TypeName=="系统角色")
                {
                    data.Result.RoleTypeList.splice(0,1);
                }
                return data.Result.RoleTypeList;
            }
            else
            {
                return [];
            }
        }
    });
    function autoLoadRight(data)
    {
        if(data)
        {
            $("input.special-input").each(function(){
                var val=parseInt($(this).val());
                data.SpecialRight=parseInt(data.SpecialRight);
                var checked=(val & data.SpecialRight)>0?true:false;
                $(this).attr("checked",checked).trigger("change");
            });
            $("[name=level]").each(function(){
                var checked=parseInt($(this).attr("value"))==data.OperatorLevel?true:false;
                $(this).attr("checked",checked).trigger("change");
            });
            $("#u-get-setting :checkbox").each(function(){
                $(this).attr("checked",false);
            });
            $.each(data.AppOperatorLevel,function(k,v){
                var key=v.UniqueKey;
                var checked=v.Level?true:false;
                $("[name="+key+"]").attr("checked",checked);
            });

        }
        else
        {
            $("#u-get-setting :checkbox").each(function(){
                $(this).attr("checked",false);
            });
            $("#u-operation-special-box :checkbox").each(function(){
                $(this).attr("checked",false);
            });
        }
    }
    /**
     *  编辑角色具体处理
     */
    function editRoleHandler(me)
    {
        $(".u-page-limit-li").show();
        $("#u-panel-title-role").text(L.editRole);
        var form=$("#u-form-add-role");
        var validator=form.validate();
        form.clearForm(true);
        validator.resetForm();
        $("#disable-white-list").attr("checked",true).trigger("change");
        //parentRoleType[0].setDefaultValue({text:'',value:''});
        //copyRoleInput[0].setDefaultValue({text:'',value:''});
        if(list.isSelectOne())
        {
            var node=list.getSelectNodes();
            var nData=node.data();
            if(nData.ForbiddenModify)
            {
                /*layer.alert(L.canNotEditSystemRole,0);
                return;*/
                $("#save-role-form").addClass("z-disabled");
            }
            else if(!$("#save-role-form").attr("data-disable"))
            {
                $("#save-role-form").removeClass("z-disabled");
            }
            autoLoadRight(nData);
            $("#u-role-name").attr("value",nData.RoleName);
            $("#u-role-id").attr("value",nData.RoleID);
            $("#u-role-remark").attr("value",nData.Remark);
            var roleTypeName=$("#u-belong-role");
            roleTypeName[0].setDefaultValue({text:nData.ParentTypeName,value:nData.ParentTypeID});
            //roleTypeName.attr("value",nData.ParentTypeName);
            //roleTypeName.next().attr("value",nData.ParentTypeID);
            $(".u-btn-ok").bind({
                click:function(){
                    if($(this).isDisabled())
                    {
                        return false;
                    }
                    if(validator.form())
                    {
                        var data={};
                        var tmp={};
                        var special=0;
                        $("input.special-input:checked").each(function(){
                            special =special | parseInt($(this).val());
                        });
                        var copyRole=$("#u-copy-role").val();
                        tmp.RoleName=$("#u-role-name").val();
                        data.RoleTypeName=$("#u-role-type-name").val();
                        data.RoleID=$("#u-role-id").val();
                        tmp.SpecialRight=special;
                        tmp.OperatorLevel=parseInt($("[name=level]:checked").val());
                        tmp.strInRolePath="默认角色\\\\"+copyRole;
                        tmp.Remark=$("#u-role-remark").val();
                        tmp.ParentTypeID=$("[name=ParentTypeID]").val();
                        var appOperatorLevel=[];
                        $("#u-get-setting").find("input[name]").each(function(){
                            var key=$(this).attr("name");
                            var level=$(this).is(":checked")?1:0;
                            var a={ UniqueKey:key,Level:level };
                            appOperatorLevel.push(a);
                        });
                        tmp.AppOperatorLevel=appOperatorLevel;
                        data.JsStr= $.toJSON(tmp);
                        $.fastAction(API.role.editRole,data,function(data,res){
                            if(res)
                            {
                                /*contentContainer.find(".u-btn-cancel").trigger("click");
                                 list.loadPage(1);
                                 //location.reload();*/
                                contentContainer.find(".u-btn-cancel").trigger("click");
                                if($("#u-role-type-name").val())
                                {
                                    roleTree.load();
                                }
                                list.loadPage(1);
                            }
                        });
                    }
                }
            });
            selectBtn(me,"m-content-item-form-role-add");
        }
        else
        {
            layer.alert(L.pleaseSelectOneRole,0);
        }
        /*$.post("Ajax.aspx", { Action: "post", Name: "lulu" },
         function (data, textStatus){


         }, "json");*/
    }
    //双击编辑，有权限的时候该功能才有效
    var editRight = LIMIT_CONTROLLER.EDIT;
    if(editRight)
    {
        list.onItemDblClick.add(function(node,obj){
            obj.deselectAll();
            obj.select(node);
            editRoleHandler($("#edit-role"));
        });
    }

    //编辑角色按钮
    $("#edit-role").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var me=$(this);
        if(me.isSelected())
        {
            return;
        }
        if(toolbar.find("."+$.bf.config.selectedCls).length>0)
        {
            layer.confirm(L.cancelOperationConfirm,function(){
                $(".u-btn-cancel").trigger("click");
                layer.closeAll();
            });
        }
        else
        {
            editRoleHandler(me);
        }
    });
    /**
     *  删除角色具体处理
     */
    function delRoleHandler(me)
    {
        //判断列表有没有选中角色
        if(list.hasSelect())
        {
            var n=list.getSelectNodes();
            var noModify=[];
            $.each(n,function(){
                if($(this).data("ForbiddenModify"))
                {
                    noModify.push($(this).data("RoleName"));
                }
            });
            if(noModify.length>0)
            {
                layer.alert(L.thisRoleCantEdit,0);
                return;
            }
            layer.confirm(L.delRoleConfirm,function(){
                //拷贝选中的id
                var ids= list.getSelectIds();
                list.deselect(n);
                var data={};
                var tmp={RoleID:ids};
                data.RoleID= $.toJSON(tmp);
                $.fastAction(API.role.delRole,data,function(data,res){
                    if(res)
                    {
                        list.loadPage(1);
                    }
                });
            });
        }
        else
        {
            layer.alert(L.pleaseSelectOneMoreRole,0);
        }
    }
    //角色等级变化时的处理
    $('[name=level]').change(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        /*$("#u-get-setting").find(":checkbox").each(function(){
         $(this).attr("checked",false);
         });*/
        var val = $('[name=level]:checked').val();
        var li = $(".u-page-limit-li");
        li.hide();
        var selector = $([]);
        li.each(function(){
            var level = $(this).attr("data-level");
            if(level<=val)
            {
                selector = selector.add($(this));
            }
            else
            {
                $(this).find(":checkbox").each(function(){
                    $(this).attr("checked",false);
                });
            }
        });
        selector.show();
        /*if($(this).attr("checked"))
         {
         $('[name=level]').not(this).attr('checked',false);
         }else
         {
         return false;
         }*/
    });
    list.onSelectChange.add(function(id,node,obj){
        var ids=list.getSelectIds();
        var nodes= list.getSelectNodes();
        var count=0;
        if(nodes)
        {
            $.each(nodes,function(){
                if($(this).data("HasApply"))
                {
                    count++;
                }
            });
        }
        if(!$("#u-enable-role").isDisabled())
        {
            if(count == nodes.length && nodes.length>0)
            {
                $("#u-btn-txt-frozen-role").text(L.frozen).prev().removeClass("icon-apply").addClass("icon-blocking");
            }
            else
            {
                $("#u-btn-txt-frozen-role").text(L.restore).prev().removeClass("icon-blocking").addClass("icon-apply");
            }
        }

    });
    $("#u-enable-role").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if(list.hasSelect())
        {
            var ids=list.getSelectIds();
            var nodes= list.getSelectNodes();
            var count = 0;
            var title = L.enableRoleConfirm;
            var url = API.role.applyRole;
            var canEdit = true;
            $.each(nodes,function(){
                if($(this).data("ForbiddenModify"))
                {
                    layer.alert(L.canNotEditSystemRole,0);
                    canEdit = false;
                    return false;
                }
                if($(this).data("HasApply"))
                {
                    count++;
                }
            });
            if(!canEdit)
            {
                return;
            }
            if(count == nodes.length)
            {
                title = L.disableRoleConfirm;
                url = API.role.disableRole;
            }
            layer.confirm(title,function(){
                //拷贝选中的id
                //var ids= list.getSelectIds();
                list.deselect(nodes);
                var data={};
                var tmp={RoleID:ids};
                data.RoleID= $.toJSON(tmp);
                $.fastAction(url,data,function(data,res){
                    if(res)
                    {
                        layer.msg(L.operationSucceed,1,1,function(){
                            list.loadPage(1);
                        });
                    }
                });
            });
        }
        else
        {
            layer.alert(L.pleaseSelectOneRole,0);
        }
    });
    contentContainer.find(".u-btn-cancel").bind({
        click:function(){
            if($(this).isDisabled())
            {
                return false;
            }
            if(!$("#save-role-form").attr("data-disable"))
            {
                $("#save-role-form").removeClass("z-disabled");
            }
            toolbar.find("."+$.bf.config.selectedCls).removeClass($.bf.config.selectedCls);
            contentContainer.find(".m-content-item").hide();
            contentContainer.find(".m-content-item-list").fadeIn();
            formBtnPanel.fadeOut();
            contentContainer.find(".u-btn-ok").unbind();
            //$("#u-search-input").unbind();
            layer.closeTips();
        }
    });
    function searchHandler(){
        var val=$("#u-search-input").val();
        var condition={RoleInfo:{Condition:[[]]}};
        if(list.extraParams.Condition)
        {
            condition= $.evalJSON(list.extraParams.Condition);
        }
        if(val)
        {
            condition.RoleInfo.Condition[0][0]=["and","RoleName","like","%"+val+"%"];
        }
        else
        {
            condition.RoleInfo.Condition[0][0]=[];
        }
        list.extraParams.Condition= $.toJSON(condition);
        list.loadPage(1);
    }
    function searchKeypressHandler(e)
    {
        if(e.keyCode=="13")
        {
            searchHandler();
        }
    }
    $("#u-search-input").unbind("keypress").bind({
        keypress:searchKeypressHandler
    });
    function searchClickHandler()
    {
        if($(this).isDisabled())
        {
            return false;
        }
        searchHandler();
    }
    $("#u-search-icon").unbind("click").bind({
        click:searchClickHandler
    });
    $("#del-role").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var me=$(this);
        if(me.isSelected())
        {
            return;
        }
        if(toolbar.find("."+$.bf.config.selectedCls).length>0)
        {
            layer.confirm(L.cancelOperationConfirm,function(){
                $(".u-btn-cancel").trigger("click");
                layer.closeAll();
            });
        }
        else
        {
            delRoleHandler(me);
        }
    });
    //筛选条件
    var searchConditionList = $("#u-search-condition")[0];
    var conditionData=[
        {text:'全部',value:-1,checked:true},
        {text:'未启用',value:0},
        {text:'已启用',value:1}
    ];
    searchConditionList.tree.me.unbind("onSelectChange").bind("onSelectChange",function(me,id,node,obj){
        var val=parseInt(id);
        var condition={RoleInfo:{Condition:[[]]}};
        if(list.extraParams.Condition)
        {
            condition= $.evalJSON(list.extraParams.Condition);
        }
        if(val)
        {
            condition.RoleInfo.Condition[0][1]=["and","RoleName","like","%"+val+"%"];
        }
        switch (val)
        {
            //未应用
            case 0:
                condition.RoleInfo.Condition[0][1]=["and","HasApply","=","0"];
                break;
            //已应用
            case 1:
                condition.RoleInfo.Condition[0][1]=["and","HasApply","=","1"];
                break;
            //全部
            default:
                condition.RoleInfo.Condition[0][1]=[];
                roleTree.deselectAll();
        }
        list.extraParams.Condition= $.toJSON(condition);
        list.loadPage(1);
    });
    /*searchConditionList.tree.onSelectChange.add(function(id,node,obj){
     //console.log(id);
     var val=parseInt(id);
     var condition={RoleInfo:{Condition:[[]]}};
     if(list.extraParams.Condition)
     {
     condition= $.evalJSON(list.extraParams.Condition);
     }
     if(val)
     {
     condition.RoleInfo.Condition[0][1]=["and","RoleName","like","%"+val+"%"];
     }
     switch (val)
     {
     //未应用
     case 0:
     condition.RoleInfo.Condition[0][1]=["and","HasApply","=","0"];
     break;
     //已应用
     case 1:
     condition.RoleInfo.Condition[0][1]=["and","HasApply","=","1"];
     break;
     //全部
     default:
     condition.RoleInfo.Condition[0][1]=[];
     roleTree.deselectAll();
     }
     list.extraParams.Condition= $.toJSON(condition);
     list.loadPage(1);
     });*/
    searchConditionList.setTreeConfig("localData",conditionData);
    searchConditionList.tree.load(true);
    /*$("#u-filter-role").bind("change",function(e){
     var val=parseInt($(this).val());
     var condition={RoleInfo:{Condition:[[]]}};
     if(list.extraParams.Condition)
     {
     condition= $.evalJSON(list.extraParams.Condition);
     }
     if(val)
     {
     condition.RoleInfo.Condition[0][1]=["and","RoleName","like","%"+val+"%"];
     }
     switch (val)
     {
     //未应用
     case 0:
     condition.RoleInfo.Condition[0][1]=["and","HasApply","=","0"];
     break;
     //已应用
     case 1:
     condition.RoleInfo.Condition[0][1]=["and","HasApply","=","1"];
     break;
     //全部
     default:
     condition.RoleInfo.Condition[0][1]=[];
     roleTree.deselectAll();
     }
     list.extraParams.Condition= $.toJSON(condition);
     list.loadPage(1);
     });*/


    /*#导入*/
    $('#import').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        //$(".sel-group.import")[0].setDefaultValue({text:"",value:""});
        $("#upload-form").clearForm();
        $.layer({
            type: 1,
            title: false,
            area: ['550px', '250px'],
            shade: [0.3, '#000'],
            move: '#import-box-title',
            page: {
                dom: '#upload-box'
            }
        });
        $("#upload-view-btn").selectFileBtn({
            fileBtn:"#fileField"
        });
    });

    $('.cancel-btn').click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        layer.closeAll();
    });

    $('#upload-view-btn').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        $('#fileField').click();
    });

    $('#fileField').on('change', function(){
        $('#import-file-name').val($(this).val());
    });

    $('#import-btn').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }

        var form = $("#upload-form");
        if(!form.validate().form())
        {
            return false;
        }
        if($('#import-file-name:visible').val() == ''){
            layer.alert(L.pleaseSelectFile, 0);
            return false;
        }
        var guid = $('#upload-box').find('.sel-group').next().val();
        if(guid == undefined){
            guid = '';
        }
        var options = {
            url: API.role.importRole,
            type: 'POST',
            dataType: "json",
            data: {'guid' : guid},
            timeout:10000000,
            success: function(result){
                if(result.ret){
                    $.bf.parseError(result);
                } else {
                    layer.msg(L.importSucceed, 1,1, function(){
                        window.location.reload();
                    });
                }
            }
        };
        $.bf.operationWaiting(L.importing);
        $('#upload-form').ajaxSubmit(options);
    });

    $('#sel-file-import').on('change', function(){
        var obj = $(this).get(0);
        if(obj.checked == true){
            $('#sel-file-box').show();
        } else {
            $('#sel-file-box').hide();
        }
    });

    $('#domain-import').on('change', function(){
        var obj = $(this).get(0);
        if(obj.checked == true){
            $('#sel-file-box').hide();
        } else {
            $('#sel-file-box').show();
        }
    });


    /*导出*/
    $('#export').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        $("#export-form").clearForm();
        $.layer({
            type: 1,
            title: false,
            area: ['550px', '250px'],
            shade: [0.3, '#000'],
            move: '#export-box-title',
            page: {
                dom: '#export-box'
            }
        });
    });

    $('#export-btn').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var guid = $('#export-box').find('.sel-group').next().val();
        if(guid == undefined){
            guid = '';
        }
        var form = $("#export-form");
        if(!form.validate().form())
        {
            return;
        }
        $.download(API.role.exportRole,{guid:guid},$.bf.date("角色(yyyy-MM-dd)")+".role",function(){
            layer.closeAll();
        });

    });
    /*$("#u-role-type-name").bind({
     change:function()
     {
     var belong=$("#u-belong-role");
     if($(this).val()=="")
     {
     belong.attr("required",true).blur();
     }
     else
     {
     belong.attr("required",false).blur();
     }
     }
     });*/
    var filterTree = $("#u-role-dept-filter-tree").ajaxTree({
        url:API.role.getUserGroupTree,
        selMark:'',
        textProperty:'text',
        pidProperty:'id',
        dataRoot:'Group',
        baseCls:'u-ajax-tree-float',
        skinCls:'s-ajax-tree-float',
        itemCls:'u-ajax-tree-item-float',
        icon:[],
        showCheckbox:false,
        itemClickSelect:true,
        showIcon:false,
        rootLocked:false,
        selMode:'single',
        itemWidth:180,
        extraParams:{includeUser:1},
        parseData:function(data)
        {
            var renderData=[];
            if(data.Group)
            {
                renderData=renderData.concat(data.Group);
            }
            if(data.User)
            {
                var user= $.map(data.User,function(v){
                    //v.checkable=true;
                    v.leaf=true;
                });
                renderData=data.User.concat(renderData);
            }
            return renderData
        }
    });
    var dpTree=$("#u-align-auto-role").ajaxTree({
        url:API.role.getUserGroupTree,
        selMark:'',
        textProperty:'text',
        pidProperty:'id',
        dataRoot:'Group',
        baseCls:'u-ajax-tree-float',
        skinCls:'s-ajax-tree-float',
        itemCls:'u-ajax-tree-item-float',
        icon:[],
        showCheckbox:true,
        itemClickSelect:false,
        showIcon:false,
        rootLocked:false,
        selMode:'multiple',
        itemWidth:180,
        extraParams:{includeUser:1},
        parseData:function(data)
        {
            var renderData=[];
            if(data.Group)
            {
                renderData=renderData.concat(data.Group);
            }
            if(data.User)
            {
                var user= $.map(data.User,function(v){
                    //v.checkable=true;
                    v.leaf=true;
                });
                renderData=data.User.concat(renderData);
            }
            return renderData
        }
    });
    /**
     *  下发角色到部门或用户
     *
     */
    $("#u-apply-role").click(function(){
        //检查是否选择了角色
        if(!list.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMoreRole,0);
            return false;
        }
        showRoleDeptApplyBox();
        dpTree.deselectAll();
    });
    $("#u-div-down-role").click(function(){
        //检查是否选择了角色
        if(!list.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMoreRole,0);
            return false;
        }
        //检查是否选择了部门
        if(!dpTree.hasSelect())
        {
            layer.alert(L.pleaseSelectDepartments,0);
            return false;
        }
    });
    /**
     *  显示下发部门树
     *
     */
    function hideRoleDeptApplyBox()
    {
        $('#u-role-dept-tree').animate({right:-235},function(){
            $('#u-role-dept-tree').hide();
            $("#u-expand-apply-role-tree").show();
        });
        //$("#u-expand-apply-role-tree").animate({right:0});
        $("body").unbind("mousedown",hideRoleDeptApplyBox);
    }
    function showRoleDeptApplyBox()
    {
        //u-role-dept-tree
        $("#u-expand-apply-role-tree").hide();
        $('#u-role-dept-tree').show().animate({right:1},function(){

            //$("#u-expand-apply-role-tree").addClass("z-expanded");
        });
        // $("#u-expand-apply-role-tree").animate({right:238});
        $("body").bind("mousedown",hideRoleDeptApplyBox);
    }
    $("body").delegate(".xubox_main,.xubox_shade,.xubox_border","mousedown",function(e){
        e.stopPropagation();
        //return false;
    });
    $('#u-role-dept-tree').mousedown(function(){
        //console.log($(this));
        return false;
    });
    $("#u-div-hidden-role").click(function(){
        hideRoleDeptApplyBox();
    });
    /**
     *  隐藏部门筛选树
     *
     */
    function hideRoleDeptFilterBox()
    {
        $('#u-role-dept-filter-tree-box').animate({right:-235},function(){
            $('#u-role-dept-filter-tree-box').hide();
            $("#u-expand-apply-role-tree").removeClass("z-expanded");
        });
        $("#u-expand-apply-role-tree").animate({right:0});
        $("body").unbind("mousedown",hideRoleDeptFilterBox);
    }
    /**
     *  显示部门筛选树
     *
     */
    function showRoleDeptFilterBox()
    {
        $('#u-role-dept-filter-tree-box').show().animate({right:1},function(){
            $("#u-expand-apply-role-tree").addClass("z-expanded");
        });
        $("#u-expand-apply-role-tree").animate({right:238});
        $("body").bind("mousedown",hideRoleDeptFilterBox);
    }
    $('#u-role-dept-filter-tree-box').mousedown(function(){
        return false;
    });
    $("#u-expand-apply-role-tree").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if($("#u-expand-apply-role-tree").isExpanded())
        {
            hideRoleDeptFilterBox();
        }
        else
        {
            showRoleDeptFilterBox();
        }
        return false;
    });



    //权限设置时自动联动
    $("#u-get-setting .f-input-align").click(function(){
        var me= $(this);
        var parent = $("#u-get-setting");
        var checked= me.attr("checked");
        var dataGroup = $(this).attr("data-group");
        var dataAction = $(this).attr("data-action");

        if(dataAction == "view" && !checked)
        {
            parent.find("[data-group="+dataGroup+"]").attr("checked",false);
        }
        if(dataAction == "edit" && checked)
        {
            parent.find("[data-group="+dataGroup+"][data-action=view]").attr("checked",true);
        }
        else if(dataAction == "edit" && !checked)
        {
            parent.find("[data-group="+dataGroup+"][data-action=all]").attr("checked",false);
        }
        if(dataAction == "all" && checked)
        {
            parent.find("[data-group="+dataGroup+"]").attr("checked",true);
        }
    });
    /**
     * 有委托权限必须有审批权限
     */
    $("#u-permission-delegation").bind({
        change:function(){
            if($(this).attr("checked"))
            {
                $("#u-permission-approval").attr("checked",true);
            }
        }
    });
    /**
     * 取消选审批权限也得取消委托权限
     */
    $("#u-permission-approval").bind({
        change:function(){
            if(!$(this).attr("checked"))
            {
                $("#u-permission-delegation").attr("checked",false);
            }
        }
    });

    $(".m-panel-title").collapsePanel();
    $("[name='white-list-enable']").change(function(){
        var disabledBtn = $("#disable-white-list");
        if(disabledBtn.attr("checked"))
        {
            $(".add-white-list-panel").hide();
        }
        else
        {
            $(".add-white-list-panel").show();
        }
    });
}

$(function(){
    role();
});
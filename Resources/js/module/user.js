var user = function(){

    var deptFloatBtnAdd = $(".u-dept-float-btn-add");
    var deptFloatBtnEdit = $(".u-dept-float-btn-edit");
    var deptFloatBtnDel = $(".u-dept-float-btn-del");
    var deptTree=$("#menu-container-user").ajaxTree({
        url:API.user.getDepartmentTree,
        selMark:'',
        textProperty:'name',
        pidProperty:'id',
        dataRoot:'Group',
        rootLocked:true,
        rootId:'00000003-0000-0000-0000-000000000003',
        afterNodeRender:function(node)
        {
            var disable = LIMIT_CONTROLLER.EDIT?"":"z-disabled";
            var hide = LIMIT_CONTROLLER.EDIT?"":"f-dn";
            var disable2 = LIMIT_CONTROLLER.EDIT_ALL?"":"z-disabled";
            if(disable)
            {
                return;
            }
            if(node.data("level")==1)
            {
                var a = document.createElement("a");
                $(a).data(node.data());
                $(a).addClass("u-dept-tree-menu-root "+hide).click(function(){
                    if($(this).isDisabled())
                    {
                        return false;
                    }
                    /*if($("#u-form-add-dept").is(":visible") && $("[name=ParentGroupGuid]").val() == $(a).data("id"))
                     {
                     return false;
                     }*/
                    if(toolbar.find("."+$.bf.config.selectedCls).length>0)
                    {
                        layer.confirm(L.cancelOperationConfirm,function(){
                            $(".u-btn-cancel").trigger("click");
                            layer.closeAll();
                        });
                    }
                    else
                    {
                        addDeptHandler($(''),$(a));
                    }
                    return false;
                });
                node.append(a);
                var oldCls = node[0].className;
                var rootEditNode  = document.createElement("div");
                var input = document.createElement("input");
                var a1 = document.createElement("a");
                var a2 = document.createElement("a");
                var form = document.createElement("form");
                $(a2).addClass("u-edit-dept-btn u-edit-dept-btn-ok").click(function(){
                    if($(this).isDisabled())
                    {
                        return false;
                    }
                    if($("#u-edit-dept-root-input").val() == node.data("text"))
                    {
                        $(rootEditNode).hide();
                        node.show();
                        return;
                    }

                    var valid = $(form).validate({
                        errorPlacement:function(error,el)
                        {
                            //layer.alert(error.text());
                        }
                    });

                    if(valid.form())
                    {
                        var params = {
                            Modify_Guid:node.data("id"),
                            GroupName:$("#u-edit-dept-root-input").val()
                        };
                        $.fastAction(API.user.editDepartment,params,function(res){
                            if(res)
                            {
                                //location.reload();
                                deptTree.load();
                            }
                        });
                    }
                    else
                    {
                        layer.alert(L.inputError);
                    }
                });
                $(a1).addClass("u-edit-dept-btn u-edit-dept-btn-cancel").click(function(){
                    if($(this).isDisabled())
                    {
                        return false;
                    }
                    $("#u-edit-dept-root-input").attr("value",node.data("text"));
                    $(rootEditNode).hide();
                    node.show();
                });
                $(input).addClass("u-edit-dept-root-input")
                    .attr({"id":"u-edit-dept-root-input","placeholder":"请输入集团或公司名称","value":node.data("text")
                        ,"required":true,"commonStr":true,"maxlength":32
                    }).trigger("setcss");
                $(form).append(input).append(a1).append(a2);
                $(rootEditNode).append(form).addClass(oldCls).addClass("u-edit-dept-box").css({paddingLeft:15}).hide();
                //console.log(rootEditNode);
                //node.wrap("<div></div>");
                //console.log(node);
                node.addClass(disable).before(rootEditNode).bind({
                    dblclick:function()
                    {
                        if($(this).isDisabled())
                        {
                            return false;
                        }
                        node.hide();
                        $(rootEditNode).show();

                        return false;
                    },
                    selectstart:function(){
                        return false;
                    }
                });
            }
            else if(node.data("level")>1){
                var a = document.createElement("a");
                function hideBtn()
                {
                    hideA();
                    $(a).attr("show-btn",null);
                    $(".u-dept-float-btn").fadeOut();
                    $("body").unbind("click",hideBtn);
                }
                function hideA()
                {
                    $(a).stop().animate({opacity:0},function(){
                        $(this).hide();
                    });
                }
                $(a).data(node.data());
                $(a).click(function(){
                    if($(this).isDisabled())
                    {
                        return false;
                    }
                    //$(a).data(node.data());

                    $(".u-dept-tree-menu").not(a).hide();
                    $("body,.u-ajax-tree-item").bind({click:hideBtn});
                    var me = $(this);
                    $("[show-btn=true]").attr("show-btn",null);
                    me.attr("show-btn",true);

                    //如果是根节点
                    if($(a).data("level")==1)
                    {
                        if(toolbar.find("."+$.bf.config.selectedCls).length>0)
                        {
                            layer.confirm(L.cancelOperationConfirm,function(){
                                $(".u-btn-cancel").trigger("click");
                                layer.closeAll();
                            });
                        }
                        else
                        {
                            addDeptHandler($(''),$(a));
                        }
                    }
                    else
                    {
                        //
                        var pos =me.offset();
                        //添加部门按钮
                        deptFloatBtnAdd.css({opacity:0,display:"block",left:pos.left-10,top:pos.top-10})
                            .stop().animate({opacity:1,left:pos.left+30,top:pos.top-45});
                        deptFloatBtnAdd.addClass(disable2).unbind("click").click(function(){
                            if($(this).isDisabled())
                            {
                                return false;
                            }
                            //console.log($("[name=ParentGroupGuid]").val() +"===="+ $(a).data("id"));
                            /*if($("[name=ParentGroupGuid]").val() == $(a).data("id"))
                             {
                             return false;
                             }*/
                            if( toolbar.find("."+$.bf.config.selectedCls).length>0)
                            {
                                layer.confirm(L.cancelOperationConfirm,function(){
                                    $(".u-btn-cancel").trigger("click");
                                    layer.closeAll();
                                });
                            }
                            else
                            {
                                addDeptHandler($(''),$(a));
                            }
                        });
                        //编辑部门按钮
                        deptFloatBtnEdit.css({opacity:0,display:"block",left:pos.left-10,top:pos.top-10})
                            .stop().animate({opacity:1,left:pos.left+30,top:pos.top-8});
                        deptFloatBtnEdit.unbind("click").click(function(){
                            if($(this).isDisabled())
                            {
                                return false;
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
                                //console.log($(a).data());
                                editDeptHandler($(''),$(a));
                            }
                        });
                        //删除部门按钮
                        deptFloatBtnDel.css({opacity:0,display:"block",left:pos.left-10,top:pos.top-10})
                            .stop().animate({opacity:1,left:pos.left+30,top:pos.top+29});
                        deptFloatBtnDel.addClass(disable2).unbind("click").click(function(){
                            if($(this).isDisabled())
                            {
                                return false;
                            }
                            if( toolbar.find("."+$.bf.config.selectedCls).length>0)
                            {
                                layer.confirm(L.cancelOperationConfirm,function(){
                                    $(".u-btn-cancel").trigger("click");
                                    layer.closeAll();
                                });
                            }
                            else
                            {
                                delDeptHandler($(a));
                            }
                        });
                    }
                    return false;
                });
                $(a).addClass("u-dept-tree-menu").hide();
                node.append(a);
                node.hover(function()
                    {
                        $(".u-dept-tree-menu").not("[show-btn=true]").hide();
                        $(a).css({opacity:0,display:"inline-block"}).stop().animate({opacity:1});

                    },
                    function()
                    {
                        if(!$(a).attr("show-btn"))
                        {
                            hideA();
                        }
                    }
                );
                $(a).hover(function(){return false;},function(){return false;});
            }

        },
        //自定义图标
        customIconHandler:function(v,data)
        {
            //普通组
            if(v.type == 0)
            {
                return "icon-dept-type0";
            }
            //继承组
            else if(v.type == 1)
            {
                return "icon-dept-type1";
            }
        }
    });

    var list=$("#u-ajax-table-container-user").ajaxTable({
        url:API.user.getUserList,
        rows:50,
        filterRowData:function(rowData)
        {
            if(rowData.loginname=="admin")
            {
                return false;
            }
            else
            {
                return rowData;
            }
        },
        columns:[
            {
                xtype:'checkbox',width:35
            },
            {
                dataIndex:'loginname',text:'登录账号',width:120,thCss:{/*textIndent:5*/},sort:'loginname',
                renderer:function(v,data)
                {
                    var icon=v=="admin"?"icon-user-type-admin":"icon-user-type";
                    if(!data.online)
                    {
                        icon +=" z-offline";
                    }
                    return "<i class='"+icon+"'></i>"+v;
                }
            },
            {
                dataIndex:'displayname',text:'用户名',width:120,sort:'displayname'
            },
            {
                dataIndex:'group',text:'隶属部门',renderer:function(v){
                if(!v||v=="_NoGroupUser_")return "未分组";
                v = v.replace(",_NoGroupUser_","").replace("_NoGroupUser_","");
                var div = document.createElement("div");
                var group = v.split(",");
                var suffix = group.length>1?"<i class='icon-user-dept-hover'></i>":"";
                var view = group[0]+suffix;
                $(div).attr({title:v}).html(view);
                return div;
                //return !v||v=="_NoGroupUser_"?"未分组":v;
            },
                width:120
            },
            {
                dataIndex:'RoleInfo',text:'用户角色',renderer:function(v)
            {
                if(v && v.RoleInfo)
                {
                    var str=[];
                    $.each(v.RoleInfo,function(k,v){
                        str.push(v.RoleName);
                    });
                    str= $.unique(str);
                    var div = document.createElement("div");
                    var suffix = str.length>1?"...":"";
                    var view = str[0]+suffix;
                    $(div).attr({title:str.join(",")}).text(view);
                    return div;
                }
            },
                width:120
            },
            {
                dataIndex:'deleted_status',text:'账号状态'/*,align:'center'*/,renderer:function(v)
            {
                return v==1?"停用":v==2?"删除":v==3?"停用,删除":"正常";
            },
                width:80,sort:'deleted_status'
            },
            {
                dataIndex:'online',text:'是否在线',renderer:function(v)
            {
                return v?"在线":"离线";
            },
                width:100/*,align:'center'*/,sort:'online'
            }
        ],
        idProperty:'guid',
        selMark:'',
        autoLoad:false,
        extraParams:{}
    });

    function linkListHandler()
    {

        $("#u-search-input").attr("value",null);
        delete list.extraParams.Key;
        var dept=deptTree.sels.join(",");
        list.extraParams.ParentGroupGuid=dept;
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
    deptTree.onSelectChange.add(linkList);

    //首次进入系统输入公司或集团名称
    function addDeptRoot(rData,obj,data){
        //u-input-dept-root
        if(data && data.rootEmpty)
        {
           // console.log($("#u-input-dept-root-input"));

            //输入集团名称或公司名称
            $.layer({
                type: 1,
                title: false,
                area: ['300px', '150px'],
                closeBtn: [0, false],
                shade: [0.3, '#000'],
                page: {
                    dom: '#u-input-dept-root'
                }
            });
            $("#u-input-dept-root-input").trigger("setcss");
            $("#u-input-dept-root-form").validate();
        }
    }
    $("#u-save-dept-root-btn").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var valid = $("#u-input-dept-root-form").validate();
        if(valid.form())
        {
            var groupName = $("#u-input-dept-root-input").val();
            var params = {
                GroupName:groupName,
                bShouldCreateDeletedUserGroup:1,
                ParentGroupGuid:'',
                GroupType:0,
                GroupDescript:''
            };
            $.fastAction(API.user.addRootDepartment,params,function(msg,res){
                if(res)
                {
                    location.reload();
                }
            });
        }
    });
    $("#u-input-dept-root-input").bind({
        keypress:function(e)
        {
            if(e.keyCode == "13")
            {
                $("#u-save-dept-root-btn").trigger("click");
            }
        }
    });
    deptTree.onFirstLoad.add(addDeptRoot);
    var listPageToolbar=$("#u-page-toolbar-user").pageToolbar({
        table:list
    });
    var contentContainer=$("#m-content-container-user");
    var toolbar=$("#u-main-toolbar-user");
    var formBtnPanel=contentContainer.find(".m-btn");
    function selectBtn(me,targetCls){
        toolbar.find("."+ $.bf.config.selectedCls).removeClass($.bf.config.selectedCls);
        contentContainer.find(".m-content-item").hide();
        me.addClass($.bf.config.selectedCls);
        contentContainer.find("."+targetCls).fadeIn();
        formBtnPanel.fadeIn();
    }
    function groupSubmitHandler(form,validator,isEdit)
    {
        if(validator.form())
        {
            $.bf.operationWaiting();
            $("#u-btn-ok-user").addClass("z-disabled");
            form.ajaxSubmit({
                type: 'post',
                url:isEdit?API.user.editDepartment:API.user.addDepartment,
                success:function(data)
                {
                    $("#u-btn-ok-user").removeClass("z-disabled");
                    $.bf.ajaxCommonCallback(data,function(da,res){
                        if(res)
                        {
                            contentContainer.find(".u-btn-cancel").trigger("click");
                            deptTree.load();
                            //list.reload();
                            //validator.resetForm();
                            /*contentContainer.find(".u-btn-cancel").trigger("click");
                             deptTree.load();
                             validator.resetForm();*/
                            //location.reload();
                        }
                    });
                },
                error:function(xhr,status,e){
                    $("#u-btn-ok-user").removeClass("z-disabled");
                    $.bf.ajaxErrorHandle(xhr,status,e);
                }
            });
        }
    }

    //添加部门界面的联动效果
    $("#u-select-search-user").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        $("#u-should-add-user").hide();
        $("#u-select-search-user-input").fadeIn();
        $(this).hide();
    });
    $("#u-user-dept-emp-more").click(function(){
        if($(this).isExpanded() || $(this).isDisabled())
        {
            return false;
        }
        $(this).addClass("z-expanded");
        var ajaxLoad = $("#u-dept-user-add-1")[0].ajaxLoad;
        ajaxLoad.params.ParentGroupGuid="";
        ajaxLoad.load();
    });
    $("#u-select-search-user-input").bind({
        keyup:function(){
            var val = $(this).val();
            var ajaxLoad = $("#u-dept-user-add-1")[0].ajaxLoad;
            ajaxLoad.params.Key=val;
            ajaxLoad.load();
        }
    });
    //添加部门的所属部门下拉框
    $("#AddGroupParentGroupGuid").ajaxTreeSelect({
        url:API.user.getDepartmentTree,
        selMark:'',
        dataRoot:'Group',
        selMode:"simple",
        itemClickSelect:false,
        showCheckbox:true,
        emptyNode:false
    });
    function addDeptHandler(me,node)
    {
        /*$("#add-user").addClass("z-disabled");*/
        $("#u-main-toolbar-user").find('a').each(function(){
            $(this).addClass("z-disabled");
        })

        $.bf.hideLoadRemark();
        var nData = node.data();
        var groupTypeData = [{
            id:0,
            text:'普通组'
        },{
            id:1,
            text:'继承组'
        }];
        if(nData.type==1)
        {
            groupTypeData=[{
                id:1,
                text:'继承组'
            }];
        }
        $("#group-type-add")[0].setTreeConfig("localData",groupTypeData);
        /*添加部门验证*/
        var form=$("#u-form-add-dept");
        var clear = form.clearForm();
        var validator=form.validate();
        validator.resetForm();
        $("#u-dept-user-add-2 option").remove();
        $("#u-select-search-user-input").hide();
        $("#u-should-add-user").show();
        $("#u-select-search-user").show();
        $("#u-user-dept-emp-more").removeClass("z-expanded");
        /*if(!deptTree.hasSelect())
         {
         layer.alert(L.pleaseSelectOneDepartment,0);
         return;
         }*/
        $("#u-dept-user-add-1").loadSelect({
            url:API.user.getUserList,
            dataRoot:'rows',
            filterRowData:function(rows){
                return $("#u-dept-user-add-2 option[value="+rows.guid+"]").length<=0?rows:false;
                //return false;
            },
            idProperty:'guid',
            textProperty:'displayname',
            params:{ParentTypeID:"",ParentGroupGuid:"_NoGroupUser_"}
        });
        $("#u-dept-user-add-1")[0].ajaxLoad.load();
        var prGuid=$("#AddGroupParentGroupGuid");
        var level;
        //var id=deptTree.getSelectIds().join(",");
        //var text=deptTree.getTextByIds(id).join(",");

        prGuid[0].setDefaultValue({text:nData.text,value:nData.id});

        //searchConditionList.setTreeConfig("localData",conditionData);
        //if(nData)
        /*function setPrGuid(me,input,data){
         var id=deptTree.getSelectIds().join(",");
         var text=deptTree.getTextByIds(id).join(",");
         node=deptTree.getSelectNodes();
         level=node.data("level");
         $(this).attr("value",text);
         $("[name=ParentGroupGuid]").val(id);
         }
         if(prGuid.isGenerated())
         {
         prGuid.trigger("onTreeAfterLoad")
         }
         else
         {
         prGuid.ajaxTreeSelect({
         url:API.user.getDepartmentTree,
         selMark:'',
         dataRoot:'Group',
         selMode:"simple"
         });
         prGuid.bind({
         onTreeAfterLoad:setPrGuid
         });
         }*/



        /*prGuid[0].tree.onSelectChange.add(function(id,node,obj){

         var l=node.data("level");
         var a=l==1?1:0;
         if(!node.isSelected())
         {
         a=0;
         }
         $("#bShouldCreateDeletedUserGroup").attr("value",a);
         });*/



        //$("#u-belong").attr("value",node.data("name"));
        selectBtn(me,"m-content-item-form-dept-add");

        $("#u-btn-ok-user").bind({click:function(){
            if($(this).isDisabled())
            {
                return false;
            }
            /*$("#u-dept-user-add-2 option").each(function(){
             $(this).attr("selected",true);
             });*/
            groupSubmitHandler(form,validator);
        }});
    }
    //添加部门按钮
    $("#add-dept").click(function(){
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
            addDeptHandler(me);
        }
    });

    function editDeptHandler(me,node)
    {
        $("#u-main-toolbar-user").find('a').each(function(){
            $(this).addClass("z-disabled");
        })
        var d=node.data();

        var groupTypeData = [{
            id:0,
            text:'普通组'
        },{
            id:1,
            text:'继承组'
        }];
        var selNode = deptTree.getNodeById(node.data("id"));
        var prNode = deptTree.getParentNode(selNode);
        if(prNode.length>0 && prNode.data("type")==1)
        {
            groupTypeData=[{
                id:1,
                text:'继承组'
            }];
        }
        $("#group-type-edit")[0].setTreeConfig("localData",groupTypeData);
        var data={
            Modify_Guid: d.id,
            GroupName: d.name,
            GroupDescript: d.descript,
            GroupType: d.type
        };
        var form=$("#u-form-edit-dept");
        var validator=form.validate();
        form.clearForm();
        validator.resetForm();
        form.autofill(data);
        selectBtn(me,"m-content-item-form-dept-edit");
        $("#u-btn-ok-user").bind({click:function(){
            if($(this).isDisabled())
            {
                return false;
            }
            groupSubmitHandler(form,validator,true);
        }});
    }
    $("#edit-dept").click(function(){
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
            editDeptHandler(me);
        }
    });

    function delDeptHandler(node)
    {
        layer.confirm(L.delDeptConfirm,function(){
            //拷贝选中的id
            //var ids= $.extend(true,[],deptTree.sels);
            //var n=deptTree.getSelectNodes();
            deptTree.deselect(node);
            $.fastAction(API.user.delDepartments,{guid: node.data("id")},function(data,res){
                if(res)
                {
                    //location.reload();

                    deptTree.load();
                    list.load();
                }
            });
        });
    }
    $("#del-dept").click(function(){
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
            delDeptHandler(me);
        }

    });

    $(".u-move-user-right").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var parent=$(this).parent();
        var prevSel=parent.prev().find("option:selected");
        var next=parent.next().find("select");
        next.append(prevSel);
    });
    $(".u-move-user-left").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var parent=$(this).parent();
        var prev=parent.prev().find("select");
        var nextSel=parent.next().find("option:selected");
        prev.append(nextSel);
    });
    /*用户管理-----添加用户*/
    $("#Adduser_ParentGuid").ajaxTreeSelect({
        url:API.user.getDepartmentTree,
        selMark:'',
        dataRoot:'Group',
        itemClickSelect:false,
        showCheckbox:true,
        emptyNode:false,
        selMode:'single'
    });
    $("#AddUserRole").ajaxTreeSelect({
        url:API.user.getRoleTree,
        idProperty:'RoleTypeID',
        textProperty:'TypeName',
        pidProperty:'ParentTypeID',
        selMode:'multiple',
        extraParams:{
            Condition:'{"RoleInfo":{"Condition":[[["and","HasApply","=","1"]]]}}'
        },
        emptyNode:{text:'无角色',value:''},
        //uniPrefix:'role_',
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
                        v.RoleTypeID= v.RoleID;
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
    function addUserHandler(me)
    {
        var form=$("#u-form-add-user");
        var validator=form.validate();
        form.clearForm();
        validator.resetForm();
        var prGuid=$("#Adduser_ParentGuid");
        function setPrGuid(){
            //var id=deptTree.getSelectIds().join(",");
            //var text=deptTree.getTextByIds(id).join(",");
            //$(this).attr("value",text);
            //$("[name=Adduser_ParentGuid]").val(id);
            var text="",id="";
            if(deptTree.hasSelect())
            {
                var n = deptTree.getSelectNodes();
                text = n.data("text");
                id = n.data("id");
            }
            prGuid[0].setDefaultValue({text:text,value:id});
        }

        setPrGuid();
        /*if(prGuid.isGenerated())
         {
         prGuid.trigger("onTreeAfterLoad")
         }
         else
         {
         prGuid.ajaxTreeSelect({
         url:API.user.getDepartmentTree,
         selMark:'',
         dataRoot:'Group',
         itemClickSelect:false,
         showCheckbox:true,
         emptyNode:false,
         selMode:'single'
         });
         prGuid.bind({
         onTreeAfterLoad:setPrGuid
         });
         }*/
        var addUserRole=$("#AddUserRole");

        addUserRole.bind({
            onTreeSelectChange:function(ds,input,node,obj){
                var json="";
                var val=input.val();
                var tmp={RoleID:val.split(",")};
                json= $.toJSON(tmp);
                $("#AddUserRoleJson").attr("value",json);
            }
        });
        //addUserRole[0].setDefaultValue({text:"",value:""});

        $("#u-btn-ok-user").bind({
            click:function(){
                if($(this).isDisabled())
                {
                    return false;
                }
                if(validator.valid()){
                    $.bf.formSubmitHandler(form,API.user.addUser,validator,function(data,res){
                        if(res)
                        {
                            contentContainer.find(".u-btn-cancel").trigger("click");
                            list.reload();
                        }
                    });
                }
            }
        });
        selectBtn(me,"m-content-item-form-user-add");
        /*if(deptTree.isSelectOne())
         {

         }
         else
         {
         layer.alert(L.pleaseSelectOneDepartment,0);
         }*/
    }
    $("#add-user").click(function(){
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
            addUserHandler(me);
        }
    });
    $("#u-fast-add-dept").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var params = {

        };
        $.fastAction(API.dept.addDepartment,params,function(res){
            if(res)
            {
                location.reload();
            }
        });
    });
    //编辑用户界面隶属组
    $("#edit-user-group").ajaxTreeSelect({
        url:API.user.getDepartmentTree,
        selMark:'',
        dataRoot:'Group',
        selMode:'multiple',
        itemClickSelect:false,
        showCheckbox:true,
        emptyNode:false
    });

    //编辑用户所属角色
    $("#EditUserRole").ajaxTreeSelect({
        url:API.user.getRoleTree,
        idProperty:'RoleTypeID',
        textProperty:'TypeName',
        pidProperty:'ParentTypeID',
        selMode:'multiple',
        extraParams:{
            Condition:'{"RoleInfo":{"Condition":[[["and","HasApply","=","1"]]]}}'
        },
        emptyNode:{text:'无角色',value:''},
        //uniPrefix:'role_',
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
                        return {
                            RoleTypeID:v.RoleID,TypeName: v.RoleName,isRole:true,checkable:true,leaf:true
                        };
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
    function editUserHandler(me)
    {
        if(list.isSelectOne())
        {
            $("#off-file").show();
            $("#u-users-edit-emp1").attr({readonly:false,maxlength:35,commonStr2:true});
            $("#edit-user-group").attr({required:true});
            var form=$("#u-form-edit-user");
            var validator=form.validate();
            form.clearForm();
            validator.resetForm();
            var prGuid=$("#edit-user-group");
            var node=list.getSelectNodes();
            var nData=node.data();
            var data={
                DisplayName:nData.displayname,
                guid:nData.guid,
                loginname:nData.loginname
            };

            function setPrGuid(){

                var a=nData.groupGuid.split(",");
                var ids=[];
                $.each(a,function(k,v){
                    var t= v.split("|");
                    ids.push(t[t.length-1]);
                });
                var group = nData.group.split(",");
                group = $.map(group,function(v,k){
                    if(v=="_NoGroupUser_")
                    {
                        ids.splice(k,1);
                    }
                    else
                    {
                        return v;
                    }
                });
                prGuid[0].setDefaultValue({text:group.join(","),value:ids.join(",")});
                //prGuid.attr("value",nData.group);
                //var groupGuid=nData.groupGuid.split("|");
                // $("[name='group']").attr("value",groupGuid[groupGuid.length-1]);
            }
            var editUserRole=$("#EditUserRole");

            editUserRole.bind({
                onTreeSelectChange:function(ds,input,node,obj){
                    var json="";
                    var val=input.val();
                    var tmp={RoleID:val.split(",")};
                    json= $.toJSON(tmp);
                    $("#EditUserRoleJson").attr("value",json);
                }
            });
            var dRoleIds=[],dRoleName=[];
            if(nData.RoleInfo && nData.RoleInfo.RoleInfo)
            {
                $.each(nData.RoleInfo.RoleInfo,function(k,v){
                    dRoleIds.push(v.RoleID);
                    dRoleName.push(v.RoleName);
                });
                editUserRole[0].setDefaultValue({text:dRoleName.join(","),value:dRoleIds.join(",")});
                /*editUserRole.attr("value",dRoleName.join(","));
                 editUserRole.next().attr("value",dRoleIds.join(","));*/
                var tmp={RoleID:dRoleIds};
                var editRoleJson= $.toJSON(tmp);
                $("#EditUserRoleJson").attr("value",editRoleJson);
            }
            form.autofill(data);
            setPrGuid();
            $("#u-btn-ok-user").bind({
                click:function(){
                    if($(this).isDisabled())
                    {
                        return false;
                    }
                    if(validator.valid()){
                        $.bf.formSubmitHandler(form,API.user.editUser,validator,function(data,res){
                            if(res)
                            {
                                contentContainer.find(".u-btn-cancel").trigger("click");
                                list.reload();
                            }
                        });
                    }
                }
            });
            selectBtn(me,"m-content-item-form-user-edit");
        }
        else if(list.hasSelect())
        {
            //$("#off-file").hide();
            $("#u-users-edit-emp1").attr({readonly:true,maxlength:null,commonStr2:null});
            $("#edit-user-group").attr({required:false});
            var form=$("#u-form-edit-user");
            var validator=form.validate();
            form.clearForm();
            validator.resetForm();
            var node=list.getSelectNodes();
            var displayname=[],guid=[],loginname=[];
            node.each(function(){
                var nData=$(this).data();
                displayname.push(nData.displayname);
                guid.push(nData.guid);
                loginname.push(nData.loginname);
            });

            var data={
                DisplayName:displayname,
                guid:guid,
                loginname:loginname
            };
            var prGuid=$("#edit-user-group");
            prGuid.ajaxTreeSelect({
                url:API.user.getDepartmentTree,
                selMark:'',
                dataRoot:'Group',
                selMode:'multiple',
                itemClickSelect:false,
                showCheckbox:true,
                emptyNode:false
            });
            var editUserRole=$("#EditUserRole");
            editUserRole.ajaxTreeSelect({
                url:API.user.getRoleTree,
                idProperty:'RoleTypeID',
                textProperty:'TypeName',
                pidProperty:'ParentTypeID',
                selMode:'multiple',
                extraParams:{
                    Condition:'{"RoleInfo":{"Condition":[[["and","HasApply","=","1"]]]}}'
                },
                emptyNode:{text:'无角色',value:''},
                //uniPrefix:'role_',
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
                                return {
                                    RoleTypeID:v.RoleID,TypeName: v.RoleName,isRole:true,checkable:true,leaf:true
                                };
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
            editUserRole.bind({
                onTreeSelectChange:function(ds,input,node,obj){
                    var json="";
                    var val=input.val();
                    var tmp={RoleID:val.split(",")};
                    json= $.toJSON(tmp);
                    $("#EditUserRoleJson").attr("value",json);
                }
            });

            //$("#EditUserRole")[0].setDefaultValue({text:'',value:''});
            // $("#edit-user-group")[0].setDefaultValue({text:'',value:''});
            //$("#EditUserRoleJson").attr("value","");
            form.autofill(data);
            selectBtn(me,"m-content-item-form-user-edit");
            $("#u-btn-ok-user").bind({
                click:function(){
                    if($(this).isDisabled())
                    {
                        return false;
                    }
                    if(validator.valid()){
                        $.bf.formSubmitHandler(form,API.user.editUser,validator,function(data,res){
                            if(res)
                            {
                                contentContainer.find(".u-btn-cancel").trigger("click");
                                list.reload();
                            }
                        });
                    }
                }
            });
        }
        else
        {
            layer.alert(L.pleaseSelectUsers,0);
        }
    }
    $("#edit-user").click(function(){
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
            editUserHandler(me);
        }
    });
    var editRight = LIMIT_CONTROLLER.EDIT;
    if(editRight)
    {
        list.onItemDblClick.add(function(node,obj){
            obj.deselectAll();
            obj.select(node);
            editUserHandler($("#edit-user"));
        });
    }
    function delUserHandler(me)
    {
        if(list.hasSelect())
        {
            layer.confirm(L.delUserConfirm,function(){
                var ids=list.getSelectIds();
                $.fastAction(API.user.delUsers,{Users: ids,IsDelUser:1,is_ajax:1,IsRestore:0},function(data,res){
                    if(res)
                    {
                        list.reload();
                    }
                });
            });
        }
        else
        {
            layer.alert(L.pleaseSelectUsers,0);
        }
    }
    $("#del-user").click(function(){
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
            delUserHandler(me);
        }
    });
    list.onSelectChange.add(function(id,node,obj){
        var ids=list.getSelectIds();
        var nodes= list.getSelectNodes();
        var count=0;
        if(nodes)
        {
            $.each(nodes,function(){
                if($(this).data("deleted_status"))
                {
                    count++;
                }
            });
        }
        if(!$("#frozen-user").isDisabled())
        {
            if(count == nodes.length && nodes.length>0)
            {
                $("#u-btn-txt-frozen-user").text(L.restore).prev().removeClass("icon-blocking").addClass("icon-apply");
            }
            else
            {
                $("#u-btn-txt-frozen-user").text(L.frozen).prev().removeClass("icon-apply").addClass("icon-blocking");
            }
        }

    });
    function frozenUserHandler(){
        if(list.hasSelect())
        {
            var ids=list.getSelectIds();
            var nodes= list.getSelectNodes();
            var hasNoFrozen = true;
            var a= 0,b=0;
            var count = 0;
            var title = L.frozenUserConfirm;
            $.each(nodes,function(){
                if($(this).data("deleted_status"))
                {
                    count++;
                }
            });
            if(count == nodes.length)
            {
                a = 3;
                b = 1;
                title = L.restoreUserConfirm;
            }
            layer.confirm(title,function(){

                $.fastAction(API.user.delUsers,{Users: ids,IsDelUser:a,IsRestore:b},function(data,res){
                    if(res)
                    {
                        list.reload();
                    }
                });
            });
        }
        else
        {
            layer.alert(L.pleaseSelectUsers,0);
        }
    }
    $("#frozen-user").click(function(){
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
            frozenUserHandler(me);
        }
    });
    function restoreUserHandler(){
        if(list.hasSelect())
        {
            layer.confirm(L.restoreUserConfirm,function(){
                var ids=list.getSelectIds();
                $.fastAction(API.user.delUsers,{Users: ids,IsDelUser:3,IsRestore:1},function(data,res){
                    if(res)
                    {
                        list.reload();
                    }
                });
            });
        }
        else
        {
            layer.alert(L.pleaseSelectUsers,0);
        }
    }
    $("#restore-user").click(function(){
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
            restoreUserHandler(me);
        }
    });
    //取消按钮
    contentContainer.find(".u-btn-cancel").bind({
        click:function(){
            if($(this).isDisabled())
            {
                return false;
            }
            toolbar.find("."+$.bf.config.selectedCls).removeClass($.bf.config.selectedCls);
            contentContainer.find(".m-content-item").hide();
            contentContainer.find(".m-content-item-list").fadeIn();
            formBtnPanel.fadeOut();
            $("#u-btn-ok-user").unbind();

            $("#u-main-toolbar-user").find('a').each(function(){
                $(this).removeClass("z-disabled");
            })
            layer.closeTips();
        }
    });
    function searchHandler()
    {
        var val=$("#u-search-input").val();
        list.extraParams.Key=val;
        /*list.onBeforeLoad.add(function(){
         list.extraParams.Key=val;
         });*/
        list.loadPage(1);
    }
    $("#u-search-input").unbind("keypress").bind({
        keypress:function(e){
            if(e.keyCode=="13")
            {
                searchHandler();
            }
        }
    });

    $("#u-search-icon").unbind("click").bind({
        click:function(){
            if($(this).isDisabled())
            {
                return false;
            }
            searchHandler();
        }
    });



    /*$("#u-belong").ajaxTreeSelect({
     url:API.user.getDepartmentTree,
     pidProperty:'id',
     textProperty:'name'
     });*/
    $("#u-import-user-group-btn").click(function(){
        $('#import').trigger("click");
    });
    /*导入*/
    var importWindow;
    $('#import').bind('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        importWindow = $.layer({
            type: 1,
            title: false,
            area: ['550px', '300px'],
            shade: [0.3, '#000'],
            move: '#import-box-title',
            page: {
                dom: '#upload-box'
            }
        });
        //$('.sel-group.import')[0].setDefaultValue({text:"",value:""});
        $("#upload-form").clearForm();
        $("#sel-file-import").attr("checked",true);
        $("#upload-view-btn").selectFileBtn({
            fileBtn:"#fileField"
        });
        $("#upload-box").find(".u-cancel-import").click(function(){
            layer.close(importWindow);
        });
    });

    $('.cancel-btn').click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        layer.closeAll();
    });

    $('#upload-view-btn').bind('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        $('#fileField').trigger("click");
    });

    $('#fileField').bind('change', function(){
        $('#import-file-name').attr("value",$(this).val()).blur();
    });

    $('#import-btn').bind('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if($('#import-file-name:visible').val() == ''){
            layer.alert(L.pleaseSelectFile, 4);
            return false;
        }
        var guid = $('#upload-box').find('.sel-group').next().val();
        if(guid == undefined){
            guid = '';
        }

        var options = {
            url: API.user.importUser,
            type: 'POST',
            dataType :'json',
            data: {'guid' : guid},
            timeout:10000000,
            success: function(result){
                if(result.ret){
                    $.bf.parseError(result);
                } else {
                    var res=result.Result || result.result;
                    var msg = L.operationSucceed+":<br/>"+L.succeed+':' + res.CreateUserCountSucc +" "+L.failed+':' + res.CreateUserCountFail + " "+L.conflict+':' + res.CreateUserCountConflit;
                    layer.alert(msg, 1, function(){
                        window.location.reload();
                    });
                }
                $.bf.hideLoadRemark();
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

    $('#domain-import').bind('change', function(){
        var obj = $(this).get(0);
        if(obj.checked == true){
            $('#sel-file-box').hide();
        } else {
            $('#sel-file-box').show();
        }
    });

    $('.sel-group').ajaxTreeSelect({
        url:API.user.getDepartmentTree,
        selMark:'',
        dataRoot:'Group',
        selMode:'simple',
        itemClickSelect:false,
        showCheckbox:true,
        treeContainerCss:{zIndex:100000000000}
    });


    /*导出*/
    $('#u-export-user').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        $('.sel-group.export')[0].setDefaultValue({text:"",value:""});
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
        $("#export-user-form").clearForm();
        // $('.sel-group')[0].tree.deselectAll();
    });
    var start = {
        elem: '#off-upload-file-time-start',
        format: 'YYYY/MM/DD hh:mm:ss',
        min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16 23:59:59', //最大日期
        istime: true,
        istoday: false,
        choose: function(datas){
            var date2=new Date(datas);
            date2.setMinutes(date2.getMinutes()+10);
            date2 = $.bf.date('yyyy/MM/dd hh:mm:ss',date2);
            end.min = date2; //开始日选好后，重置结束日的最小日期
            end.start = date2 //将结束日的初始值设定为开始日
            var date=new Date(datas);
            date.setMonth(date.getMonth()+1);
            date = $.bf.date('yyyy/MM/dd hh:mm:ss',date);
            end.max = date;
            var val=$(start.elem).blur().val();
            $(end.elem).attr("required",true);
            $('#u-time-long').attr("required",false).valid();
        }
    };
    laydate(start);
    var end = {
        elem: '#off-upload-file-time-end',
        format: 'YYYY/MM/DD hh:mm:ss',
        min: laydate.now(),
        max: '2099-06-16 23:59:59',
        istime: true,
        istoday: false,
        choose: function(datas){
            //start.max = datas; //结束日选好后，充值开始日的最大日期
            var val=$(end.elem).blur().val();
            $(start.elem).attr("required",true);
            $('#u-time-long').attr("required",false).valid();
        }
    };

    laydate(end);
    /*生成离线授权文件*/
    $('#off-file').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        $.layer({
            type: 1,
            title: false,
            area: ['580px', '300px'],
            shade: [0.3, '#000'],
            move: '#off-box-title',
            page: {
                dom: '#off-box'
            }
        });
        /*生成离线授权文件*/
        var form=$("#u-form-check-off-file");
        form.clearForm();
        var validator=form.validate();
        validator.resetForm();
    });

    $('#cancel-off-btn').click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var form=$("#u-form-check-off-file");
        var validator=form.validate();
        validator.resetForm();
        layer.closeAll();
    });

    $('#u-time-long').bind({
        change:function(){
            var val=$(this).val();
            if(!val)
            {
                $("#off-upload-file-time-start").attr("required",true);
                $("#off-upload-file-time-end").attr("required",true);
            }
            else
            {
                $("#off-upload-file-time-start").attr("required",false).valid();
                $("#off-upload-file-time-end").attr("required",false).valid();
            }
        }
    });
    $('#export-off-btn').bind('click',function(){
        if($(this).isDisabled())
        {
            return false;
        }
        /* 离线授权文件表单提交验证*/
        var form=$("#u-form-check-off-file");
        var validator=form.validate();
        if(validator.form())
        {
            var data={};
            data.timeStart = $('#off-upload-file-time-start').val();
            data.timeEnd = $('#off-upload-file-time-end').val();
            data.timeLong = $('#u-time-long').val();
            data.checkPwd = $('#check-off-file-psw').val();
            data.guid = $('#user-guid').val();
            data.loginname = $('#user-loginname').val();
            data.displayname = $('#u-users-edit-emp1').val();
            //var str = $.param(data);
            //window.open(API.user.generateOfflineFile+"?"+str);
            var fileType = data.displayname.split(",").length > 1 ? ".zip":".wow";
            var filename = data.displayname.split(",").length > 1 ? $.bf.date("离线授权(yyyy-MM-dd)")+fileType:data.displayname+"-离线授权文件"+$.bf.date("(yyyy-MM-dd)")+fileType;
            $.download(API.user.generateOfflineFile,data,filename,function(){
                layer.closeAll();
                validator.resetForm();
            }, L.onGenerateOfflineFile, L.generatedSucceed);
        }

    });
    /*导出*/
    $('#export-btn').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var guid = $('#export-box').find('.sel-group').next().val();
        if(guid == undefined){
            guid = '';
        }
        $.download(API.user.exportUser,{guid:guid},$.bf.date("组织机构(yyyy-MM-dd)")+".wsv",function(){
            layer.closeAll();
        });
    });
    $(".GroupType").ajaxTreeSelect({
        localData:[{
            id:0,
            text:'普通组'
        },{
            id:1,
            text:'继承组'
        }],
        idProperty:'id',
        textProperty:'text',
        autoLoad:false,
        itemWidth:false,
        emptyNode:false,
        height:'auto',
        selMode:'single',
        lastChildLevel:1/*,
         width:87,
         offsetX:2*/
    });

    /**
     * 搜索条件
     */
    //
    var searchConditionList = $("#u-search-condition")[0];
    var conditionData=[
        {text:'默认条件',value:0,checked:true},
        {text:'全部员工',value:3},
        {text:'停用员工',value:1},
        {text:'删除员工',value:2},
        {text:'在线员工',value:4},
        {text:'离线员工',value:5}
    ];
    var isAdmin = LIMIT_CONTROLLER.IS_ADMIN;
    if(!isAdmin)
    {
        conditionData.splice(3,1);
    }
    searchConditionList.tree.me.unbind("onSelectChange").bind("onSelectChange",function(me,id,node,obj){
        var val=parseInt(id);

        switch (val)
        {
            case 1:
                list.extraParams.ShowFrozen=-1;
                list.extraParams.ShowDeleted=0;
                list.extraParams.IsOnline=3;
                break;
            case 2:
                list.extraParams.ShowFrozen=0;
                list.extraParams.ShowDeleted=-1;
                list.extraParams.IsOnline=3;
                break;
            case 3:
                list.extraParams.ShowFrozen=1;
                list.extraParams.ShowDeleted=1;
                list.extraParams.IsOnline=3;
                deptTree.deselectAll();
                break;
            case 4:
                list.extraParams.ShowFrozen=false;
                list.extraParams.ShowDeleted=false;
                list.extraParams.IsOnline=1;
                break;
            case 5:
                list.extraParams.ShowFrozen=0;
                list.extraParams.ShowDeleted=0;
                list.extraParams.IsOnline=2;
                break;
            default:
                list.extraParams.ShowFrozen=0;
                list.extraParams.ShowDeleted=0;
                list.extraParams.IsOnline=3;
                break;
        }
        list.loadPage(1);
    });
    searchConditionList.setTreeConfig("localData",conditionData);
    searchConditionList.tree.load(true);

    $("#f-remark").mouseover(function(){
        layer.tips(L.addUserRemark,this,{
            style: ['background-color:#f1f1f1;color:#333;position:absolute;top:3px;left:100px;width:500px;'],
            maxWidth:800,
            closeBtn:[0,false],
            isGuide:true
        });
    }).mouseout(function(){
        layer.closeTips();
    });
    $(".u-panel-title").collapsePanel();

}
$(function(){
    user();
});

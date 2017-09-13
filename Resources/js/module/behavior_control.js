/**
 * Created by Administrator on 2014/12/22.
 */
var behaviorControl=function(){
    var menu=$("#menu-container-behavior-control").ajaxTree({
        url:API.behaviorControl.getMenu,
        selMark:'',
        icon:[],
        textProperty:'text',
        pidProperty:'id',
        dataRoot:'data',
        rootLocked:true
    });
    var listPanel = $(".u-list-panel");
    var formPanel = $(".u-form-panel");
    var listTable = $("#u-ajax-table-container-behavior-control");
    var list=listTable.ajaxTable({
        url:API.behaviorControl.getList,
        rows:50,
        columns:[
            {
                xtype:'checkbox',width:35
            },
            {
                dataIndex:'PolicyName',text:'策略名称',width:120
            }/*,
            {
                dataIndex:'PolicyFileMd5',text:'策略文件MD5值',width:220
            }*/,
            {
                dataIndex:'PolicyDescribe',text:'策略描述',width:200
            },
            {
                dataIndex:'RecordeTime',text:'创建时间',width:200,sort:"RecordeTime"
            }
        ],
        idProperty:'PolicyID',
        selMark:'',
        autoLoad:true,
        extraParams:{}
    });
    //左侧选择处理函数
    function leftMenuSelectHandler(id,node){
        filterTree.deselectAll();
        $("#add-behavior-control-td").show();
        $("#edit-behavior-control-td").addClass("f-margin-left1");
        $("#u-bind-behavior-control").show();
        $("#u-unbind-behavior-control").hide();
        if(listPanel.is(":hidden"))
        {
            list.setConfig("loadRemark",false);
        }
        list.setExtraParams({"type":id,"user":""});
        list.loadPage(1);
        list.setConfig("loadRemark",true);
    }
    //确认表单退出
    function confirmFormExit(yes,no){
        yes = yes || function(){};
        no = no || function(){};
        if(formPanel.is(":visible"))
        {
            var index = layer.confirm(L.cancelOperationConfirm,function(){
                yes();
                layer.close(index);
            },no);
        }
        else
        {
            yes();
        }
    }
    $("#menu-container-behavior-control").bind("onSelect",function(e,id,node){
        //list.load({"type":id});
        leftMenuSelectHandler(id,node);
        confirmFormExit(function(){
            listPanel.show();
            formPanel.hide();
        });
    });

    var listPageToolbar=$("#u-page-toolbar-behavior-control").pageToolbar({
        table:list
    });
    function initSearchFilter(){
        var searchConditionList = $("#u-search-condition")[0];
        var conditionData=[
            {text:'默认条件',value:0,checked:true}
        ];
        var tree = searchConditionList.getTree();
        tree.getMe().unbind("onSelectChange").bind("onSelectChange",function(me,id,node,obj){
            var val=parseInt(id);
            switch (val)
            {
                default:
                    list.setExtraParams({
                        filter:0
                    });
                    break;
            }
            list.loadPage(1);
        });
        searchConditionList.setTreeConfig("localData",conditionData);
        tree.load(true);
    }
    initSearchFilter();

    //==============toolbar（顶部工具按钮处理）===============

    //显示列表页
    function listPanelShow(){
        listPanel.show();
        formPanel.hide();
    }
    //显示表单页
    function formPanelShow()
    {
        listPanel.hide();
        formPanel.show();
    }
    //加载添加页面
    /*function showAddPage(){
        formPanelShow();
        formPanel.addClass("z-loading");
        formPanel.empty().load(API.behaviorControl.addPage, function () {
            formPanel.removeClass("z-loading");
            formPanel.find(".u-btn-cancel").click(function(){
                listPanelShow();
                //添加表单界面初始化函数在这里写
            });
        });
    }*/
    var chooseTypeWindow;
    $("#add-behavior-control").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        confirmFormExit(function(){
            var id = menu.getSelectId();
            if(id>=0)
            {
                showAddPage(id)
            }
            else{
                chooseTypeWindow = $.layer({
                    type: 1,
                    title: false,
                    area: ['460px', '265px'],
                    shade: [0.3, '#000'],
                    move:"#choose-window-title",
                    page: {
                        dom: '#choose-window-box'
                    }
                });
            }
        });
    });
    function showAddPage(type){
        formPanel.ajaxPanel({
            url:API.behaviorControl.addPage,
            params:{
                id:type
            },
            hidePanel:listPanel,
            success:function(me,oldPanel)
            {
                behaviorCommonFormHandler(me,type);
            },
            error: $.bf.ajaxCommonCallback
        });
    }
    $("#choosed-submit").click(function(){
        var type = $("[name=chooseTab]:checked").val();
        type = parseInt(type);
        layer.close(chooseTypeWindow);
        showAddPage(type);
        return false;
    });
    //基础权限控制页面处理
    function IOCtlFormHandler(id,form,me){
        //提交表单
        me.find(".u-btn-ok").click(function(){
            var valid = form.validate();
            var url = id?API.behaviorControl.edit:API.behaviorControl.add;
            if(valid.form())
            {
               $.bf.operationWaiting();
                form.ajaxSubmit({
                    url:url,
                    dataType:'json',
                    success:function(ret){
                        $.bf.ajaxCommonCallback(ret,function(res,suc){
                            if(suc)
                            {
                                me[0].bf.close();
                                list.reload();
                            }
                        });
                    },
                    error: $.bf.ajaxErrorHandle
                });
            }
        });
    }
    var ControlItemTpl = '<li class="f-fl f-ib ctl-item" data-index="{index}" title="{name}">' +
        '<a class="u-view-limit">' +
        '<i class="web-img web-img-msg" style="{style}"></i>' +
        '<p class="tab-content-control">{name}' +
        '<input type="hidden" class="val-name" name="{key}[{index}][WebPageName]" value="{name}"/>' +
        '<input type="hidden" class="val-url" name="{key}[{index}][WebPageAddr]" value="{url}"/>' +
        '<input type="hidden" class="val-icon" name="{key}[{index}][WebPageKey]" value="{icon}"/>' +
        '<em class="tab-icon-off"></em></p></a></li>';
    var IMControlItemTpl = '<li class="f-fl f-ib ctl-item" data-index="{index}" title="{name}">' +
        '<a class="u-view-limit">' +
        '<i class="web-img web-img-msg {icon}" ></i>' +
        '<p class="tab-content-control">{name}' +
        '<input type="hidden" class="val-name" name="{key}[{index}]" value="{name}"/>' +
        '<em class="tab-icon-off"></em></p></a></li>';
    function addWebItem(btn,name,url,key,img,icon){
        var style="";
        if(!img)
        {
            style = "";
            img = "";
        }
        else{
            style="background-image: url('"+img+"');";
        }
        if(!icon)
        {
            icon = "";
        }
        var prevItem = btn.prev();
        var index = prevItem.length>0?(parseInt(prevItem.attr("data-index"))+1):0;
        var add = ControlItemTpl.replace(/\{name\}/gi,name).replace(/\{url\}/gi,url).replace(/\{index\}/gi,index).replace(/\{key\}/gi,key).replace(/\{img\}/gi,img).replace(/\{icon\}/gi,icon).replace(/\{style\}/gi,style);
        btn.before(add);
        btn.prev().find(".tab-icon-off").click(function(){
            var pr = $(this).parents("li:first");
            pr.remove();
            // .remove();
        });
    }
    function addIMItem(btn,name,key,icon){

        if(!icon)
        {
            icon="";
        }
        var prevItem = btn.prev();
        var index = prevItem.length>0?(parseInt(prevItem.attr("data-index"))+1):0;
        var add = IMControlItemTpl.replace(/\{name\}/gi,name).replace(/\{index\}/gi,index).replace(/\{key\}/gi,key).replace(/\{icon\}/gi,icon);
        btn.before(add);
        btn.prev().find(".tab-icon-off").click(function(){
            var pr = $(this).parents("li:first");
            pr.remove();
            // .remove();
        });
    }
    //WEB权限控制页面
    function WEBCtlFormHandler(id,form,me){
        var addWindow;
        var container = $("#add-window-box");
        var winForm = container.find("form");
        var winFormValid = winForm.validate({
            rules:{
                name:{
                    required:true,
                    commonStr:true
                },
                url:{
                    required:true,
                    domain:true
                }
            }
        });
        $(".u-add-custom-item-btn").bind("click",function(){
            addWindow= $.layer({
                type: 1,
                title: false,
                area: ['460px', '290px'],
                shade: [0.3, '#000'],
                move: '#add-window-title',
                page: {
                    dom: '#add-window-box'
                }
            });
            winForm.clearForm();
            winFormValid.resetForm();
        });

        container.find(".cancel-btn").click(function(){
            layer.close(addWindow);
        });
        container.find(".submit-btn").click(function(){
            if(winFormValid.form())
            {
                //console.log("ssss");
                var name = winForm.find("[name=name]").val();
                var url = winForm.find("[name=url]").val();
                if(form.find("[value='"+url+"']").length>0)
                {
                    layer.alert("你输入的内容已经存在",0);
                    return;
                }
                var btn = $(".u-add-custom-item-btn");
                addWebItem(btn,name,url,"SelfDefKind");
                layer.close(addWindow);
            }
            return false;
        });

        //提交表单
        me.find(".u-btn-ok").click(function(){
            var valid = form.validate();
            var PolicyName = $("#PolicyName").val();
            var PolicyDescribe =$("#PolicyDescribe").val();
            if( PolicyName.length <1){
                $("#PolicyName").focus();
            }
            if(PolicyDescribe.length <1){
                $("#PolicyDescribe").focus();
            }
            if(PolicyName.length <1&&PolicyDescribe.length <1 ){
                $("#PolicyName").focus();
            }
            var url = id?API.behaviorControl.edit:API.behaviorControl.add;
            if(valid.form())
            {
                $.bf.operationWaiting();
                form.ajaxSubmit({
                    url:url,
                    dataType:'json',
                    success:function(ret){
                        $.bf.ajaxCommonCallback(ret,function(res,suc){
                            if(suc)
                            {
                                me[0].bf.close();
                                list.reload();
                            }
                        });
                    },
                    error: $.bf.ajaxErrorHandle
                });
            }
        });
        var chooseWindow;
        $(".u-add-item-btn").unbind("click").bind("click",function(){
            var addItemBtn = $(this);
            var key = addItemBtn.attr("data-key");
            chooseWindow = $.layer({
                type:1,
                title:false,
                area:['460px','290px'],
                move:'#choose-tab-title',
                page:{
                    dom:'#choose-tab-body'
                }
            });
            var type = addItemBtn.attr("data-id");
            var chooseBox = $("#choose-tab-body");
            var chooseBtn = chooseBox.find(".submit-btn");
            var cancelChooseBtn = chooseBox.find(".cancel-btn");
            var chooseDataBox = $("#add-item-from-database");
            var items = addItemBtn.parents("ul:first").find(".val-url");
            var sel = items.map(function(){
                return $(this).val()
            }).get().join(",");
            var params={type:type,sel:sel};
            $.bf.loadPage(chooseDataBox,API.behaviorControl.addWebItemPage,params,function(ret,suc){
                if(suc)
                {
                    //添加
                    chooseBtn.unbind("click").click(function(){
                        var choose = chooseDataBox.find("li.z-selected");
                        choose.each(function(){
                            var li = $(this);
                            addWebItem(addItemBtn,li.attr("data-name"),li.attr("data-url"),key,li.attr("data-img"),li.attr("data-icon"));
                        });
                        if(choose.length>0)
                        {
                            layer.close(chooseWindow);
                        }
                    });
                    cancelChooseBtn.unbind("click").click(function(){
                        layer.close(chooseWindow);
                    });
                    chooseDataBox.find("li").unbind("click").click(function(){
                        var li = $(this);
                        if(li.is(".z-selected"))
                        {
                            li.removeClass("z-selected");
                        }
                        else{
                            li.addClass("z-selected");
                        }
                    });
                }
                else
                {
                    layer.close(chooseWindow);
                }
            });
        });
        form.find("em.tab-icon-off").click(function(){
            $(this).parents("li:first").remove();
        });
    }

    /**
     * 即时通讯的界面逻辑
     * @param id
     * @param form
     * @param me
     * @constructor
     */
    function IMCtlFormHandler(id,form,me){
        var addWindow;
        var container = $("#add-window-box");
        var winForm = container.find("form");

        $(".u-add-item-btn").unbind("click").bind("click",function(){
            var btn = $(this);
            var type = btn.attr("data-id");
            var key = btn.attr("data-key");
            var icon = btn.attr("data-icon");
            addWindow= $.layer({
                type: 1,
                title: false,
                area: ['460px', '290px'],
                shade: [0.3, '#000'],
                move: '#add-window-title',
                page: {
                    dom: '#add-window-box'
                }
            });
            /*$("#u-select-file-btn-view").selectFileBtn({
                fileBtn:"#u-select-file-btn",
                input:"#u-select-file-content"
            });*/
            var winFormValid= winForm.validate({
                rules:{
                    name:{
                        required:true,
                        number:true,
                        commonAccount:true
                    }
                }
            });
            if(type=="qq")
            {
                winForm.find("[name=name]").rules("add",{number:true});
            }
            else{
                winForm.find("[name=name]").rules("remove","number");
            }
            if(type=="skype")
            {
                winForm.find("[name=name]").rules("add",{skypeAccount:true});
                winForm.find("[name=name]").rules("remove","commonAccount");
            }
            else{
                winForm.find("[name=name]").rules("remove","skypeAccount");
                winForm.find("[name=name]").rules("add","commonAccount");
            }
            winForm.clearForm();
            winFormValid.resetForm();
            var items = btn.parents("ul:first");
            container.find(".submit-btn").unbind("click").click(function(){
                if(winFormValid.form())
                {
                    //console.log("ssss");
                    var name = winForm.find("[name=name]").val();
                    if(items.find("[value='"+name+"']").length>0)
                    {
                        layer.alert("你输入的内容已经存在",0);
                        return;
                    }
                    addIMItem(btn,name,key,icon);
                    layer.close(addWindow);
                }
                return false;
            });
        });

        container.find(".cancel-btn").click(function(){
            layer.close(addWindow);
        });


        //提交表单
        me.find(".u-btn-ok").click(function(){
            var valid = form.validate();
            var url = id?API.behaviorControl.edit:API.behaviorControl.add;
            if(valid.form())
            {
                $.bf.operationWaiting();
                form.ajaxSubmit({
                    url:url,
                    dataType:'json',
                    success:function(ret){
                        $.bf.ajaxCommonCallback(ret,function(res,suc){
                            if(suc)
                            {
                                me[0].bf.close();
                                list.reload();
                            }
                        });
                    },
                    error: $.bf.ajaxErrorHandle
                });
            }
        });

        form.find("em.tab-icon-off").click(function(){
            $(this).parents("li:first").remove();
        });
    }
    //添加或编辑分流函数
    function behaviorCommonFormHandler(me,type,id){
        $(".m-tab-main").binfuTab();
        me.find(".u-btn-cancel").click(function(){
            me[0].bf.close();
        });
        var form = me.find("form:first");
        if(type==0)
        {
            IOCtlFormHandler(id,form,me);
        }
        else if(type==1)
        {
            IMCtlFormHandler(id,form,me);
        }
        else if(type==2)
        {
            WEBCtlFormHandler(id,form,me);
        }
    }
    //加载编辑页面
    function showEditPage(data)
    {
        var params = {id:data.PolicyID,type:data.PolicyType};
        /*formPanelShow();
        formPanel.addClass("z-loading");
        formPanel.empty().load(API.behaviorControl.editPage+"&"+ $.param(params), function () {
            formPanel.removeClass("z-loading");
            formPanel.find(".u-btn-cancel").click(function(){
                listPanelShow();
                //添加表单界面初始化函数在这里写
            });
        });*/
        formPanel.ajaxPanel({
            url:API.behaviorControl.editPage,
            params:params,
            hidePanel:listPanel,
            success:function(me,oldPanel)
            {
                behaviorCommonFormHandler(me,params.type,params.id);
            },
            error: $.bf.ajaxCommonCallback
        });
    }
    //编辑按钮
    $("#edit-behavior-control").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        confirmFormExit(function(){
            //判断是否选择一行
            if(!list.isSelectOne())
            {
                layer.alert(L.pleaseSelectOne,0);
                return false;
            }
            else
            {
                showEditPage(list.getSelectNodes().data());
            }
        });
    });
    if(LIMIT_CONTROLLER.EDIT)
    {
        //双击编辑
        listTable.bind("onItemDblClick",function(e,id,node){
            showEditPage(node.data());
        });
    }



    //删除按钮
    $("#del-behavior-control").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        confirmFormExit(function(){
            //判断是否选择一行
            if(!list.hasSelect())
            {
                layer.alert(L.pleaseSelectOneMore,0);
                return false;
            }
            else
            {
                layer.confirm(L.delConfirm,function(){
                    var sel = list.getSelectNodes();
                    var data=[];
                    sel.each(function(){
                        var v= $(this).data();
                        data.push(v.PolicyType+"|"+ v.PolicyID);
                    });
                    var id = data.join(",");
                    $.fastAction(API.behaviorControl.del,{id:id},function(ret,suc){
                        if(suc)
                        {
                            list.reload();
                        }
                    });
                });
            }
        });

    });
    //导出界面
    $("#u-export-behavior-control").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
    });
    //==============toolbar（顶部工具按钮处理）===============
    $("#tab-icon-off").click(function(){
        alert("wewe");
    });

    $(".cancel-btn").click(function(){
        layer.closeAll();
    });

  //=============搜索框
    function searchHandler()
    {
        var val=$("#u-search-input").val();
        list.extraParams.Keyword=val;
        list.reload();
    }
    $("#u-search-input").unbind("keypress").bind({
        keypress:function(e){
            if(e.keyCode == "13")
            {
                searchHandler();
            }
        }
    });
    $("#u-search-icon").unbind("click").bind({
        click:function(){
            searchHandler();
        }
    });
    var bindPanel = $("#u-bind-panel");
    bindPanel.collapseFloatPanel({
        enableSwitchBtn:false
    });
    var filterPanel = $("#u-filter-panel");
    filterPanel.collapseFloatPanel();

    $("#u-bind-behavior-control").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        confirmFormExit(function(){
            if(!list.hasSelect()){
                layer.alert(L.pleaseSelectOneMore,0);
                return false;
            }
            var sels = list.getSelectNodes();
            var checked={};
            $.each(sels,function(){
                var d =$(this).data();
                if(typeof(checked[d.PolicyType])=="number")
                {
                    checked[d.PolicyType]++;
                }
                else
                {
                    checked[d.PolicyType]=1;
                }
            });
            var pass=true;
            $.each(checked,function(k,v){
                if(v>1)
                {
                    pass=false;
                    return false;
                }
            });
            if(!pass)
            {
                layer.alert(L.theSameTypeCanOnlyChooseOne,0);
                return false;
            }
            bindTree.deselectAll();
            bindPanel[0].bf.expand();
        });

    });
    $("#u-submit-bind").click(function(){
        if(!bindTree.hasSelect()){
            layer.alert(L.pleaseSelectOneMore,0);
            return false;
        }
        var user = bindTree.getSelectIds();
        var sels = list.getSelectNodes();
        var policy=[];
        $.each(sels,function(k,v){
            var d=$(this).data();
            policy.push(d.PolicyType+"|"+ d.PolicyID);
        });
        var data={
            user:user.join(","),
            policy:policy.join(",")
        };
        $.fastAction(API.behaviorControl.bindUserOrGroupPolicy,data,function(ret,suc){
            if(suc)
            {
                list.deselectAll();
                bindPanel[0].bf.collapse();
            }
        });
    });
    $("body").delegate(".xubox_main","mousedown",function(e){
        e.stopPropagation();
    });
    $("#u-cancel-bind").click(function(){
        bindPanel[0].bf.collapse();
    });
    var bindTree = $("#u-bind-tree").ajaxTree({
        url:API.behaviorControl.getUserTree,
        selMark:'',
        textProperty:'name',
        pidProperty:'id',
        dataRoot:'Group',
        baseCls:'u-ajax-tree-float',
        skinCls:'s-ajax-tree-float',
        itemCls:'u-ajax-tree-item-float',
        icon:[],
        extraParams:{include_onceUser:1},
        showCheckbox:true,
        itemClickSelect:false,
        showIcon:true,
        rootLocked:false,
        selMode:'multiple',
        itemWidth:180,
        parseData:function(data){
            var rdData=[];
            if(data.User)
            {
                $.each(data.User,function(k,v){
                    v.icon="icon-user-15";
                    v.leaf=true;
                    rdData.push(v);
                });
            }
            if(data.Group)
            {
                $.each(data.Group,function(k,v){
                    v.icon="icon-group-15";
                    rdData.push(v);
                });
            }
            if(rdData.length>0)
            {
                return rdData;
            }
        }
    });
    var filterTree = $("#u-filter-tree").ajaxTree({
        url:API.behaviorControl.getUserTree,
        selMark:'',
        textProperty:'name',
        pidProperty:'id',
        dataRoot:'Group',
        baseCls:'u-ajax-tree-float',
        skinCls:'s-ajax-tree-float',
        itemCls:'u-ajax-tree-item-float',
        icon:[],
        extraParams:{include_onceUser:1},
        showCheckbox:false,
        itemClickSelect:true,
        showIcon:true,
        rootLocked:false,
        selMode:'single',
        itemWidth:180,
        parseData:function(data){
            var rdData=[];
            if(data.User)
            {
                $.each(data.User,function(k,v){
                    v.icon="icon-user-15";
                    v.leaf=true;
                    rdData.push(v);
                });
            }
            if(data.Group)
            {
                $.each(data.Group,function(k,v){
                    v.icon="icon-group-15";
                    rdData.push(v);
                });
            }
            if(rdData.length>0)
            {
                return rdData;
            }
        }
    });
/*    $("#u-filter-tree").bind("onSelect",function(e,id,node){
        //list.load({"type":id});

        confirmFormExit(function(){
            listPanel.show();
            formPanel.hide();
        });
    });*/

    function RightTreeSelectHandler(id,node){
        menu.deselectAll();
        $("#add-behavior-control-td").removeClass("f-margin-left1").hide();
        $("#edit-behavior-control-td").removeClass("f-margin-left1");
        $("#u-bind-behavior-control").hide();
        $("#u-unbind-behavior-control").css("display","inline-block");
        list.setExtraParams({
            user:id
        });
        list.loadPage(1);
    }
    //确认表单退出
    $("#u-filter-tree").bind("onSelect",function(e,id,node){
        //list.load({"type":id});

        confirmFormExit(function(){
            listPanel.show();
            formPanel.hide();
            RightTreeSelectHandler(id,node);
        });
    });


   /* $("#u-filter-tree").bind({
        onSelect:function(e,id,node){

            menu.deselectAll();

            $("#add-behavior-control-td").removeClass("f-margin-left1").hide();
            $("#edit-behavior-control-td").removeClass("f-margin-left1");
            $("#u-bind-behavior-control").hide();
            $("#u-unbind-behavior-control").show();
            list.setExtraParams({
                user:id
            });
            list.loadPage(1);

        }
    });*/
    $("#u-unbind-behavior-control").click(function () {
        if($(this).isDisabled())
        {
            return false;
        }
        //判断是否选择一行
        if(!list.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMore,0);
            return false;
        }
        else
        {
            layer.confirm(L.cancelConfirm,function(){
                var sel = list.getSelectNodes();
                var data=[];
                sel.each(function(){
                    var v= $(this).data();
                    data.push(v.PolicyType+"|"+ v.PolicyID);
                });
                var id = data.join(",");
                var user = filterTree.getSelectId();
                $.fastAction(API.behaviorControl.unbindUserOrGroupPolicy,{id:id,user:user},function(ret,suc){
                    if(suc)
                    {
                        list.reload();
                    }
                });
            });
        }
    });

   /* $(".m-panel-title").collapsePanel();*/
};

$(function(){
    behaviorControl();
});
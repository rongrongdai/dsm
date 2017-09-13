function strategy(){
    var contentContainer=$("#m-content-container-strategy");
    var toolbar=$("#u-main-toolbar-strategy");
    var formBtnPanel=contentContainer.find(".m-btn");
    var formPanel = $(".u-form-panel");
    var listPanel =$(".m-content-item-list");
    var strategyGroup=$("#menu-container-strategy").ajaxTree({
        url:API.strategy.getStrategyGroupTree,
        textProperty:'text',
        pidProperty:'id',
        icon:['icon-strategy-lv1','icon-strategy-lv2','icon-strategy-lv3'],
        dataRoot:'result',
        rootLocked:false,
        lastChildLevel:2,
        selMark:'',
        enableFloatMenu:false,
        floatMenu:[{icon:"u-users-tree-add",handler:function(data,node,tree){
               //console.log(data.id);
            formPanel.ajaxPanel({
                url:API.strategy.addGroupPage,
                params:{pid:data.id},
                hidePanel:".m-content-item:visible,.m-btn",
                success:function(me,oldPanel)
                {
                    me.find(".u-panel-title").collapsePanel();
                    me.find(".u-btn-cancel").click(function(){
                        me[0].bf.close();
                    });
                },
                error: $.ajaxCommonCallback
            });
        }},{icon:"u-users-tree-edit",handler:function(data,node,tree){
            //console.log(data.id);
            formPanel.ajaxPanel({
                url:API.strategy.editGroupPage,
                params:{id:data.id},
                hidePanel:".m-content-item:visible",
                success:function(me,oldPanel)
                {
                    me.find(".u-panel-title").collapsePanel();
                    me.find(".u-btn-cancel").click(function(){
                        me[0].bf.close();
                    });
                },
                error: $.ajaxCommonCallback
            });
        }},{
            icon:"u-users-tree-del",handler:function(){
                layer.alert("delete",0);
            }
        }]
    });
    //自动显示列表行里面的排序按钮
    function autoShowRowBtn(){
        $.each(arguments,function(k,n){
            n.find(".u-row-btn").hide();
            var t = n.parent().children().size();
            if(n.index()>0)
            {
                n.find(".icon-row-up,.icon-row-top").show();
            }
            if(n.index()<(t-1))
            {
                n.find(".icon-row-down").show();
            }
        });
    }
    //自动显示排序工具栏
    function autoShowOrderToolbar()
    {
        var itemCls = list.getConfig("itemCls");
        var items = list.me.find("."+itemCls).map(function(k,v){
            var rowIndex = $(v).attr("row-index");
            if(rowIndex != k)
            {
                return v;
            }
        }).get();
        //console.log();
        if(items.length>0)
        {
            $("#u-order-toolbar").show();
        }
        else
        {
            $("#u-order-toolbar").hide();
        }
        return items;
    }
    //上移行效果
    function rowUpBtnAction(n)
    {
        //console.log(rowIndex);
        var pr = n.parents("tr:first");
        var prPrev = pr.prev();
        prPrev.before(pr);
        //pr.remove();
        //console.log(pr);
        autoShowRowBtn(pr,prPrev);
        list.deselect(prPrev,false);
        list.select(pr,false);
    }
    //上移排序按钮处理函数
    function rowUpBtnHandler()
    {
        var me=$(this);
        //rowUpBtnAction(me);
        //autoShowOrderToolbar();
        var pr = me.parents("tr:first");
        var prPrev = pr.prev();
        var group = strategyDept.getSelectNodes().data(strategyDept.getConfig("idProperty"));
        var idProperty = list.getConfig("idProperty");
        var src,target;
        var prData = pr.data();
        src = prData[idProperty];
        if(prPrev.length<=0)
        {
            target = prData['prev'][idProperty];
        }
        else
        {
            target = prPrev.data(idProperty);
        }
        var params={
            group:group,
            src:src,
            target:target
        };
        list.select(pr);
        $.fastAction(API.strategy.changeGroupStrategyOrder,params,function(msg,res){
            if(res)
            {
                if(prPrev.length<=0)
                {
                    list.loadPrev();
                }
                else
                {
                    list.reload();
                }
                list.select(pr);
            }
        },'', L.savingOrder);
    }
    //下移行效果
    function rowDownBtnAction(me)
    {
        var pr = me.parents("tr:first");
        var prNext = pr.next();
        prNext.after(pr);
        autoShowRowBtn(pr,prNext);
    }
    //下移排序按钮处理函数
    function rowDownBtnHandler()
    {
        var me=$(this);
        //rowDownBtnAction(me);
        //autoShowOrderToolbar();
        var pr = me.parents("tr:first");
        var prNext = pr.next();
        var group = strategyDept.getSelectNodes().data(strategyDept.getConfig("idProperty"));
        var idProperty = list.getConfig("idProperty");
        var src,target;
        var prData = pr.data();
        src = prData[idProperty];
        if(prNext.length<=0)
        {
            target = prData['next'][idProperty];
        }
        else
        {
            target = prNext.data(idProperty);
        }
        var params={
            group:group,
            src:src,
            target:target
        };
        list.select(pr);
        $.fastAction(API.strategy.changeGroupStrategyOrder,params,function(msg,res){
            if(res)
            {
                if(prNext.length<=0)
                {
                    list.loadNext();
                }
                else
                {
                    list.reload();
                }
                list.select(pr);
            }
        },'', L.savingOrder);
    }
    //置顶效果
    function rowTopBtnAction(me)
    {
        var pr = me.parents("tr:first");
        var first = pr.prevAll("tr:last");
        first.before(pr);
        autoShowRowBtn(pr,first);
    }
    //置顶排序按钮处理函数
    function rowTopBtnHandler()
    {
        var me=$(this);
        //rowTopBtnAction(me);
        var pr = me.parents("tr:first");
        var group = strategyDept.getSelectNodes().data(strategyDept.getConfig("idProperty"));
        var idProperty = list.getConfig("idProperty");
        var id = pr.data(idProperty);
        var params={
            group:group,
            id:id
        };
        list.select(pr);
        $.fastAction(API.strategy.groupStrategyToTop,params,function(msg,res){
            if(res)
            {
                list.loadPage(1);
                list.select(pr);
            }
        },'', L.savingOrder);
    }
    function rowBottomBtnHandler()
    {
        var me=$(this);
        //rowTopBtnAction(me);
        var pr = me.parents("tr:first");
        var group = strategyDept.getSelectNodes().data(strategyDept.getConfig("idProperty"));
        var idProperty = list.getConfig("idProperty");
        var id = pr.data(idProperty);
        var params={
            group:group,
            id:id
        };
        list.select(pr);
        $.fastAction(API.strategy.groupStrategyToBottom,params,function(msg,res){
            if(res)
            {
                list.loadLast();
                list.select(pr);
            }
        },'', L.savingOrder);
    }
    var list=$("#u-ajax-table-container-strategy").ajaxTable({
        url:API.strategy.getStrategyList,
        rows:500,
        parseData:function(data)
        {
            if($.isArray(data.rows))
            {
                return data.rows;
            }
            else
            {
                return [data.rows];
            }
        },
        columns:[
            {
                xtype:'checkbox',width:35
            },
            {
                text:'策略名称',
                dataIndex:'text',
                width:130,
                sort:'text'
            },
            {
                dataIndex:'common1',
                text:'受控进程',
                width:130,
                renderer:function(v,data)
                {
                    var rec=v;
                    if(data.data && data.data.common)
                    {
                        rec = data.data.common;
                    }
                    if(rec)
                    {
                        var file= rec.Process||[];
                        /*var view= str;
                         var s=document.createElement("span");
                         $(s).attr("title",str).text(view);
                         return s;*/
                        var div = document.createElement("div");
                        var suffix = file.length>1?"...":"";
                        var view = file[0]+suffix;
                        $(div).attr({title:file.join(",")}).text(view);
                        return div;
                    }
                }
            },
            {
                dataIndex:'common2',
                text:'受控文件',
                width:130,
                renderer:function(v,data)
                {
                    var rec=v;
                    if(data.data && data.data.common)
                    {
                        rec = data.data.common;
                    }
                    if(rec)
                    {
                        var file= rec.file||[];
                        var div = document.createElement("div");
                        var suffix = file.length>1?"...":"";
                        var view = file[0]+suffix;
                        $(div).attr({title:file.join(",")}).text(view);
                        return div;
                        /*var str = file.join(",");
                         var view= str;
                         var s=document.createElement("span");
                         $(s).attr("title",str).text(view);
                         return s;*/
                    }
                }
            }/*,
             {
             dataIndex:'common1',
             text:'状态',
             width:80
             }*/,
            {
                dataIndex:'exception',
                text:'例外控制',
                width:65,
                /*align:'center',*/
                renderer:function(v,data)
                {
                    var rec=false;
                    if(data.data && data.data.exception)
                    {
                        var exception = data.data.exception;
                        //以下只要有一项数据存在说明有例外控制
                        if(
                            exception.bDecryptWhenRead>0 ||
                                exception.bDecryptWhenWriteAndOverwrite>0 ||
                                exception.bEncryptWhenCreateAndOverwrite>0 ||
                                exception.bEncryptWhenEdit>0 ||
                                exception.bPassthrough>0 ||
                                exception.bRejectAllOperation>0 ||
                                exception.bRejectEdit>0 ||
                                exception.comment.length>0 ||
                                (exception.Process && exception.Process.length>0) ||
                                (exception.file && exception.file.length)>0
                            )
                        {
                            rec = true;
                        }
                    }
                    return rec ?"有":"无";
                }
            },
            {
                dataIndex:'common',
                text:'备注',
                width:130,
                renderer:function(v,data)
                {
                    var rec=v;
                    if(data.data && data.data.common)
                    {
                        rec = data.data.common;
                    }
                    if(rec)
                    {
                        var str= rec.comment||'';
                        var view= $.strLimit(str,20);
                        var s=document.createElement("span");
                        $(s).attr("title",str).text(view);
                        return s;
                    }
                }
            },
            {
                dataIndex:'_operation',
                text:'操作',
                width:80,
                hide:true,
                /*align:'center',*/
                renderer:function(v,rowData,allData,rowIndex,colIndex,itemDom,rowDom,obj)
                {

                    var div = document.createElement("div");
                    //console.log(obj.total);
                    if(obj.total>0)
                    {
                        var up = document.createElement("div");
                        $(up).addClass("u-row-btn icon-row-up u-row-up").data(rowData).attr({"data-row-index":rowIndex,"title": L.moveUp}).bind({
                            click:rowUpBtnHandler
                        }).css("display","inline-block").hide();
                        $(div).append(up);
                        var down = document.createElement("div");
                        $(down).addClass("u-row-btn icon-row-down u-row-down").data(rowData).attr({"data-row-index":rowIndex,"title": L.moveDown}).css("display","inline-block").hide().bind({
                            click:rowDownBtnHandler
                        });
                        $(div).append(down);
                        var top = document.createElement("div");
                        $(top).addClass("u-row-btn icon-row-top u-row-top").data(rowData).attr({"data-row-index":rowIndex,"title": L.moveTop}).css("display","inline-block").hide().bind({
                            click:rowTopBtnHandler
                        });
                        $(div).append(top);
                        var bottom = document.createElement("div");
                        $(bottom).addClass("u-row-btn icon-row-bottom u-row-bottom").data(rowData).attr({"data-row-index":rowIndex,"title": L.moveBottom}).css("display","inline-block").hide().bind({
                            click:rowBottomBtnHandler
                        });
                        $(div).append(bottom);
                        if(!rowData['isFirst'])
                        {
                            $(top).add(up).show();
                        }
                        if(!rowData['isLast'])
                        {
                            $(down).add(bottom).show();
                        }
                        $(div).hide().bind({
                            click:function(){
                                return false;
                            }
                        });
                        rowDom.hover(function(){
                            $(div).show();
                        },function(){
                            $(div).hide();
                        });
                    }
                    return div;
                }
            }
        ],
        idProperty:'id',
        autoLoad:false,
        selMark:'',
        extraParams:{
            mode:'template'
        }
    });
    var listPageToolbar=$("#u-page-toolbar-strategy").pageToolbar({
        table:list
    });
    $("#u-copy-to").addClass("z-disabled");
    /*if(!$.hash("strategySels"))
     {
     strategyGroup.sels=["通用策略=>系统预置"];
     $.bf.setHashValue("strategySels","通用策略=>系统预置");
     }*/
    function linkListHandler(){
        list.deselectAll();
        //恢复默认模板模式
        list.extraParams.mode = "template";
        delete list.extraParams.guid;
        hideDeptFloatBox();
        hideApplyFloatBox();
        //$("#u-apply-strategy").add("#add-strategy").removeClass("z-disabled");
        //避免去除没有权限的按钮的禁用状态
        $("#u-issued-strategy,#add-strategy,#u-import-strategy,#exportStrategy").filter(".z-has-change").removeClass("z-disabled");
        $("#u-copy-to").addClass("z-disabled");
        strategyDept.deselectAll(true);
        $("#u-search-input").attr("value","");
        delete list.extraParams.Keyword;
        if(list.me.is(":hidden"))
        {
            list.loadRemark=false;
        }
        var sg=strategyGroup.sels.join(",");
        //sg = sg || "系统预置";
        list.extraParams.id=sg;
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
    strategyGroup.onSelectChange.add(linkList);
    //strategyGroup.onFirstLoad.add(linkList);
    function selectBtn(me,targetCls){
        toolbar.find("."+ $.bf.config.selectedCls).removeClass($.bf.config.selectedCls);
        contentContainer.find(".m-content-item").hide();
        me.addClass($.bf.config.selectedCls);
        contentContainer.find("."+targetCls).fadeIn();
        formBtnPanel.fadeIn();
        //重置禁用面板的
        $("#u-strategy-adv-set")[0].disablePanel.resetPos();
    }
    //复制角色框
    var _copyStrategy = $("#u-copy-strategy");
    _copyStrategy.ajaxTreeSelect({
        url:API.strategy.getStrategyGroupTree,
        textProperty:'text',
        pidProperty:'id',
        dataRoot:'result',
        lastChildLevel:3,
        selMode:'simple',
        itemClickSelect:false,
        showCheckbox:false,
        emptyNode:false,
        autoLoad:false,
        parseData:function(data){
            if(data.result)
            {
                $.map(data.result,function(v){
                    if(v.id.split("=>").length >2)
                    {
                        v.checkable = true;
                    }
                    return v;
                });
                return data.result;
            }
            else
            {
                return [];
            }
        }
    });
    function selectCopyHandler(id,node,obj)
    {
        if(node && node.isSelected())
        {
            var nData = $.extend(true,{},node.data());
            delete nData.data.name;
            autoFillStrategy($("#u-form-add-strategy"),nData);
        }
        else
        {
            autoFillStrategy();
        }
    }
    _copyStrategy[0].tree.onSelectChange.add(selectCopyHandler);
    //角色归属框
    var _belongBox=$("#u-belong-strategy");
    _belongBox.ajaxTreeSelect({
        url:API.strategy.getStrategyGroupTree,
        textProperty:'text',
        pidProperty:'id',
        dataRoot:'result',
        lastChildLevel:2,
        selMode:'simple',
        itemClickSelect:false,
        showCheckbox:true,
        autoLoad:false,
        filterRowData:function(v)
        {
            if(v.isSystem)
            {
                return false;
            }
            else
            {
                return v;
            }
        }
    });
    function autoSetRequiredArea(id){
        var ids = id?id.split('=>'):[];
        if(ids.length<2)
        {
            $("#u-strategy-adv-set").find("[required]").each(function(){
                $(this).attr({"needrequired":true,"required":null}).blur();
            });
            _copyStrategy.parents("li").hide();
            _copyStrategy[0].setEmpty();
        }
        else
        {
            //console.log("sss");
            $("#u-strategy-adv-set").find("[needrequired]").each(function(){
                $(this).attr({"needrequired":true,"required":true}).blur();
            });
            _copyStrategy.parents("li").show();

        }
        $("#u-form-add-strategy").validate().resetForm();
    }
    _belongBox[0].tree.onSelectChange.add(function(id,node,obj){
        var me = _belongBox;
        var disablePanel = $("#u-strategy-adv-set")[0].disablePanel;
        autoSetRequiredArea(id);
        var ids = id?id.split('=>'):[];

        if(ids.length>=2)
        {
            $("#u-strategy-name").attr({"name":"AddPolicyDetail_name","latinletter":true}).blur();
            me.next().attr("name",null);
            $("#Detail_AddPolicySoftwareGroup").attr("name","Detail_AddPolicySoftwareGroup").attr("value",ids[1]);
            $("#Detail_AddPolicyGroupName").attr("name","Detail_AddPolicyGroupName").attr("value",ids[0]);
            disablePanel.hide();
            //_copyStrategy.parents("li").show();
        }
        else if(ids.length==1)
        {
            $("#u-strategy-name").attr({"name":"AddPolicySoftwareGroup"/*,"latinletter":null*/}).blur();
            me.next().attr("name",'AddPolicyGroupName');
            $("#Detail_AddPolicySoftwareGroup").attr({"value":null,"name":null});
            $("#Detail_AddPolicyGroupName").attr({"":null,"name":null});
            disablePanel.show();
            //_copyStrategy.parents("li").hide();
            //_copyStrategy[0].setEmpty();
            //autoFillStrategy();
        }
        else
        {
            $("#u-strategy-name").attr({"name":"AddPolicyGroupName"/*,"latinletter":null*/}).blur();
            me.next().attr("name",null);
            $("#Detail_AddPolicySoftwareGroup").attr({"value":null,"name":null});
            $("#Detail_AddPolicyGroupName").attr({"":null,"name":null});
            disablePanel.show();
        }
        /*if(node && node.isSelected(obj.getConfig("selectedCls")))
         {
         var ids = id?id.split('=>'):[];

         if(ids.length>=2)
         {
         $("#u-strategy-name").attr({"name":"AddPolicyDetail_name","latinletter":true}).blur();
         me.next().attr("name",null);
         $("#Detail_AddPolicySoftwareGroup").attr("name","Detail_AddPolicySoftwareGroup").attr("value",ids[1]);
         $("#Detail_AddPolicyGroupName").attr("name","Detail_AddPolicyGroupName").attr("value",ids[0]);
         disablePanel.hide();
         //_copyStrategy.parents("li").show();
         }
         else if(ids.length==1)
         {
         $("#u-strategy-name").attr({"name":"AddPolicySoftwareGroup","latinletter":null}).blur();
         me.next().attr("name",'AddPolicyGroupName');
         $("#Detail_AddPolicySoftwareGroup").attr({"value":null,"name":null});
         $("#Detail_AddPolicyGroupName").attr({"":null,"name":null});
         disablePanel.show();
         //_copyStrategy.parents("li").hide();
         //_copyStrategy[0].setEmpty();
         //autoFillStrategy();
         }
         }
         else
         {
         $("#u-strategy-name").attr({"name":"AddPolicyGroupName","latinletter":null}).blur();
         me.next().attr("name",null);
         $("#Detail_AddPolicySoftwareGroup").attr({"value":null,"name":null});
         $("#Detail_AddPolicyGroupName").attr({"":null,"name":null});
         disablePanel.show();
         //_copyStrategy.parents("li").hide();
         //_copyStrategy[0].setEmpty();
         }*/
    });
    /**
     *  添加策略
     */
    function addStrategyHandler(me,btnCls,isCopySystem)
    {
        var disablePanel = $("#u-strategy-adv-set")[0].disablePanel;
        btnCls = btnCls || "m-content-item-form-strategy-add";
        var node=strategyGroup.getSelectNodes();
        var level=node.length>0?node.data("level"):0;
        var text=node.length>0?node.data("text"):'';
        var id=node.length>0?node.data("id"):'';

        var form,validator;
        form=$("#u-form-add-strategy");
        form.find(".u-other-mark:first").trigger("click");
        //var belongBox=$("#u-belong-strategy");
        //var copyStrategy = $("#u-copy-strategy");
        _belongBox.attr({"data-copy-system":false,"required":false});
        //form.clearForm();
        _belongBox[0].tree.setConfig({'selectLockLevel':0,"selMode":"simple"});
        _belongBox[0].setConfig({"showEmptyNode":true});
        _copyStrategy.attr("disabled",false);
        if(!isCopySystem)
        {
            form.clearForm();
        }
        else
        {
            //copyStrategy.attr("disableclear",true);
            //belongBox.attr("disableclear",true);
            //form.clearForm();
            _belongBox[0].load();
            _copyStrategy[0].tree.load();
        }
        //form.clearForm();
        var sels=id.split("=>");
        var isNotSys=!node.data("isSystem") && !isCopySystem;
        if(isNotSys)
        {
            _belongBox[0].setDefaultValue({text:sels[sels.length-1],value:id},true);
        }
        if(sels.length==2 && isNotSys)
        {
            disablePanel.hide();
        }
        else
        {
            disablePanel.show();
        }
        selectBtn(me,btnCls);
        validator=form.validate();
        validator.resetForm();
        $("#u-btn-ok-strategy").bind({
            click:function(){
                if($(this).isDisabled())
                {
                    return false;
                }
                //var _belongBoxVal = _belongBox[0].getValue(false);
                /*if(_belongBoxVal)
                 {
                 var id = _belongBoxVal.value;
                 var ids = id?id.split('=>'):[];
                 if(ids.length<=2)
                 {
                 var form = $("#u-form-add-strategy-common");
                 console.log(form.length);
                 }
                 }*/
                form.find(".u-other-mark:first").trigger("click");
                if(validator.valid()){
                    $.bf.formSubmitHandler(form,API.strategy.addStrategy,validator,function(data,res){
                        if(res)
                        {
                            /*contentContainer.find(".u-btn-cancel").trigger("click");
                             strategyGroup.load();
                             list.loadPage(1);*/
                            contentContainer.find(".u-btn-cancel").trigger("click");
                            var id = $("#u-belong-strategy").next().val();
                            if(id && id.split("=>").length>=2)
                            {
                                //contentContainer.find(".u-btn-cancel").trigger("click");
                                list.loadPage(1);
                            }
                            else
                            {

                                strategyGroup.load();
                                list.loadPage(1);
                            }
                            //location.reload();
                        }
                    });
                }
            }
        });
    }
    $("#add-strategy").click(function(){
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
            addStrategyHandler(me);
        }
    });
    //自动填充策略
    function autoFillStrategy(form,nData,ids)
    {

        if(!nData)
        {
            $("#u-strategy-adv-set").find("input,textarea").each(function(){
                var me = $(this);
                if(me.is(":checkbox"))
                {
                    me.attr("checked",false);
                }
                else
                {
                    me.attr("value","");
                }
            });
        }
        else
        {

            var info = nData.data;
            ids= ids||[];
            var data={
                Common_DecryptWhenRead:info.common && info.common.bDecryptWhenRead>0?true:false,
                Common_EncryptWhenCreateAndOverwrite:info.common && info.common.bEncryptWhenCreateAndOverwrite>0?true:false,
                Common_EncryptWhenEdit:info.common && info.common.bEncryptWhenEdit>0?true:false,
                Common_Passthrough:info.common && info.common.bPassthrough>0?true:false,
                Common_RejectAllOperation:info.common && info.common.bRejectAllOperation>0?true:false,
                Common_RejectEdit:info.common && info.common.bRejectEdit>0?true:false,
                Common_Comment:info.common ? info.common.comment:"",
                Common_ProcessList:info.common && info.common.Process?info.common.Process.join("|"):"",
                Common_FileList:info.common && info.common.file?info.common.file.join("|"):"",
                Exception_DecryptWhenRead:info.exception && info.exception.bDecryptWhenRead>0?true:false,
                Exception_EncryptWhenCreateAndOverwrite:info.exception && info.exception.bEncryptWhenCreateAndOverwrite>0?true:false,
                Exception_EncryptWhenEdit:info.exception && info.exception.bEncryptWhenEdit>0?true:false,
                Exception_Passthrough:info.exception && info.exception.bPassthrough>0?true:false,
                Exception_RejectAllOperation:info.exception && info.exception.bRejectAllOperation>0?true:false,
                Exception_RejectEdit:info.exception && info.exception.bRejectEdit>0?true:false,
                Exception_Comment:info.exception ? info.exception.comment :"",
                Exception_ProcessList:info.exception && info.exception.Process?info.exception.Process.join("|"):"",
                Exception_FileList:info.exception && info.exception.file?info.exception.file.join("|"):""
            };
            /*AddPolicyDetail_name:nData.name,
             Detail_AddPolicySoftwareGroup:ids[1]||"",
             Detail_AddPolicyGroupName:ids[0]||"",*/

            if(nData.data.name) data.AddPolicyDetail_name = nData.data.name;
            if(nData.data.index ===0 || nData.data.index) data.index = nData.data.index;
            if(nData.data.top === false || nData.data.top) data.stayontop = nData.data.top;
            if(ids[1]) data.Detail_AddPolicySoftwareGroup = ids[1];
            if(ids[0]) data.Detail_AddPolicyGroupName = ids[0];
            $.each(data,function(k,v){
                var input = form.find("[name="+k+"]");
                if(input.is(":checkbox"))
                {
                    input.attr("checked",v);
                }
                else
                {
                    input.attr("value",v);
                }
            });
        }
    }
    function editStrategyHandler(me)
    {
        if(!list.isSelectOne())
        {
            layer.alert(L.pleaseSelectOneStrategy,0);
            return;
        }
        //console.log($(".u-other-mark:first"));

        var form=$("#u-form-edit-strategy");
        form.find(".u-other-mark:first").trigger("click");
        form.clearForm();
        var node=list.getSelectNodes();
        var nData=node.data();
        //var nData = $.extend(true,{},nodeData);
        //console.log(nData);
        /*if(nData && nData.data)
         {
         nData = {};
         nData= $.extend(true,{},nData,nData.data);
         }*/
        //console.log(nData);
        var id=nData.id;
        var tmp=id.split("=>");
        var ids=[];
        for(var a=0;a<2;a++)
        {
            if(tmp[a])
            {
                ids.push(tmp[a]);
            }
        }
        //编辑系统自带的策略时自动转换成新增模式
        //console.log(nData);
        if(nData && nData.isSystem)
        {
            //$("#u-belong-strategy").attr("disableclear",true);
            addStrategyHandler(me,false,true);
            _copyStrategy.parents("li").show()
            _copyStrategy.attr("disabled",true);
            _belongBox[0].tree.setConfig({'selectLockLevel':1,"selMode":"single"});
            _belongBox[0].setConfig({"showEmptyNode":false});
            var disablePanel = $("#u-strategy-adv-set")[0].disablePanel;
            disablePanel.hide();
            /*$("#u-belong-strategy").attr("disableclear",true);
             $("#u-copy-strategy").attr("disableclear",true);*/
            $("#u-belong-strategy").attr({"data-copy-system":true,"required":true});
            $("#u-copy-strategy")[0].setDefaultValue({text:nData.text,value:nData.id});
            autoFillStrategy($("#u-form-add-strategy"),nData,ids);
            //$("#u-copy-strategy").attr(nData.text);
            $("#u-strategy-name").attr("value",nData.text+"_自定义");
            //console.log($("#u-copy-strategy")[0]);
            return;
        }
        if(!nData || !nData.data || !nData.data.common || !nData.data.exception)
        {
            layer.alert(L.pleaseSelectOneStrategy,0);
            return;
        }
        $("#u-belong-strategy-edit").attr("value",ids.join("/"));
        $("[name=PolicyID]").attr("value",id);
        autoFillStrategy(form,nData,ids);
        selectBtn(me,"m-content-item-form-strategy-edit");
        var validator=form.validate();
        validator.resetForm();
        $("#u-btn-ok-strategy").bind({
            click:function(){
                if($(this).isDisabled())
                {
                    return false;
                }
                form.find(".u-other-mark:first").trigger("click");
                //验证表单
                if(validator.valid()){
                    var url;
                    if(list.extraParams.mode == "group")
                    {
                        //编辑策略
                        url = API.strategy.editGroupStrategy;
                    }
                    else
                    {
                        //编辑策略模板
                        url = API.strategy.editStrategy;
                    }
                    $.bf.formSubmitHandler(form,url,validator,function(data,res){
                        if(res)
                        {
                            //location.reload();
                            //location.reload();
                            contentContainer.find(".u-btn-cancel").trigger("click");
                            list.reload();
                            /*list.loadPage(1);
                             var rec={id:data.lv1+"=>"+data.lv2+"=>"+data.lv3,text:data.lv3};
                             strategyGroup.refreshNode(node,rec);*/
                        }
                    });
                }
            }
        });
    }
    //双击编辑，有权限的时候该功能才有效
    var editRight = LIMIT_CONTROLLER.EDIT;
    if(editRight)
    {
        list.onItemDblClick.add(function(node,obj){
            obj.deselectAll();
            obj.select(node);
            editStrategyHandler($("#edit-strategy"));
        });
    }

    $("#edit-strategy").click(function(){
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
            editStrategyHandler(me);
        }
    });

    function delStrategyHandler(me)
    {
        if(list.hasSelect())
        {
            var data={};
            var ids=list.getSelectIds();
            var gIds=strategyGroup.getSelectIds();
            var text= L.delStrategyConfirm;
            if(ids.length>0)
            {
                data.ids=ids;
            }/*
             else if(gIds.length>0)
             {
             data.ids=gIds;
             text= L.delStrategyGroupConfirm;
             }*/
            else
            {
                layer.alert(L.pleaseSelectStrategyOrTemplate,0);
                return;
            }
            layer.confirm(text,function(){
                var url;
                if(list.extraParams.mode == "group")
                {
                    data.groupId = list.extraParams.guid;
                    url=API.strategy.delGroupStrategy
                }
                else
                {
                    url = API.strategy.delStrategy;
                }
                $.fastAction(url,data,function(data,res){
                    if(res)
                    {
                        if(ids.length>0)
                        {
                            list.loadPage(1);
                        }
                        else
                        {
                            //strategyGroup.deselectAll();
                            /*var n=strategyGroup.getNodeById("通用策略=>系统预置");
                             strategyGroup.select(n);*/
                            //strategyGroup.load();
                            list.loadPage(1);
                        }
                    }
                });
            });
        }
        else
        {
            layer.alert(L.pleaseSelectOneMoreStrategy,0);
        }
    }
    $("#del-strategy").click(function(){
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
            delStrategyHandler(me);
        }
    });
    //================右侧组织架构树呼出按钮======================
    function hideApplyFloatBox()
    {
        $('#u-strategy-tan').animate({right:-250},function(){
            $('#u-strategy-tan').hide();
            $("#u-expand-apply-strategy-tree").show();
        });
        $("body").unbind("click",hideApplyFloatBox);
    }
    function showApplyFloatBox()
    {
        $("#u-expand-apply-strategy-tree").hide();
        $('#u-strategy-tan').show().animate({right:1},function(){

        });
        $("body").bind("click",hideApplyFloatBox);
    }
    //================右侧组织架构树呼出按钮=======================


    function showDeptFloatBox()
    {
        $('#u-strategy-dept-tree').show().animate({right:1},function(){
            $("#u-expand-apply-strategy-tree").addClass("z-expanded");
        });
        $("#u-expand-apply-strategy-tree").animate({right:238});
        $("body").bind("click",hideDeptFloatBox);
    }
    function hideDeptFloatBox()
    {
        $('#u-strategy-dept-tree').animate({right:-235},function(){
            $('#u-strategy-dept-tree').hide();
            $("#u-expand-apply-strategy-tree").removeClass("z-expanded");
        });
        $("#u-expand-apply-strategy-tree").animate({right:0});
        $("body").unbind("click",hideDeptFloatBox);
    }
    $("#u-expand-apply-strategy-tree").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if($(this).isExpanded())
        {
            hideDeptFloatBox();
        }
        else
        {
            if(strategyDept.isFirstLoad)
            {
                strategyDept.load(true);
            }
            showDeptFloatBox();
        }
        return false;
    });
    /*$(".u-icon-right-tree-off").click(function(){
     showApplyFloatBox();
     return false;
     });*/
    function applyStrategyHandler(me)
    {
        var form=$("#u-form-edit-strategy");
        var node=list.getSelectNodes();
        var nData=node.data();
        if(nData.data)
        {
            nData= $.extend(nData,nData.data);
        }
        if(!nData.common || !nData.exception)
        {
            layer.alert(L.pleaseSelectOneMoreStrategy,0);
            return;
        }
        showApplyFloatBox();
    }
    //下发策略
    $("#u-issued-strategy").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        $("body").unbind("click",hideApplyFloatBox);
        if(dpTree.isFirstLoad)
        {
            dpTree.load(true);
        }
        else
        {
            dpTree.deselectAll();
        }
        var me=$(this);

        if(me.isSelected())
        {
            return;
        }
        if(!list.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMoreStrategy,0);
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
            dpTree.actionMode = "fetch";
            $("#u-strategy-tan").removeClass("z-replace-confirm");
            applyStrategyHandler(me);
        }
        return false;
    });

    //复制到
    $("#u-copy-to").click(function(e){
        if($(this).isDisabled())
        {
            return false;
        }
        $("body").unbind("click",hideApplyFloatBox);
        if(dpTree.isFirstLoad)
        {
            dpTree.load(true);
        }
        else
        {
            dpTree.deselectAll();
        }
        var me=$(this);

        if(me.isSelected())
        {
            return;
        }
        if(!list.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMoreStrategy,0);
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
            dpTree.actionMode = "copy";
            $("#u-strategy-tan").addClass("z-replace-confirm");
            applyStrategyHandler(me);
        }
        return false;
    });
    $('#u-strategy-tan').click(function(e){
        e.stopPropagation();
    });
    $('#u-strategy-dept-tree').click(function(e){
        e.stopPropagation();
    });
    $('#u-div-hidden').click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        hideApplyFloatBox();
    });

    var strategyDept=$("#u-strategy-dept-container").ajaxTree({
        url:API.strategy.getUserGroupTree,
        selMark:'',
        textProperty:'name',
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
        autoLoad:false
    });
    function strategyDeptHandler(id,node,obj){
        list.deselectAll();
        var groupId = "";
        var hasChangeOrderLimit = LIMIT_CONTROLLER.EDIT_ALL;
        if(node.isSelected())
        {
            if(hasChangeOrderLimit)
            {
                list.showColumn("_operation");
            }
            list.extraParams.mode = "group";
            groupId = node.data("id");
            list.extraParams.guid = groupId;
            strategyGroup.deselectAll(false);
            $("#u-search-input").attr("value","");
            delete list.extraParams.id;
            delete list.extraParams.Keyword;
            $("#u-issued-strategy,#add-strategy,#u-import-strategy,#exportStrategy").not(".z-disabled").addClass("z-disabled z-has-change");
            if($("#u-copy-to").data("permition"))
            {
                $("#u-copy-to").removeClass("z-disabled");
            }
            list.sort="";
            list.order="";
            list.orderConverge=[];
            list.setConfig("orderEnable",false);
            list.removeCurrentOrderCls(true);
            list.loadPage(1);
        }
        else
        {
            //恢复排序
            list.sort="";
            list.order="";
            list.orderConverge=[];
            list.setConfig("orderEnable",true);
            list.removeCurrentOrderCls(true);
            list.hideColumn("_operation");
        }

        //list.setConfig("orderEnable",true);
        $("[name=GroupID]").attr("value",groupId);
    }
    //右侧部门树选择变化的判断是否加载组的策略
    strategyDept.onSelectChange.add(function(id,node,obj){
        if(list.me.is(":hidden"))
        {
            //list.loadRemark=false;
            layer.confirm(L.cancelOperationConfirm,function(){
                contentContainer.find(".u-btn-cancel").trigger("click");
                strategyDeptHandler(id,node,obj);
            });
        }
        else
        {
            strategyDeptHandler(id,node,obj);
        }
    });
    var dpTree=$("#u-align-auto").ajaxTree({
        url:API.strategy.getUserGroupTree,
        selMark:'',
        textProperty:'name',
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
        autoLoad:false
    });
    $("#u-div-down").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if(!dpTree.hasSelect())
        {
            layer.alert(L.pleaseSelectDepartments,0);
            return false;
        }
        if(!list.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMoreStrategy,0);
            return false;
        }
        //copyPolicyToGroup
        var sels = [];
        list.getSelectNodes().each(function(){
            if(dpTree.actionMode=="fetch")
            {
                var data = $(this).data("data");
                sels.push(data.id+data.text);
            }
            else
            {
                sels.push($(this).data("id"));
            }
        });

        if(dpTree.actionMode=="fetch")
        {
            var data={policy:sels,group:dpTree.getSelectIds()};
            //下发策略
            $.fastAction(API.strategy.copyPolicyToGroup,data,function(data,res){
                if(res)
                {
                    list.reload();
                    hideApplyFloatBox();
                    dpTree.deselectAll();
                }
            });
        }
        else
        {
            var data={policy:sels,dstGroup:dpTree.getSelectIds(),srcGroup:strategyDept.getSelectId(),replace:$("[name=replaceit]:checked").val()};
            $.fastAction(API.strategy.copyGroupPolicyToGroup,data,function(data,res){
                if(res)
                {
                    list.reload();
                    hideApplyFloatBox();
                    dpTree.deselectAll();
                }
            });
        }
        return false;
    });
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
            $("#u-btn-ok-strategy").unbind();
            //$("#u-search-input").unbind();
            layer.closeTips();
        }
    });

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
    var searchConditionList = $("#u-search-condition")[0];
    var conditionData=[
        {text:'全部',value:0,checked:true}
    ];
    searchConditionList.tree.me.unbind("onSelectChange").bind("onSelectChange",function(me,id,node,obj){
        var val=parseInt(id);
        switch (val)
        {
            //未下发策略
            case 0:
                list.extraParams.SortType=0;
                break;
            //已下发策略
            case 1:
                list.extraParams.SortType=1;
                break;
            //全部
            default:
                delete list.extraParams.SortType;
        }
        list.loadPage(1);
    });
    /*searchConditionList.tree.onSelectChange.add(function(id,node,obj){
     //console.log(id);
     var val=parseInt(id);
     switch (val)
     {
     //未下发策略
     case 0:
     list.extraParams.SortType=0;
     break;
     //已下发策略
     case 1:
     list.extraParams.SortType=1;
     break;
     //全部
     default:
     delete list.extraParams.SortType;
     }
     list.loadPage(1);
     });*/
    searchConditionList.setTreeConfig("localData",conditionData);
    searchConditionList.tree.load(true);
    /*$("#u-filter-strategy").bind("change",function(){
     var val=parseInt($(this).val());
     switch (val)
     {
     //未下发策略
     case 0:
     list.extraParams.SortType=0;
     break;
     //已下发策略
     case 1:
     list.extraParams.SortType=1;
     break;
     //全部
     default:
     delete list.extraParams.SortType;
     }
     list.loadPage(1);
     });*/

    /*导入*/
    $('#u-import-strategy').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }

        $.layer({
            type: 1,
            title: false,
            area: ['550px', '200px'],
            shade: [0.3, '#000'],
            move: '#import-box-title',
            page: {
                dom: '#upload-box'
            }
        });
        $("#upload-strategy-form").clearForm();
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

    $('#import-strategy-btn').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if($('#import-file-name:visible').val() == ''){
            layer.alert(L.pleaseSelectFile, 0);
            return false;
        }
        if(!strategyGroup.firstNodeData)
        {
            var options = {
                url: API.strategy.importStrategy,
                type: 'POST',
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
            $('#upload-strategy-form').ajaxSubmit(options);
        }
        else
        {
            layer.confirm(L.strategyShouldOverwrite,function(){
                var options = {
                    url: API.strategy.importStrategy,
                    type: 'POST',
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
                $('#upload-strategy-form').ajaxSubmit(options);
            },function(){
                var options = {
                    url: API.strategy.importStrategy,
                    type: 'POST',
                    data:{overwrite:true},
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
                $('#upload-strategy-form').ajaxSubmit(options);
            },'',[L.retain, L.overwrite]);
        }


    });



    /**
     * 禁用panel控件生成
     */
    $("#u-strategy-adv-set").disablePanel();

    function showExportStrategyLayerBox()
    {
        $.layer({
            type: 1,
            title: false,
            area: ['550px', '250px'],
            shade: [0.3, '#000'],
            move: '#export-strategy-box-title',
            page: {
                dom: '#export-strategy-box'
            }
        });
        var form = $("#export-strategy-form");
        form.clearForm();
        form.validate().resetForm();
    }

    /*导出*/
    $('#u-export-strategy').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if(list.hasSelect())
        {
            layer.confirm(L.exportListStrategyConfirm,function(){
                var params ={};
                params.ids = list.getSelectIds();
                $.download(API.strategy.exportStrategy,params,$.bf.date("策略(yyyy-MM-dd)")+".xml",function(){
                    layer.closeAll();
                });
            });
        }
        else
        {
            showExportStrategyLayerBox();
        }

    });
    $("#u-export-strategy-group-tree").ajaxTreeSelect({
        url:API.strategy.getStrategyGroupTree,
        textProperty:'text',
        pidProperty:'id',
        dataRoot:'result',
        rootLocked:false,
        lastChildLevel:2,
        selMark:'',
        showCheckbox:true,
        itemClickSelect:false,
        treeContainerCss:{zIndex:100000000},
        filterRowData:function(v)
        {
            if(v.isSystem)
            {
                return false;
            }
            else
            {
                return v;
            }
        }
    });
    /*导出*/
    $('#export-strategy-btn').on('click', function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var groupTree =$("#u-export-strategy-group-tree")[0];
        var data = groupTree.getValue(false);
        var params ={};
        if(data.value)
        {
            params.ids=[data.value];
        }
        /*console.log(params);
         return;*/
        /*if(list.extraParams.mode != "group" && list.hasSelect())
         {
         params.ids = list.getSelectIds();
         }*/
        $.download(API.strategy.exportStrategy,params,$.bf.date("策略(yyyy-MM-dd)")+".xml",function(){
            layer.closeAll();
        });
        //window.location.href = API.strategy.exportStrategy;
    });
    $("#u-sync-strategy").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if(!list.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMoreStrategy,0);
            return;
        }
        var mode = "template";
        var ids = list.getSelectIds();
        var data={ids:ids,mode:mode};
        var info;
        if(list.extraParams.mode == "group")
        {
            var checkSystem = false;
            var hasSystem=false;
            $.each(ids,function(k,v){
                var reg=/^通用策略/gi;
                if(reg.test(v))
                {
                    hasSystem=true;
                    return false;
                }
            });
            if(checkSystem && hasSystem)
            {
                layer.alert(L.canNotSyncSystemStrategy,0);
                return false;
            }
            data.mode ="group";
            data.groupId=strategyDept.getSelectNodes().data(strategyDept.getConfig("idProperty"));
            //console.log(data.groupId);
            info= L.groupStrategySyncConfirm;
        }
        else
        {
            info= L.templateStrategySyncConfirm;
            //data.mode = "group";
        }

        layer.confirm(info,function(){
            $.fastAction(API.strategy.syncStrategy,data,function(data,res){
                if(res)
                {
                    //list.reload();
                    //hideApplyFloatBox();
                    //dpTree.deselectAll();
                }
            });
        });
    });

    //保存排序
    $("#u-save-order").click(function(){

    });


    //新增/编辑策略的tabpanel
    $(".u-title-mark li>span").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var index=$(this).parent("li").index();
        var parent=$(this).parents(".u-panel-title");
        var nextAll=parent.nextAll(".u-panel-body");
        if(nextAll.eq(index).is(":visible"))
        {
            return false;
        }
        nextAll.hide();
        nextAll.eq(index).fadeIn();
        parent.find("li>span").removeClass("z-selected-tab");
        $(this).addClass("z-selected-tab");
        return false;
    });
    /*$(".u-panel-title").collapsePanel();*/
}

$(function(){
    strategy();
});
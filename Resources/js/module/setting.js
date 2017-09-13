function setting()
{
    var setGroup=$("#menu-container-setting").ajaxTree({
        url:API.setting.getSettingTree,
        dataRoot:'data',
        icon:['icon-setting-lv1','icon-setting-lv2','icon-setting-lv3'],
        selMark:'setGroup',
        pathMark:'setPath',
        rootLocked:true,
        autoExpandLevel:3,
        autoLoadLevel:3
    });
    var contentContainer=$("#m-content-container-setting");
    var toolbar=$("#u-main-toolbar-setting");
    var setGroupSel= $.bf.hash("setGroup");
//var setGroupPath= $.bf.hash("setPath");
    if(!setGroupSel)
    {
        //$.bf.hash("setGroup","5");
        //$.bf.hash("setPath","/1/5/");
        setGroup.sels=["5"];
        setGroup.paths = ["/1/5/"];
    }
    var tabContainer = $(".g-mn");
//左侧菜单选中的处理函数
    function selectHandler(id,node,obj)
    {
        if($(".m-ajax-form").is(":visible"))
        {
            var index = layer.confirm(L.cancelOperationConfirm,function(){
                selectDoHandler(id,node,obj);
                layer.close(index);
            });
        }
        else
        {
            selectDoHandler(id,node,obj);
        }
    }
    function selectDoHandler(id,node,obj){
        $("[name=hasDefault]").attr("value",0);
        var processType = node.data("processType");
        if(processType == 1 ||  processType == 0)
        {
            $(".m-content-item-form-setting,.m-ajax-form").hide();
            $(".m-content-item-form-setting[data-group=special]").show();
            $("form:visible").validate().resetForm();
            getProcessSetting(node);
        }
        else
        {
            $(".m-content-item-form-setting,.m-ajax-form").fadeOut();
            $(".m-content-item-form-setting[data-group="+id+"]").fadeIn();
        }
    }
    setGroup.onSelect.add(selectHandler);
    setGroup.onBeforeSelect=function(node,obj){
        if(node.data("level")<=1 ||node.data("id")==4 /*||  !parseInt(node.data("id"))*/)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    /*var start = {
     elem: '#u-setting-limit-timeout-start',
     format: 'YYYY/MM/DD hh:mm:ss',
     min: laydate.now(), //设定最小日期为当前日期
     max: '2099-06-16 23:59:59', //最大日期
     istime: true,
     istoday: false,
     choose: function(datas){
     end.min = datas; //开始日选好后，重置结束日的最小日期
     end.start = datas //将结束日的初始值设定为开始日
     }
     };
     var end = {
     elem: '#u-setting-limit-timeout-end',
     format: 'YYYY/MM/DD hh:mm:ss',
     min: laydate.now(),
     max: '2099-06-16 23:59:59',
     istime: true,
     istoday: false,
     choose: function(datas){
     start.max = datas; //结束日选好后，充值开始日的最大日期
     }
     };
     laydate(start);
     laydate(end);*/





//流程验证
    $('#process-setting').validate({
        rules:{
            "SS_APPROVAL_HANDLER":{
                required:true
            },
            "SS_APPROVAL_LEVEL":{
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

    //域参数配置表单验证
    var adsFormValid = $('#ads-setting').validate({
        rules:{
            AdsSvIP: {
                required: true,
                ipv4: true
            },
            AdsDns: {
                required: true
            },
            LogName: {
                required: true,
                commonStr2:true
            },
            PassWord: {
                required: true
            }
        },
        errorPlacement:function(error,element) {
            error.appendTo(element.parent().parent());
        }
    });
    $("#save-ads-btn").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if(adsFormValid.form()){
            $.bf.operationWaiting();
            $('#ads-setting').ajaxSubmit({
                url:API.setting.setAdsSetting,
                success:function(data){
                    if(!data || data.ret){
                        $.bf.parseError(data);
                    } else {
                        layer.msg(L.operationSucceed, 1, 1);
                    }
                }
            });
        }
    });
    //其他设置的拖动设置界面
    $(".slider-setting").each(function(){
        var me = $(this);
        var start = parseInt(me.attr("start"));
        var step = parseInt(me.attr("step"));
        var min = parseInt(me.attr("min"));
        var max = parseInt(me.attr("max"));
        me.noUiSlider({
            start: [start],
            step: step,
            range: {
                'min': [ min ],
                'max': [ max ]
            },
            format: wNumb({
                decimals: 0
            })
        });
        /*me.noUiSlider_pips({
            mode: 'steps',
            density: 2
        });*/
        me.Link('lower').to(me.prev());
    });
    $("#other-configuration-parameters").find(".u-smarty-textarea").smartyTextArea({
        validate:/^(\*)$|^\.([\w]{1,10})$/gi,
        //inputMinWidth:50,
        msg:{
            formatError:"请输入“.后缀名”这样的格式",
            uniqueError:"你输入的内容已经存在"
        }
    });
    /*$("#EIntervalTimeSlider").noUiSlider({
        start: [0],
        step: 1,
        range: {
            'min': [ 1 ],
            'max': [ 8 ]
        }
    });
    $("#EIntervalTimeSlider").noUiSlider_pips({
        mode: 'steps',
        density: 2
    });*/
    var otherFormValid = $('#other-configuration-parameters').validate({
                ignore:true,
                rules:{
                    /*"EMaxSize":{
                        number:true,
                        min:1,
                        digits:true
                    },
                    "ESentensPer":{
                        number:true,
                        min:1,
                        digits:true
                    },
                    "ESentens":{
                        required:true,
                        number:true,
                        min:1,
                        digits:true
                    },
                    "EDelTime":10,
                    "EIntervalTime":2,
                    "EBackFile":true,
                    "EDelFile":true,
                    "ESuffix":[".doc",".docx"],
                    "NMaxSize":11,
                    "NSentensPer":20,
                    "NSentens":20,
                    "NDelTime":10,
                    "NIntervalTime":2,
                    "NBackFile":true,
                    "NDelFile":true,
                    "NSuffix":[".doc",".docx"],
                    "DMaxSize":11,
                    "DSentensPer":20,
                    "DSentens":20,
                    "DDelTime":10,
                    "DIntervalTime":2,
                    "DBackFile":true,
                    "DDelFile":true,
                    "DSuffix":[".doc",".docx"],
                    "TickTime":""*/
                },
                errorPlacement:function(error,element) {
                    error.appendTo(element.parent().parent());
                }
    });
    //console.log(otherFormValid);
    $("#save-other-btn").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        if($("#other-configuration-parameters").find("input.z-error").length<=0 && otherFormValid.form()){
            $.bf.operationWaiting();
            $('#other-configuration-parameters').ajaxSubmit({
                url:API.setting.setOtherSetting,
                success:function(data){
                    if(!data || data.ret){
                        $.bf.parseError(data);
                    } else {
                        layer.msg(L.operationSucceed, 1, 1);
                    }
                }
            });
        }
    });

    $("#save-business-btn").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var form = $('#business-setting');
        if(form.validate().form())
        {
            $.bf.operationWaiting();
            //业务参数设置
            form.ajaxSubmit({
                url: API.setting.setBusinessSetting,
                success: function (msg) {
                    if (!msg || !msg.water || !msg.copy || !msg.time || !msg.out) {
                        $.bf.parseError({ret: -1});
                    }
                    else if (!msg.water.ret && !msg.copy.ret && !msg.time.ret && !msg.out.ret) {
                        layer.msg(L.operationSucceed, 1, 1);
                        return true;
                    }
                    else {
                        $.bf.parseError(msg);
                    }
                    if (msg.water.ret) {
                        layer.msg('水印设置失败', 1, 8);
                    }
                    if (msg.copy.ret) {
                        layer.msg('拷贝设置失败', 1, 8);
                    }
                    if (msg.time.ret) {
                        layer.msg('短期离线时长设置失败', 1, 8);
                    }
                    if (msg.out.ret) {
                        layer.msg('文件外发参数设置失败', 1, 8);
                    }
                    layer.close($.bf.loadLayer);
                }
            });
        }
    });

    //流程设置
    $("#save-process-btn").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var processFormValid = {
            rules:{
                "SS_APPROVAL_HANDLER":{
                    required:true
                },
                "SS_APPROVAL_AUDI_WAIT_TIME":{
                    required:false
                }
            }
        };
        if($('#process-setting').validate().form()){
            $.bf.operationWaiting();
            var n=setGroup.getSelectNodes();
            var nData=n.data();
            var guidData = $("#SS_APPROVAL_ITEM")[0].getValue(false);
            var itemData = $("#SS_APPROVAL_ITEM")[0].tree.getSelectNodes().data();
            var prefix=nData.processType==0?"解密申请":"外发申请";
            var uniqueName=prefix+guidData.text;
            var data={
                GUID: guidData.value,
                UNIQUENAME: uniqueName,
                ICON: "",
                NEEDFILE: 1,
                DISPLAY: [{
                    "AREA": 1033,
                    "TEXT": uniqueName
                },{
                    "AREA":2052,
                    "TEXT": uniqueName
                },{
                    "AREA":-1,
                    "TEXT": uniqueName
                }
                ],
                STEP:[],
                TYPE:parseInt($("[name=SS_APPROVAL_TYPE]").val()),
                SS_APPROVAL_AUDI:$("[name=SS_APPROVAL_AUDI]").val(),
                SS_APPROVAL_ROLE:$("[name=SS_APPROVAL_ROLE]").val(),
                DEFAULT:$("[name=SS_APPROVAL_DEFAULT]:checked").length>0?1:0
            };
            var stepTotal=parseInt($("[name=SS_APPROVAL_LEVEL]:checked").val());
            for(var a=1;a<=stepTotal;a++)
            {
                var step={
                    "ICON": "",
                    "STEPSTAYTIME": parseInt($("[name=SS_APPROVAL_WAIT_TIME]").val())*60,
                    "AUTORESULT": parseInt($("[name=SS_APPROVAL_HANDLER_STEP"+a+"_LIMIT]:checked").val()),
                    "PERSONSTAYTIME": parseInt($("[name=SS_APPROVAL_AUDI_WAIT_TIME]").val())*60,
                    "LOOPTYPE": 1,
                    "AUDI":[],
                    "DISPLAY":[]
                };
                var isMoreAudi=parseInt($("[name=SS_APPROVAL_HANDLER]:checked").val());
                var audi1 = $("[name=SS_APPROVAL_HANDLER_STEP"+a+"_AUDI_1]").val() || 'AUTO';

                step.AUDI = audi1.split(",");
                data.STEP.push(step);
            }
            var params={
                type:'set',
                data: $.toJSON(data),
                isAdd:$("[name=isAdd]").val()
            };
            $.fastAction(API.setting.setProcessSetting,params,function(data,res)
            {
                if(res)
                {
                    if(itemData.isDefault)
                    {
                        $("[name=hasDefault]").attr("value",1);
                    }
                    $(".u-setting-approval-way :radio").each(function(){
                        $(this).attr("disabled",true);
                    });
                    $("[name=isAdd]").attr("value",0);
                }
            });
        }
    });
    //重置按钮
    $(".u-btn-cancel").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        var nData = $("#SS_APPROVAL_ITEM")[0].tree.getSelectNodes().data();
        var isDefault = nData ? nData.isDefault : false;
        //console.log($("#process-setting").is(":hidden"));
        if(!$("#process-setting").is(":hidden"))
        {
            //console.log("hahahah");
            if($("[name=isAdd]").val()==1)
            {
                layer.confirm(L.resetProcessConfirm,function(){
                    $("#u-audi-wait-time").show();
                    $("[name=isAdd]").attr("value",1);
                    if(isDefault)
                    {
                        $("[name=hasDefault]").attr("value",0);
                    }
                    resetProcessForm($("[name=SS_APPROVAL_DEFAULT]"),isDefault);
                    layer.msg(L.operationSucceed,1,1);
                });
            }
            else
            {
                var guid=$("#process-setting [name=guid]").val();
                var params={
                    guid:guid,
                    type:'reset'
                };
                layer.confirm(L.resetProcessConfirm,function(){
                    $.fastAction(API.setting.resetProcessSetting,params,function(data,res){
                        if(res)
                        {
                            $("#u-audi-wait-time").show();
                            //location.reload();
                            $("[name=isAdd]").attr("value",1);
                            if(isDefault)
                            {
                                $("[name=hasDefault]").attr("value",0);
                            }
                            resetProcessForm($("[name=SS_APPROVAL_DEFAULT]"),isDefault);
                        }
                    });
                });
            }
        }
        else if(!$("#ads-setting").is(":hidden"))
		{
			layer.confirm(L.resetSettingConfirm,function(){
                var form = $("form:visible");
                form.clearForm();
                form.validate().resetForm();
                $("#u-copy-count").trigger("change");
                //$(".u-btn-ok").trigger("click");
                $.bf.operationWaiting();
				$('#ads-setting:visible').ajaxSubmit({

					url:API.setting.setOtherSetting,
					success:function(data){
						if(!data || data.ret){
							$.bf.parseError(data);
						} else {
							layer.msg(L.operationSucceed, 1, 1);
						}
					}
				});
            });
		}
		else if(!$("#business-setting").is(":hidden"))
		{
			layer.confirm(L.resetSettingConfirm,function(){
                var form = $("form:visible");
                form.clearForm();
                form.validate().resetForm();
                $("#u-copy-count").trigger("change");
                //$(".u-btn-ok").trigger("click");
                $.bf.operationWaiting();
				$('#business-setting:visible').ajaxSubmit({
					url:API.setting.setBusinessSetting,
					success:function(data){
						if(!data || data.ret){
							$.bf.parseError(data);
						} else {
							layer.msg(L.operationSucceed, 1, 1);
						}
					}
				});
            });
		}
        else if(!$("#other-configuration-parameters").is(":hidden")){
            layer.confirm(L.resetSettingConfirm,function(){
                var form = $("#other-configuration-parameters");
                form.clearForm();
                form.validate().resetForm();
                $(".u-smarty-textarea").each(function() {
                    $(this)[0].bf.clear();
                });
                $(".slider-setting").each(function(){
                    $(this).val(0);
                });
                var data = {};
                form.find("name").each(function(){
                    data[$(this).attr("name")]=null;
                });
                $.bf.operationWaiting();
                $.fastAction(API.setting.setOtherSetting,data);
                location.reload();
                /*$("#other-configuration-parameters").ajaxSubmit({
                    url:API.setting.setOtherSetting,
                    data:data,
                    success:function(data){
                        if(!data || data.ret){
                            $.bf.parseError(data);
                        } else {
                            layer.msg(L.operationSucceed, 1, 1);
                        }
                    }
                });*/
            });
        }
		else
        {
            layer.confirm(L.resetSettingConfirm,function(){
                var form = $("form:visible");
                form.clearForm();
                form.validate().resetForm();
                $("#u-copy-count").trigger("change");
                //$(".u-btn-ok").trigger("click");
                layer.msg(L.operationSucceed,1,1);
            });
            //$("form:visible").clearForm();
            //layer.msg(L.operationSucceed,1,1);
        }


    });

    $("#SS_APPROVAL_AUDI").ajaxTreeSelect({
        url:API.setting.getProcessApplyUserGroupTree,
        selMark:'',
        textProperty:'text',
        pidProperty:'id',
        dataRoot:'Group',
        childrenProperty:'group',
        extraParams:{includeGroup:1,processType:1,includeUser:1},
        autoExpandLevel:1,
        selMode:'multiple',
        itemWidth:165,
        emptyNode:{text:'取消选择',value:''},
        showCheckbox:true,
        itemClickSelect:false,
        selectChildrenMode:false,
        showIcon:true,
        //一次性加载完整数据
        onceLoadAll:true,
        filterRowData:function(v,node,obj,k){
            //flag 1：其他流程已经关联的人员  2：本流程关联人员 3：其他流程关联但子节点下有本流程的适用人员
            //console.log(v.flag);
            if(v.flag == 1)
            {
                return false;
            }

            var parentEq3= false;
            var tmpNode = node;
            while(tmpNode)
            {
                var parent = tmpNode[0].parentItem;
                if(parent)
                {
                    if(parent.data("flag")==3)
                    {
                        parentEq3 = true;
                        parent = false;
                    }
                }
                tmpNode = parent;
            }
            if((node.data("flag")==3||parentEq3) && v.flag == 0)
            {
                return false;
            }
            if(parentEq3 && v.flag == 3)
            {
                return false;
            }
            //console.log(parentEq3);
            if(v.flag ==3 || (parentEq3 && v.flag ==4))
            {
                v[obj.opts.selectLockedProperty] = true;
            }
            return v;
        },
        parseData:function(data)
        {
            var dataRoot = data.Result;
            var renderData=[];
            if(!data.Result)
            {
                return [];
            }
            if(dataRoot.group)
            {
                var group= $.map(dataRoot.group,function(v){
                    v.icon = "icon-group-15";
                    v.childCount = (v.groupcount+ v.usercount);
                });
                renderData=renderData.concat(dataRoot.group);
            }
            if(dataRoot.user)
            {
                var user= $.map(dataRoot.user,function(v){
                    v.icon = "icon-user-15";
                    v.leaf = true;
                });
                renderData=dataRoot.user.concat(renderData);
            }
            //console.log(renderData);
            return renderData;
        },
        parseChildrenData:function(data)
        {
            //console.log(data);
            var renderData =[];
            if(data.group)
            {
                var group= $.map(data.group,function(v){
                    v.icon = "icon-group-15";
                    v.childCount = (v.groupcount+ v.usercount);
                });
                renderData=renderData.concat(data.group);
            }
            //console.log(data.user);
            if(data.user)
            {
                var user= $.map(data.user,function(v){
                    v.icon = "icon-user-15";
                    v.leaf = true;
                });
                renderData=data.user.concat(renderData);
            }
            return renderData;
        },
        autoLoad:false
    });
    $("#u-role-level").ajaxTreeSelect({
        localData:[{
            id:0,
            text:'缺省'
        },{
            id:1,
            text:'一级'
        },{
            id:2,
            text:'二级'
        },{
            id:3,
            text:'三级'
        }],
        lastChildLevel:1,
        idProperty:'id',
        textProperty:'text',
        autoLoad:false,
        itemWidth:false,
        emptyNode:false,
        height:'auto',
        selMode:'single'
    });

//流程选择
    $("#SS_APPROVAL_ITEM").ajaxTreeSelect({
        autoExpandLevel:1,
        url:API.setting.getSystemProcess,
        autoLoad:false,
        textProperty:'text',
        emptyNode:false,
        selMode:'single',
        levelWidth:0,
        onBeforeSelect:function(node,obj){
            if(!node.data("isDefault"))
            {
                if($("[name=hasDefault]").val()==1)
                {
                    return true;
                }
                else
                {
                    layer.alert(L.pleaseSetDefaultProcess,0);
                    return false;
                }
            }
            else
            {
                return true;
            }
        }
    });

//流程配置新增模式
    function generateProcessSettingAddMode(nData)
    {
        $("[name=isAdd]").attr("value",1);

        /*console.log(nData["id"]);*/
        if(nData["id"]=="c553ee73-8905-11e5-bb58-c860008aa618"||nData["id"]=="9440744a-8905-11e5-bb58-c860008aa618")
        {
            $("[name=SS_APPROVAL_LEVEL][value=1]").attr("checked",true);
            $("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked",true);

            //默认所有rodia不能选
            $("[name=SS_APPROVAL_LEVEL]").each(function(){
                $(this).attr("disabled",true);
            });

            $("[name=SS_APPROVAL_HANDLER]").each(function(){
                $(this).attr("disabled",true);
            });
            //默认只有一个节点
            processStepViewHandler(1);
            //隐藏循环等待时间
           /* $("#u-audi-wait-time").hide();*/
        }
    }
//流程配置编辑模式
    function generateProcessSettingEditMode(msg,nData){
        $("[name=isAdd]").attr("value",0);
       /* console.log(nData);*/

        var flowInfo=msg.FlowInfo;
        $("[name=SS_APPROVAL_LEVEL][value="+ flowInfo.FlowStep.length+"]").attr("checked",true).trigger("change");
        $.each(flowInfo.FlowStep,function(a,v){
            var k=a+1;
            $("[name=SS_APPROVAL_HANDLER_STEP"+k+"_LIMIT][value="+ v.AutoResult+"]").attr("checked",true).trigger("change");

            //$("[name=SS_APPROVAL_WAIT_TIME]").attr("value",v.PERSONSTAYTIME);
            var time=v.StepStayTime/60;
            $("[name=SS_APPROVAL_WAIT_TIME]").attr("value",time);

            var time2= v.PersonStayTime/60;
            $("[name=SS_APPROVAL_AUDI_WAIT_TIME]").attr("value",time2);
        });


        var flowTypeInfo=msg.FlowTypeInfo;
        if(!flowTypeInfo.CanNotFound && flowTypeInfo.IsDefault)
        {
            $("[name=SS_APPROVAL_DEFAULT]").attr("checked",true).trigger("change");
        }
        else
        {
            $("[name=SS_APPROVAL_DEFAULT]").attr("checked",false).trigger("change");
        }
        $("[name=SS_APPROVAL_HANDLER]").each(function(){
            $(this).attr("disabled",true);
        });
        var roleLevel = "";
        if(msg.Role && msg.Role.FlowLevel)
        {
            roleLevel = msg.Role.FlowLevel.join(",");
            //$("[name=SS_APPROVAL_ROLE] option").attr("selected",false);
            //$("[name=SS_APPROVAL_ROLE] option[value="+msg.Role.FlowLevel+"]").attr("selected",true);
        }
        $("#u-role-level")[0].setDefaultValue({value:roleLevel});
        //流程的审批员信息
        if(msg.UserOrGroup)
        {
            var groupName=[],groupGuid=[],name=[],guid=[];
            $.each(msg.UserOrGroup,function(k,v){
                /*if(v.IsGroup)
                 {
                 groupName.push(v.Name);
                 groupGuid.push(v.Guid);
                 $("[name=SS_APPROVAL_GROUP]").prev()[0].setDefaultValue({text: groupName.join(","),value: groupGuid.join(",")});
                 }
                 else
                 {
                 name.push(v.Name);
                 guid.push(v.Guid);
                 $("[name=SS_APPROVAL_AUDI]").prev()[0].setDefaultValue({text: name.join(","),value: guid.join(",")});
                 }*/
                if(v.DisplayName)
                {
                    name.push(v.DisplayName);
                }
                else if(v.Name)
                {
                    name.push(v.Name);
                }
                //name.push(v.DisplayName);
                guid.push(v.Guid);
                $("[name=SS_APPROVAL_AUDI]").prev()[0].setDefaultValue({text: name.join(","),value: guid.join(",")});
            });
        }

        //流程步骤的信息
        if(msg.FlowStepInfo)
        {
            var totalLevel = msg.FlowInfo.FlowStep.length;
            var hasMoreAudi=0,hasNone=0;
            for(var a=0;a<totalLevel;a++)
            {
                if(!msg.FlowStepInfo[a]){
                    hasNone++;
                }
            }
            if(hasNone>0)
            {
                $("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked",true)/*.trigger("change")*/;
                $("#u-audi-wait-time").show();
                audiMultiMode();
            }
            $.each(msg.FlowStepInfo,function(k,v){
                //if(k>=3)return false;
                var step=k+1;
                // var hasMoreAudi=0;
                //var hasAutoAudi = 0;
                if(v)
                {
                    $("[name=SS_APPROVAL_HANDLER_STEP"+step+"]:last").attr("checked",true).trigger("change");
                    if( hasMoreAudi == 0 && v.length==0 || v.length>1 || (v[0] && v[0].IsGroup))
                    {
                        // $("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked",true)/*.trigger("change")*/;
                        hasMoreAudi++;
                        //$("#u-audi-wait-time").show();
                    }
                    else if(hasNone<=0)
                    {
                        $("[name=SS_APPROVAL_HANDLER][value=1]").attr("checked",true)/*.trigger("change")*/;
                        $("#u-audi-wait-time").hide();
                        audiSimpleMode();
                    }
                    var name=[],guid=[],user= 0,group=0;
                    $.each(v,function(a,b){
                        if(b.IsGroup)
                        {
                            group++;
                        }
                        else
                        {
                            user++;
                        }
                        var audi=a+1;
                        if(b.DisplayName)
                        {
                            name.push(b.DisplayName);
                        }
                        else if(b.Name)
                        {
                            name.push(b.Name);
                        }
                        guid.push(b.Guid);
                    });
                    //console.log(name.join(","));
                    //var prev =
                    /*if(step>1)
                     {

                     }*/
                    //console.log(guid);
                    var selBox = $("[name=SS_APPROVAL_HANDLER_STEP"+step+"_AUDI_1]");
                    selBox.prev()[0].setDefaultValue({text: name.join(","),value: guid.join(",")},true);
                    selBox.prev().attr({selGroups:group,selUsers:user});
                    //console.log($("[name=SS_APPROVAL_HANDLER_STEP"+step+"_AUDI_1]").prev());
                    //$("[name=SS_APPROVAL_HANDLER_STEP"+step+"_AUDI_1]").prev().attr("value",name.join(","));
                    if(v.length>1)
                    {
                        hasMoreAudi++;
                    }
                }
                else
                {
                    //hasAutoAudi++;
                    $("[name=SS_APPROVAL_HANDLER_STEP"+step+"]:first").attr("checked",true).trigger("change");
                }
            });
        }
        else
        {
            $("[name=SS_APPROVAL_HANDLER][value=1]").attr("checked",true)/*.trigger("change")*/;
            $("#u-audi-wait-time").hide();
            audiSimpleMode();
        }
        //console.log(hasMoreAudi);
        if(hasMoreAudi>0)
        {
            $("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked",true)/*.trigger("change")*/;
            $("#u-audi-wait-time").show();
            audiMultiMode();
        }
        $("[name=SS_APPROVAL_LEVEL]").attr("disabled",true);



        //当选择“咨询审批人流程”时
        if(nData["id"]=="c553ee73-8905-11e5-bb58-c860008aa618"||nData["id"]=="9440744a-8905-11e5-bb58-c860008aa618")
        {
            $("[name=SS_APPROVAL_LEVEL][value=1]").attr("checked",true);
            $("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked",true);

            //默认所有rodia不能选
            $("[name=SS_APPROVAL_LEVEL]").each(function(){
                $(this).attr("disabled",true);
            });

            $("[name=SS_APPROVAL_HANDLER]").each(function(){
                $(this).attr("disabled",true);
            });
            //默认只有一个节点
            processStepViewHandler(1);
            //隐藏循环等待时间
            $("#u-audi-wait-time").hide();
        }
    }
    /**
     *  重置流程表单
     * */
    function resetProcessForm(add,isDefault){
        //清除表单
        var form = $("#process-setting");
        form.clearForm(true,$("#SS_APPROVAL_ITEM,.u-select-user1").add(add));
        form.validate().resetForm();
        form.find("[disabled]").each(function(){
            //console.log(isDefault && !$(this).is("#SS_APPROVAL_AUDI") && !$(this).is("#u-role-level"));
            if(isDefault && !$(this).is("#SS_APPROVAL_AUDI") && !$(this).is("#u-role-level"))
            {
                $(this).attr("disabled",false);
            }
            else if(!isDefault)
            {
                $(this).attr("disabled",false);
            }
            //$(this).attr("disabled",false);
        });
        $("#u-step-container").empty();
    }
//生成流程配置
    function generateProcessSetting(nData)
    {
        $("#u-audi-wait-time").show();
        $("#SS_APPROVAL_AUDI")[0].tree.extraParams.processGuid = nData['id'];
        resetProcessForm();
        /*$("[name=SS_APPROVAL_LEVEL][value="+nData.lv+"]").attr("checked",true).trigger("change");
         $("[name=SS_APPROVAL_DEFAULT]").attr("checked",false);
         $("[name=SS_APPROVAL_WAIT_TIME]").attr("value",null);
         $("[name=SS_APPROVAL_AUDI_WAIT_TIME]").attr("value",null);
         $("[name=isAdd]").attr("value",0);
         $(".u-step-handler-auto").attr("checked",true).trigger("change");
         $(".u-select-user").each(function(){
         $(this)[0].setDefaultValue({text:'',value:''});
         });*/
        /*$(".u-select-group").each(function(){
         $(this)[0].setDefaultValue({text:'',value:''});
         });*/
        /*$("[name=SS_APPROVAL_ROLE] option:first").attr("selected",true).trigger("change");
         $("#u-setting-process2").attr("checked",true).trigger("change");*/


        //请求等待...
        $.bf.loadDataWaiting();
        $.ajax({
            url: API.setting.getProcessSetting,
            type:'post',
            data:{'type':'get','guid':nData.id},
            success: function(msg){
                $.bf.hideLoadRemark();
                if(!msg)
                {

                }
                else if(msg.ret){
                    $.bf.parseError(msg);
                } else {
                    if(msg.FlowInfo)
                    {
                        if(nData.isDefault)
                        {
                            $("[name=hasDefault]").attr("value",1);
                        }
                        generateProcessSettingEditMode(msg,nData);
                    }
                    else
                    {
                        generateProcessSettingAddMode(nData);
                    }
                    /*var record=msg.Result;
                     var step={
                     "ICON": "",
                     "STEPSTAYTIME": Number($("[name=SS_APPROVAL_WAIT_TIME]").val()),
                     "AUTORESULT": parseInt($("[name=SS_APPROVAL_HANDLER_STEP"+a+"_LIMIT]:checked").val()),
                     "PERSONSTAYTIME": Number($("[name=SS_APPROVAL_WAIT_TIME]").val()),
                     "LOOPTYPE": parseInt($("[name=SS_APPROVAL_HANDLER]:checked").val()),
                     "DISPLAY": []
                     };
                     $.each(record.STEP,function(k,v){
                     $("[name=SS_APPROVAL_HANDLER_STEP"+k+"_LIMIT][value="+ v.AUTORESULT+"]").trigger("click");
                     $("[name=SS_APPROVAL_HANDLER][value="+ v.LOOPTYPE+"]").trigger("click");
                     //$("[name=SS_APPROVAL_WAIT_TIME]").attr("value",v.PERSONSTAYTIME);
                     $("[name=SS_APPROVAL_WAIT_TIME]").attr("value",v.STEPSTAYTIME);
                     });*/
                }
            }
        });
    }
//选中流程列表自动加载流程数据
    $("#SS_APPROVAL_ITEM")[0].tree.onSelectChange.add(function(id,node,obj){
        generateProcessSetting(node.data());
        if(node.data("isDefault"))
        {
            $("[name=SS_APPROVAL_DEFAULT]").attr("checked",true).trigger("change");
        }
    });
//其他设置获取
    function getProcessSetting(n){
        //var processType = setGroup.getSelectNodes().data("processType");
        var nData=n.data();
        if(nData['processType'] == undefined){
            return false;
        }
        //$("[name=SS_APPROVAL_TYPE] option").attr("selected",false);
        //$("[name=SS_APPROVAL_TYPE] option[value="+nData.processType+"]").attr("selected",true);
        $.bf.hideLoadRemark();
        //初始化界面
        var processTree = $("#SS_APPROVAL_ITEM")[0].tree;
        processTree.extraParams.type = nData['processType'] == 1 ? "sendOut":"decrypt";
        $("#SS_APPROVAL_AUDI")[0].tree.extraParams.processType = nData['processType'];
        //$("#SS_APPROVAL_AUDI")[0].tree.extraParams.processGuid = nData['id'];
        //processTree.load();
        var form=$("#process-setting");
        //form.clearForm();
        //form.validate().resetForm();

        $("#SS_APPROVAL_TYPE").attr("value",nData.processTypeName);
        $("[name=SS_APPROVAL_TYPE]").attr("value",nData.processType);
        //var defaultNodeData = processTree.firstNodeData;
        //console.log(defaultNodeData);
        //processTree.setDefaultValue({text:defaultNodeData.text,value:defaultNodeData.id});
        function defaultSetFistNode(){
            var defaultNodeData = processTree.firstNodeData;
            $("#SS_APPROVAL_ITEM")[0].setDefaultValue({text:defaultNodeData.text,value:defaultNodeData.id});
            processTree.onFirstLoad.remove(defaultSetFistNode);
        }
        //processTree.onFirstLoad.remove(defaultSetFistNode);
        processTree.onFirstLoad.add(defaultSetFistNode);
        processTree.load();
        //console.log("ssss");
    }
//setGroup.onSelect.add(getProcessSetting);
//setGroup.onAfterLoad.add(getProcessSetting);

    $("#cancel-setting").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        contentContainer.find("form:visible")[0].reset();
    });
//自动显示步骤
    function processStepViewHandler(stepTotal){
        if(stepTotal<=0)return;
        var singleHandlerChecked = $("[name=SS_APPROVAL_HANDLER][value=1]").attr("checked");
        var handlerDisabled = singleHandlerChecked?"disabled='disabled'":"";
        var handlerChecked = singleHandlerChecked?"checked='checked'":"";
        var handlerSelectChecked = singleHandlerChecked?"":"disabled='disabled'";
        $temp = [];
        $temp.push('<div class="m-panel-item s-panel-item u-process-step f-dn" data-step="[step]"  >');
        $temp.push('<div class="u-decryption-sp" >');
        $temp.push('<span class="">');
        $temp.push('<i class="icon-process-step"></i>');
        $temp.push('</span>');
        $temp.push('<span class="u-setting-Approval-span">[step]级审批</span>');
        $temp.push('</div>');
        $temp.push('<div style="overflow: hidden;">');
        $temp.push('<span class="u-process-text">');
        $temp.push('<ul class="u-setting-node-property">');

        $temp.push('<li>');
        $temp.push('<span class="u-setting-node-property-way-panel">方式</span>');
        $temp.push('<span class="u-setting-node-property-way-panel">');
        $temp.push('<label><input type="radio" class="f-input-align u-step-handler-auto" data-group="step[step]" name="SS_APPROVAL_HANDLER_STEP[step]"  value="1">默认</label></span>');
        $temp.push('<span class="u-setting-node-property-way-panel">');
        $temp.push('<label><input type="radio" class="f-input-align u-step-handler-custom" data-group="step[step]" name="SS_APPROVAL_HANDLER_STEP[step]" value="2">自定义审批人/部门</label></span>');
        $temp.push('</li>');

        $temp.push('<li class="u-step-handler-audi" data-group="step[step]">');
        $temp.push('<span class="u-setting-node-property-way-panel">人员</span>');

        $temp.push('<span class="u-setting-node-property-way-panel">');
        $temp.push('<label><input type="text" name="SS_APPROVAL_HANDLER_STEP[step]_AUDI_1" class="u-panel-input2 u-select-user u-select-user1" disabled="disabled" data-step-index="[step]" ></label>');
        $temp.push('</span>');

        /*$temp.push('<span class="u-setting-node-property-way-panel u-step-audi-ext">');
         $temp.push('<label><input type="text" name="SS_APPROVAL_HANDLER_STEP[step]_AUDI_2" class="u-panel-input2 u-select-user u-select-user1"></label>');
         $temp.push('</span>');

         $temp.push('<span class="u-setting-node-property-way-panel u-step-audi-ext">');
         $temp.push('<label><input type="text" name="SS_APPROVAL_HANDLER_STEP[step]_AUDI_3" class="u-panel-input2 u-select-user u-select-user1"></label>');
         $temp.push('</span>');*/

        /*$temp.push('</li>');

         $temp.push('<li>');*/
        $temp.push('<span class="u-setting-node-property-way-panel f-margin-left30">超时处理</span>');
        $temp.push('<span class="u-setting-node-property-way-panel">');
        $temp.push('<label><input type="radio" class="f-input-align u-setting-approval-handler" name="SS_APPROVAL_HANDLER_STEP[step]_LIMIT" value="1">通过</label>');
        $temp.push('</span>');

        $temp.push('<span class="u-setting-node-property-way-panel">');
        $temp.push('<label><input type="radio" class="f-input-align u-setting-approval-handler" name="SS_APPROVAL_HANDLER_STEP[step]_LIMIT" value="2">驳回</label>');
        $temp.push('</span>');

        $temp.push('</li>');
        $temp.push('</ul>');
        $temp.push('</span>');
        $temp.push('</div>');
        $temp.push('</div>');
        $tempalte = $temp.join("");
        var stepContainer = $("#u-step-container");
        stepContainer.empty();
        for(var a=1;a<=stepTotal;a++)
        {
            $view = $tempalte.replace(/\[step\]/gi,a);
            stepContainer.append($view);
            stepContainer.find(".u-process-step:last").fadeIn();
        }
        if(singleHandlerChecked)
        {
            stepContainer.find(".u-step-handler-auto").each(function(){
                $(this).attr("disabled",true);
            });
            stepContainer.find(".u-step-handler-custom").each(function(){
                $(this).attr("checked",true).trigger("change");
            });
        }
        var selMode = $("[name=SS_APPROVAL_HANDLER][value=1]").attr("checked")?"simple":"multiple";
        //console.log($("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked"));
        var opts = {
            url:API.setting.getProcessStepUserGroupTree,
            selMark:'',
            textProperty:'text',
            pidProperty:'id',
            dataRoot:'Group',
            extraParams:{includeUser:1},
            autoExpandLevel:0,
            selMode:selMode,
            selectChildrenMode:false,
            itemWidth:165,
            itemTextAlign:"left",
            emptyNode:{text:'取消选择',value:''},
            showCheckbox:true,
            itemClickSelect:false,
            showIcon:true,
            parseData:function(data)
            {
                var dataRoot = data.Result;
                var renderData=[];
                if(!data.Result)
                {
                    return [];
                }
                if(dataRoot.group)
                {
                    var group= $.map(dataRoot.group,function(v){
                        v.icon = "icon-group-15";
                        v.isGroup = true;
                        //console.log($("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked"));
                        if($("[name=SS_APPROVAL_HANDLER][value=1]").attr("checked"))
                        {
                            v.selectLocked=true;
                        }
                    });
                    renderData=renderData.concat(dataRoot.group);
                }
                if(dataRoot.user)
                {
                    var user= $.map(dataRoot.user,function(v){
                        v.icon = "icon-user-15";
                        v.leaf = true;
                        v.isGroup = false;
                    });
                    renderData=dataRoot.user.concat(renderData);
                }
                return renderData;
            },
            parseChildrenData:function(data)
            {
                //console.log(data);
                var renderData =[];
                if(data.group)
                {
                    var group= $.map(data.group,function(v){
                        v.icon = "icon-group-15";
                        v.isGroup = true;
                        if($("[name=SS_APPROVAL_HANDLER][value=1]").attr("checked"))
                        {
                            v.selectLocked=true;
                        }
                    });
                    renderData=renderData.concat(data.group);
                }
                //console.log(data.user);
                if(data.user)
                {
                    var user= $.map(data.user,function(v){
                        v.icon = "icon-user-15";
                        v.leaf = true;
                        v.isGroup = false;
                    });
                    renderData=data.user.concat(renderData);
                }
                return renderData;
            },
            autoLoad:false
        };
        //生成控件
        contentContainer.find(".u-select-user1:first").ajaxTreeSelect(opts);
        var firstUserSelect = contentContainer.find(".u-select-user1:first")[0];
        //第二个及第二个之后的下拉组织机构树
        if($("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked"))
        {
            contentContainer.find(".u-select-user1:first").attr("checkProcessStepAudi",true);
        }
        contentContainer.find(".u-select-user1:gt(0)").each(function(){
            var me= $(this);
            var tmp = $.extend(true,{},opts);
            /**
             * 筛选过滤
             * 上一个节点选择部门时，筛选掉同级的部门，上一个节点选择员工时，筛选掉该员工
             */
            tmp.filterRowData = function(v,node,obj)
            {
                //var n = firstUserSelect.tree.getSelectNodes();
                //var b =
                //console.log(n);
                /*var a = n.map(function(){
                 console.log($(this));
                 var id = $(this).data();
                 //console.log(a);
                 //console.log(id +"=="+ v[obj.opts.idProperty]);
                 if(id == v[obj.opts.idProperty])
                 {
                 return this;
                 }
                 });*/
                //console.log(v);

                /*var stepIndex = me.attr("data-step-index");
                 stepIndex--;
                 if(contentContainer.find(".u-select-user1[data-step-index="+stepIndex+"]").length<=0)
                 {
                 return;
                 }
                 var select = contentContainer.find(".u-select-user1[data-step-index="+stepIndex+"]")[0];*/
                var stepIndex = me.attr("data-step-index");
                var n = false;
                for(stepIndex;stepIndex>0;stepIndex--)
                {
                    if(contentContainer.find(".u-select-user1[data-step-index="+stepIndex+"]").length<=0)
                    {
                        continue;
                    }
                    var select = contentContainer.find(".u-select-user1[data-step-index="+stepIndex+"]")[0];
                    var curSelectNode = select.tree.getSelectNodes();
                    if(n === false)
                    {
                        n = curSelectNode;
                    }
                    else
                    {
                        n = n.add(curSelectNode);
                    }
                }

                if(n)
                {
                    var row = v;
                    $.each(n,function(){
                        var m = $(this);
                        if(m.data(select.tree.opts.idProperty) == v[obj.opts.idProperty])
                        {
                            //node.removeClass(obj.opts.expandableCls);
                            //row.leaf = true;
                            row = false;
                            /*if(!v["isGroup"])
                             {
                             node.addClass(select.tree.getConfig('disabledCls'));
                             }*//*
                         if(!node[0].childrenItems || node[0].childrenItems.length<=0)
                         {
                         node.remove();
                         }*/
                            return false;
                        }
                        //console.log(node);
                        if(m.data("isGroup") && v["isGroup"])
                        {
                            var meLevel = node.data(obj.opts.levelProperty) || 0;
                            var limitLevel =m.data(select.tree.opts.levelProperty) || 0;
                            limitLevel--;
                            //meLevel++;
                            if(limitLevel <= meLevel)
                            {
                                row = false;
                                return false;
                            }
                        }
                    });
                    //console.log(node);
                    return row;
                }

            };
            if($("[name=SS_APPROVAL_HANDLER][value=2]").attr("checked"))
            {
                $(this).attr("checkProcessStepAudi",true);
            }
            me.ajaxTreeSelect(tmp);
        });
        firstUserSelect.load();
        contentContainer.find(".u-select-user1").each(function(){
            var me = $(this);
            me[0].tree.onSelectChange.add(function(id,node,obj){
                /*var sel = obj.getSelectNodes();
                 console.log(sel);*/
                var stepIndex = me.attr("data-step-index");
                if(stepIndex<stepTotal)
                {
                    stepIndex++;
                    //contentContainer.find(".u-select-user1[data-step-index="+stepIndex+"]")[0].load();
                    var next =contentContainer.find(".u-select-user1[data-step-index="+stepIndex+"]")[0];
                    //next.setEmpty();
                    if(!next.tree.isFirstLoad)
                    {
                        next.setEmpty();
                    }
                    next.tree.load(false);
                }
                var selGroups = me.attr("selGroups") || 0;
                var selUsers = me.attr("selUsers") || 0;
                if(node)
                {
                    var nData = node.data();
                    if(node.isSelected(obj.opts.selectedCls))
                    {
                        if(nData.isGroup===false)
                        {
                            selUsers++;
                        }
                        else
                        {
                            selGroups++;
                        }
                    }
                    else
                    {
                        if(nData.isGroup===false)
                        {
                            selUsers--;
                        }
                        else
                        {
                            selGroups--;
                        }
                    }
                    //已选数据不能小于0
                    if(selGroups<0)selGroups=0;
                    if(selUsers<0)selUsers=0;
                    me.attr("selGroups",selGroups);
                    me.attr("selUsers",selUsers);
                }
                else
                {
                    me.attr("selGroups",0);
                    me.attr("selUsers",0);
                }
                me.blur();
            });
        });
        contentContainer.find(".u-setting-approval-handler,.u-step-handler-auto,.u-step-handler-custom").each(function(){
            $(this).rules("add",{required:true});
        });
    }
    $("[name=SS_APPROVAL_LEVEL]").bind({
        change:function(){
            if($(this).attr("checked"))
            {
                var val=parseInt($(this).val());
                processStepViewHandler(val);
                //$(".u-process-step").show();
                //$(".u-process-step:gt("+val+")").hide();
            }
            // $("[name=SS_APPROVAL_HANDLER]").trigger("change");
        }
    });
    function audiSimpleMode(isLoad)
    {
        //console.log("ssssssssss");
        isLoad = isLoad || false;
        $(".u-select-user1").each(function(){
            $(this)[0].setTreeConfig("selMode","simple");
            //$(this)[0].setEmpty();
            if(isLoad){
                $(this)[0].load();
            }
            $(this).attr("checkProcessStepAudi",null);
        });
        $(".u-step-handler-auto").each(function(){
            $(this).attr("disabled",true);
        });
    }
    function audiMultiMode(isLoad)
    {
        isLoad = isLoad || false;
        $(".u-select-user1").each(function(){
            $(this)[0].setTreeConfig("selMode","multiple");
            if(isLoad){
                $(this)[0].load();
            }
            $(this).attr("checkProcessStepAudi",true);
            //$(this)[0].setEmpty();
        });
        $(".u-step-handler-auto").each(function(){
            $(this).attr("disabled",false);
        });
    }
    $("[name=SS_APPROVAL_HANDLER]").bind({
        change:function(){
            //return;
            if($(this).attr("checked"))
            {

                if(parseInt($(this).val())==2)
                {
                    //$("[name=SS_APPROVAL_AUDI_WAIT_TIME]").show();
                    $("#u-audi-wait-time").show();
                    $(".u-step-audi-ext").show();
                    $(".u-step-handler-auto").attr({"disabled":false});
                    $(".u-step-handler-custom").trigger("change");
                    /*$(".u-select-user1").each(function(){
                     $(this)[0].setTreeConfig("selMode","multiple");
                     $(this)[0].load();
                     $(this).attr("checkProcessStepAudi",true);
                     //$(this)[0].setEmpty();
                     });*/
                    audiMultiMode(true);
                }
                else
                {
                    $(".u-step-handler-custom").attr({"checked":true}).trigger("change");
                    $(".u-step-handler-auto").attr({"disabled":true});
                    //$("[name=SS_APPROVAL_AUDI_WAIT_TIME]").hide();
                    $("#u-audi-wait-time").hide();
                    $(".u-step-audi-ext").hide();
                    /*$(".u-select-user1").each(function(){
                     $(this)[0].setTreeConfig("selMode","simple");
                     //$(this)[0].setEmpty();
                     $(this)[0].load();
                     $(this).attr("checkProcessStepAudi",null);
                     });*/
                    //console.log(parseInt($(this).val()));
                    audiSimpleMode(true);
                }
            }
        }
    });

    /**
     * 单人审批的模式下，审批员的滞留时间与节点滞留时间是一样的
     */
    $("[name=SS_APPROVAL_WAIT_TIME]").bind({
        change:function(){
            var val = parseInt($(this).val());
            var nextVal = parseInt($("[name=SS_APPROVAL_AUDI_WAIT_TIME]").val());
            if($("[name=SS_APPROVAL_HANDLER]:checked").val()==1 || nextVal>val)
            {
                $("[name=SS_APPROVAL_AUDI_WAIT_TIME]").attr("value",val);
            }
            $("[name=SS_APPROVAL_AUDI_WAIT_TIME]").attr("max",val);
        }
    });
//设置默认流程时不能选择使用人员
    $("[name=SS_APPROVAL_DEFAULT]").bind({
        change:function(){
            if($(this).attr("checked"))
            {
                $("#SS_APPROVAL_AUDI").attr("disabled",true);
                $("#SS_APPROVAL_AUDI")[0].setEmpty();
                $("#u-role-level").attr("disabled",true);
                $("#u-role-level")[0].setEmpty();
            }
            else
            {
                $("#SS_APPROVAL_AUDI").attr("disabled",false);
                $("#u-role-level").attr("disabled",false);
            }
        }
    });


//点击步骤的默认时自动清掉自定义申批员
    $("body").delegate(".u-step-handler-auto",{
        change:function()
        {
            var group=$(this).attr("data-group");
            if($(this).attr("checked"))
            {
                $(".u-step-handler-audi[data-group="+group+"]").find(".u-select-user").each(function(){
                    $(this)[0].setDefaultValue({text:'',value:''});
                    $(this).attr({required:null,disabled:true}).blur();
                    layer.closeTips();
                });
            }
        }
    });
    $("body").delegate(".u-step-handler-custom",{
        change:function()
        {
            var group=$(this).attr("data-group");
            if($(this).attr("checked"))
            {
                $(".u-step-handler-audi[data-group="+group+"]").find(".u-select-user").each(function(){
                    //$(this)[0].setDefaultValue({text:'',value:''});
                    if($(this).is(":visible"))
                    {
                        $(this).attr({required:true,disabled:false});
                    }
                });
            }
        }
    });
    $(".u-select-user").bind("change",function()
    {
        var val=$(this).val();
        var group=$(this).parents("li").attr("data-group");
        $(".u-step-handler-custom[data-group="+group+"]").attr("checked",true).trigger("change");
    });

    $("#u-clear-prev").click(function(){
        if($(this).isDisabled())
        {
            return false;
        }
        $("[name=SS_APPROVAL_AUDI]").prev()[0].setEmpty();
        //$("[name=SS_APPROVAL_GROUP]").prev()[0].setDefaultValue({text:'',value:''});
        $("[name=SS_APPROVAL_ROLE]").prev()[0].setEmpty();
    });

    var searchConditionList = $("#u-search-condition")[0];
    var conditionData=[
        {text:'全部',value:0,checked:true}
    ];
    searchConditionList.setTreeConfig("localData",conditionData);

    searchConditionList.tree.me.unbind("onSelectChange");
    searchConditionList.tree.load(true);

    //搜索
    function searchHandler()
    {
        if(whiteListTable.is(":visible"))
        {
            var val=$("#u-search-input").val();
            whiteList.extraParams.Keyword=val;
            whiteList.reload();
        }
        if(workModeListTable.is(":visible"))
        {
            var val=$("#u-search-input").val();
            workModeList.extraParams.Keyword=val;
            workModeList.reload();
        }
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
    $("#u-copy-count").bind({
        change:function()
        {

            var val = $(this).val();

            if(!parseInt(val) || parseInt(val)<=0)
            {
                //console.log(val);
                $("#u-copy-length").attr({"disabled":true,"required":false}).attr("value","").trigger("blur");
            }
            else
            {
                $("#u-copy-length").attr({"disabled":false,"required":true});
            }
        }
    });

    var scrollUpCount = 0;
    var scrollDownCount = 0;
    function goToNextPanel()
    {
        var node = setGroup.getSelectNodes();
        if(node.data("processType")>=0)return;
        var nextNode = setGroup.getNextNode(node);
        if(setGroup.getNodeId(nextNode)==4)
        {
            return;
            nextNode = setGroup.getChildrenNode(nextNode);
        }

        if(nextNode.length>0){
            nextNode.trigger("click");
        }
        tabContainer.unbind("mousewheel",mouseWheelBind);
        setTimeout(function(){
            tabContainer.mousewheel(mouseWheelBind);
        },1000);
    }
    function goToPrevPanel(){
        var node = setGroup.getSelectNodes();
        if(node.data("processType")>=0)return;
        var prevNode = setGroup.getPrevNode(node);
        if(setGroup.getNodeId(node)=="a03f5142-178d-11e4-806b-902b34b05c67")
        {
            var parentNode = setGroup.getParentNode(node);
            prevNode = setGroup.getPrevNode(parentNode);
        }
        if(prevNode.length>0){
            prevNode.trigger("click");
        }
        tabContainer.unbind("mousewheel",mouseWheelBind);
        setTimeout(function(){
            tabContainer.mousewheel(mouseWheelBind);
        },1000);
    }

    function mouseWheelBind(e,p){
        var nScrollHeight = $(this)[0].scrollHeight;
        var nScrollTop = $(this)[0].scrollTop;
        if(p<0 && nScrollTop + $(this).height() >= nScrollHeight)
        {
            scrollDownCount++;
            if(scrollUpCount>0)
            {
                scrollUpCount--;
            }
            if(scrollDownCount==3)
            {
                goToNextPanel();
                scrollDownCount = 0;
                scrollUpCount = 0;
            }

        }
        else if(p>0 && nScrollTop<=0){
            scrollUpCount++;
            if(scrollDownCount>0)
            {
                scrollDownCount--;
            }
            if(scrollUpCount==3)
            {
                goToPrevPanel();
                scrollDownCount=0;
                scrollUpCount=0;
            }
        }
    }
    //滚动自动切换
    //tabContainer.mousewheel(mouseWheelBind);

    var whiteListTable = $("#u-ajax-table-container-white-list");
    var whiteList=whiteListTable.ajaxTable({
        url:API.setting.getEmailWhiteList,
        rows:50,
        columns:[
            {
                xtype:'checkbox',width:35
            },
            {
                dataIndex:'name',text:'名称',width:120,sort:'name'
            },
            {
                dataIndex:'from_white_list_view',text:'发件人白名单',width:220,"defaultValue":"禁用"
            },
            {
                dataIndex:'to_white_list_view',text:'收件人白名单',width:200,"defaultValue":"禁用"
            },
            {
                dataIndex:'keep_sent',text:'发件箱设置',width:200,renderer:function(v){return v==false?"删除":"保留"}
            },
            {
                dataIndex:'log_attachemts',text:'是否保留附件',width:200,renderer:function(v){return v==true?"保留":"删除"}
            }
        ],
        idProperty:'id',
        selMark:'',
        autoLoad:true,
        extraParams:{}
    });
    var listPageToolbar=$("#u-page-toolbar-white-list").pageToolbar({
        table:whiteList
    });
    //添加白名单
    $("#add-white-list").click(function(){
        $(".m-ajax-form").ajaxPanel({
            url:API.setting.addWhiteListPage,
            hidePanel:".m-content-item.f-full-show[data-group=6]",
            success:function(me,oldPanel)
            {
                whiteListFormPageLogic(me);
            },
            error: $.ajaxCommonCallback
        });
    });
    //编辑白名单按钮
    $("#edit-white-list").click(function(){
        if(!whiteList.isSelectOne())
        {
            layer.alert(L.pleaseSelectOne,0);
        }
        else
        {
           // var id = whiteList.getSelectIds();
            var node = whiteList.getSelectNodes();
            editWhiteListAction(node);
        }
    });
    //删除白名单按钮
    $("#del-white-list").click(function(){
        if(!whiteList.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMore,0);
        }
        else
        {
            layer.confirm(L.delConfirm,function(){
                var id = whiteList.getSelectIds().join(",");
                $.fastAction(API.setting.deleteWhiteList,{id:id},function(ret,suc){
                    if(suc)
                    {
                        whiteList.reload();
                    }
                });
            });
        }
    });
    whiteListTable.bind({
        onItemDblClick:function(e,id,node){
            editWhiteListAction(node);
        }
    });
    function editWhiteListAction(node)
    {
        var data = $.toJSON(node.data());

        $(".m-ajax-form").ajaxPanel({
            url:API.setting.editWhiteListPage,
            params:{
                data:data
            },
            hidePanel:".m-content-item.f-full-show[data-group=6]",
            success:function(me,oldPanel)
            {
                whiteListFormPageLogic(me);
            },
            error: $.bf.ajaxCommonCallback
        });
    }

    function whiteListFormPageLogic(me)
    {
        var roleInput = $("#u-role-select");
        roleInput.ajaxTreeSelect({
            url:API.setting.getRoleTree,
            idProperty:'RoleTypeID',
            textProperty:'TypeName',
            pidProperty:'ParentTypeID',
            emptyNode:{text:"全局配置",displayText:"全局配置",value:""},
            autoLoad:true,
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
        var val = roleInput.attr("data-value");
        var name = roleInput.attr("data-name");
        if(val)
        {
            if(val=="default")
            {
                val="";
            }
            roleInput[0].setDefaultValue({text:name,value:val});
        }
        me.find(".m-panel-title").collapsePanel();
        me.find(".u-smarty-textarea").smartyTextArea({
            //inputMinWidth:50,
            msg:{
                formatError:"请输入正确的Email格式",
                uniqueError:"你输入的内容已经存在"
            }
        });
        me.find(".u-btn-cancel").click(function(){
            me[0].bf.close();
        });
        $("#save-white-list").click(function(){
            var form = me.find("form");
            var valid = form.validate();
            if(form.find("input.z-error").length<=0&&valid.form())
            {
                $.bf.operationWaiting();
                form.ajaxSubmit({
                    url:API.setting.saveWhiteList,
                    success:function(data){
                        $.bf.ajaxCommonCallback(data,function(ret,suc){
                            if(suc)
                            {
                                whiteList.reload();
                                me[0].bf.close();
                            }
                        });
                    },
                    error: $.bf.ajaxErrorHandle
                });
            }
        });
        me.find("[name=SENDER_HANDLER],[name=RECIPIENTS_HANDLER]").change(function(){
            var ts = $(this);
            var link = ts.attr("data-link");
            var pr = ts.parents("li");
            var li = pr.next();
            var listBox = li.find(".u-smarty-textarea");
            if(!pr.find(".u-checked-default").attr("checked"))
            {
                li.hide();
                listBox[0].bf.clear();
            }
            else
            {
                li.show();
                listBox[0].bf.autoSetInputPos();
            }
        });
        me.find("#import-sender-list").selectFileBtn({
            fileBtn:"#import-sender-list-file"
        });
        me.find("#import-recipients-list").selectFileBtn({
            fileBtn:"#recipients-white-list-file"
        });
        me.find("#export-sender-list").click(function(){
            var data = $("[name=from_white_list]").val();
            if(data)
            {
                $.download(API.setting.exportWhiteList,{data:data},"邮件发件人白名单.txt");
            }
            else
            {
                layer.alert(L.noData);
            }
        });
        me.find("#export-recipients-list").click(function(){
            var data = $("[name=to_white_list]").val();
            if(data)
            {
                $.download(API.setting.exportWhiteList,{data:data},"邮件发件人白名单.txt");
            }
            else
            {
                layer.alert(L.noData);
            }
        });

    }

    $(".m-ajax-form").delegate("#import-sender-list-file","change",function(){
        var val = $(this).val();
        if(!val)return;
        $.bf.operationWaiting(L.importing);
        $.ajaxFileUpload({
            url:API.setting.importWhiteList,
            fileElementId:"import-sender-list-file",
            secureuri:false,
            dataType:"json",
            success:function(data)
            {
                $.bf.ajaxCommonCallback(data,function(ret,suc){
                    if(suc&&ret.data)
                    {
                        var whiteList = $("#sender-white-list")[0];
                        //var arr = ret.data.split(whiteList.bf.getConfig("split"));
                        //console.log(arr);
                        whiteList.bf.add( ret.data,"import");
                        /*$.each(arr,function(k,v){
                            if(whiteList.bf.check(v))
                            {
                                whiteList.bf.add(v,"import");
                            }
                        });*/
                    }
                    else
                    {
                        layer.alert(L.noParseData);
                    }
                });
            }
        });
    });
    $(".m-ajax-form").delegate("#recipients-white-list-file","change",function(){
        var val = $(this).val();
        if(!val)return;
        $.bf.operationWaiting(L.importing);
        $.ajaxFileUpload({
            url:API.setting.importWhiteList,
            fileElementId:"recipients-white-list-file",
            secureuri:false,
            dataType:"json",
            success:function(data)
            {
                $.bf.ajaxCommonCallback(data,function(ret,suc){
                    if(suc&&ret.data)
                    {
                        var whiteList = $("#recipients-white-list")[0];
                        //var arr = ret.data.split(whiteList.bf.getConfig("split"));
                        whiteList.bf.add( ret.data,"import");
                        /*$.each(arr,function(k,v){
                            if(whiteList.bf.check(v))
                            {
                                whiteList.bf.add(v,"import");
                            }
                        });*/
                    }
                    else
                    {
                        layer.alert(L.noParseData);
                    }
                });
            }
        });
    });
    $(".m-content-item-form-setting,.m-ajax-form").hide();

    //可收缩的panel
    $(".m-panel-title").collapsePanel();
    var EBackFileDom = $("#EBackFile")[0];
    var EBackFileSwitch = new Switchery(EBackFileDom,{
        color:"#1A7CF6",
        size:"small",
        jackColor:"#f8f8f8"
    });


    var switch_timeDom = $("#switch_time")[0];
    var TimeSwitch = new Switchery(switch_timeDom,{
        color:"#1A7CF6",
        size:"small",
        jackColor:"#f8f8f8"
    });
    var divtime=$("#slider-time");

    //判断初始值
    if(switch_timeDom.checked)
    {
        divtime.show();
    }
    else
    {
        divtime.hide();
    }

    //加密时间间隔必须为数字，且最小值为1
    var SecondDom=$("#TickTime")[0];
    SecondDom.onblur=function(){
        if(isNaN(SecondDom.value))
        {
            SecondDom.value=1;
        }
        if(SecondDom.value<1)
        {
            SecondDom.value=1;
        }
    }

    switch_timeDom.onchange=function(){

        if(switch_timeDom.checked)
        {
            divtime.show();
            //打开开关的时候判断时间间隔
            if(SecondDom.value<1)
            {
                SecondDom.value=1;
            }
        }
        else
        {
            divtime.hide();
        }
    }


    var DBackFileDom = $("#DBackFile")[0];
    var DBackFileSwitch = new Switchery(DBackFileDom,{
        color:"#1A7CF6",
        size:"small",
        jackColor:"#f8f8f8"
    });
    EBackFileDom.onchange=function(){
        var common = $("#u-common-backup-setting");
        var edit = $("#u-edit-backup-setting");
        if(EBackFileDom.checked)
        {
            edit.show();
        }
        else
        {
            edit.hide();
        }
        var isHideCommon = !EBackFileDom.checked && !DBackFileDom.checked;
        if(isHideCommon)
        {
            common.hide();
        }
        else{
            common.show();
        }
    };
    DBackFileDom.onchange=function(){
        var common = $("#u-common-backup-setting");
        var del = $("#u-del-backup-setting");
        if(DBackFileDom.checked)
        {
            del.show();
        }
        else
        {
            del.hide();
        }
        var isHideCommon = !EBackFileDom.checked && !DBackFileDom.checked;
        if(isHideCommon)
        {
            common.hide();
        }
        else{
            common.show();
        }
    };

    //====================工作模式-start===============================
    var workModeGlobalSettingAdd = false;
    var workModeListTable = $("#u-ajax-table-container-workmode-list");
    var day=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    var dayName=["周一","周二","周三","周四","周五","周六","周日"];
    var workModeList=workModeListTable.ajaxTable({
        url:API.setting.getWorkModeList,
        rows:50,
        dataRoot:"rows",
        columns:[
            {
                xtype:'checkbox',width:25
            },
            {
                dataIndex:'RoleName',text:'名称'
            },
            {
                dataIndex:'Forbidden',text:'工作模式切换',renderer:function(v,data){
                    return v==1?"启用":"禁用";
                }
            },
            {
                dataIndex:'EnableActCtrl',text:'行为管控',renderer:function(v,data){
                return v==1?"开启":"关闭";
                }
            },
            {
                dataIndex:'RoleID',text:'重复周期',
                renderer:function(i,data){
                    if(i=="全局配置"){
                        workModeGlobalSettingAdd=true;
                    }
                    var str=[];
                    $.each(day,function(k,v){
                        if(data[v]!=undefined){
                            str.push(dayName[k]);
                        }
                    });
                    return str.join("，");
                }
            },
            {
                dataIndex:'RepeatTime',text:'生效时段',
                renderer:function(i,data){
                    var str=[];
                    $.each(day,function(k,v){
                        if(data[v]!=undefined){
                            $.each(data[v],function(a,b){
                                str.push(b.StartTime+"-"+ b.EndTime);
                            });
                            return false;
                        }
                    });
                    return str.join("，");
                }
            }
        ],
        idProperty:'RoleID',
        totalRoot:"total",
        selMark:'',
        autoLoad:true,
        extraParams:{}
    });
    $("#u-page-toolbar-workmode-list").pageToolbar({
        table:workModeList
    });


    //添加工作模式
    $("#add-workmode-list").click(function(){
        workModeAction();
    });

    function workModeFormPageLogic(me){
        var roleInput = $("#u-role-select");
        var first=true;
        roleInput.ajaxTreeSelect({
            url:API.setting.getNoPolicyRoleTree,
            idProperty:'RoleTypeID',
            textProperty:'TypeName',
            pidProperty:'ParentTypeID',
            //emptyNode:{text:"全局配置",displayText:"全局配置",value:""},
            emptyNode:false,
            autoLoad:true,
            selMode:"multiple",
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
                    if(first && !workModeGlobalSettingAdd){
                        rData.unshift({RoleTypeID:"全局配置",TypeName:"全局配置",isRole:true,checkable:true,leaf:true});
                        first=false;
                    }
                    return rData;
                }
                else
                {
                    return [];
                }
            }
        });
        me.find(".u-btn-cancel").click(function(){
            me[0].bf.close();
        });

        var EnableActCtrlDom = $("#EnableActCtrl")[0];
        var EnableActCtrlSwitch = new Switchery(EnableActCtrlDom,{
            color:"#1A7CF6",
            size:"small",
            jackColor:"#f8f8f8"
        });
        var ForbiddenDom = $("#Forbidden")[0];
        var ForbiddenSwitch = new Switchery(ForbiddenDom,{
            color:"#1A7CF6",
            size:"small",
            jackColor:"#f8f8f8"
        });

        $("[name='RepeatDaySwitch']").change(function(){
            repeatDaySwitch();
        });
        $("#repeat-day-list [name=RepeatDay]").change(function(){
            //console.log($("#repeat-day-list [name='RepeatDay']:checked").size());
            if(!$(this).prop("checked") && $("#repeat-day-list [name='RepeatDay']:checked").size()<1){
                $(this).prop("checked",true);
                return false;
            }
        });
        repeatDaySwitch();
        $("#work-time-list").delegate(".icon-tool-add","click",function(e){
            addRepeatDayRange();
            return false;
        });
        $("#work-time-list").delegate(".icon-tool-del","click",function(e){
            var li = $(this).parents("li:first");
            li.nextAll().each(function(){
                var index = $(this).index();
                $(this).find(".range-title").html("时段"+index);
            });
            li.remove();
            initDayRange();

            return false;
        });
        $("[name='RepeatTimeSwitch']").change(function(){
            repeatTimeSwitch();
        });
        if($("#work-time-list li").size()<=0){
            addRepeatDayRange();
        }
        //initDayRange();
        //初始化界面
        repeatDaySwitch();
        repeatTimeSwitch();
        $(".date-time").timePicker();

        var form = $("#workmode-form");
        var valid = form.validate();
        $("#save-workmode").click(function(){

            if(valid.form()){
                var data = {
                    "RoleID":$("[name=RoleID]").val().split(","),
                    "IsEdit":$("[name=IsEdit]").val()=="yes",
                    "EnableActCtrl":$("[name=EnableActCtrl]").prop("checked")?1:0,
                    "Forbidden":$("[name=Forbidden]").prop("checked")?1:0,
                    "TimeLimitName":"wowostar"
                };
                var item=[];
                if($("[name=RepeatTimeSwitch]:checked").val()=="24"){
                    item=[{StartTime:"00:00:00",EndTime:"23:59:59"}];
                }else{
                    $("#work-time-list li").each(function(){
                        var me = $(this);
                        var start = me.find('[data-name="StartTime"]').val();
                        var end = me.find('[data-name="EndTime"]').val();
                        item.push({StartTime:start,EndTime:end});
                    });
                }
                //console.log(item);
                $("#repeat-day-list [name=RepeatDay]:checked").each(function(){
                    var key = $(this).val();
                    data[key]=item;
                });
                /*console.log(data);
                return;*/
                data = $.toJSON(data);
                $.fastAction(API.setting.saveWorkMode,{data:data},function(ret,suc){
                    if(suc){
                        workModeList.reload();
                        me[0].bf.close();
                    }
                });
            }
        });
    }

    function repeatDaySwitch(){
        if($("[name='RepeatDaySwitch']:checked").val()=="custom"){
            $("#repeat-day-list").removeClass("f-hide").find("[name='RepeatDay']:first").prop("checked",true);
        } else {
            $("#repeat-day-list").addClass("f-hide").find("[name='RepeatDay']").each(function(){
                $(this).prop("checked",true);
            });
        }
    }

    function repeatTimeSwitch(){
        if($("[name='RepeatTimeSwitch']:checked").val()=="custom"){
            $("#work-time-list").removeClass("f-hide");
        } else {
            $("#work-time-list").addClass("f-hide");
            $("#work-time-list").empty();
            addRepeatDayRange();
        }
    }


    function initDayRange(){
        $("#work-time-list").find(".icon-tool-del,.icon-tool-add").hide();
        var size = $("#work-time-list li").size();
        if(size >1){
            $("#work-time-list .icon-tool-del").show();
        }
        if(size<5){
            $("#work-time-list li:last").find(".icon-tool-add").show();
        }

    }
    function addRepeatDayRange(){
        var t = new Date().getTime();
        var i = $("#work-time-list li").size()+1;
        $("#work-time-list").append(
            '<li>' +
                ' <span class="f-padding5 range-title">时段'+i+'</span><input type="text" class="date-time" data-name="StartTime" readonly data-field="time"  data-max-target="'+t+'"/> <span class="f-padding5">至</span> <input type="text" class="date-time" data-name="EndTime" readonly data-field="time"  data-target="'+t+'"/> ' +
                '<i class="icon-tool icon-tool-del"></i> ' +
                '<i class="icon-tool icon-tool-add"></i> ' +
            '</li>'
        );
        $(".date-time").timePicker();
        initDayRange();
    }

    $("#edit-workmode-list").click(function(){
        if(!workModeList.isSelectOne())
        {
            layer.alert(L.pleaseSelectOne,0);
        }
        else
        {
            // var id = whiteList.getSelectIds();
            var node = workModeList.getSelectNode();
            workModeAction(node.data("RoleID"),node.data("RoleName"));
        }
    });
    /*//删除白名单按钮
    $("#del-white-list").click(function(){
        if(!whiteList.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMore,0);
        }
        else
        {
            layer.confirm(L.delConfirm,function(){
                var id = whiteList.getSelectIds().join(",");
                $.fastAction(API.setting.deleteWhiteList,{id:id},function(ret,suc){
                    if(suc)
                    {
                        whiteList.reload();
                    }
                });
            });
        }
    });*/
    workModeListTable.bind({
        onItemDblClick:function(e,id,node){
            workModeAction(node.data("RoleID"),node.data("RoleName"));
        }
    });
    function workModeAction(id,name){
        var params = {};
        if(id){
            params["RoleID"]=id;
        }
        if(name){
            params["RoleName"]=name;
        }
        $(".m-ajax-form").ajaxPanel({
            url:API.setting.workModePage,
            params:params,
            hidePanel:".m-content-item.f-full-show[data-group=8]",
            success:function(me,oldPanel)
            {
                workModeFormPageLogic(me);
            },
            error: $.ajaxCommonCallback
        });
    }

    $("#del-workmode-list").click(function(){
        if(!workModeList.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMore,0);
        }
        else
        {
            layer.confirm(L.delConfirm,function(){
                var id = workModeList.getSelectIds().join(",");
                $.fastAction(API.setting.deleteWorkMode,{id:id},function(ret,suc){
                    if(suc)
                    {
                        workModeList.reload();
                    }
                });
            });
        }
    });
    //====================工作模式-end===============================
}

$(function(){
    setting();
});
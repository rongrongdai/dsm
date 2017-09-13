function log(){
    $("body").addClass("abcd");
    var operationCode={
        10 : "添加用户",
        11 : "冻结用户",
        12 : "删除用户",
        13 : "修改用户",
        14 : "添加用户组的访问权限",
        15 : "删除用户组的访问权限",


        30 : "添加组",
        31 : "删除组",
        32 : "编辑组",
        33 :"移动用户到组",
        34 :"从删除的用户中移除用户",


        50 :"添加策略",
        51 :"删除策略",
        52 :"添加组策略",
        53 :"移除组策略",
        54 :"编辑组策略",
        55 :"添加访问权限到策略模板",
        56 :"删除访问权限到策略模板",
        57 :"添加访问权限到组策略",
        58 :"删除访问权限到组策略",
        59 :"拷贝组策略",
        60 :"拷贝组策略到库",
        61 :"拷贝策略库到组",


        70 :"设置用户或组的特权信息",


        90 :"配置系统设置",
        91 :"配置系统文件信息",
        92 :"配置文件外发信息",
        93 :"配置水印字符串",
        94 :"配置离线时间",
        95 :"配置拷贝参数",
        96 :"添加访问权限全局设置",
        97 :"删除访问权限全局设置",

        110 :"添加角色类型",
        111 :"删除角色类型",
        112 :"添加角色",
        113 :"修改角色",
        114 :"删除角色",
        115 :"绑定用户角色",
        116 :"删除用户角色"
    };
    var logType={
        ManulDecryptFile:"手动解密",
        OfflineStrategy :"导入离线授权",
        ModifyUserPwd :"修改密码",
        ManulAuthorFile :"文件授权",
        FileOutPut :"文件外发",
        ManulEncryptFile :"手动加密"
    };

    var contentContainer=$("#m-content-container-log");
    var toolbar=$("#log-pages");
    var formBtnPanel=contentContainer.find(".m-btn");
    function selectBtn(me,targetCls){
        toolbar.find("."+ $.bf.config.selectedCls).removeClass($.bf.config.selectedCls);
        contentContainer.find(".m-content-item").hide();
        me.addClass($.bf.config.selectedCls);
        contentContainer.find("."+targetCls).fadeIn();
        formBtnPanel.fadeIn();
    }
    //var closes;
    //function haha(type){
    //    var domList = {1:"#export-box",2:"#export-authorization",3:"#White-list",4:"#outer-hair",5:"#decrypt-o",6:"#outside-w"};
    //    var area = {1:['580px', '430'],2:['580px', '430'],3: ['580px', '430'],4:['680px', '451'],5:['580px', '470'],6:['880px', '450']};
    // closes = $.layer({
    //        type: 1,
    //        title: false,
    //        area: area[type],
    //        shade: [0.3, '#000'],
    //        page: {
    //            dom: domList[type]
    //        },
    //        closeBtn:false
    //    });

        //var cbList={1:function(json){
        //    $("#account").html(json.data.acc);
        //    $("#username").html(json.data.name);
        //    $("#ip").html(json.data.IP);
        //    $("#mac").html(json.data.MAC);
        //    $("#operation").html(json.data.OptTime);
        //    $("#decrypt").html(json.data.DecryptAcc);
        //    $("#total").html(json.data.DecryptAcc);
        //    $("#success").html(json.data.DecryptAcc);
        //    $("#failure").html(json.data.DecryptAcc);
        //},2:function(json){
        //    $("#account-w").html(json.data.acc);
        //    $("#username-w").html(json.data.name);
        //    $("#ip-w").html(json.data.IP);
        //    $("#mac-w").html(json.data.MAC);
        //    $("#operation-w").html(json.data.OptTime);
        //    $("#authorization").html(json.data.AuthorizeName);
        //    $("#atype").html(json.data.AuthorizeType);
        //    $("#total-w").html(json.data.DecryptAcc);
        //    $("#success-w").html(json.data.DecryptAcc);
        //    $("#failure-w").html(json.data.DecryptAcc);
        //}};
        //$.post(API.log.getDecryptDetail,{id:id},function(json){
        //    if(json.ret==0){
        //        cbList[type]();
        //    }
        //},'json');
        //$("#export-user-form").clearForm();
   // }

    //$("#u-ajax-table-container-client").delegate(".log-detail","click",function(){
    //    var sid=$(this).data("id");
    //    var searchVal=$(this).data("type");
    //    $(".closed").click(function(){
    //        layer.close(closes);
    //    });
    //
    //   $(".upward").click(function(){
    //       searchVal--;
    //       haha(searchVal);
    //
    //   });
    //
    //    haha(searchVal);
    //})


    function Closures(type ,sid){
        /*关闭按钮*/
        $(".closed").click(function(){
           // layer.close(closes);
          layer.closeAll();
        });
        switch (type){
            case 1:
                  $.layer({
                    type: 1,
                    title: false,
                    area: ['580px', '430'],
                    shade: [0.3, '#000'],
                    page: {
                        dom: '#export-box'
                    },
                    closeBtn:false
                });
                $.post(API.log.getDecryptDetail,{id:sid},function(json){
                    if(json.ret==0){
                        // console.log(json.data);
                        $("#account").html(json.data.acc);
                        $("#username").html(json.data.name);
                        $("#ip").html(json.data.IP);
                        $("#mac").html(json.data.MAC);
                        $("#operation").html(json.data.OptTime);
                        $("#decrypt").html(json.data.DecryptAcc);
                        $("#total").html(json.data.DecryptAcc);
                        $("#success").html(json.data.DecryptAcc);
                        $("#failure").html(json.data.DecryptAcc);
                    }
                },'json');
                $("#export-user-form").clearForm();
                break;
            case 2:
                 $.layer({
                    type: 1,
                    title: false,
                    area: ['580px', '430'],
                    shade: [0.3, '#000'],
                    page: {
                        dom: '#export-authorization'
                    },
                    closeBtn:false
                });
                $.post(API.log.getAuthorizeDetail,{id:sid},function(json){
                    if(json.ret==0){
                        $("#account-w").html(json.data.acc);
                        $("#username-w").html(json.data.name);
                        $("#ip-w").html(json.data.IP);
                        $("#mac-w").html(json.data.MAC);
                        $("#operation-w").html(json.data.OptTime);
                        $("#authorization").html(json.data.AuthorizeName);
                        $("#atype").html(json.data.AuthorizeType);
                        $("#total-w").html(json.data.DecryptAcc);
                        $("#success-w").html(json.data.DecryptAcc);
                        $("#failure-w").html(json.data.DecryptAcc);
                    }
                },'json');
                $("#export-user-form1").clearForm();
                break;
            case 3:
                  $.layer({
                    type: 1,
                    title: false,
                    area: ['580px', '430'],
                    shade: [0.3, '#000'],
                    page: {
                        dom: '#White-list'
                    } ,
                    closeBtn:false
                });
                $.post(API.log.getEmailDetail,{logid:sid},function(json){
                    if(json.ret==0){
                        //console.log(json.data);
                        $("#account-b").html(json.data.acc);
                        $("#username-b").html(json.data.name);
                        $("#ip-b").html(json.data.IP);
                        $("#mac-b").html(json.data.MAC);
                        $("#operation-b").html(json.data.OptTime);
                        $("#Sender").html(json.data.SendEmail);
                        $("#Addressee").html(json.data.Addressee);
                        $("#copy").html(json.data.CopySend);
                        $("#Mail").html(json.data.EmailTheme);
                        $("#total-b").html(json.data.DecryptAcc);
                        $("#success-b").html(json.data.DecryptAcc);
                        $("#failure-b").html(json.data.DecryptAcc);
                    }
                },'json');
                $("#export-user-form2").clearForm();
                break;
            case 4:
                 $.layer({
                    type: 1,
                    title: false,
                    area: ['680px', '451'],
                    shade: [0.3, '#000'],
                    page: {
                        dom: '#outer-hair'
                    } ,
                    closeBtn:false
                });
                $.post(API.log.getFileSendDetail,{logid:sid},function(json){
                    if(json.ret==0){
                        //console.log(json.data);
                        $("#account-x").html(json.data.acc);
                        $("#username-x").html(json.data.name);
                        $("#ip-x").html(json.data.IP);
                        $("#mac-x").html(json.data.MAC);
                        $("#operation-x").html(json.data.OptTime);
                        $("#Authentication").html(json.data.Action);
                        $("#Effective").html(json.data.EffTime);
                        $("#Allow").html(json.data.CopySend);
                        $("#Browse").html(json.data.EmailTheme);
                        $("#Invalid").html(json.data.Addressee);
                        $("#Effective1").html(json.data.CopySend);
                        $("#Modify").html(json.data.EmailTheme);
                        $("#total-x").html(json.data.DecryptAcc);
                        $("#success-x").html(json.data.DecryptAcc);
                        $("#failure-x").html(json.data.DecryptAcc);
                    }
                },'json');
                $("#export-user-form3").clearForm();
                break;
            case 5:
                  $.layer({
                    type: 1,
                    title: false,
                    area: ['580px', '470'],
                    shade: [0.3, '#000'],
                    page: {
                        dom: '#decrypt-o'
                    }  ,
                    closeBtn:false
                });
                $.post(API.log.getDecryptApplyDetail,{logid:sid},function(json){
                    if(json.ret==0){
                        // console.log(json.data);
                        $("#account-j").html(json.data.acc);
                        $("#username-j").html(json.data.name);
                        $("#ip-j").html(json.data.IP);
                        $("#mac-j").html(json.data.MAC);
                        $("#operation-j").html(json.data.OptTime);
                        $("#technological").html(json.data.Process);
                        $("#examination").html(json.data.ApprovalEmp);
                        $("#handle").html(json.data.ReplyNews);
                        $("#apply").html(json.data.ApplyReason);
                        $("#reply").html(json.data.EmailTheme);
                        $("#total-j").html(json.data.DecryptAcc);
                        $("#success-j").html(json.data.DecryptAcc);
                        $("#failure-j").html(json.data.DecryptAcc);
                    }
                },'json');
                $("#export-user-form4").clearForm();
                break;
            case 6:
                 $.layer({
                    type: 1,
                    title: false,
                    area: ['880px', '450'],
                    shade: [0.3, '#000'],
                    page: {
                        dom: '#outside-w'
                    } ,
                    closeBtn:false
                });
                $.post(API.log.getFileApplyDetail,{logid:sid},function(json){
                    if(json.ret==0){
                        //console.log(json.data);
                        $("#account-z").html(json.data.acc);
                        $("#username-z").html(json.data.name);
                        $("#ip-z").html(json.data.IP);
                        $("#mac-z").html(json.data.MAC);
                        $("#operation-z").html(json.data.OptTime);
                        $("#technological-z").html(json.data.Action);
                        $("#examination-z").html(json.data.Action);
                        $("#handle-z").html(json.data.Action);
                        $("#apply-z").html(json.data.Action);
                        $("#reply-z").html(json.data.Action);
                        $("#Effective-z").html(json.data.EffTime);
                        $("#Allow-z").html(json.data.CopySend);
                        $("#Browse-z").html(json.data.EmailTheme);
                        $("#Invalid-z").html(json.data.Addressee);
                        $("#Effective1-z").html(json.data.CopySend);
                        $("#Modify-z").html(json.data.EmailTheme);
                        $("#total-z").html(json.data.DecryptAcc);
                        $("#success-z").html(json.data.DecryptAcc);
                        $("#failure-z").html(json.data.DecryptAcc);
                    }
                },'json');
                $("#export-user-form5").clearForm();
                break;

    }}
    /*点击详情事件*/
   $("#u-ajax-table-container-client").delegate(".log-detail","click",function(){
       //console.log($(this).data());
        var sid=$(this).data("id");
        var searchVal=$(this).data("type");
        /*上一个*/
       $(".upward").click(function(){
           --searchVal;
           layer.closeAll();
           if(searchVal==0) {
               $(".upward").unbind("click");
           }
           console.log(searchVal);
           Closures(searchVal,sid);
       });
       /*下一个*/
       $(".down").click(function(){
           ++searchVal;
           layer.closeAll();
           console.log(searchVal);
           Closures(searchVal,sid);

       });

        Closures(searchVal,sid);

    }
   );

    /*日志主页表单加载数据*/
    var clientList=$("#u-ajax-table-container-client").ajaxTable({
        url:API.log.getLogList,
        rows:50,
        columns:[
            {
                xtype:'checkbox',width:35
            },
            {
                dataIndex:'acc',text:'登录账号',width:100,thCss:{textIndent:5},renderer:function(v){
                if(!v)
                {
                    return;
                }
                var icon=v=="admin"?"icon-user-type-admin":"icon-user-type";
                return "<i class='icon-img "+icon+"'></i><span style='padding-left: 5px;'>"+v+"</span>";
            }
            },
            {
                dataIndex: 'IP', text: 'IP地址', width: 100, sort: 'IP'/*,align:'center'*/
            },
            {
                dataIndex:'name',text:'用户名',width:100
            },
            {
                dataIndex:'MAC',text:'MAC地址',width:100,sort:'MAC'/*,align:'center'*/
            },
            {
                dataIndex:'att',text:'属性',width:100,sort:'att'/*,align:'center'*/
            },
            {
                dataIndex:'Description',text:'描述',width:100,sort:'Description'/*,align:'center'*/
            },
            {
                dataIndex:'OptContent',text:'操作内容',width:100,sort:'OptContent'/*,align:'center'*/
            },

            {
                dataIndex:'logtype',text:'日志类型'/*,align:'center'*/,renderer:function(v)
            {
                return logType[v];
            },width:80
            },
            {
                dataIndex:'OptTime',
                text:'操作时间',
                width:140
            },{
                dataIndex:"logtype",
                text:"操作",
                renderer:function(v,row){
                   console.log(row);
                    return "<a class='log-detail' data-type='"+v+"' data-id='"+row.logid+"' >详情</a>";
                }
            }

        ],
        idProperty:'logid',
        selMark:'',
        autoLoad:true
    });


    var clientListPageToolbar=$("#u-page-toolbar-client").pageToolbar({
        table:clientList
    });

    /*手动解密详情加载数据*/
//    var handList=$("#u-ajax-table-container-client6").ajaxTable({
//        url:API.log.getDecryptDetail,
//    columns:[
//            {
//                xtype:'checkbox',width:35
//            },
//            {
//                dataIndex:'acc',text:'序号',width:100,thCss:{textIndent:5},renderer:function(v){
//                if(!v)
//                {
//                    return;
//                }
//                var icon=v=="admin"?"icon-user-type-admin":"icon-user-type";
//                return "<i class='icon-img "+icon+"'></i><span style='padding-left: 5px;'>"+v+"</span>";
//            }
//            },
//
//            {
//                dataIndex:'OptContent',text:'操作内容',width:120,sort:'OptContent'/*,align:'center'*/
//            },
//
//            {
//                dataIndex:'logtype',text:'属性'/*,align:'center'*/,renderer:function(v)
//            {
//                return logType[v];
//            },width:120
//            },
//            {
//                dataIndex:'OptTime',
//                text:'描述',
//                width:140
//            }
//],
//        idProperty:'logid',
//        selMark:'',
//        autoLoad:true
//    });
//    var handListPageToolbar=$("#u-page-toolbar-client6").pageToolbar({
//        table:handList
//    });




    //左侧菜单点击事件
    $(".u-log-item").click(function(){
        if($(this).isSelected() || $(this).isDisabled())
        {
            return false;
        }
        //清除搜索框
        $("#u-search-input").attr("value","");
        delete adminList.extraParams.StrUserName;
        delete clientList.extraParams.StrUserName;

        var oldSel=$(".u-log-item.z-selected");
        var oldCls=oldSel.attr("data-group");
        var dataGroup = $(this).attr("data-group");
        oldSel.removeClass("z-selected");
        $(this).addClass("z-selected");
        var cls=$(this).attr("data-group");
        $(".m-content-item-list."+oldCls).hide();
        $(".m-content-item-list."+cls).show();
        autoShowList(dataGroup);
        $.hash("showLog",dataGroup);
    });



    //时间筛选
    $('#u-log-date').dateRangePicker({
        separator:" 至 ",
        getValue: function()
        {
            return $(this).val();
        },
        setValue: function(s,start,end)
        {
            $("[name=StartDate]").val(start);
            $("[name=EndDate]").val(end);
            $(this).val(s);
        }
    });

   //今天：
    $("#all-day").click(function(){
     var dateTime = new Date();
     var date = dateTime.getFullYear()+"-"+(dateTime.getMonth()+1)+"-"+dateTime.getDate();
     $('#u-log-date').data('dateRangePicker').setDateRange(date,date);
     });


    //本周:
    $("#all-week").click(function(){
        var year=new Date().getFullYear();
        var month=new Date().getMonth()+1;
        var day=new Date().getDate();
        var thisWeekStart; //本周周一的时间
        if(new Date().getDay()==0){  //周天的情况；
            thisWeekStart = (new Date(year+'/'+month+'/'+day)).getTime()-((new Date().getDay())+6) * 86400000;
        }else{
            thisWeekStart = (new Date(year+'/'+month+'/'+day)).getTime()-((new Date().getDay())-1) * 86400000;
        }
        var weekStartDate=new Date(thisWeekStart);
        var weekEndDate=new Date();
        $('#u-log-date').data('dateRangePicker').setDateRange(weekStartDate,weekEndDate);
    });


    //本月：
    $("#all-month").click(function(){
    var currentYear=new Date().getFullYear();
    var currentMonth=new Date().getMonth();
    var monthStartDate= new Date(currentYear,currentMonth,1);
    var monthEndDate=new Date();
   $('#u-log-date').data('dateRangePicker').setDateRange(monthStartDate,monthEndDate);
    });

    //本季：
    $("#all-season").click(function(){
        var year=new Date().getFullYear();
        var month=new Date().getMonth()+1;
        function getQuarterStartMonth(){
            var quarterStartMonth = 0;
            if(month<3){
                quarterStartMonth = 0;
            }
            if(2<month && month<6){
                quarterStartMonth = 3;
            }
            if(5<month && month<9){
                quarterStartMonth = 6;
            }
            if(month>8){
                quarterStartMonth = 9;
            }
            return quarterStartMonth;
        }
        var startDate = new Date(year, getQuarterStartMonth(), 1);
        var quarterEndMonth = new Date(year,getQuarterStartMonth() + 2);
        $('#u-log-date').data('dateRangePicker').setDateRange(startDate,quarterEndMonth);
    });


    //本年：
    $("#all-year").click(function(){
        var currentYear=new Date().getFullYear();
        //本年第一天
        var currentYearFirstDate=new Date(currentYear,0,1);
        //本年最后一天
        var currentYearLastDate=new Date(currentYear,11,31);
        $('#u-log-date').data('dateRangePicker').setDateRange(currentYearFirstDate,currentYearLastDate);
        });

    /*全部*/
    $("#all-t").click(function(){
       $("#u-log-date").attr("value",'');
    });

    //搜索条件下拉框
    $("#log-types").ajaxTreeSelect({
        localData:[],
        idProperty:'value',
        textProperty:'text',
        autoLoad:false,
        itemWidth:false,
        emptyNode:false,
        height:'auto',
        selMode:'single',
        width:78,
        offsetX:0,
        lastChildLevel:1,
        autoSelectFire:true,
        levelWidth:10,
        showExpand:false,
        treeItemCls:'u-ajax-tree-select-item u-ajax-common-select-item'
    });

    /*点击导出事件*/
    $("#log-downs").click(function(){
        $(this).next(".navContent").slideToggle(300).siblings(".navContent").slideUp(500);
    });
    /*点击导出全部事件*/
    $("#export-all").click(function(){

    });

    /*点击导出已选事件*/
    $("#export-yx").click(function(){
        if(!clientList.hasSelect())
        {
            layer.alert(L.pleaseSelectOneMore,0);
            return;
        }
        alert("你好！");
    });

    /*点击删除事件*/
    $("#log-deletes").click(function(){
        $(this).next(".navContent1").slideToggle(300).siblings(".navContent").slideUp(500);
    });
    /*点击删除已选事件*/
    $("#delete-yx").click(function(){
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
    function delUserHandler(me)
    {
        if(clientList.hasSelect())
        {
            layer.confirm(L.delUserConfirms,function(){
                var ids=clientList.getSelectIds();
                $.fastAction(API.user.delUsers,{Users: ids,IsDelUser:1,is_ajax:1,IsRestore:0},function(data,res){
                    if(res)
                    {
                        clientList.reload();
                    }
                });
            });
        }
        else
        {
            layer.alert(L.pleaseSelectOneMore,0);
        }
    }


    /*查询*/
    //日志查询事件：
    function searchHandler()
    {
        console.log($("[name=StartDate]").val());
        console.log($("[name=EndDate]").val());
        var val=$("#u-log-date").val();
        clientList.extraParams.BeginTime=val;
        var va2=$("#login-z").val();
        clientList.extraParams.UserMac=va2;
        var va3=$("#user-n").val();
        clientList.extraParams.FileName=va3;
        var va4=$("#content-s").val();
        clientList.extraParams.UserMac=va4;
        var va5=$("#log-types").val();
        clientList.extraParams.OperatorCode=va5;
        clientList.loadPage(1);
    }
    $("#u-search-input").unbind("keypress").bind({
        keypress:function(e){
            if(e.keyCode == "13")
            {
                searchHandler();
            }
        }
    });

       $("#log-inquire").bind("click").bind({
        click:function(){
            searchHandler();
        }
    });








    /*导出下拉*/

    //导出下拉框
    //$("#export-la").ajaxTreeSelect({
    //    localData:[],
    //    idProperty:'value',
    //    textProperty:'text',
    //    autoLoad:false,
    //    itemWidth:false,
    //    emptyNode:false,
    //    height:'auto',
    //    selMode:'single',
    //    width:88,
    //    offsetX:0,
    //    lastChildLevel:1,
    //    autoSelectFire:true,
    //    levelWidth:10,
    //    showExpand:false,
    //    treeItemCls:'u-ajax-tree-select-item u-ajax-common-select-item'
    //});
    //var exportLists=$("#export-la")[0];
    //var exportData=[
    //    {text:'导出',value:0,checked:true},
    //    {text:'全部导出',value:3},
    //    {text:'导出当前',value:1},
    //    {text:'导出已选',value:2}
    //];
    //var isAdmin = LIMIT_CONTROLLER.IS_ADMIN;
    //if(!isAdmin)
    //{
    //    exportData.splice(3,1);
    //}
    //exportLists.tree.me.unbind("onSelectChange").bind("onSelectChange",function(me,id,node,obj){
    //    var val=parseInt(id);
    //    switch (val){
    //        case 1:
    //
    //            break;
    //        case 2:
    //
    //
    //
    //    }
    //    clientList.loadPage(1);
    //});
    //exportLists.setTreeConfig("localData",exportData);
    //exportLists.tree.load(true);
    //
    //
    //
    //
    //function delHandlers(me)
    //{
    //    if(clientList.hasSelect())
    //    {
    //        layer.confirm(L.delUserConfirm,function(){
    //            var ids=clientList.getSelectIds();
    //            $.fastAction(API.user.delUsers,{Users: ids,IsDelUser:1,is_ajax:1,IsRestore:0},function(data,res){
    //                if(res)
    //                {
    //                    clientList.reload();
    //                }
    //            });
    //        });
    //    }
    //    else
    //    {
    //        layer.alert(L.pleaseSelectUsers,0);
    //    }
    //}


    /*删除下拉框*/
    //$("#delete-la").ajaxTreeSelect({
    //    localData:[],
    //    idProperty:'value',
    //    textProperty:'text',
    //    autoLoad:false,
    //    itemWidth:false,
    //    emptyNode:false,
    //    height:'auto',
    //    selMode:'simple',
    //    width:88,
    //    offsetX:0,
    //    lastChildLevel:1,
    //    autoSelectFire:true,
    //    levelWidth:10,
    //    showExpand:false,
    //    treeItemCls:'u-ajax-tree-select-item u-ajax-common-select-item'
    //});
    //var deleteLists=$("#delete-la")[0];
    //var deleteData=[
    //    {text:'删除',value:0,checked:true},
    //    {text:'删除全部',value:3},
    //    {text:'删除当前',value:1},
    //    {text:'删除已选',value:2}
    //];
    //var isAdmins = LIMIT_CONTROLLER.IS_ADMIN;
    //if(!isAdmins)
    //{
    //    deleteData.splice(3,1);
    //}
    //deleteLists.tree.me.unbind("onSelectChange").bind("onSelectChange",function(me,id,node,obj){
    //    var val=parseInt(id);
    //    switch (val){
    //        case 1:
    //            break;
    //        case 2:
    //            if(!clientList.hasSelect()){
    //                alert("没选择");
    //            }else{
    //                alert("有选择");
    //            }
    //
    //            if($(this).isDisabled())
    //            {
    //                return false;
    //            }
    //            var me1=$(this);
    //            if(me1.isSelected())
    //            {
    //                return;
    //            }
    //            if(toolbar.find("."+$.bf.config.selectedCls).length>0)
    //            {
    //                layer.confirm(L.cancelOperationConfirm,function(){
    //                    $(".u-btn-cancel").trigger("click");
    //                    layer.closeAll();
    //                });
    //            }
    //            else
    //             {
    //                delHandlers(me);
    //            }
    //            alert("");
    //            break;
    //        case 3:
    //            alert("是删除全部吗?");
    //            break;
    //    }
    //    //clientList.loadPage(1);
    //});
    //deleteLists.setTreeConfig("localData",deleteData);
    //deleteLists.tree.load(true);



        /*导航条上的搜索*/
        var searchConditionList = $("#u-search-condition")[0];
        var conditionData=[
        {text:'全部',value:0,checked:true}];
         searchConditionList.setTreeConfig("localData",conditionData);
         searchConditionList.tree.me.unbind("onSelectChange");
         searchConditionList.tree.load(true);

}
        $(function(){
           log();
        });
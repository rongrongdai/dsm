function log() {
    var operationCode = {
        10: "添加用户",
        11: "冻结用户",
        12: "删除用户",
        13: "修改用户",
        14: "添加用户组的访问权限",
        15: "删除用户组的访问权限",
        30: "添加组",
        31: "删除组",
        32: "编辑组",
        33: "移动用户到组",
        34: "从删除的用户中移除用户",
        50: "添加策略",
        51: "删除策略",
        52: "添加组策略",
        53: "移除组策略",
        54: "编辑组策略",
        55: "添加访问权限到策略模板",
        56: "删除访问权限到策略模板",
        57: "添加访问权限到组策略",
        58: "删除访问权限到组策略",
        59: "拷贝组策略",
        60: "拷贝组策略到库",
        61: "拷贝策略库到组",
        70: "设置用户或组的特权信息",
        90: "配置系统设置",
        91: "配置系统文件信息",
        92: "配置文件外发信息",
        93: "配置水印字符串",
        94: "配置离线时间",
        95: "配置拷贝参数",
        96: "添加访问权限全局设置",
        97: "删除访问权限全局设置",
        110: "添加角色类型",
        111: "删除角色类型",
        112: "添加角色",
        113: "修改角色",
        114: "删除角色",
        115: "绑定用户角色",
        116: "删除用户角色"
    };
    var logType = {
        0: "所有类型",
        1: "手动解密",
        2: "文件外发",
        3: "申请解密",
        4: "申请外发",
        5: "用户登录"
    };
    var logTypes = {
        0: "所有类型",
        1: "用户管理",
        2: "策略管理",
        3: "角色管理",
        4: "系统配置"
    };


    /*客戶端日志点击详情信息*/
    function expandRowHandler(node, data) {
        if (!data.filejson || !data.filejson.filelist)return false;
        if (!node[0].itemContent) {
            var type = node.data("logtype");
            var content = generateRowItem(type, data);
            node[0].itemContent = $(content);
            node.after(node[0].itemContent);
        } else {
            node[0].itemContent.show();

        }
    }

    function fetchListName(list, noLink) {
        if (list.attach > 0) {
            if (!typeof(list.filejson.filelist) != "object" && !list.filejson.filelist.length)return "";
            var data = [];
            for (var a in list.filejson.filelist) {
                if (a > 100)break;
                if (noLink) {
                    data.push(list.filejson.filelist[a].clientname);
                } else {
                    data.push("<span class='download-file' data-servername='" + list.filejson.filelist[a].servername + "' data-clientname='" + list.filejson.filelist[a].clientname + "'>" + list.filejson.filelist[a].clientname + "</span>");

                }
            }
            return data.join("、");
        } else {
            return "（无文件操作）";
        }

    }

    function getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    }

    function optenadmin(type) {
        var str = "";
        if (type.opentimes) {
            if (str == "") {
                str = "允许打开" + type.opentimes + "次";
            }
            else {
                str = str + "," + "允许打开" + type.opentimes + "次";
            }
        }
        if (type.readtime) {
            var minTime;
            try {
                var minTime = parseInt(type.readtime) / 60;
            }
            catch (err) {

            }

            var timeDesc = "有效时长" + minTime + "分钟";

            if (str == "") {
                str = timeDesc;
            }
            else {
                str = str + "," + timeDesc;
            }
        }

        if (type.canmodify) {
            var modifyDesc = "";
            if (type.canmodify || type.canmodify == "1") {
                modifyDesc = "允许文件修改";

                if (str == "") {
                    str = modifyDesc;
                }
                else {
                    str = str + "," + modifyDesc;
                }
            }
        }

        if (type.deletewheninvalid) {
            var delDesc = "";
            if (type.deletewheninvalid || type.deletewheninvalid == "1") {
                delDesc = "阅读文件到期后删除文件";

                if (str == "") {
                    str = delDesc;
                }
                else {
                    str = str + "," + delDesc;
                }
            }
        }

        if (type.canprint) {
            var printDesc = "";

            if (type.canprint == true || type.canprint == "1") {
                printDesc = "允许文件打印";

                if (str == "") {
                    str = printDesc;
                }
                else {
                    str = str + "," + printDesc;
                }
            }
        }

        if (type.makeexe) {
            var exeDesc = "";
            if (type.makeexe || type.makeexe == "1")
                exeDesc = "exe文件外发";
            else
                exeDesc = "普通文件外发";

            if (str == "") {
                str = exeDesc;
            } else {
                str = str + "," + exeDesc;
            }
        }

        if (type.uiDeadLine) {
            if (str == "") {
                str = "截止时间" + getLocalTime(type.uiDeadLine);
            } else {
                str = str + "," + "截止时间" + getLocalTime(type.uiDeadLine);
            }
        }

        if (str == "")
            str = "无";

        return str;
    }

    function generateRowItem(type, data) {
        //console.log(data);
        type = parseInt(type);
        switch (type) {
            case 1:   //手动解密
                //filelist
                return "<td colspan='6'><div class='log-tab-con'>" +
                    "<p>解密账号：<label>" + data.filedesc.DecryptName + "</label></p>" +
                    "<p>操作对象：<label>" + data.filedesc.OperationObjects + "</label></p>" +
                    "<p>过滤条件：<label>" + data.filedesc.Filter + "</label></p>" +
                    "<p>文件总数：<label>" + data.filejson.count + "</label></p>" +
                    "<p>文件列表：<label>" + fetchListName(data, true) + "</label></p>" +
                    "</div></td>";
                break;
            case 2:   //手动外发
                return "<td colspan='6'><div class='log-tab-con'>" +
                    "<p>外发参数：<label>" + optenadmin(data.filedesc) + "</label></p>" +
                    "<p>文件总数：<label>" + data.filejson.count + "</label></label></p>" +
                    "<p>文件列表：<label>" + fetchListName(data, true) + "</label></p>" +
                    "</div></td>";
                break;
            case 3:   //申请解密
                return "<td colspan='6'><div class='log-tab-con'>" +
                    "<p>审批人：<label>" + data.filedesc.Auditor + "</label></p>" +
                    "<p>流程名称：<label>" + data.filedesc.FlowName + "</label></p>" +
                    "<p>文件总数：<label>" + data.filejson.count + "</label></p>" +
                    "<p>文件列表：<a>" + fetchListName(data) + "</a></p>" +
                    "</div></td>";
                break;
            case 4:   //申请外发
                var lst = data.filedesc.OutFilePara;
                var outDesc = "";
                if (lst[0].length == 0) {

                    outDesc = "无";
                }
                else {
                    outDesc = optenadmin(lst[0]);
                }

                var username = data.filedesc.Auditor;
                var shown = "";
                if (username.length == 0) {
                    shown = "无";
                } else {
                    shown = username;
                }

                var leg = data.filedesc.FlowName;
                var process = "";
                if (leg.length == 0) {
                    process = "无";
                } else {
                    process = leg;
                }

                return "<td colspan='6'><div class='log-tab-con'>" +
                        //"<p>审批人：<label>"+data.username+"</label></p>" +
                        //"<p>流程名称：<label>"+data.filedesc.FlowName+"</label></p>"+
                    "<p>审批人：<label>" + shown + "</label></p>" +
                    "<p>流程名称：<label>" + process + "</label></p>" +
                    "<p>外发参数：<label>" + outDesc + "</label></p>" +
                    "<p>文件总数：<label>" + data.filejson.count + "</label></p>" +
                    "<p>文件列表：<a>" + fetchListName(data) + "</a></p>" +
                    "</div></td>";
                break;
        }
    }

    //下载地址
    $("#u-ajax-table-container-client").delegate(".download-file", "click", function (e) {
        var servername = $(this).data("servername");
        var clientname = $(this).data("clientname");
        $.download("index.php?_c=Log&_a=getFileDownload", {servername: servername}, clientname, L.downloading);
        return false;
    });

    /**
     * 客户端日志列表
     * @type {jQuery}
     */
    var clientList = $("#u-ajax-table-container-client").ajaxTable({
        selMode: "single",
        rows:50,
        url: API.log.getClientLogDetail,
        parseData: function (data) {
            return data.Result.LogInfoList;
        },
        parseTotal: function (data) {
            return data.Result.TotalCount;
        },
        columns: [
            {
                dataIndex: 'loginname',
                text: '账号',
                sort: 'loginname',
                width: 50,
                thCss: {textIndent: 5},
                renderer: function (v) {

                    var $adminclick = $("<a class='a-tp' id='ad-types'>" + v + "</a>");
                    $adminclick.bind("click", function (e) {
                        var val = $(this).text();
                        var contain = val;
                        var label =$("#admin-d");
                        label.html("<span id='adminNew-va' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                        label.css("display", "inline-block");
                        $("#login-z").val(val);
                        searchHandler();
                        return false;
                    });
                    return $adminclick;
                }
            },
            {
                dataIndex: 'username', text: '姓名', width: 50, sort: 'username'
            },
            {
                dataIndex: 'uptime', text: '时间', width: 100, sort: 'uptime'
            },
            {
                dataIndex: 'ipaddress', text: '登录IP', width: 90, sort: 'ipaddress', renderer: function (v) {
                var $ipclick = $("<a class='a-tp' id='ad-types'>" + v + "</a>");
                $ipclick.bind("click", function (e) {
                    var val = $(this).text();
                    var contain = val;
                    var label = $("#adminip-d");
                    label.html("<span id='adminNew-vaId' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                    label.css("display", "inline-block");
                    $("#user-n").val(val);
                    searchHandler();
                    return false;


                });
                return $ipclick;
            }
            },


            {
                dataIndex: 'logtype', text: '操作类型', renderer: function (v) {
                var $tapeclick = $("<a class='a-tp' id='lplog-types'>" + logType[v] + "</a>");
                $tapeclick.bind("click", function (e) {
                    logTypeTree.setDefaultValue({value: v, text: logType[v]}, true);
                    searchHandler();
                    return false;
                });
                return $tapeclick;
            }, width: 60
            },
            {
                dataIndex: "filejson",
                text: "详细信息",
                renderer: function (v, row) {
                    // console.log(row);
                    if (row.logtype == "5") {
                        if (row.filedesc.model == 1) {
                            return "<a class='a-tp'>上线</a>";
                        }
                        else {
                            return "下线";
                        }
                    } else if (row.attach > 0) {
                        if (v && v.filelist) {
                            var firstFileName = v.filelist[0].clientname;
                            var showName = textOverflow(firstFileName) + (v.filelist.length > 1 ? "等" + numberOverflow(v.filelist.length) + "个文件" : "");
                            var $a = $("<a class='log-detail a-tp' data-type='" + row.logtype + "'>" + showName + "<i class='lognew-img'></i></a>");
                            return $a;
                        } else {
                            return "（无文件操作）";
                        }
                    } else {
                        return "（无文件操作）";
                    }

                    //else if(v && v.filelist){
                    //    var firstFileName = v.filelist[0].clientname;
                    //    var showName = textOverflow(firstFileName)+(v.filelist.length>1?"等"+numberOverflow(v.filelist.length)+"个文件":"");
                    //    var $a=$("<a class='log-detail a-tp' data-type='"+row.logtype+"'>"+showName+"<i class='lognew-img'></i></a>");
                    //    return $a;
                    //}else{
                    //    return "（无文件操作）";
                    //}
                    //if(v && v.filelist && v.filelist.length>0){
                    //    var firstFileName = v.filelist[0].clientname;
                    //    var showName = textOverflow(firstFileName)+(v.filelist.length>1?"等"+numberOverflow(v.filelist.length)+"个文件":"");
                    //    var $a=$("<a class='log-detail a-tp' data-type='"+row.logtype+"'>"+showName+"<i class='lognew-img'></i></a>");
                    //    //$a.bind("click",function(e){return false;});
                    //    return $a;
                    //}
                    //else{
                    //    return "离线";
                    //}

                }

            }

        ],
        idProperty: 'ID',
        selMark: '',
        autoLoad: false,
        totalMark: 'cTotal',
        pageMark: 'cPage'
    });


    var year = new Date().getFullYear();
    var month = new Date().getMonth() + 1;
    var day = new Date().getDate();


    var prevWeek =new Date();
    prevWeek.setDate(prevWeek.getDate() - 7);
    var today = new Date();
    function format(date, fm) {
        fm = fm || "Y-m-d";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return fm.replace("Y", year).replace("m", fixZero(month)).replace("d", fixZero(day));
    }

    function fixZero(s) {
        s = s || parseInt(s);
        return s < 10 ? 0 + "" + s : s;
    }

    var weekStartDate = format(prevWeek);
    var weekEndDate = format(today);





    $("#u-log-date").val(weekStartDate + " 至 " + weekEndDate);
    $("#u-log-date").trigger("change");
    /*clientList.extraParams={
     BeginTime:"2015-10-11",
     EndTime:"2015-10-21"
     };*/
    function numberOverflow(num, maxLen) {
        maxLen = maxLen || 99;
        return num > maxLen ? maxLen + "<sup>+</sup>" : num;
    }

    function textOverflow(text, maxLen) {
        var extArr = text.split(".");
        var ext = extArr[extArr.length - 1];
        var name = [];
        for (var a = 0; a < extArr.length - 1; a++) {
            name.push(extArr[a]);
        }
        name = name.join(".");
        maxLen = maxLen || 5;
        name = name.length > maxLen ? name.substr(0, maxLen) + "···" : name;
        return name + "." + ext;
    }


    function textoverspot(text, maxlen) {
        //if(isNaN(maxlen)){
        //    maxlen = maxlen || 15;
        //    return text.length>maxlen?text.substr(0,maxlen)+"···":text;
        //}else{
        maxlen = maxlen || 10;
        return text.length > maxlen ? text.substr(0, maxlen) + "···" : text;

    }


    clientList.onSelect.add(function (x, node) {
        var data = node.data();
        expandRowHandler(node, data);

    });
    clientList.onDeselect.add(function (x, node) {
        if (node[0].itemContent)node[0].itemContent.hide();
    });
    var clientListPageToolbar = $("#u-page-toolbar-client").pageToolbar({
        table: clientList
    });


    /**
     * 管理端日志列表
     * @type {jQuery}
     */
    var adminList = $("#u-ajax-table-container-admin").ajaxTable({
        url: API.log.getServerLogDetail,
        rows:50,
        parseData: function (data) {
            return data.Result.LogInfoList;
        },
        //parseData:function(data)
        //{
        //    return data.Result.AdminOP;
        //},
        //parseTotal:function(data)
        //{
        //    return data.Result.TotalCount;
        //},
        //},
        parseTotal: function (data) {
            return data.Result.TotalCount;
        },
        columns: [
            {
                dataIndex: 'loginname',
                text: '账号',
                sort: 'loginname',
                width: 100,
                thCss: {textIndent: 5},
                renderer: function (v) {
                    var $adminclick = $("<a class='a-tp' id='ad-types'>" + v + "</a>");
                    $adminclick.bind("click", function (e) {
                        var val = $(this).text();
                        var contain = val;
                        var label =$("#admin-d");
                        label.html("<span id='adminNew-va' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                        label.css("display", "inline-block");
                        $("#login-z").val(val);
                        searchHandler();
                        return false;
                    });
                    return $adminclick;
                }
            },

            {
                dataIndex: 'displayname', text: '姓名', sort: 'displayname', width: 100, thCss: {textIndent: 5}
            },
            {
                dataIndex: 'uptime',
                text: '时间',
                width: 150,
                /*align:'center',*/
                sort: 'uptime'
            },
            {
                dataIndex: 'ipaddress', text: '登录IP', width: 130, sort: 'ipaddress',

                renderer: function (v, row) {
                    var $ipclick = $("<a class='a-tp' id='ad-types'>" + v + "</a>");
                    $ipclick.bind("click", function (e) {
                        var val = $(this).text();
                        var contain = val;
                        var label = $("#adminip-d");
                        label.html("<span id='adminNew-vaId' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                        label.css("display", "inline-block");
                        $("#user-n").val(val);
                        searchHandler();
                        return false;
                    });
                    return $ipclick;
                }
            },
            {
                dataIndex: 'optype', text: '操作类型', renderer: function (v) {
                var $tapeclick = $("<a class='a-tp' id='lplog-types'>" + logTypes[v] + "</a>");
                $tapeclick.bind("click", function (e) {
                    logTypeTree.setDefaultValue({value: v, text: logTypes[v]}, true);
                    searchHandler();
                    return false;
                });
                return $tapeclick;
            }, width: 100
            }, {
                dataIndex: "opdescribe",
                text: "详情信息"
            }
        ],
        idProperty: 'ID',
        selMark: '',
        autoLoad: false,
        pageMark: 'aPage',
        totalMark: 'aTotal'

    });
    var adminListPageToolbar = $("#u-page-toolbar-admin").pageToolbar({
        table: adminList
    });
    var contianer = $("#m-content-container-log");

    function autoShowList($key) {
        searchHandler();
        /*switch($key)
         {
         case 'admin':
         adminList.load();
         //adminList.loadPage(1);
         break;
         case 'client':
         clientList.load();
         //clientList.loadPage(1);
         break;

         }*/
    }

    function getList($key) {
        var list = null;
        switch ($key) {
            case 'admin':
                list = adminList;
                break;
            case 'client':
                list = clientList;
                break;
        }
        return list;
    }

    /*类型下拉框中的事件*/
    $("#log-types").ajaxTreeSelect({
        idProperty: 'value',
        textProperty: 'text',
        autoLoad: false,
        itemWidth: false,
        emptyNode: false,
        height: 'auto',
        selMode: 'single',
        width: 82,
        offsetY: 2,
        lastChildLevel: 1,
        autoSelectFire: true,
        levelWidth: 10,
        showExpand: false,
        treeItemCls: 'u-ajax-tree-select-item u-ajax-common-select-item'
    });

    var logTypeTree = $("#log-types")[0];
    /*点击下拉框触发查询*/
    $("#log-types").on("onTreeSelectChange", function () {
        searchHandler();

    });

    function emptyall() {
        $("#login-z").val("");
        $("#admin-d").empty().hide();
        $("#admin-d").removeClass("log-adclass");
        $("#user-n").val("");
        $("#adminip-d").empty().hide();
        $("#adminip-d").removeClass("log-adclass");
        $("#content-s").val("");
        $("#keyword-d").empty().hide();
        $("#keyword-d").removeClass("log-adclass");
    }


    //左侧菜单点击事件
    $(".u-log-item").click(function () {
        if ($(this).isSelected() || $(this).isDisabled()) {
            return false;
        }

        //清除搜索框
        $("#u-search-input").attr("value", "");
        //delete adminList.extraParams.StrUserName;
        //delete clientList.extraParams.StrUserName;

        /*搜索条件下拉框*/
        var oldSel = $(".u-log-item.z-selected");
        var oldCls = oldSel.attr("data-group");

        var dataGroup = $(this).attr("data-group");
        if (dataGroup == "client") {
            logTypeTree.setTreeConfig("localData", [
                {text: '所有类型', value: 0, checked: true},
                {text: '手动解密', value: 1},
                {text: '文件外发', value: 2},
                {text: '申请解密', value: 3},
                {text: '申请外发', value: 4},
                {text: '用户登录', value: 5}
            ]);
            logTypeTree.tree.load(true);
            emptyall();

        } else if (dataGroup == "admin") {
            logTypeTree.setTreeConfig("localData", [
                {text: '所有类型', value: 0, checked: true},
                {text: '用户管理', value: 1},
                {text: '策略管理', value: 2},
                {text: '角色管理', value: 3},
                {text: '系统配置', value: 4}
            ]);
            logTypeTree.tree.load(true);
            emptyall();
        }

        //console.log(logTypeTree.tree.getSelectId());
        //var list = getList(dataGroup);
        //list.loadPage(1);
        oldSel.removeClass("z-selected");
        $(this).addClass("z-selected");
        var cls = $(this).attr("data-group");
        $(".m-content-item-list." + oldCls).hide();
        $(".m-content-item-list." + cls).show();
        autoShowList(dataGroup);
        $.hash("showLog", dataGroup);
    });

    var defaultShowLog = $.hash("showLog") ? $.hash("showLog") : "client";
    //console.log($(".u-log-item[data-group="+defaultShowLog+"]"));
    $(".u-log-item[data-group=" + defaultShowLog + "]").trigger("click");

    //上一个月
    var prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1);

    //上一周
    var prevWeek = new Date();
    prevWeek.setDate(prevWeek.getDate() - 7);

    var today = new Date();
    //时间筛选
    $('#u-log-date').dateRangePicker({
        separator: " 至 ",
        getValue: function () {
            return $(this).val();
        },
        setValue: function (s, start, end) {
            //console.log(end+"==="+format(today)+":"+start+"====="+format(prevWeek));
            if (end == format(today) && start == format(prevWeek)) {
                $("#all-week").prop("checked", true);

            } else if (end == format(today) && start == format(prevMonth)) {
                $("#all-month").prop("checked", 'true');

            } else {
                $("#custom-d").prop("checked", 'true');

            }
            $(this).val(s);
        }
    });

    var searchConditionList = $("#u-search-condition")[0];
    var conditionData = [
        {text: '全部', value: 0, checked: true}
    ];
    searchConditionList.setTreeConfig("localData", conditionData);

    searchConditionList.tree.me.unbind("onSelectChange");
    searchConditionList.tree.load(true);
    //操作按钮
    $("#u-btn-operate").click(function () {
        var selNode = $(".u-log-item.z-selected");
        var group = selNode.attr("data-group");
        var val = $("#u-search-input").val();
        layer.confirm(L.backupConfirm, function () {
            switch (group) {
                case 'admin':
                    var params = {
                        EXPORT: true,
                        TotalCount: adminList.total
                    };
                    var node = adminList.getSelectNodes();
                    if (node.length > 0) {
                        var data = [];
                        node.each(function () {
                            var v = $(this).data();
                            data.push(v);
                        });
                        params.EXPORT_DATA = $.toJSON(data);
                        params.TotalCount = data.length;
                    }
                    $.download(API.log.getAdminLogList, params, $.bf.date("管理员日志(yyyy-MM-dd)") + ".xls", function () {
                        layer.closeAll();
                    });
                    break;
                case 'client':
                    var params = {
                        EXPORT: true,
                        TotalCount: clientList.total
                    };
                    var node = clientList.getSelectNodes();
                    if (node.length > 0) {
                        var data = [];
                        node.each(function () {
                            var v = $(this).data();
                            data.push(v);
                        });
                        params.EXPORT_DATA = $.toJSON(data);
                        params.TotalCount = data.length;
                    }
                    $.download(API.log.getClientLogList, params, $.bf.date("客户端日志(yyyy-MM-dd)") + ".xls", function () {
                        layer.closeAll();
                    });

                    break;
            }
        });

    });


    //一周点击时间:
    $("#all-week").click(function () {
        var weekEndDate = format(today);
        var weekStartDate = format(prevWeek);
        $('#u-log-date').data('dateRangePicker').setDateRange(weekStartDate, weekEndDate);
        $('#u-log-date').trigger("change");
    });
    //一月点击时间：
    $("#all-month").click(function () {
        $('#u-log-date').data('dateRangePicker').setDateRange(format(prevMonth), format(today));
        $('#u-log-date').trigger("change");
    });

    /*全部点击时间*/
    $("#all-t").click(function () {
        $("#u-log-date").attr("value", '');
        $('#u-log-date').trigger("change");
    });

    /*自定义*/
    $("#custom-d").click(function () {
        $('#u-log-date').trigger("change");

    });
    $("#u-log-date").click(function () {
        $('#u-log-date').trigger("change");
    });

    /*查询事件*/
    $("#log-inquire").bind("click").bind({
        click: function () {
            var admin = $("#login-z").val();
            if (admin.length > 0) {
                var contain = admin;
                var label = $("#admin-d");
                label.html("<span id='adminNew-va' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                label.css("display", "inline-block");
                $("#login-z").val(admin);
            }

            var ips = $("#user-n").val();
            if (ips.length > 0) {
                var contain = ips;
                var label = $("#adminip-d");
                label.html("<span id='adminNew-vaId' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                label.css("display", "inline-block");
                $("#user-n").val(ips);
            }


            var keyword = $("#content-s").val();
            if (keyword.length > 0) {
                var contain = keyword;
                var label = $("#keyword-d");
                label.html("<span id='adminNew-vaG' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                label.css("display", "inline-block");
                $("#content-s").val(keyword);
            }
            searchHandler();
        }

    });
    /*按回车键查询*/
    $(document).keyup(function (event) {
        if (event.keyCode == 13) {
            var admin = $("#login-z").val();
            if (admin.length > 0) {
                var contain = admin;
                var label = $("#admin-d");
                label.html("<span id='adminNew-va' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                label.css("display", "inline-block");
                $("#login-z").val(admin);
            }

            var ips = $("#user-n").val();
            if (ips.length > 0) {
                var contain = ips;
                var label = $("#adminip-d");
                label.html("<span id='adminNew-vaId' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                label.css("display", "inline-block");
                $("#user-n").val(ips);
            }


            var keyword = $("#content-s").val();
            if (keyword.length > 0) {
                var contain = keyword;
                var label = $("#keyword-d");
                label.html("<span id='adminNew-vaG' class='log-adclass'>" + "<span class='logDa-newG'>" + contain + "</span><a class='close'></a>" + "</span>");
                label.css("display", "inline-block");
                $("#content-s").val(keyword);
            }
            searchHandler();
        }
    });


    /*查询方法函数*/
    function searchHandler() {
        var selNode = $(".u-log-item.z-selected");
        var group = selNode.attr("data-group");
        //var val=$("#u-search-input").val();
        var val = logTypeTree.tree.getSelectId();
        var va2 = $("#login-z").val();
        var va3 = $("#user-n").val();
        var va4 = $("#content-s").val();
        var va5 = $("#u-log-date").val();
        switch (group) {
            case 'client':
                clientList.extraParams.LogTypeIndex = val;
                clientList.extraParams.LoginName = va2;
                clientList.extraParams.StrIP = va3;
                clientList.extraParams.StrInKey = va4;
                //var checkDateType = $(".filter-time:checked").val();
                //checkDateType
                if (va5) {
                    var times = va5.split(" 至 ");
                    clientList.extraParams.BeginTime = times[0];
                    clientList.extraParams.EndTime = times[1];
                } else {
                    clientList.extraParams.BeginTime = "";
                    clientList.extraParams.EndTime = "";
                }

                clientList.loadPage(1);
                break;
            case 'admin':
                adminList.extraParams.LogTypeIndex = val;
                adminList.extraParams.LoginName = va2;
                adminList.extraParams.StrIP = va3;
                adminList.extraParams.StrInKey = va4;

                if (va5) {
                    var times = va5.split(" 至 ");
                    adminList.extraParams.BeginTime = times[0];
                    adminList.extraParams.EndTime = times[1];
                } else {
                    adminList.extraParams.BeginTime = "";
                    adminList.extraParams.EndTime = "";
                }
                adminList.loadPage(1);
                break;
        }
    }

    $("#u-search-input").unbind("keypress").bind({
        keypress: function (e) {
            if (e.keyCode == "13") {
                searchHandler();
            }
        }
    });
    $("#u-search-icon").unbind("click").bind({
        click: function () {
            searchHandler();
        }
    });


    /*账号点击取消事件*/
    $("#admin-d").delegate(".close", "click", function () {
        $("#admin-d").empty().hide();
        $("#adminNew-va").removeClass("log-adclass");
        $("#login-z").val("");
    });


    /*ip点击取消事件 */
    $("#adminip-d").delegate(".close", "click", function () {
        $("#adminip-d").empty().hide();
        $("#adminNew-vaId").removeClass("log-adclass");
        $("#user-n").val("");
    });

    /*关键字点击取消事件 */
    $("#keyword-d").delegate(".close", "click", function () {
        $("#keyword-d").empty().hide();
        $("#adminNew-vaG").removeClass("log-adclass");
        $("#content-s").val("");
    });


    /*点击重置按钮*/
    $("#log-reset").click(function () {
        //$("#u-log-date").attr("value", '');
        //$("#u-log-date").trigger("change");
        var prevWeek =new Date();
        prevWeek.setDate(prevWeek.getDate() - 7);
        var today = new Date();
        var weekStartDate = format(prevWeek);
        var weekEndDate = format(today);
        $("#u-log-date").val(weekStartDate + " 至 " + weekEndDate);
        $("#u-log-date").trigger("change");

        logTypeTree.setDefaultValue({value: 0, text: logType[0]}, true);
        emptyall();

        searchHandler();
    });


    $("#u-log-date").click(function () {
        $(".date-picker-wrapper").addClass("dateNew");
    });




    //$("#user-n").blur(function(){
    //    var ip = $('#user-n').value;
    //    var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //正则表达式
    //    if(re.test(ip))
    //    {
    //        if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256)
    //            return true;
    //    }
    //    alert("IP地址输入格式不对！");
    //    return false;
    //});



}


$(function(){
    log();
});
/**
 * Created by HongBinfu
 */

/**
 * 基础框架包
 * @Author 洪彬富
 * 依赖包：jquery hash cookie json layer
 */
(function($){
    $.emptyFn=function(){};
    //bf命名空间下的基础函数
    $.bf={
        ajaxList:[],
        clearAjaxList:function()
        {
            var list = $.bf.ajaxList;
            var len =list.length;
            for(var a=0;a < len;a++)
            {
                list[a].abort();
            }
        },
        config:{
            selectedCls:'z-selected',
            currentClass:'z-current',
            loadedCls:'z-loaded',
            loadingCls:'z-loading',
            expandableCls:'z-expandable',
            expandedCls:'z-expanded',
            collapsedCls:'z-collapsed',
            generatedCls:'z-generated',
            disabledCls:'z-disabled',
            selectableCls:'z-selectable',
            inOperationCls:'z-in-operation'
        },
        mainProcessList:{
            actionChange:$.emptyFn,
            menuChange:$.emptyFn
        },
        mainProcessCb:$.Callbacks(),
        addProcess:function(func){
            $.bf.mainProcessCb.add(func);
        },
        removeProcess:function(func)
        {
            $.bf.mainProcessCb.remove(func);
        },
        emptyProcess:function(){
            $.bf.mainProcessCb.emptyProcess();
        },
        mainProcess:function()
        {
            $(window).bind({
                hashchange: $.bf.doProcess
            });
        },
        restartProcess:function(){
            $.bf.mainProcess();
        },
        doProcess:function(){
            $.bf.mainProcessCb.fire();
        },
        stopProcess:function(){
            $(window).unbind("hashchange",$.bf.doProcess);
        },
        date:function(format,date){
            format = format || "yyyy-MM-dd hh:mm:ss";
			date = date || new Date();
			/*
			 * eg:format="yyyy-MM-dd hh:mm:ss";
			 */
			var o = {
				"M+" : date.getMonth() + 1, // month
				"d+" : date.getDate(), // day
				"h+" : date.getHours(), // hour
				"m+" : date.getMinutes(), // minute
				"s+" : date.getSeconds(), // second
				"q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
				"S" : date.getMilliseconds()
				// millisecond
			};

			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
					- RegExp.$1.length));
			}

			for (var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1
						? o[k]
						: ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return format;
        },
        ajaxCommonCallback:function(res,cb,succeedTitle){
            cb=typeof(cb)=="function"?cb:$.emptyFn;
            if(res && res.length>0 && typeof(res)=="string")
            {
                res=$.evalJSON(res);
            }
            if(res && (res.Failed>0 || res.Suc>0))
            {
                if(res.Failed<=0 && res.Suc>0)
                {
                    succeedTitle = succeedTitle || L.operationSucceed;
                    layer.msg(succeedTitle,1,1,function(){
                        cb(res,true);
                    });
                    return false;
                }
                else
                {
                    var msg = L.operationSucceed+":<br/>"+L.succeed+':'+ res.Suc +" "+L.failed+':' + res.Failed;
                    var index = layer.alert(msg,1,function(){
                        cb(res,false);
                        layer.close(index);
                    });
                }

                return false;
            }
            if(res && $.isArray(res))
            {
                var failed = 0;
                var suc = 0;
                $.each(res,function(k,v){
                    failed += parseInt(v.Failed);
                    suc += parseInt(v.Suc);
                });
                if(suc>0 && failed<=0)
                {
                    succeedTitle = succeedTitle || L.operationSucceed;
                    layer.msg(succeedTitle,1,1,function(){
                        cb(res,true);
                    });
                    return false;
                }
                else if(suc>0 ||failed>0)
                {
                    var msg = L.operationSucceed+":<br/>"+L.succeed+':'+ suc +" "+L.failed+':' + failed;
                    var index = layer.alert(msg,1,function(){
                        cb(res,false);
                        layer.close(index);
                    });
                    return false;
                }
            }
            if(res && res.ret == 0)
            {
                succeedTitle = succeedTitle || L.operationSucceed;
                layer.msg(succeedTitle,1,1,function(){
                    cb(res,true);
                });
            }
            else
            {
                $.bf.parseError(res);
                cb(res,false);
            }
            $.bf.hideLoadRemark();
        },
        setHashValue:function(name,value){
            $.bf.stopProcess();
            $.hash(name,value);
            $.bf.restartProcess();
        },
        hash:function(name,value,isFire){
            $.bf.stopProcess();
            var v=$.hash(name,value);
            $.bf.restartProcess();
            return v;
        },
        loadLayer:'',
        operationWaiting:function(title)
        {
            title = title || L.inOperation;
            $.bf.loadLayer=layer.load(title);
        },
        loadDataWaiting:function(title)
        {
            title = title || L.loadData;
            $.bf.loadLayer=layer.load(title);
        },
        hideLoadRemark:function(){
            //console.log("heihei");
            layer.close($.bf.loadLayer);
        },
        ajaxErrorHandle:function(xhr, status, e){
            switch (xhr.status)
            {
                case 504:
                    layer.msg("网络延迟，请稍后重试！",3);
                    break;
                case 404:
                    layer.msg("请求失败，请稍后重试！",3);
                    break;
            }
            layer.close($.bf.loadLayer);
            //console.log("heihei");
        },
        parseError:function(data)
        {
            //console.log("heihei");
            layer.close($.bf.loadLayer);
            if(data && data.ret)
            {
                if(parseInt(data.ret)==-44)
                {
                    location.href="../index.php"+location.hash;
                }
                if(data.error_info)
                {
                    layer.alert(data.error_info,2, L.errorInfo);
                }
                else
                {
                    layer.alert(parseCode(data.ret),2,L.errorInfo);
                }
            }
            else
            {
                layer.alert(L.unknownError,2,L.errorInfo);
            }
        },
        formSubmitHandler:function(form,url,validator,cb)
        {
            if(validator.form())
            {
                $.bf.operationWaiting();
                form.ajaxSubmit({
                    type: 'post',
                    url:url,
                    success:function(data)
                    {
                        $.bf.ajaxCommonCallback(data,cb);
                    }
                });
            }
        },
        ajaxSetup:{
            timeout:1500000000,
            dataType:'json',
            type:'post',
            error: function(xhr, status, e){
                switch (xhr.status)
                {
                    case 504:
                        layer.msg("网络延迟，请稍后重试！",3);
                        break;
                    case 404:
                        layer.msg("请求失败，请稍后重试！",3);
                        break;
                }
                layer.close($.bf.loadLayer);
            },
            beforeSend:function(){
                if($.bf.ajaxLocked)
                {
                    return false;
                }
            }
        },
        autoSetLayout:function(){
            return;
            var w = $(window).width();
            var h = $(window).height();
            var body = $("body");
            var bW = body.width();
            var bH = body.height();
            var con = $(".container");
            var minW = 1260;
            var minH = h < 100 ? 100 : h-$(".g-hd").outerHeight();
            //$(".g-hd").outerHeight()
            //var conW= w < minW ? minW : '100%';
            con.css({minWidth:minW});
            var left = $(".g-sd");
            var leftW = left.outerWidth();
            var leftH = left.outerHeight();
            var center = $(".g-mn");
            var centerW = minW - leftW;
            //centerW = centerW < (minW - centerW) ? (minW - centerW) : centerW;
            //console.log(centerW);
            //console.log(minH);
            center.css({minWidth:centerW,minHeight:minH});
            $(".g-sd-version").show();
            //console.log(center.height());
            //var mTop = $(".m-mn-top");
            // mTop.css({minWidth:centerW});
            //$(".m-content-container").css({width:center.width()});
            //$(".container").css("height",viewHeight);
            //$(".m-content").css("height",(viewHeight-98));
            /*$(".g-mn").css("width",a);
             if(viewHeight > 740){
             $(".container").css("overflow-y",'auto');
             }*/
        },
        loadPage:function(target,url,params,cb){
            if(!target || target.length<=0)
            {
                return;
            }
            $.bf.loadDataWaiting();
            var old = target.html();
            target.empty().load(url,params,function(data){
                $.bf.hideLoadRemark();
                //判断返回值不是 json 格式
                if (/^\{(.+:.+,*){1,}\}$/.test(data))
                {
                    target.html(old);
                    var error = jQuery.parseJSON(data);
                    $.bf.ajaxCommonCallback(error,cb);
                }
                else
                {
                    if($.isFunction(cb))
                    {
                        cb(data,true);
                    }
                }
            });
        }
    };



    $.fn.isSelected=function(cls){
        cls=cls||$.bf.config.selectedCls;
        return $(this).is("."+ cls);
    };
    $.fn.isSelectable=function(cls){
        cls=cls||$.bf.config.selectableCls;
        return $(this).is("."+ cls);
    };
    $.fn.isCurrent=function(cls){
        cls=cls || $.bf.config.currentClass;
        return $(this).is("."+cls);
    };

    $.fn.isExpanded=function(cls){
        cls=cls || $.bf.config.expandedCls;
        return $(this).is("."+cls);
    };
    $.fn.isExpandable=function(cls){
        cls=cls || $.bf.config.expandableCls;
        return $(this).is("."+cls);
    };
    $.fn.isCollapsed=function(cls){
        cls=cls || $.bf.config.collapsedCls;
        return $(this).is("."+cls);
    };

    $.fn.isGenerated=function(cls)
    {
        cls=cls || $.bf.config.generatedCls;
        return $(this).is("."+cls);
    };

    $.fn.isDisabled=function(cls)
    {
        cls=cls || $.bf.config.disabledCls;
        return $(this).is("."+cls);
    };
    //默认配置项
    $.navigationDefaults={
        selectedCls:$.bf.config.selectedCls,
        actionMark:'action',
        idMark:'data-id',
        itemCls:'u-nav-item',
        defaultAction:'user'
    };

    /**
     * 顶部菜单插件
     */

    $.fn.navigation=function(options){
        //顶部菜单的扩展函数
        var opts= $.extend({},$.navigationDefaults,options);
        var me=$(this);
        //深度拷贝
        var obj= $.extend(true,{},opts);
        obj.me=me;
		obj.itemCls=opts.itemCls;
		obj.idMark=opts.idMark;
        me.find("."+opts.itemCls).each(function(){
            var a=$(this);
            a.bind({
                click:function(){
                    if(!a.isSelected(opts.selectedCls))
                    {
                        $.bf.hash("");
                        $.hash(opts.actionMark, a.attr(opts.idMark));
                    }
                }
            });
        });
        return obj;
    };

    /**
     * 主内容展示
     */

    $.mainBoxDefaults={
        selectedCls: $.bf.config.selectedCls,
        loadedCls: $.bf.config.loadedCls,
        itemCls:'u-main-container-item',
        idMark:'data-id',
        navigation:{},
        actionMark:'action',
        onAfterLoad:$.emptyFn,
        onBeforeLoad:$.emptyFn
    };
    $.fn.mainBox=function(options)
    {
        var opts= $.extend({}, $.mainBoxDefaults,options);
        var me=$(this);
        function doLoad(contoller,cb)
        {
            cb =$.isFunction(cb)?cb : $.emptyFn;
            layer.closeTips();
            /*var item=me.find("."+opts.itemCls+"["+opts.idMark+"="+action+"]");
            if(item.length>0)
            {
                me.find("."+opts.itemCls).hide();
                item.show();
                return;
            }
            var url="./module/"+action+"/main.php";
            var div=document.createElement("div");
            $(div).addClass(opts.itemCls).attr(opts.idMark,action);
            me.append(div);*/
            $.bf.loadDataWaiting();
            var url=API.router.autoLoadModule+"_c="+contoller;
            opts.onBeforeLoad();
            me.load(url,function(){
                opts.onAfterLoad();
            });
            /*$.ajax({
                url:url,
                dataType:'html',
                success:function(data){
                    var div=document.createElement("div");
                    $(div).addClass(opts.itemCls).attr(opts.idMark,action).append(data);
                    me.append(div);
                }
            });*/
        }
        
		if(opts.navigation.me instanceof jQuery){
			var nav=opts.navigation;
			nav.me.find("."+nav.itemCls).click(function(){
                $.bf.clearAjaxList();
                if($(this).isSelected(opts.selectedCls))
					{
						return;
					}
					var contoller= $(this).attr(nav.idMark);
					var currentSel= nav.me.find("."+ nav.selectedCls);
					if(currentSel.length>0 && currentSel.attr(nav.idMark) == contoller)
					{
						return;
					}
					else
					{
						currentSel.removeClass(opts.selectedCls);
						nav.me.find("["+nav.idMark+"="+contoller+"]").addClass(opts.selectedCls);
                        doLoad(contoller);
					}
			});
			var obj={
				me:me,
				load:function(contoller,cb){
					nav.me.find("."+ nav.selectedCls).removeClass(opts.selectedCls);
					nav.me.find("["+nav.idMark+"="+contoller+"]").addClass(opts.selectedCls);
					doLoad(contoller);
				}
			};
		}
        /* if(opts.navigation.me instanceof jQuery)
        {
            var nav=opts.navigation;
            //监听hashchange，加载不同模块内容
            $.bf.addProcess(function(){
                var action= $.hash(nav.actionMark)||nav.defaultAction;
                var currentSel= nav.me.find("."+ nav.selectedCls);
                if(currentSel.length>0 && currentSel.attr(nav.idMark) == action)
                {
                    return;
                }
                else
                {
                    currentSel.removeClass(opts.selectedCls);
                    nav.me.find("["+nav.idMark+"="+action+"]").addClass(opts.selectedCls);
                    doLoad(action);
                }
            });
        } */
        return obj;
    };


    $.fastAction=function(url,data,cb,type,loadTitle){
        cb=typeof(cb)=="function"?cb:$.emptyFn;
        type = type || $.bf.ajaxSetup.type;
        $.bf.operationWaiting(loadTitle);
        var ajaxItem = $.ajax({
            url: url,
            data: data,
            type:type,
            dataType: $.bf.ajaxSetup.dataType,
            success: function(res){
                $.bf.ajaxCommonCallback(res,cb);
            }
        });
        $.bf.ajaxList.push(ajaxItem);
    };
    $.download=function(url,data,filename,cb,loadTitle,succeedTitle)
    {
        cb = typeof(cb) == "function"? cb : $.emptyFn;
        loadTitle = loadTitle || L.exporting;
        succeedTitle = succeedTitle || L.exportSucceed;
        $.bf.operationWaiting(loadTitle);
        var ajaxItem = $.ajax({
            url: url,
            data: data,
            success: function(data){
                $.bf.ajaxCommonCallback(data,function(ret,res){
                     if(res)
                     {
                         cb();
                         var params={
                             code:ret.code,
                             filename: filename || ret.code
                         };
                         location.href = API.download.download+ "&" + $.param(params);
                     }
                },succeedTitle);
            }
        });
        $.bf.ajaxList.push(ajaxItem);
    };



    $.loadFormDefaults={
        url:''
    };
    $.fn.loadForm=function(options){
        var opts= $.extend({}, $.loadFormDefaults,options);
    };

    $.ajaxSelectDefaults={
        url:'',
        parseData:'',
        dataRoot:'',
        containerCls:'u-ajax-tree-select-container',
        inputCls:'u-ajax-tree-select-input',
        showCheckbox:false,
        //single multiple
        selMode:'single',
        icon:[],
        itemCls:'u-ajax-tree-select-item',
        checkboxCls:'u-ajax-tree-select-checkbox',
        generatedCls: $.bf.config.generatedCls,
        getType:'post',
        extraParams:{},
        textProperty:'text',
        idProperty:'id',
        //checkbox的位置 left right
        checkboxPos:'left',
        autoLoad:true,
        expandedCls: $.bf.config.expandedCls,
        collapsedCls: $.bf.config.collapsedCls
    };
    $.fn.ajaxSelect=function(options)
    {
        var opts= $.extend({}, $.ajaxSelectDefaults,options);
        var me=$(this);
        var name=me.attr("name");
        me.attr("name",null);
        var inputDom=document.createElement("input");
        var input=$(inputDom);
        input.attr({name:name,type:"hidden"});
        if(me.isGenerated(opts.generatedCls))
        {
            return;
        }
        me.attr("readonly",true).addClass(opts.inputCls+" "+opts.generatedCls);
        var div=document.createElement("div");
        var container=$(div);
        container.hide();
        container.addClass(opts.containerCls);
        me.after(div).after(inputDom);
        function showTree(){
            var w=me.outerWidth()-2;
            var h=me.outerHeight();
            var pos=me.position();
            var mL=parseInt(me.css("margin-left"));
            var l=pos.left+mL;
            var t=pos.top;
            container.css({width:w,position:'absolute',left:l,height:opts.height,overflow:"auto",top:t+h});
            me.addClass(opts.expandedCls);
        }
        function hideSelect()
        {
            container.fadeOut("fast");
            me.removeClass(opts.expandedCls);
        }
        function getExtraParams(key)
        {
            return key?obj.extraParams[key]:obj.extraParams;
        }
        var obj={
            sels:[],
            select:function(node,isFire)
            {

            },
            selModel:function()
            {

            },
            hideSelect:function()
            {
                hideSelect();
                $("body").unbind("click",hideSelect);
            },
            showSelect:function()
            {
                container.show();
            },
            //渲染dom
            renderer:function(data){
                var ulDom=document.createElement("ul");
                var ul=$(ulDom);
                $.each(data,function(k,v){
                    var liDom=document.createElement("li");
                    var li=$(li);
                    var aDom=document.createElement("a");
                    var a=$(aDom);
                    a.addClass(opts.itemCls).text(v[opts.textProperty]).data(v);
                    var checkbox=document.createElement("input");
                    $(checkbox).attr("type","checkbox").addClass(opts.checkboxCls);
                    li.append(aDom);
                    if(opts.showCheckbox && opts.checkboxPos=="left")
                    {
                        li.prepend(checkbox);
                    }
                    else if(opts.showCheckbox)
                    {
                        li.append(checkbox);
                    }
                    ul.append(liDom);
                });
                container.append(ulDom);
            },
            extraParams:opts.extraParams,
            load:function()
            {
                obj.doLoad();
            },
            onAjaxProcess:null,
            stopAjaxProcess:function(){
                if(obj.onAjaxProcess)
                {
                    obj.onAjaxProcess.abort();
                }
            },
            doLoad:function()
            {
                var params= $.extend({},getExtraParams());
                obj.stopAjaxProcess();
                obj.onAjaxProcess = $.ajax({
                    url:opts.url,
                    data:params,
                    type:opts.getType,
                    success:function(data)
                    {
                        if(data && !data.ret)
                        {
                            //解析渲染的数据
                            var renderData;
                            if($.isFunction(opts.parseData))
                            {
                                renderData=opts.parseData(data);
                            }
                            else if(opts.dataRoot && data[opts.dataRoot])
                            {
                                renderData=data[opts.dataRoot];
                            }
                            if(renderData)
                            {
                                obj.renderer(renderData);
                            }
                        }
                        else
                        {
                            $.bf.parseError(data);
                        }
                    }
                });
                $.bf.ajaxList.push(obj.onAjaxProcess);
            }
        };
        if(opts.autoLoad)
        {
            obj.load();
        }
    };

    $.loadSelectDefaults={
        url:'',
        params:{},
        dataRoot:'',
        parseData:'',
        textProperty:'text',
        idProperty:'id',
        getType:$.bf.ajaxSetup.type,
        dataType: $.bf.ajaxSetup.dataType,
        autoLoad:false,
        loadingCls: $.bf.config.loadingCls,
        filterRowData: false
    };
    $.fn.loadSelect=function(options){
        var opts= $.extend({}, $.loadSelectDefaults,options);
        var me=$(this);
        function renderer(data)
        {
            me.empty();
            $.each(data,function(k,e){
                var v;
                if($.isFunction(opts.filterRowData))
                {
                    v = opts.filterRowData(e);
                }
                else
                {
                    v = e;
                }
                if(!v)return;
                var option=document.createElement("option");
                var op=$(option);
                op.attr("value",v[opts.idProperty]).text(v[opts.textProperty]);
                me.append(option);
            });
        }

        var obj={
            params:opts.params,
            url:opts.url,
            data:opts.params,
            type:opts.getType,
            dataType:opts.dataType,
            loadingCls:opts.loadingCls,
            load:function(){
                obj.doLoad();
            },
            doLoad:function(){
                me.empty();
                me.addClass(opts.loadingCls);
                var ajaxItem = $.ajax({
                    url:obj.url,
                    data:obj.params,
                    type:obj.getType,
                    dataType:obj.dataType,
                    success:function(data){
                        me.removeClass(obj.loadingCls);
                        if(data && !data.ret)
                        {
                            //解析渲染的数据
                            var renderData;
                            if($.isFunction(opts.parseData))
                            {
                                renderData=opts.parseData(data);
                            }
                            else if(opts.dataRoot && data[opts.dataRoot])
                            {
                                renderData=data[opts.dataRoot];
                            }
                            if(renderData)
                            {
                                renderer(renderData);
                            }
                        }

                    },
                    error:function(xhr,status,e)
                    {
                        me.removeClass(obj.loadingCls);
                        $.bf.ajaxErrorHandle(xhr,status,e);
                    }
                });
                $.bf.ajaxList.push(ajaxItem);
            }
        };

        if(opts.autoLoad)
        {
            obj.load();
        }
        me[0].ajaxLoad = obj;
    };

    $.strLimit=function(str,len,fix){
        fix=fix||"...";
        if(str.length > len){
            return str.substring(0,len) + fix;
        }
        else
        {
            return str;
        }
    };
    $.fn.wresize = function( f )
    {
        wresize = {fired: false, width: 0};
        function resizeOnce()
        {
            if ( $.browser.msie )
            {
                if ( ! wresize.fired )
                {
                    wresize.fired = true;
                }
                else
                {
                    var version = parseInt( $.browser.version, 10 );
                    wresize.fired = false;
                    if ( version < 7 )
                    {
                        return false;
                    }
                    else if ( version == 7 )
                    {
                        //a vertical resize is fired once, an horizontal resize twice
                        var width = $( window ).width();
                        if ( width != wresize.width )
                        {
                            wresize.width = width;
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        function handleWResize( e )
        {
            if ( resizeOnce() )
            {
                return f.apply(this, [e]);
            }
        }
        this.each( function()
        {
            if ( this == window )
            {
                $( this ).resize( handleWResize );
            }
            else
            {
                $( this ).resize( f );
            }
        } );
        return this;
    };

    //============panel禁用遮罩==================
    $.disablePanelDefaults = {
        generatedCls: $.bf.config.generatedCls,
        shadeCls:'u-disable-panel',
        autoShow:false
    };
    $.fn.disablePanel = function(option)
    {
        var opts = $.extend({}, $.disablePanelDefaults,option);
        $(this).each(function(){
            if($(this).isGenerated(opts.generatedCls))
            {
                return true;
            }
            var ts=this;
            var me=$(ts);
            var shadeDom;
            //初始化控件
            function init()
            {
                shadeDom = document.createElement("div");
                $(shadeDom).addClass(opts.shadeCls).hide();
                me.append(shadeDom);
                if(opts.autoShow)
                {
                    $(shadeDom).show();
                }
            }
            //显示
            function show()
            {
                $(shadeDom).show();
            }
            function resetPos()
            {
                var w = me.width();
                var h = me.height();
                $(shadeDom).css({width:w,height:h})
            }
            //隐藏
            function hide()
            {
                $(shadeDom).hide();
            }
            var obj={
                me:me,
                ts:ts,
                opts:opts,
                show:function(){
                    show();
                },
                hide:function(){
                    hide();
                },
                resetPos:function(){
                    resetPos();
                }
            };
            init();
            me[0].disablePanel = obj;
        });
    }
    $.selectFileBtnDefaults = {

    };
    //临时性解决ie下file input的安全策略问题
    $.fn.selectFileBtn = function(option)
    {
        var me = $(this);
        var opts = $.extend({},$.selectFileBtnDefaults,option);
        var fileBtn = $(opts.fileBtn);
        var input = $(opts.input);
        me.after(fileBtn);
        var pos = me.position();
        /*console.log(option);*/
        fileBtn.css({opacity:0,position:"relative",marginLeft:me.css("marginLeft"),top:"-23px",
            display:'block',width:me.outerWidth()+parseInt(me.css("paddingLeft"))+parseInt(me.css("paddingRight")),height:me.outerHeight()+parseInt(me.css("paddingTop"))+parseInt(me.css("paddingBottom")),cursor:"pointer"});
        fileBtn.bind({
            mouseover:function(){
                me.addClass("z-hover");
            },
            mouseout:function(){
                me.removeClass("z-hover");
            },
            click:function(e){
                e.stopPropagation();
            },
            change:function(){
                var val = $(this).val();
                input.val(val);
            }
        });
    }
})(jQuery);

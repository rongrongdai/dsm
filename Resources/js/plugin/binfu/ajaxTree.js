/**
 * Created by HongBinfu
 */

(function($){
    $.fn.cssInt = function(key){
        return parseInt($(this).css(key));
    };
    $.ajaxTreeDefaults={
        selMark:'',
        pathMark:'treePath',
        loadedCls:$.bf.config.loadedCls,
        expandableCls: $.bf.config.expandableCls,
        expandedCls:$.bf.config.expandedCls,
        collapsedCls: $.bf.config.collapsedCls,
        selectedCls: $.bf.config.selectedCls,
        generatedCls: $.bf.config.generatedCls,
        disabledCls: $.bf.config.disabledCls,
        url:'',
        getType:$.bf.ajaxSetup.type,
        dataType: $.bf.ajaxSetup.dataType,
        params:{},
        idProperty:'id',
        pidProperty:'pid',
        leafProperty:'leaf',
        textProperty:'text',
        childrenProperty:'children',
        childCountProperty:'childCount',
        pathProperty:'path',
        autoLoad:true,
        icon:['icon-user-lv1','icon-user-lv2','icon-user-lv3'],
        iconPath:'./images/icon/',
        autoExpandLevel:2,
        autoLoadLevel:2,
        baseCls:'u-ajax-tree',
        skinCls:'s-ajax-tree',
        itemCls:'u-ajax-tree-item',
        iconImgCls:'icon-img',
        expandIconCls:'icon-expand',
        expandIconPos:'left',//left right
        loadingCls:$.bf.config.loadingCls,
        idMark:'data-id',
        pathSeparator:"/",
        unselectLevel:[],
        //single simple multiple
        selMode:'single',
        selectChildrenMode:false,
        showCheckbox:false,
        showIcon:true,
        showExpand:true,
        checkboxCls:'u-ajax-tree-checkbox',
        itemClickSelect:true,
        itemClickExpand:true,
        levelWidth:15,
        rootLocked:true,
        dataRoot:'',
        parseData:'',
        //可以设置最多展开到某一级
        lastChildLevel:20,
        extraParams:{},
        filter:$.emptyFn,
        rootId:'',
        checkableProperty:'checkable',
        checkedProperty:'checked',
        disabledProperty:'disabled',
        iconProperty:'icon',
        textLength:10,
        filterRowData:'',
        itemWidth:200,
        itemTextAlign:"left",
        afterNodeRender:function(){return "";},
        enableFloatMenu:false,
        floatMenu:[{icon:"u-dept-tree-menu",handler:function(){}},{icon:"u-dept-tree-menu",handler:function(){}}],
        floatMenuOffset:[12,0],//x、y自定义偏移，在自动偏移的基础上做细微调整
        /*floatMenuItemWidth:37,
        floatMenuItemHeight:37,*/
        floatMenuCls:"float-menu",
        floatMenuItemCls:"float-menu-item",
        floatMenuBtnCls:"float-menu-btn",
        floatMenuShowEvent:"click",
        floatMenuFilter:"",//有些节点不需要显示浮动菜单的处理函数，返回true显示，false不显示
        rootLockedCls:'z-root-locked',
        localData:false,
        allNodeDataProperty:'allNode',
        autoSelectFire:true,
        parseChildrenData:'',
        //一次加载完全
        onceLoadAll:false,
        levelProperty:'level',
        disableLevel:0,
        customIconHandler:function(){},
        iconCls:"icon-default-tree-node-icon",
        //锁定选择功能
        selectLockLevel:0,
        selectLockedCls:'z-select-locked',
        selectLockedProperty:'selectLocked'
    };

    /**
     * ajax树控件
     * @param options
     */
    $.fn.ajaxTree=function(options){
        if($(this).length<=0)return false;
        var opts= $.extend({}, $.ajaxTreeDefaults,options);
        var me=$(this);
        if(me.isGenerated(getConfig('generatedCls')))
        {
            return;
        }

        /**
         * 初始化插件
         */
        function init(){
            if(getConfig('selMark'))
            {
                var hSels=$.bf.hash(getConfig('selMark'));
                var hPaths=$.bf.hash(getConfig('pathMark'));
                obj.sels=hSels?hSels.split(","):[];
                obj.paths=hPaths?hPaths.split(","):[];
            }
            if(getConfig("enableFloatMenu"))
            {
                generateFloatMenu();
            }
        }
        //浮动菜单
        function generateFloatMenu(){
            var idProperty = getConfig("idProperty");
            var menuData = getConfig("floatMenu");
            //console.log(menuData);
            var menuOffset = getConfig("floatMenuOffset");
            var menuCls = getConfig("floatMenuCls");
            var menuIcon = getConfig("floatMenuBtnCls");
            var showEvent = getConfig("floatMenuShowEvent");
            var itemCls = getConfig("floatMenuItemCls");
            var menuDom = document.createElement("div");
            var menu = $(menuDom);
            menu.addClass(menuCls);
            $("body").append(menu);
            $.each(menuData,function(k,v){
                var icon = v.icon||itemCls;
                var handler = $.isFunction(v.handler)?v.handler:function(){};
                var a = document.createElement("a");
                menu.append(a);
                $(a).addClass(itemCls).addClass(icon).click(function(){
                    var ts = $(this);
                    handler(menu.data(),ts,obj);
                    menu.fadeOut();
                    me.find("[data-menu-btn]").fadeOut();
                    return false;
                });
            });
            var menuHeight = menu.outerHeight();
            var floatMenuFilter = getConfig("floatMenuFilter");
            floatMenuFilter = $.isFunction(floatMenuFilter)?floatMenuFilter:function(){return true;};
            //注册当每一个节点渲染默认dom元素之后绑定的事件，_node即是节点的jquery对象，可以对其插入任何dom元素
            me.bind("afterNodeRender",function(e,_node,_me,_obj){
                var chk = floatMenuFilter(_node,_me,_obj);
                if(!chk)
                {
                    return false;
                }
                menuIcon = $.isFunction(menuIcon)? menuIcon(_node,_me,_obj): menuIcon;
                var menuBtnDom = document.createElement("a");
                var menuBtn =$(menuBtnDom);
                menuBtn.addClass(menuIcon).attr("data-menu-btn",true).hide();
                _node.hover(function(){
                    if(menu.is(":hidden")){
                        menuBtn.show();
                    }
                    return false;
                },function(){
                    if(menu.is(":hidden")){
                        menuBtn.hide();
                    }
                    return false;
                });
                _node.append(menuBtnDom);
                menuBtn.bind(showEvent,function(){
                    menu.fadeOut();
                    var offset = menuBtn.offset();
                    var menuBtnWidth = menuBtn.width()+menuBtn.cssInt("paddingLeft")+menuBtn.cssInt("paddingRight");
                    //console.log(menuBtn.width()+menuBtn.cssInt("paddingLeft"));
                    menu.data(_node.data()).css({left:offset.left+menuBtnWidth+menuOffset[0],top:offset.top-(menuHeight/2)+(menuBtnWidth/2)}).fadeIn();
                    $("body").one("click",function(){
                        menu.fadeOut();
                        menuBtn.fadeOut();
                    });
                    return false;
                });
            });

        }
        /**
         * 设置配置项
         * @param key
         * @param value
         */
        function setConfig(key,value){
            if(arguments.length>1)
            {
                var opt={};
                opt[key]=value;
            }
            else
            {
                opt=key;
            }
            opts = $.extend({},opts,opt);
        }

        /**
         * 获取配置项
         * @param key
         * @returns {*}
         */
        function getConfig(key){
            return key?opts[key]:opts;
        }

        /**
         * 获取ajax请求的时候手动添加的参数
         * @param key
         * @returns {*}
         */
        function getExtraParams(key)
        {
            return key?obj.extraParams[key]:obj.extraParams;
        }

        /**
         * 渲染到DOM节点
         * @param data
         * @param node
         * @param cb
         * @param hasChildData
         */
        function render(data,node,cb,hasChildData){
            if(!data)
            {
                return;
            }
            if(!node.is(ts) && !node.is("."+getConfig('expandableCls')))
            {
                return;
            }
            //console.log("."+getConfig('itemCls'));
            if(node.is(ts) && me.find("."+getConfig('itemCls')).length>0)
            {
                return;
                //console.log("ssss");
                //me.empty();
            }
            var ul=document.createElement("ul");
            $(ul).hide();
            var selector = false;
            //标记已经加载过数据源
            node.addClass(getConfig('loadedCls'));
            if(data.length>0)
            {
                //var childItem = false;
                //遍历子节点
                $.each(data,function(k,e){
                    var v;
                    if($.isFunction(obj.filterRowData))
                    {
                        v = obj.filterRowData(e,node,obj,k);
                    }
                    else
                    {
                        v = e;
                    }
                    if(!v || v.length<=0){
                        if(k == (data.length-1))
                        {
                            if(!node[0].childrenItems)
                            {
                                node.addClass(getConfig('loadedCls')).removeClass(getConfig('expandableCls'));
                                /*if(node.is(ts))
                                 {
                                 obj.deselectAll(true);
                                 }*/
                            }
                        }
                        return true;
                    }
                    var li=document.createElement("li");
                    var a=document.createElement("a");
                    $(li).append(a);
                    $(ul).append(li);
                    var level;
                    //自动拼接path
                    if(node.is(ts))
                    {
                        level=1;
                        if(!v[getConfig('pathProperty')])
                        {
                            $(a).data(getConfig('pathProperty'),"/"+v[getConfig('idProperty')]+"/");
                        }
                    }
                    else
                    {
                        level=Number(node.data(getConfig('levelProperty')))+1;
                        if(!v[getConfig('pathProperty')])
                        {
                            $(a).data(getConfig('pathProperty'),node.data(getConfig('pathProperty'))+v[getConfig('idProperty')]+"/");
                        }
                    }
                    //绑定上级节点关系，方便查找和调用
                    if(!node.is(ts))
                    {
                        $(a)[0].parentItem = node;
                    }
                    //绑定下级节点关系，方便查找和调用
                    /*console.log(node[0].childrenItems);
                     if(!node[0].childrenItems)
                     {
                     node[0].childrenItems = $(a);
                     }*/

                    /*if(childItem)
                     {
                     childItem = childItem.add($(a));
                     }
                     else
                     {
                     childItem = $(a);
                     }*/
                    //console.log(node[0].childrenItems);
                    if(node[0].childrenItems)
                    {
                        node[0].childrenItems = node[0].childrenItems.add($(a));
                    }
                    else
                    {
                        node[0].childrenItems = $(a);
                    }
                    $(a).data(getConfig('levelProperty'),level);
                    $(a).data(getConfig('idProperty'), v[getConfig('idProperty')]);
                    $(a).data(v);
                    var lvClass=level>1?'child':'root';
                    //添加样式
                    var cls=getConfig('itemCls')+" "+getConfig('baseCls')+"-"+lvClass+" "+getConfig('skinCls')+"-"+lvClass;
                    if(v[getConfig('disabledProperty')] || (getConfig('disableLevel') >0 &&level<= getConfig('disableLevel')))
                    {
                        cls += " "+getConfig('disabledCls');
                    }
                    if(v[getConfig('selectLockedProperty')] || (getConfig('selectLockLevel') >0 &&level<= getConfig('selectLockLevel')))
                    {
                        cls += " "+getConfig('selectLockedCls');
                    }
                    var span=document.createElement("span");
                    $(span).addClass(getConfig('baseCls')+"-text").text(v[getConfig('textProperty')]).attr("title",v[getConfig('textProperty')]);
                    $(a).addClass(cls).append(span);
                    var lW=level*getConfig('levelWidth');
                    if(getConfig('levelWidth'))
                    {
                        //itemWidth

                        $(a).css({paddingLeft:lW});
                    }
                    if(getConfig('itemWidth'))
                    {
                        $(span).css({width:getConfig('itemWidth')-lW-30});
                    }
                    if(getConfig('itemTextAlign'))
                    {
                        $(a).css({textAlign:getConfig('itemTextAlign')});
                    }
                    //console.log(getConfig('itemClickSelect'));
                    //console.log(( $(a).isExpanded(getConfig('expandedCls'))));
                    if($.inArray(""+ level,getConfig('unselectLevel'))<0)
                    {
                        //节点点击事件
                        $(a).bind({
                            click:function(e){
                                if(obj.onBeforeSelect($(a),obj) && getConfig('itemClickSelect') && !$(a).isDisabled(getConfig('disabledCls')) && !$(a).is("."+getConfig('selectLockedCls')))
                                {
                                    selectModel($(a));
                                }
                                e.stopPropagation();
                                return false;
                            }
                        });
                    }

                    if(!v[getConfig('leafProperty')])
                    {
                        if(getConfig('lastChildLevel')>0 && level<getConfig('lastChildLevel'))
                        {
                            $(a).addClass(getConfig('expandableCls'));
                        }
                        else if(getConfig('lastChildLevel')<=0)
                        {
                            $(a).addClass(getConfig('expandableCls'));
                        }
                    }
                    else
                    {
                        $(a).addClass(getConfig('loadedCls'));
                    }

                    $(a).bind({
                        click:function(e){
                            //如果开启点击节点选择模式（该节点没有被锁定没有锁定情况下）

                            if(getConfig('itemClickExpand') && (getConfig('rootLocked') && level>1 || !getConfig('rootLocked')) && !$(a).isDisabled(getConfig('disabledCls')))
                            {
                                if($(this).isExpanded(getConfig('expandedCls')))
                                {

                                    obj.collapse($(this));
                                }
                                else
                                {
                                    obj.expand($(this));
                                }
                            }
                            e.stopPropagation();
                            return false;
                        }
                    });
                    var chkbox=document.createElement("input");
                    $(chkbox).attr("type","checkbox").addClass(getConfig('checkboxCls')).bind({
                        click:function(e){
                            if($(a).isDisabled(getConfig('disabledCls')))
                            {
                                return false;
                            }
                            var p=$(chkbox).parent();
                            var s=true;
                            if(obj.onBeforeSelect(p,obj))
                            {
                                s=selectModel(p,e);
                            }
                            if(s===false)
                            {
                                return s;
                            }
                            e.stopPropagation();
                        }
                    });
                    if(!v[getConfig('checkableProperty')] && !getConfig('showCheckbox'))
                    {
                        $(chkbox).hide();
                    }
                    if(getConfig('showIcon'))
                    {
                        var i=document.createElement("i");
                        var iconCls= getConfig('iconCls');
                        if(v[getConfig('iconProperty')])
                        {
                            iconCls += " "+v[getConfig('iconProperty')];
                        }
                        var levelIcon = getConfig('icon')[level-1];
                        if(levelIcon)
                        {
                            iconCls += " "+levelIcon;
                        }

                        if($.isFunction(getConfig('customIconHandler')))
                        {
                            var tmp =  getConfig('customIconHandler')(v,data,$(i),$(a),obj);
                            if(tmp)
                            {
                                iconCls += " "+tmp;
                            }
                        }
                        $(i).addClass(getConfig('iconImgCls'));
                        $(a).addClass(iconCls).prepend(i)
                    }
                    var epIconDom=document.createElement("i");
                    var epIcon=$(epIconDom);
                    epIcon.addClass(getConfig('expandIconCls'));
                    //console.log(getConfig('rootLocked') && level>1 || !getConfig('rootLocked'));
                    if(getConfig('rootLocked') && level>1 || !getConfig('rootLocked'))
                    {
                        epIcon.bind({
                            click:function(e){
                                var pr=$(this).parent();
                                if(pr.isExpanded(getConfig('expandedCls')))
                                {
                                    obj.collapse(pr);
                                }
                                else
                                {
                                    obj.expand(pr);
                                }
                                e.stopPropagation();
                                return false;
                            }
                        });
                    }
                    if(!getConfig('showExpand'))
                    {
                        epIcon.hide();
                    }
                    //添加复选框
                    $(a).prepend(chkbox);
                    //添加icon
                    if(getConfig('expandIconPos')=="left")
                    {
                        $(a).prepend(epIconDom);
                    }
                    else if(getConfig('expandIconPos')=="right")
                    {
                        $(a).append(epIconDom);
                    }
                    //自定义在后面添加元素
                    obj.afterNodeRender($(a));
                    me.trigger("afterNodeRender",[$(a),me,obj]);
                    //自动选中
                    //console.log(v);
                    //console.log($.inArray(""+v[getConfig('idProperty')],obj.sels));
                    // console.log(v);
                    // console.log(obj.sels);
                    //console.log(v[getConfig('checkedProperty')]+"==="+v[getConfig('textProperty')]);
                    if($.inArray(""+v[getConfig('idProperty')],obj.sels)>=0 || v[getConfig('checkedProperty')])
                    {
                        //console.log(v[getConfig('checkedProperty')]);
                        if(selector !== false)
                        {
                            selector = selector.add($(a));
                        }
                        else
                        {
                            selector = $(a);
                        }
                    }
                    //自动展开
                    var expandPathNum=0;
                    var path= obj.paths.join(",");
                    if(path)
                    {
                        var mPath=obj.getPath($(a));
                        var chkPathOne= path.indexOf(mPath) >=0;
                        if(chkPathOne && (v[getConfig('leafProperty')] || level>=getConfig('autoExpandLevel')) && !hasChildData)
                        {
                            expandPathNum++;
                            obj.expand($(a));
                        }
                    }
                    /*console.log(v[getConfig('childrenProperty')]);
                     console.log(getConfig('childrenProperty'));*/
                    var childrenData = v[getConfig('childrenProperty')];
                    if($.isFunction(getConfig('parseChildrenData')))
                    {
                        childrenData = getConfig('parseChildrenData')(v);
                    }
                    if(childrenData)
                    {
                        render(childrenData,$(a),function(){
                            //$(a).addClass(getConfig('expandedCls'));
                        },true);
                    }
                    if(expandPathNum)
                    {

                    }
                    else if(!v[getConfig('leafProperty')] && level<getConfig('autoExpandLevel'))
                    {
                        //$(a).addClass(getConfig('expandedCls'));
                        /*obj.loadChild(v[getConfig('idProperty')],$(a),function(){
                         $(a).addClass(getConfig('expandedCls'));
                         });*/
                        obj.expand($(a));
                    }
                    else if(!v[getConfig('leafProperty')] && level<getConfig('autoLoadLevel'))
                    {
                        obj.loadChild(v[getConfig('idProperty')],$(a));
                    }
                    //是否锁定跟节点
                    if(getConfig('rootLocked') && level==1)
                    {
                        $(a).addClass(getConfig('rootLockedCls'));
                    }
                });
                //console.log(selector);
                if(selector)
                {
                    //console.log(getConfig('autoSelectFire'));
                    //autoSelectFire 是否触发select和selectchange事件
                    obj.select(selector,getConfig('autoSelectFire'));
                }
                //node[0].childrenItems = childItem;
                var nodeNext=node.next("ul");
                if(node.is(ts))
                {
                    node.append(ul);
                    $(ul).slideDown();
                    if(typeof(cb)=="function")
                    {
                        cb(node);
                    }
                }
                else
                {
                    node.after(ul);
                    //$(ul).slideDown();
                    if(typeof(cb)=="function")
                    {
                        cb(node);
                    }
                }
            }
            else
            {
                node.removeClass(getConfig('expandableCls'));
            }
        }
        function selectModel(n,e){
            if(!n || n.length<=0)return;
            switch(getConfig('selMode'))
            {
                case "single":
                    if(n.isSelected(getConfig('selectedCls')))
                    {
                        return false;
                    }
                    obj.sels =[];
                    obj.deselect(me.find("a."+getConfig('selectedCls')),false);
                    return obj.select(n);
                    break;
                case "simple":
                    if(n.isSelected(getConfig('selectedCls')))
                    {
                        return obj.deselect(n);
                    }
                    else
                    {
                        obj.deselect(me.find("a."+getConfig('selectedCls')),false);
                        return obj.select(n);
                    }
                    break;
                case "multiple":
                    if(n.isSelected(getConfig('selectedCls')))
                    {
                        n = obj.shiftKeyDeselectProduct(n,e);
                        return obj.deselect(n);
                    }
                    else
                    {
                        n = obj.shiftKeySelectProduce(n,e);
                        return obj.select(n);
                    }
                    break;
            }
        }
        me.addClass(getConfig('baseCls')+" "+getConfig('skinCls')+" "+getConfig('generatedCls'));
        var ts=this;
        var obj={
            me:me,
            ts:ts,
            opts:opts,
            getMe:function(){
                return me;
            },
            setConfig:function(key,value){
                return setConfig(key,value);
            },
            getConfig:function(key){
                return getConfig(key);
            },
            isFirstLoad:true,
            rootId:getConfig('rootId'),
            selectChildrenMode:getConfig('selectChildrenMode'),
            load:function(isDeselectAll){
                isDeselectAll = isDeselectAll || false;
                me.empty();
                me.removeClass(getConfig('loadedCls'));
                if(isDeselectAll)
                {
                    obj.deselectAll(false);
                    obj.sels = [];
                    obj.paths =[];
                }
                //obj.sels = [];
                obj.isFirstLoad = true;
                obj.loadChild(obj.rootId,me);
            },
            reload:function(){
                var nodes=obj.getSelectNodes();
                nodes.each(function(){
                    var child=$(this);
                    if(child.data(getConfig('levelProperty'))==1)
                    {
                        obj.load();
                        return false;
                    }
                    var id=child.data(getConfig('idProperty'));
                    child.addClass(getConfig('expandableCls')).next().empty();
                    obj.loadChild(id,child);
                });
            },
            expand:function(node,cb){
                cb = cb || $.emptyFn;
                if(!node || node.length<=0)return;
                if(node.is("."+getConfig('loadingCls')))
                {
                    return;
                }
                node.removeClass(getConfig('collapsedCls'));
                if(node.is("."+getConfig('expandableCls')) && !node.is("."+getConfig('loadedCls')))
                {
                    obj.loadChild(node.data(getConfig('idProperty')),node,function(n){
                        cb(n);
                        //n.addClass(getConfig('expandedCls'));
                        obj.expand(node);
                    });
                }
                else if(node.is("."+getConfig('expandableCls')) && !node.is("."+getConfig('disabledCls')))
                {
                    node.addClass(getConfig('expandedCls'));
                    node.next("ul").slideDown();
                    cb(node);
                }
            },
            collapse:function(node){
                if(!node || node.length<=0)return;
                node.removeClass(getConfig('expandedCls')).addClass(getConfig('collapsedCls'));
                node.next("ul").slideUp();
            },
            sels:[],
            paths:[],
            text:[],
            onFirstLoad: $.Callbacks(),
            onAfterLoad: $.Callbacks(),
            onBeforeLoad: $.Callbacks(),
            extraParams:getConfig('extraParams'),
            refreshNode:function(n,data){
                n.data(data);
                n.text(data[getConfig('textProperty')]);
            },
            filter:getConfig('filter'),
            loadChild:function(pid,node,cb){

                if(!node.is("."+getConfig('expandableCls')) && node.is("."+getConfig('loadedCls')))
                {
                    return;
                }
                if(node.is(ts) && me.find("."+getConfig('itemCls')).length>0)
                {
                    return;
                    //console.log("ssss");
                    //me.empty();
                }
                obj.onBeforeLoad.fire(obj);
                var params={};
                params[getConfig('pidProperty')]=pid;
                var subParams= $.extend({},params,getExtraParams());
                /*if(!node.is(ts))
                 {
                 node.addClass(getConfig('loadingCls'));
                 }*/

                if(getConfig('localData') !== false)
                {
                    var renderData = getConfig('localData');
                    obj.filter(renderData);
                    render(renderData,node,cb);
                    obj.onAfterLoad.fire(renderData,node,obj);
                    if(obj.isFirstLoad)
                    {
                        obj.onFirstLoad.fire(renderData,obj);
                    }
                    obj.isFirstLoad=false;
                }
                else
                {
                    /*if(node.childrenItems)
                     {
                     obj.stopAjaxProcess();
                     }*/
                    node.addClass(getConfig('loadingCls'));
                    //防止重复请求
                    //obj.stopAjaxProcess();
                    obj.onAjaxProcess = $.ajax({
                        type: getConfig('getType'),
                        url: getConfig('url'),
                        data: subParams,
                        dataType: getConfig('dataType'),
                        success: function(data){
                            /*if(!node.is(ts))
                             {
                             node.removeClass(getConfig('loadingCls'));
                             //node.addClass(getConfig('expandedCls'))
                             }*/
                            node.removeClass(getConfig('loadingCls'));
                            if(data && !data.ret)
                            {
                                var renderData;
                                if($.isFunction(getConfig('parseData')))
                                {
                                    renderData=getConfig('parseData')(data);
                                }
                                else
                                {
                                    renderData=getConfig('dataRoot').length>0?data[getConfig('dataRoot')]:data;
                                }

                                obj.filter(renderData);
                                if(!renderData){
                                    //没有数据则标记该节点为叶节点
                                    node.removeClass(getConfig('expandableCls'));
                                    //return false;
                                }
                                render(renderData,node,cb);
                                //obj.onAfterLoad.fire(renderData,node,obj);
                            }
                            else if(!data)
                            {
                                node.removeClass(getConfig('expandableCls'));
                            }
                            else if(data && data.ret !=0)
                            {
                                $.bf.parseError(data);
                            }
                            obj.onAfterLoad.fire(renderData,node,obj,data);
                            if(obj.isFirstLoad)
                            {
                                if(obj.onceLoadAll)
                                {
                                    obj.allData = $.extend(true,{},renderData);
                                }
                                if(renderData && renderData[0])
                                {
                                    obj.firstNodeData = $.extend(true,{},renderData[0]);
                                }
                                obj.onFirstLoad.fire(renderData,obj,data);
                            }
                            obj.isFirstLoad=false;
                        },
                        error:function(xhr,status,e)
                        {
                            if(!node.is(ts))
                            {
                                node.addClass(getConfig('expandedCls'))
                            }
                            node.removeClass(getConfig('loadingCls'));
                            node.removeClass(getConfig('expandableCls'));
                            $.bf.ajaxSetup.error(xhr,status,e);
                        }
                    });
                    $.bf.ajaxList.push(obj.onAjaxProcess);
                }
            },
            stopAjaxProcess:function(){
                if(obj.onAjaxProcess)
                {
                    obj.onAjaxProcess.abort();
                }
            },
            onAjaxProcess:null,
            afterNodeRender:getConfig('afterNodeRender'),
            filterRowData:getConfig('filterRowData'),
            onceLoadAll:getConfig('onceLoadAll'),
            expandModel:function(n){
                if(!n || n.length<=0)return;
            },
            shiftKeyDeselectProduct:function(n,e){
                if(e && e.shiftKey)
                {

                    var parentLi = n.parents("li");
                    //console.log(parentLi.nextAll());
                    /* var nextSelect = parentLi.nextAll(":not(."+getConfig('selectedCls')+"):last");
                     nextSelect.prevUntil(parentLi,"."+getConfig('selectedCls')).each(function(){
                     n =  n.add($(this).children("a"));
                     }); */
                    parentLi.nextAll("."+getConfig('selectedCls')).each(function(){
                        n =  n.add($(this).children("a"));
                    });
                    /* if(nextSelect.length>0)
                     {
                     nextSelect.prevUntil(parentLi,"."+getConfig('selectedCls')).each(function(){
                     n =  n.add($(this).children("a"));
                     });
                     }
                     else
                     {
                     var prevSelect = parentLi.prevAll(":not(."+getConfig('selectedCls')+"):last");
                     if(prevSelect.length>0)
                     {
                     prevSelect.nextUntil(parentLi,"."+getConfig('selectedCls')).each(function(){
                     n =  n.add($(this).children("a"));
                     });
                     }
                     } */
                }
                return n;
            },
            shiftKeySelectProduce:function(n,e){
                if(e && e.shiftKey)
                {
                    //console.log(n.prev());
                    var parentLi = n.parents("li");
                    var prevSelect = parentLi.prevAll("."+getConfig('selectedCls')+":last");
                    if(prevSelect.length>0)
                    {
                        prevSelect.nextUntil(parentLi,":not(."+getConfig('selectedCls')+")").each(function(){
                            n =  n.add($(this).children("a"));
                        });
                    }
                    else
                    {
                        var nextSelect = parentLi.nextAll("."+getConfig('selectedCls')+":last");
                        if(nextSelect.length>0)
                        {
                            nextSelect.prevUntil(parentLi,":not(."+getConfig('selectedCls')+")").each(function(){
                                n =  n.add($(this).children("a"));
                            });
                        }
                    }
                }
                return n;
            },
            onBeforeSelect: function(){return true;},
            select:function(n,isFire,selectChildrenMode){
                selectChildrenMode = selectChildrenMode == undefined ? obj.selectChildrenMode:selectChildrenMode;
                if(!n || n.length<=0){
                    return false;
                }
                //console.log(isFire);
                var id,node;
                $.each(n,function(){
                    node=$(this);
                    if(node.isDisabled(getConfig('disabledCls')))
                    {
                        return true;
                    }
                    id=""+node.data(getConfig('idProperty'));
                    var path=obj.getPath(node);
                    //console.log(path);
                    /*obj.sels.splice($.inArray(id,obj.sels),1);
                     obj.paths.splice($.inArray(path,obj.paths),1);*/

                    if($.inArray(id,obj.sels)<=0)
                    {
                        obj.sels.push(id);
                    }
                    if($.inArray(path,obj.paths)<=0)
                    {
                        obj.paths.push(path);
                    }
                    $.unique(obj.sels);
                    $.unique(obj.paths);
                    /*$.unique(obj.sels);
                     obj.paths.push(path);
                     $.unique(obj.paths);*/
                    if(getConfig('selMark'))
                    {
                        $.bf.setHashValue(getConfig('selMark'),obj.sels.join(","));
                        $.bf.setHashValue(getConfig('pathMark'),obj.paths.join(","));
                    }
                    node.addClass(getConfig('selectedCls')).parent("li").addClass(getConfig('selectedCls'));
                    node.find("."+getConfig('checkboxCls')).attr("checked",true);
                    if(selectChildrenMode===true)
                    {
                        if(!node.is("."+getConfig('loadedCls')))
                        {
                            //console.log(node.data());
                            obj.loadChild(node.data(getConfig('idProperty')),node,function(nd){
                                //console.log(nd[0].childrenItems);
                                obj.select(nd[0].childrenItems,false,selectChildrenMode);
                            });
                        }
                        else
                        {
                            obj.select(node[0].childrenItems,false,selectChildrenMode);
                        }
                        if(node[0].parentItem && node[0].parentItem.data(getConfig('childCountProperty')))
                        {
                            var a1 = node[0].parentItem.data(getConfig('childCountProperty'));
                            var a3 = node[0].parentItem[0].childrenItems.filter("a."+getConfig('selectedCls')).length;
                            if(a1 >0 && a3 >0 && a1 == a3)
                            {
                                obj.select(node[0].parentItem,false,1);
                            }
                        }
                    }
                    else if(selectChildrenMode == 1)
                    {
                        if(node[0].parentItem && node[0].parentItem.data(getConfig('childCountProperty')))
                        {
                            var a1 = node[0].parentItem.data(getConfig('childCountProperty'));
                            var a3 = node[0].parentItem[0].childrenItems.filter("a."+getConfig('selectedCls')).length;
                            if(a1 >0 && a3 >0 && a1 == a3)
                            {
                                obj.select(node[0].parentItem,false,1);
                            }
                        }
                    }
                });
                isFire=isFire===undefined?true:isFire;
                if(isFire && node)
                {
                    //console.log(node);
                    obj.onSelect.fire(id,node,obj);
                    obj.onSelectChange.fire(id,node,obj);
                    me.trigger("onSelect",[id,node,obj]);
                    me.trigger("onSelectChange",[id,node,obj]);
                }
                return true;
            },
            selectAll:function(){

            },
            deselect:function(n,isFire,selectChildrenMode){
                selectChildrenMode = selectChildrenMode == undefined ? obj.selectChildrenMode:selectChildrenMode;
                if(!n || n.length<=0)return;
                var id,node;
                $.each(n,function(){
                    node=$(this);
                    if(selectChildrenMode)
                    {
                        var selector = false;
                        var pr = obj.getParentNodes(node);
                        if(pr)
                        {
                            pr = pr.filter("a."+getConfig('selectedCls'));
                        }
                        obj.deselect(pr,false,false);
                        var ch = node[0].childrenItems;
                        obj.deselect(ch,false,selectChildrenMode);
                        //console.log(ch);
                        /*if(ch)
                         {
                         ch = ch.filter("."+getConfig('selectedCls'));
                         if(selector)
                         {
                         selector = selector.add(ch);
                         }
                         else
                         {
                         selector = ch;
                         }
                         }*/

                    }
                    id=""+node.data(getConfig('idProperty'));
                    var path=obj.getPath(node);
                    obj.sels.splice($.inArray(id,obj.sels),1);
                    obj.paths.splice($.inArray(path,obj.paths),1);
                    if(getConfig('selMark'))
                    {
                        $.bf.setHashValue(getConfig('selMark'),obj.sels.join(","));
                        $.bf.setHashValue(getConfig('pathMark'),obj.paths.join(","));
                    }
                    node.removeClass(getConfig('selectedCls')).parent("li").removeClass(getConfig('selectedCls'));
                    node.find("."+getConfig('checkboxCls')).attr("checked",false);
                });
                isFire=isFire===undefined?true:isFire;
                if(isFire)
                {
                    obj.onDeselect.fire(id,node,obj);
                    obj.onSelectChange.fire(id,node,obj);
                    me.trigger("onDeselect",[id,node,obj]);
                    me.trigger("onSelectChange",[id,node,obj]);
                }
                return true;
            },
            deselectAll:function(isFire){
                var n=obj.getSelectNodes();
                //console.log(n);
                obj.deselect(n,isFire);
            },
            onSelect: $.Callbacks(),
            onDeselect: $.Callbacks(),
            onSelectChange: $.Callbacks(),
            getSelectNodes:function(){
                return me.find("a."+getConfig('selectedCls'));
            },
            resetSelect:function(ids,isFire)
            {
                /*if(ids[0] == "8f1bffbb-67a1-4642-8b59-9def76940303")
                 console.log(ids);*/
                if(isFire===undefined)
                {
                    isFire = true;
                }
                //return true;
                if($.isArray(ids))
                {
                    //console.log(33333);
                    /*var oldNode = obj.getSelectNodes();
                     var oldId = obj.getSelectNodes();*/
                    obj.deselectAll(false);
                    if(ids.length>0)
                    {
                        var selector = false;
                        var item = me.find("."+getConfig('itemCls'));
                        var id;
                        item.each(function(){
                            var ds=$(this);
                            id=ds.data(getConfig('idProperty'));
                            /*var text = ds.data(getConfig('textProperty'));
                             if(!text){
                             return true;
                             }*/
                            if($.inArray(""+id,ids)>=0)
                            {
                                if(selector)
                                {
                                    selector = selector.add(ds);
                                }
                                else
                                {
                                    selector = ds;
                                }
                            }
                        });

                        obj.select(selector,isFire);
                        if(selector===false && isFire)
                        {
                            obj.onSelectChange.fire(ids[0],null,obj);
                        }
                    }
                    else if(isFire)
                    {
                        obj.onSelectChange.fire(null,null,obj);
                    }
                    obj.sels=ids;
                }
            },
            getNodeById:function(id){
                var n=false;
                var selCls = getConfig('itemCls').split(" ")[0];
                me.find("."+selCls).each(function(){
                    if($(this).data(getConfig('idProperty'))==id)
                    {
                        n = $(this);
                        return false;
                    }
                });
                return n;
            },
            getNodeByIds:function(ids)
            {
                if(!$.isArray(ids))
                {
                    ids=!isNaN(ids)?[ids]:String(ids)?ids.split(","):[];
                }
                var selector = false;
                me.find("."+getConfig('itemCls')).each(function(){
                    var ds=$(this);
                    var id=ds.data(getConfig('idProperty'));
                    if($.inArray(id,ids)>=0)
                    {
                        if(selector !== false)
                        {
                            selector = selector.add(ds);
                        }
                        else
                        {
                            selector=ds;
                        }
                    }
                });
                return selector;
            },
            getNodeId:function(node)
            {
                return node.data(getConfig("idProperty"));
            },
            getTextByIds:function(ids)
            {
                if(!$.isArray(ids))
                {
                    ids=ids.split(",");
                }
                var text=[];
                me.find("."+getConfig('itemCls')).each(function(){
                    var ds=$(this);
                    var id=ds.data(getConfig('idProperty'));
                    if($.inArray(""+id,ids)>=0)
                    {
                        text.push(ds.data(getConfig('textProperty')));
                    }
                });
                return text;
            },
            getSelectIds:function(){
                return $.extend(true,[],obj.sels);
            },
            getSelectId:function(){
                var ids = obj.getSelectIds();
                return ids?ids[0]:"";
            },
            hasSelect:function(){
                return obj.sels.length>0;
            },
            isSelectOne:function(){
                return obj.sels.length==1;
            },
            getPath:function(node){
                return node.data(getConfig('pathProperty'));
                /*var path=[];
                 var id=node.data(getConfig('idProperty'));
                 path.push(id);
                 var parents=obj.getParentNodes(node);
                 if(parents)
                 {
                 $.each(parents,function(){
                 var pid=$(this).data(getConfig('idProperty'));
                 path.unshift(pid);
                 });
                 }
                 return path.join(getConfig('pathSeparator'));*/
            },
            getParentNodes:function(node){
                var selector = false;
                while(node)
                {
                    var parent = node[0].parentItem;
                    if(parent)
                    {
                        if(selector)
                        {
                            selector = selector.add(parent);
                        }
                        else
                        {
                            selector = parent;
                        }
                    }
                    node = parent;
                }
                return selector;
            },
            getParentNode:function(node){
                return node.parents("ul").prev("."+getConfig("itemCls")+":first");
            },
            getNextNode:function(node){
                return node.parent("li").next("li").children("."+getConfig("itemCls")+":first");
            },
            getPrevNode:function(node){
                return node.parent("li").prev("li").children("."+getConfig("itemCls")+":first");
            },
            getChildrenNode:function(node){
                return node.next("ul").find("."+getConfig("itemCls")+":first");
            }
        };
        if(getConfig('autoLoad'))
        {
            obj.load(true);
        }
        init();
        me[0].tree = obj;
        return obj;
    };
})(jQuery);

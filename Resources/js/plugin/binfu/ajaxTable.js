/**
 * Created by Hongbinfu.
 */
/**
 * table控件
 * 非公用版
 * 依赖frame.js
 */
(function($){
    $.fn.ajaxTableDefaults={
        selHashMark:'currentRows',
        loadedCls:$.bf.config.loadedCls,
        expandableCls:'z-expandable',
        expandedCls:'z-expanded',
        collapsedCls:'z-collapsed',
        selectedCls: $.bf.config.selectedCls,
        url:'',
        columns:[],
        getType:$.bf.ajaxSetup.type,
        dataType: $.bf.ajaxSetup.dataType,
        params:{},
        idProperty:'id',
        pidProperty:'pid',
        totalProperty:'total',
        autoLoad:true,
        iconPath:'./images/icon/',
        autoExpandLevel:2,
        onSelect:$.emptyFn,
        baseCls:'u-ajax-table',
        skinCls:'s-ajax-table',
        rows:15,
        autoFixRows:false,
        pageToolbar:{},
        startMark:'start',
        limitMark:'limit',
        totalMark:'total',
        pageMark:'page',
        rowsMark:'row',
        conditionMark:'condition',
        orderMark:'order',
        sortMark:'sort',
        selMark:'',
        hashEnable:false,
        checkboxCls:'u-ajax-table-row-checkbox',
        loadRemark:true,
        pageProperty:'page',
        rowsProperty:'rows',
        orderProperty:'order',
        sortProperty:'sort',
        orderEnable:true,
        orderCls:'u-ajax-table-header-order',
        orderDescCls:'z-order-desc',
        orderAscCls:'z-order-asc',
        orderIconCls:'u-order-icon',
        orderMode:'single',
        orderEvent:'click',
        dataRoot:'rows',
        parseData:'',
        extraParams:{},
        parseTotal:'',
        totalRoot:'total',
        filterRowData:'',
        trCls:'u-ajax-table-tr',
        thTrCls:'',
        tdCls:'u-ajax-table-td',
        thCls:'u-ajax-table-th',
        tdConCls:'u-ajax-table-td-content',
        thConCls:'u-ajax-table-th-content',
        itemCls:'u-ajax-table-item',
        conCls:'u-ajax-table-content',
        thContainerCls:'u-ajax-table-thead',
        tbContainerCls:'u-ajax-table-tbody',
        checkboxWidth:50,
        colWidth:100,
        rowHeight:38,
        checkboxColName:'checkboxCol',
        selectStartLocked:false,
        colIndexDomProperty:'col-index',
        rowIndexDomProperty:'row-index',
        dataIndexDomProperty:'data-index',
        xtypeDomProperty:'data-xtype',
        columnTdCls:{},
        columnAlign:'left',
        columnCss:{paddingLeft:20,paddingRight:20},
        columnTdCss:{},
        columnThCss:{textAlign:'left',paddingLeft:21},
        emptyCls:'z-emptied',
        //加载下一页时取消当前选择
        loadNextPageDeselect:true,
        hoverCls:'z-hover',
        //是否绑定数据到节点上
        bindDataToNode:true,
        dateFormat:'yyyy-MM-dd hh:mm:ss',
        selMode:"multiple"
    };
    $.fn.ajaxTable=function(options)
    {
        if($(this).length<=0)return false;
        var opts= $.extend({},$.fn.ajaxTableDefaults,options);
        var me=$(this);
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
        function getConfig(key){
            return key?(opts[key]===undefined?"":opts[key]):opts;
        }
        function init(){
            if(renderThead())
            {
                if(obj.selMark)
                {
                    var hSels=$.hash(obj.selMark);
                    obj.sels= hSels?hSels.split(","):[];
                }
                if(getConfig('hashEnable'))
                {
                    obj.page=Number($.hash(obj.pageMark))||1;
                    obj.rows=Number($.hash(obj.rowsMark))||obj.rows;
                    obj.order=$.hash(obj.orderMark)||obj.order;
                    obj.sort=$.hash(obj.sortMark)||obj.sort;
                }
                //obj.autoFixRows
                if(getConfig('autoFixRows'))
                {
                    autoSetRows(getConfig('loadRemark'),false);
                    var timer=false;
                    $(window).wresize(function(){
                        if(!getConfig('autoFixRows'))return;
                        //console.log("sssssssss");
                        if(timer !== false)
                        {
                            clearTimeout(timer);
                            timer = false;
                        }
                        timer = setTimeout(autoSetRows,500);
                    });
                }

                $(window).wresize(resetColWidth);
                //选择列效果
                me.delegate("th."+getConfig('thCls')+"[data-index]",{
                    mouseover:function(){
                        //console.log(getConfig('hoverCls'));
                        obj.tbContainer.find("td[data-index="+$(this).attr(getConfig('dataIndexDomProperty'))+"]").addClass(getConfig('hoverCls'));
                    },
                    mouseout:function(){
                        obj.tbContainer.find("td[data-index="+$(this).attr(getConfig('dataIndexDomProperty'))+"]").removeClass(getConfig('hoverCls'));
                    }
                });
            }
        }
        function render(data)
        {
            me.find("th["+getConfig('xtypeDomProperty')+"=checkbox] ."+getConfig('checkboxCls')).attr("checked",false);
            obj.tbContainer.empty();
            var table=document.createElement("table");
            $(table).addClass(getConfig('baseCls')+" "+getConfig('skinCls'));
            var tBody=document.createElement("tbody");
            obj.tbContainer.append(table);
            $.each(getConfig('columns'),function(c,d){
                if(d.hide)
                {
                    return true;
                }
                var col=document.createElement("col");
                $(table).append(col);
                var colWidth = d.width || getConfig('colWidth');
                $(col).attr("width", colWidth+"px");
            });
            $(table).append(tBody);
            //console.log(data);
            if(!data || (data&&data.length<=0)){
                obj.tbContainer.addClass(getConfig('emptyCls'));
                return true;
            }
            else
            {
                obj.tbContainer.removeClass(getConfig('emptyCls'));
            }
            $.each(data,function(k,e){
                var v;
                if($.isFunction(getConfig('filterRowData')))
                {
                    v = getConfig('filterRowData')(e);
                }
                else
                {
                    v = e;
                }
                if(!v || v.length<=0){
                    return true;
                }
                var tr=document.createElement("tr");
                $(tBody).append(tr);
                var id=String(v[getConfig('idProperty')]);
                //console.log(id);
                var jTr = $(tr);
                jTr.addClass(getConfig('itemCls')+" "+getConfig('trCls')).data(getConfig('idProperty'),id).bind({click:itemClick,dblclick:itemDblClick})
                    .attr(getConfig('rowIndexDomProperty'),k);
                if(getConfig('bindDataToNode'))
                {
                    jTr.data(v);
                }
                //console.log(jTr.data());
                if(getConfig('selectStartLocked'))
                {
                    jTr.bind("selectstart",function(){
                        return false;
                    }).css({"-moz-user-select":"none","cursor":"default"});
                }
                var isSel=$.inArray(""+id,obj.sels);
                $.each(getConfig('columns'),function(a,b){
                    if(b.hide)
                    {
                        return true;
                    }
                    var td=document.createElement("td");
                    jTr.append(td);
                    var content=document.createElement("span");
                    $(td).append(content);
                    var tdAlign = b.align || getConfig('columnAlign');
                    var css = b.css? $.extend({},getConfig('columnCss'), b.css) : getConfig('columnCss');
                    var tdCss = b.tdCss? $.extend({},getConfig('columnTdCss'), b.tdCss) : getConfig('columnTdCss');
                    var extendCls = b.cls || "";
                    $(td).addClass(extendCls+" "+getConfig('tdCls')).css({textAlign: tdAlign}).attr(getConfig('dataIndexDomProperty'), b.dataIndex)
                        .attr(getConfig('colIndexDomProperty'),a).css(css).css(tdCss);
                    var rd,txt="",contentWidth;
                    if(b.xtype=="checkbox"){
                        var input=document.createElement("input");
                        $(input).attr("type","checkbox").addClass(getConfig('checkboxCls'));
                        rd=input;
                        $(td).attr(getConfig('xtypeDomProperty'), b.xtype).css({textAlign:"center",textIndent:0,padding:0});
                    }
                    else if(b.xtype=="date")
                    {
                        b.format = b.format? b.format:getConfig('dateFormat');
                        rd=v[b.dataIndex]?$.bf.date(b.format,new Date(parseInt(v[b.dataIndex]) * 1000)):"";
                        txt=rd;
                    }
                    else if(typeof(b.renderer)=="function")
                    {
                        rd=b.renderer(v[b.dataIndex],v,data,k,a,$(td),jTr,obj);
                        txt=$(rd).length>0?$(rd).text():rd;
                    }else if(b.defaultValue!=undefined&&(v[b.dataIndex]==""||v[b.dataIndex]==null||v[b.dataIndex]==undefined))
                    {
                        rd=b.defaultValue;
                        txt=b.defaultValue;
                    }
                    else
                    {
                        rd=v[b.dataIndex];
                        txt=rd;
                    }
                    var colWidth = b.width || getConfig('colWidth');
                    $(td)
                        .addClass(getConfig('conCls')+" "+getConfig('tdConCls'))
                        .append(rd)
                        .attr("title",txt).css({width:colWidth});
                });
                if(isSel>=0)
                {
                    select(jTr,false);
                }


                if(me.find("tbody tr."+getConfig('selectedCls')).size() == me.find("tbody tr").size())
                {
                    me.find("th["+getConfig('xtypeDomProperty')+"=checkbox] ."+getConfig('checkboxCls')).attr("checked",true);
                }
            });
            // console.log("耗时："+(new Date().getTime()-logTime));
            return true;
        }

        /**
         * 重新调整列宽，避免出现滚动条时错位
         */
        function resetColWidth(){
            if(obj.tbContainer[0].scrollHeight>obj.tbContainer.height())
            {
                var scrollbarWidth=obj.tbContainer[0].offsetWidth - obj.tbContainer[0].scrollWidth;
                obj.thContainer.css({paddingRight:scrollbarWidth});
            }
            else
            {
                obj.thContainer.css({paddingRight:0});
            }
        }

        /**
         * 渲染表头
         */
        function renderThead()
        {
            var thContainer=document.createElement("div");
            var tbContainer=document.createElement("div");
            obj.thContainer=$(thContainer);
            obj.tbContainer=$(tbContainer);
            obj.thContainer.addClass(getConfig('thContainerCls'));
            obj.tbContainer.addClass(getConfig('tbContainerCls'));
            var table=document.createElement("table");
            $(table).addClass(getConfig('baseCls')+" "+getConfig('skinCls'));
            var tHead=document.createElement("thead");
            var tr=document.createElement("tr");
            var jTr=$(tr);
            jTr.addClass(getConfig('trCls')+" "+getConfig('thTrCls'));
            //表头处理
            $.each(getConfig('columns'),function(k,v){
                if(v.hide)
                {
                    return true;
                }
                var col=document.createElement("col");
                /*if(k != getConfig('columns').length-1)
                 {
                 var colWidth = v.width || getConfig('colWidth');
                 $(col).attr("width", colWidth+"px");
                 }*/
                var colWidth = v.width || getConfig('colWidth');
                $(col).attr("width", colWidth+"px");
                $(table).append(col);
                var thDom=document.createElement("th");
                var th=$(thDom);
                //if()
                var sort = v.sort || "";
                var orderCls ="";
                var order = "";
                if(obj.sort && obj.order)
                {
                    $.each(obj.orderConverge,function(k,v){
                        if(v[0] == sort)
                        {
                            order = v[1];
                            orderCls = order=="asc"?getConfig('orderAscCls'):getConfig('orderDescCls');
                        }
                    });
                }

                //var orderCls=getConfig('order')=="desc"?" "+getConfig('orderDescCls'):getConfig('order')=="asc"?" "+getConfig('orderAscCls'):"";
                var css = v.css ? $.extend({},getConfig('columnCss'), v.css): getConfig('columnCss');
                var thCss = v.thCss ? $.extend({},getConfig('columnThCss'), v.thCss): getConfig('columnThCss');
                var thAlign = v.align || getConfig('columnAlign');
                css = $.extend({},css,thCss);
                var extendCls = v.cls || "";
                th.addClass(extendCls+" "+getConfig('thCls')+" "+orderCls).css({'textAlign':thAlign}).css(css).data({
                    sort:sort,
                    order:order
                });
                //排序
                function orderHandler()
                {
                    if(!getConfig('orderEnable'))
                    {
                        return;
                    }
                    var ths = $(this);
                    var data = ths.data();
                    if(!data.sort)
                    {
                        return;
                    }
                    if(getConfig('orderMode')=="single")
                    {
                        obj.removeCurrentOrderCls();
                    }
                    obj.sort=data.sort;
                    if(data.order=="asc" || data.order=="")
                    {
                        data.order = "desc";
                        ths.removeClass(getConfig('orderAscCls')).addClass(getConfig('orderDescCls'));
                    }
                    else
                    {
                        data.order = "asc";
                        ths.removeClass(getConfig('orderDescCls')).addClass(getConfig('orderAscCls'));
                    }
                    obj.order = data.order;
                    obj.reload();
                }
                $(th).bind(getConfig('orderEvent'),orderHandler);
                //防止双击选中
                $(th).bind("selectstart",function(){
                    return false;
                }).css({"-moz-user-select":"none","cursor":"default"});

                if(v.xtype=="checkbox")
                {
                    var input=document.createElement("input");
                    $(input).attr("type","checkbox").addClass(getConfig('checkboxCls')).bind({
                        click:thCheckBoxClick
                    });
                    var content=document.createElement("span");
                    $(content).addClass(getConfig('conCls')+" "+getConfig('thConCls')).append(input)/*.css({width: v.width})*/;
                    var chkW = v.width || getConfig('checkboxWidth');
                    th.append(content).css({width:colWidth,textAlign:'center',textIndent:0,padding:0}).attr(getConfig('xtypeDomProperty'), v.xtype);
                }

                else
                {
                    var content=document.createElement("span");
                    $(content).addClass(getConfig('conCls')+" "+getConfig('thConCls')).text(v.text)/*.css({width: v.width})*/;
                    th.append(content);
                    var orderDom=document.createElement("i");
                    $(orderDom).addClass(getConfig('orderIconCls'));
                    th.append(orderDom).css({width:colWidth});
                    /*if(getConfig('orderEnable'))
                     {

                     }*/
                }

                th.attr({"data-Index": v.dataIndex});
                jTr.append(thDom);
            });
            $(tHead).append(tr);
            $(table).append(tHead);
            $(table).append("<tbody></tbody>");
            $(thContainer).append(table);
            me.empty().append(thContainer,tbContainer);
            //me.append(tbContainer);
            return true;
        }

        function doLoad(params,cb){
            if(!obj.onBeforeLoad.fire(obj))
            {
                return;
            }
            //debugger;
            var submitParams=obj.getParams();
            submitParams= $.extend({},submitParams,params);
            //防止重复请求
            //obj.stopAjaxProcess();
            if(getConfig('loadRemark'))
            {
                $.bf.loadDataWaiting();
            }
            //obj.tbContainer.empty();
            obj.onAjaxProcess = $.ajax({
                url:getConfig('url'),
                type:getConfig('getType'),
                data:submitParams,
                dataType:getConfig('dataType'),
                success:function(data){
                    if(getConfig('loadRemark'))
                    {
                        $.bf.hideLoadRemark();
                    }
                    if(data && !data.ret)
                    {
                        var renderData;
                        if($.isFunction(getConfig('parseData')))
                        {
                            renderData=getConfig('parseData')(data);
                        }
                        else
                        {
                            renderData=getConfig('dataRoot')?data[getConfig('dataRoot')]:data;
                        }
                        //if(!renderData)return false;
                        if(obj.firstLoad)
                        {
                            obj.onFirstLoad.fire(renderData,obj);
                        }
                        obj.firstLoad=false;
                        //==========total==================
                        var total=0;
                        if($.isFunction(getConfig('parseTotal')))
                        {
                            total=getConfig('parseTotal')(data);
                        }
                        else if(getConfig('totalRoot'))
                        {
                            total=data[getConfig('totalRoot')];
                        }
                        obj.total=Number(total)||0;
                        obj.totalPage = Math.ceil(obj.total/obj.rows);
                        if(obj.page<=0){
                            obj.page = 1;
                            obj.start = 0;
                        }
                        else
                        {
                            obj.start=(obj.page-1)*obj.rows;
                        }

                        if(obj.start<0)
                        {
                            obj.start = 0;
                        }
                        var rdLen = renderData?renderData.length:0;
                        obj.end=obj.start+rdLen-1;
                        if(obj.end<0)
                        {
                            obj.end = 0;
                        }
                        if(getConfig('hashEnable'))
                        {
                            $.bf.hash(getConfig('totalMark'),obj.total);
                        }
                        if(render(renderData)){
                            //重置表头宽度
                            resetColWidth();
                            obj.onAfterLoad.fire(renderData,obj);
                            if(typeof(cb)=="function")
                            {
                                cb();
                            }
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

        function autoSetRows(showLoadRemark,isLoad){
            if(!getConfig('autoFixRows'))return;
            if(obj.me.is(":hidden"))
            {
                return;
            }
            var oldRows = obj.rows;
            obj.rows = autoCountRow();
            var oldShowRemark = getConfig('loadRemark');
            showLoadRemark = showLoadRemark || false;
            obj.setConfig("loadRemark",showLoadRemark);
            obj.totalPage = Math.ceil(obj.total/obj.rows);
            var page = obj.page;
            if(obj.page>obj.totalPage)
            {
                page = obj.totalPage;
            }
            if(obj.page<1)
            {
                page = 1;
            }
            isLoad = isLoad===undefined?true:isLoad;
            if(isLoad)
            {
                obj.loadPage(page);
            }
            obj.setConfig("loadRemark",oldShowRemark);
        }

        function autoCountRow(){
            var ctH = obj.tbContainer.height();
            //console.log($(".g-mn").height());
            var rows =  Math.floor(ctH/getConfig('rowHeight'));
            //console.log(rows);
            if(!rows)
            {
                rows = getConfig('rows');
            }
            return rows;
        }
        function setColumn(dataIndex,key,value,isFire){
            if(typeof(dataIndex)=="object")
            {
                opts.columns = $.extend({},getConfig('columns'),dataIndex);
            }
            else
            {
                var colIndex = -1;
                $.each(getConfig('columns'),function(k,v){
                    if(v.dataIndex == dataIndex)
                    {
                        colIndex = k;
                        return false;
                    }
                });
                if(colIndex>=0)
                {
                    if(value==undefined)
                    {
                        opts.columns[colIndex] = $.extend({},getConfig('columns')[colIndex],key);
                    }
                    else
                    {
                        opts.columns[colIndex][key] =  value;
                    }
                }
            }
            if(isFire)
            {
                renderThead();
            }
        }
        function hideColumn(cols){
            if(!$.isArray(cols))
            {
                cols = [cols];
            }
            $.each(cols,function(k,v){
                setColumn(v,'hide',true);
            });
            renderThead();
        }
        function showColumn(cols){
            if(!$.isArray(cols))
            {
                cols = [cols];
            }
            $.each(cols,function(k,v){
                setColumn(v,'hide',false);
            });
            renderThead();
        }

        function itemDblClick(e){
            clearTimeout(obj.clickProcess);
            var node=$(this);
            if(!node.isSelected(getConfig('selectedCls')))
            {
                select(node);
            }
            obj.onItemDblClick.fire(node,obj);
            me.trigger('onItemDblClick',[obj.getRowId(node),node,obj]);
        }
        function itemClick(e)
        {
            clearTimeout(obj.clickProcess);
            var node=$(this);
            obj.clickProcess = setTimeout(function(){
                if(node.isSelected(getConfig('selectedCls')))
                {
                    if(e.shiftKey)
                    {
                        node = node.add(node.nextAll());
                    }
                    //obj.select(node);
                    obj.deselect(node);
                }
                else
                {
                    if(e.shiftKey)
                    {
                        var prevCount = node.prevAll("." + getConfig('selectedCls')).size();
                        var nextCount = node.nextAll("." + getConfig('selectedCls')).size();
                        var d = 0;
                        //向下连选
                        if(prevCount>0)
                        {
                            node.prevAll().each(function () {
                                if (d == prevCount) {
                                    return false;
                                }
                                node = node.add($(this));
                                if ($(this).isSelected(getConfig('selectedCls'))) {
                                    d++;
                                }
                            });
                        }
                        else if(nextCount>0)
                        {
                            node.nextAll().each(function () {
                                if (d == nextCount) {
                                    return false;
                                }
                                node = node.add($(this));
                                if ($(this).isSelected(getConfig('selectedCls'))) {
                                    d++;
                                }
                            });
                        }
                    }
                    select(node);
                }
                obj.onItemClick.fire(node,obj);
                me.trigger('onItemClick',[node,obj]);
            },1);
        }
        function select(n,isFire){
            if(getConfig("selMode")=="single"){
                var cur = obj.getSelectNodes();
                deselect(cur);
            }
            isFire=isFire===undefined?true:isFire;
            if(!n || n.length<=0)return;
            var node,id;
            n.each(function(){
                node=$(this);
                id= node.data(getConfig('idProperty'));
                obj.sels.push(id);
                $.unique(obj.sels);
                if(getConfig('selMark'))
                {
                    $.bf.setHashValue(getConfig('selMark'),obj.sels.join(","));
                }
                node.addClass(getConfig('selectedCls')).find("."+getConfig('checkboxCls')).attr("checked",true);
            });
            //console.log(node.data());
            if(isFire)
            {
                obj.onSelect.fire(id,node,obj);
                obj.onSelectChange.fire(id,node,obj);
                me.trigger("onSelect",[id,node,obj]);
                me.trigger("onSelectChange",[id,node,obj]);
            }
        }
        function deselect(n,isFire){
            isFire=isFire===undefined?true:isFire;
            if(!n || n.length<=0)return;
            var node,id;
            n.each(function(){
                node=$(this);
                id= node.data(getConfig('idProperty'));
                obj.sels.splice($.inArray(id,obj.sels),1);
                //console.log(obj.sels);
                if(getConfig('selMark'))
                {
                    $.bf.setHashValue(getConfig('selMark'),obj.sels.join(","));
                }
                node.removeClass(getConfig('selectedCls')).find("."+getConfig('checkboxCls')).attr("checked",false);
            });
            if(isFire)
            {
                obj.onDeselect.fire(id,node,obj);
                obj.onSelectChange.fire(id,node,obj);
                me.trigger("onDeselect",[id,node,obj]);
                me.trigger("onSelectChange",[id,node,obj]);
            }
        }
        function thCheckBoxClick(){
            if($(this).attr("checked"))
            {
                obj.selectAll();
            }
            else
            {
                obj.deselectAll();
            }
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
        function setExtraParams(key,value)
        {

            if(value)
            {
                var tmp={};
                tmp[key]=value;
                obj.extraParams = $.extend({},getExtraParams(),tmp);
            }
            else if(key)
            {
                obj.extraParams = $.extend({},getExtraParams(),key);
            }

        }
        var obj={
            me:me,
            opts:opts,
            firstLoad:false,
            sels:[],
            selMark:getConfig('selMark'),
            totalPage:1,
            start:0,
            end:0,
            total:0,
            setConfig:function(key,value){
                return setConfig(key,value);
            },
            getConfig:function(key){
                return getConfig(key);
            },
            removeCurrentOrderCls:function(clearOrder){
                obj.thContainer.find("."+getConfig('orderAscCls')).add("."+getConfig('orderDescCls')).each(function(){
                    $(this).removeClass(getConfig('orderAscCls')).removeClass(getConfig('orderDescCls'));
                    if(clearOrder)
                    {
                        $(this).data("order","");
                    }
                });
            },
            condition:"",
            extraParams:getConfig('extraParams'),
            page:1,
            rows:getConfig('rows'),
            sort:'',
            order:'',
            orderConverge:[],
            getParams:function(){
                var params={};
                params[getConfig('pageProperty')]=obj.page || 1;
                params[getConfig('rowsProperty')]=obj.rows || getConfig('rows');
                params[getConfig('orderProperty')]=obj.order;
                params[getConfig('sortProperty')]=obj.sort;
                if(obj.order && obj.sort)
                {
                    obj.orderConverge.unshift([obj.sort,obj.order]);
                }
                $.unique(obj.orderConverge);
                params= $.extend({},params,getExtraParams());
                return params;
            },
            getExtraParams:function(key){
                return getExtraParams(key);
            },
            setExtraParams:function(key,value){
                setExtraParams(key,value);
            },
            setCondition:function(params){
                $.bf.stopProcess();
                if(getConfig('hashEnable'))
                {
                    $.hash(getConfig('pageMark'),1);
                    $.hash(getConfig('rowsMark'),getConfig('rows'));
                }

                if(params)
                {
                    obj.condition=$.toJSON(params);
                }
                $.bf.restartProcess();
            },
            addCondition:function(con){
                var condition= $.evalJSON(obj.condition);
                condition=condition||[];
                condition.push(con);
                condition= $.toJSON(condition);
                obj.condition=condition;
            },
            addEqCondition:function(name,value){
                var con=obj.getEqCondition(name,value);
                obj.addCondition(con);
            },
            getEqCondition:function(name,value){
                return {
                    field:name,
                    filter:[{
                        compare:"=",
                        value:value
                    }]
                };
            },
            clearParams:function(){
                obj.extraParams = {};
                /*$.bf.stopProcess();
                 $.hash(getConfig('pageMark'),null);
                 $.hash(getConfig('rowsMark'),null);
                 $.hash(getConfig('orderMark'),null);
                 $.hash(getConfig('sortMark'),null);
                 $.bf.restartProcess();*/
            },

            load:function(params,cb){
                obj.clearParams();
                doLoad(params,cb);
            },
            reload:function(params,cb,isDeselectCurrentPage)
            {
                isDeselectCurrentPage = isDeselectCurrentPage===undefined?true:isDeselectCurrentPage;
                if(isDeselectCurrentPage)
                {
                    obj.deselectAll();
                }
                doLoad(params,cb);
            },
            onBeforeLoad: $.Callbacks(),
            onAfterLoad: $.Callbacks(),
            onFirstLoad: $.Callbacks(),
            onAjaxProcess:null,
            stopAjaxProcess:function(){
                if(obj.onAjaxProcess)
                {
                    obj.onAjaxProcess.abort();
                    obj.onAjaxProcess=null;
                }
            },
            //加载某一页
            loadPage:function(p){
                if(p<=0)p=1;
                if(p>obj.totalPage)p=obj.totalPage;
                obj.page=p;
                if(getConfig('hashEnable'))
                {
                    $.bf.hash(getConfig('pageMark'),p);
                }
                obj.reload('','',getConfig('loadNextPageDeselect'));
            },
            loadPrev:function(){
                obj.loadPage(obj.page-1);
            },
            loadNext:function(){
                obj.loadPage(obj.page+1);
            },
            loadLast:function(){
                obj.loadPage(obj.totalPage);
            },
            setColumn:function(dataIndex,key,value,isFire){
                return setColumn(dataIndex,key,value,isFire);
            },
            hideColumn:function(cols){
                hideColumn(cols);
            },
            showColumn:function(cols){
                showColumn(cols);
            },
            getSelection:function(){
                var ids=[];
                var rows=[];
                me.find("tbody tr."+getConfig('selectedCls')).each(function(){
                    var r=$(this);
                    var id= r.data(getConfig('idProperty'));
                    var rows={
                        id:id,
                        r:r
                    };
                    ids.push(id);
                    rows.push(rows);
                });
                return {
                    ids:ids,
                    rows:rows
                };
            },
            onItemClick: $.Callbacks(),
            onItemDblClick: $.Callbacks(),
            clickProcess:null,
            selectStartLocked:getConfig('selectStartLocked'),
            select:function(n,isFire){
                return select(n,isFire);
            },
            onSelect: $.Callbacks(),
            onDeselect: $.Callbacks(),
            onSelectChange: $.Callbacks(),
            deselect:function(n,isFire){
                return deselect(n,isFire);
            },
            selectAll:function(){
                select(me.find("tbody tr"));
            },
            deselectAll:function(){
                obj.sels=[];
                obj.deselect(me.find("tbody tr"));
            },
            inverseSelect:function(){
                var nsel=me.find("tbody tr").not("."+getConfig('selectedCls'));
                var sel=me.find("tbody tr."+getConfig('selectedCls'));
                select(nsel);
                obj.deselect(sel)
            },
            getAllRowsIds:function()
            {
                var ids=[];
                me.find("tbody tr").each(function(){
                    var id= $(this).data(getConfig('idProperty'));
                    ids.push(id);
                });
                return ids;
            },
            getSelectId:function(){
                return obj.sels[0];
            },
            getSelectIds:function(){
                return $.extend(true,[],obj.sels);
            },
            hasSelect:function(){
                return obj.sels.length>0;
            },
            isSelectOne:function(){
                return obj.sels.length==1;
            },
            getSelectNode:function(){
                /*me.find("."+getConfig('trCls')+"."+getConfig('selectedCls')).each(function(){
                 console.log($(this).data());
                 })*/
                return me.find("."+getConfig('trCls')+"."+getConfig('selectedCls')+":first");
            },
            getSelectNodes:function(){
                /*me.find("."+getConfig('trCls')+"."+getConfig('selectedCls')).each(function(){
                    console.log($(this).data());
                })*/
                return me.find("."+getConfig('trCls')+"."+getConfig('selectedCls'));
            },
            getRowId:function(node){
                return node.data(getConfig('idProperty'));
            }
        };
        me.bind("onSelectChange",function(){
            var thCheckBox=me.find("th["+getConfig('xtypeDomProperty')+"=checkbox] ."+getConfig('checkboxCls'));
            if(me.find("tbody tr."+getConfig('selectedCls')).size() == me.find("tbody tr").size())
            {
                thCheckBox.attr("checked",true);
            }
            else
            {
                thCheckBox.attr("checked",false);
            }
        });
        init();
        if(getConfig('autoLoad'))
        {
            if(getConfig('autoFixRows'))
            {
                autoSetRows();
            }
            else
            {
                obj.reload();
            }
        }
        return obj;
    };
    /**
     *   分页工具栏
     * */
    $.pageToolbarDefaults={
        table:{},
        baseCls:'u-page-toolbar',
        skinCls:'s-page-toolbar',
        numPCrtCls:'u-page-toolbar-num-p-current',
        numPTotalCls:'u-page-toolbar-num-p-total',
        numStartCls:'u-page-toolbar-num-start',
        numEndCls:'u-page-toolbar-num-end',
        numTotalCls:'u-page-toolbar-num-total',
        btnFirstCls:'u-page-toolbar-btn-first',
        btnEndCls:'u-page-toolbar-btn-end',
        btnPrevCls:'u-page-toolbar-btn-prev',
        btnNextCls:'u-page-toolbar-btn-next',
        btnReloadCls:'u-page-toolbar-btn-reload',
        btnInverseSelectCls:'u-page-toolbar-btn-inverse-select',
        rowSelectCls:'u-page-toolbar-rows-select'
    };
    //分页工具条
    $.fn.pageToolbar=function(options){
        var opts= $.extend({}, $.pageToolbarDefaults,options);
        var me=$(this);
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
        function getConfig(key){
            return key?opts[key]:opts;
        }
        if(me.isGenerated(getConfig('generatedCls')))
        {
            return;
        }
        me.addClass(getConfig('baseCls')+" "+getConfig('skinCls'));
        var numPCrt=me.find("."+getConfig('numPCrtCls')),
            numPTotal=me.find("."+getConfig('numPTotalCls')),
            numStart=me.find("."+getConfig('numStartCls')),
            numEnd=me.find("."+getConfig('numEndCls')),
            numTotal=me.find("."+getConfig('numTotalCls'));
        function isFormCp(j){
            return j.is("input") || j.is("textarea")|| j.is("select");
        }
        me.find("."+getConfig('numCrtCls')+",."+getConfig('numStartCls')+",."+getConfig('numEndCls')+",."+getConfig('numTotalCls')).each(function(){
            $(this).bind({
                emptyVal:function(){
                    if(isFormCp($(this)))
                    {
                        $(this).attr("value",null);
                    }
                    else
                    {
                        $(this).empty();
                    }
                },
                setVal:function(me,value){
                    if(isFormCp($(this)))
                    {
                        $(this).attr("value",value);
                    }
                    else
                    {
                        $(this).text(value);
                    }
                }
            });
        });
        function init()
        {
            me.find("."+getConfig('numPCrtCls')+",."+getConfig('numPTotalCls')+",."+getConfig('numStartCls')+",."+getConfig('numEndCls')+",."+getConfig('numTotalCls')).trigger("emptyVal");
            me.find("."+getConfig('rowSelectCls')).unbind("change").bind({
                change:function(){
                    //console.log($(this).val());
                    var val = $(this).val();
                    if(val)
                    {
                        getConfig('table').setConfig("autoFixRows",false);
                        getConfig('table').rows = val;
                        getConfig('table').loadPage(1);
                    }
                    else
                    {
                        getConfig('table').setConfig("autoFixRows",true);
                        getConfig('table').autoSetRows();
                    }
                    //console.log(getConfig('table').getConfig("autoFixRows"));
                }
            });
        }
        var obj={
            me:me
        };
        //初始化
        init();

        if(getConfig('table').me instanceof jQuery)
        {
            var table=getConfig('table');
            /*table.page=Number(table.page);
             table.rows=Number(table.rows);
             table.total=Number(table.total);
             table.totalPage=Number(table.totalPage);*/

            function autoSetVal(){
                var start = table.total<=0?0:(table.start+1);
                numStart.trigger("setVal",[start]);
                var end = table.total<=0?0:(table.end+1);
                numEnd.trigger("setVal",[end]);
                var totalPage = table.total<=0?0:table.totalPage;
                numPTotal.text(totalPage);
                var page = table.total<=0?0:table.page;
                numPCrt.attr("value",page);
                numTotal.trigger("setVal",[table.total]);
                var checkboxCls = table.getConfig("checkboxCls");
                var thCheckbox = table.me.find("th ."+checkboxCls);
                if(thCheckbox.length>0){
                    var thCheckboxPos = thCheckbox.position();
                    //console.log(thCheckbox.position());
                    var inverseBtn = me.find("."+getConfig('btnInverseSelectCls'));
                    var left = thCheckboxPos.left || "";
                    inverseBtn.parent().css({left:left});
                }

            }
            autoSetVal();
            numPCrt.bind({
                keypress:function(e)
                {
                    var enterPage=parseInt(numPCrt.val());
                    if(e.keyCode == "13")
                    {
                        table.loadPage(enterPage);
                    }
                }
            });
            me.find("."+getConfig('btnInverseSelectCls')).bind({click:function(){
                table.inverseSelect();
            }});
            me.find("."+getConfig('btnFirstCls')).bind({click:function(){
                if(table.page<=1)
                {
                    return;
                }
                table.loadPage(1);
            }});
            me.find("."+getConfig('btnEndCls')).bind({click:function(){
                if(table.page>=table.totalPage)
                {
                    return;
                }
                table.loadLast();
            }});
            me.find("."+getConfig('btnPrevCls')).bind({click:function(){
                if(table.page<=1)
                {
                    return;
                }
                table.loadPrev();
            }});
            me.find("."+getConfig('btnNextCls')).bind({click:function(){
                //console.log(table.totalPage);
                if(table.page>=table.totalPage)
                {
                    return;
                }
                table.loadNext();
            }});
            me.find("."+getConfig('btnReloadCls')).bind({click:function(){
                table.reload();
            }});
            table.onAfterLoad.add(autoSetVal);
        }
        return obj;
    };
})(jQuery);
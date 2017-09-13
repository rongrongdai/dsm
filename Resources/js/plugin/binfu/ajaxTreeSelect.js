/**
 * Created by HongBinfu
 */

$.ajaxTreeSelectDefaults={
    selectIconCls:'icon-select',
    expandedCls: $.bf.config.expandedCls,
    collapsedCls: $.bf.config.collapsedCls,
    treeConfig:{},
    url:'',
    containerCls:'u-ajax-tree-select-container',
    inputCls:'u-ajax-tree-select-input',
    showCheckbox:false,
    selMode:'simple',
    icon:[],
    treeBaseCls:'u-ajax-tree-select',
    treeSkinCls:'s-ajax-tree-select',
    treeItemCls:'u-ajax-tree-select-item',
    selMark:'',
    generatedCls: $.bf.config.generatedCls,
    height:200,
    levelWidth:15,
    expandIconCls:'icon-expand-12',
    expandIconPos:'left',
    idProperty:'id',
    pidProperty:"id",
    textProperty:'name',
    showIcon:false,
    showExpand:true,
    rootLocked:false,
    onBeforeSelect:function(){return true;},
    filter:$.emptyFn,
    parseData:'',
    parseChildrenData:'',
    dataRoot:'',
    rootId:'',
    extraParams:{},
    addEmpty:'',
    onSelectChange:'',
    uniPrefix:'',
    autoExpandLevel:1,
    autoLoadLevel:1,
    lastChildLevel:0,
    filterRowData:'',
    itemClickExpand:true,
    itemClickSelect:true,
    itemWidth:170,
    emptyNode:{text:'无归属',value:'',displayText:''},
    showEmptyNode:true,
    autoLoad:false,
    localData:false,
    offsetX:0,
    offsetY:0,
    maxHeight:200,
    width:0,
    containerCss:{},
    textAttrProperty:'ajaxTreeText',
    valueAttrProperty:'ajaxTreeValue',
    selectChildrenMode:false,
    childrenProperty:'children',
    onceLoadAll:false,
    newNameSuffix:'_view',
    emptyNodeCls:'u-empty-node',
    disableLevel:0,
    selectLockLevel:0,
    selectLockedCls:'z-select-locked',
    selectLockedProperty:'selectLocked',
    autoSelectFire:false,
    treeContainerCss:{}
};
$.fn.ajaxTreeSelect=function(options)
{
    var opts= $.extend({}, $.ajaxTreeSelectDefaults,options);
    $(this).each(function(){

        var me=$(this);
        var name=me.attr("name") || new Date().getTime();
        var textAttr = {
            "name":name+opts.newNameSuffix
        };
        textAttr[opts.textAttrProperty] = true;
        me.attr(textAttr);
        var inputDom=document.createElement("input");
        var input=$(inputDom);
        var valueAttr = {
            name:name,type:"hidden"
        };
        valueAttr[opts.valueAttrProperty] = true;
        input.attr(valueAttr);
        if(me.isGenerated(opts.generatedCls))
        {
            return;
        }
        me.attr("readonly",true).addClass(opts.inputCls+" "+opts.generatedCls);
        var div=document.createElement("div");
        var treeContainer=$(div);
        treeContainer.hide();
        treeContainer.addClass(opts.containerCls).css(opts.treeContainerCss);
        var tree=$(div).ajaxTree({
            url:opts.url,
            showCheckbox:opts.showCheckbox,
            selMode:opts.selMode,
            icon:opts.icon,
            baseCls:opts.treeBaseCls,
            skinCls:opts.treeSkinCls,
            itemCls:opts.treeItemCls,
            levelWidth:opts.levelWidth,
            expandIconCls:opts.expandIconCls,
            expandIconPos:opts.expandIconPos,
            pidProperty:opts.pidProperty,
            textProperty:opts.textProperty,
            idProperty:opts.idProperty,
            showIcon:opts.showIcon,
            rootLocked:opts.rootLocked,
            filter:opts.filter,
            parseData:opts.parseData,
            rootId:opts.rootId,
            selMark:opts.selMark,
            extraParams:opts.extraParams,
            dataRoot:opts.dataRoot,
            autoExpandLevel:opts.autoExpandLevel,
            autoLoadLevel:opts.autoLoadLevel,
            lastChildLevel:opts.lastChildLevel,
            filterRowData:opts.filterRowData,
            itemClickSelect:opts.itemClickSelect,
            itemClickExpand:opts.itemClickExpand,
            itemWidth:opts.itemWidth,
            itemTextAlign:opts.itemTextAlign,
            autoLoad:opts.autoLoad,
            localData:opts.localData,
            selectChildrenMode:opts.selectChildrenMode,
            autoSelectFire:opts.autoSelectFire,
            childrenProperty:opts.childrenProperty,
            parseChildrenData:opts.parseChildrenData,
            onceLoadAll:opts.onceLoadAll,
            disableLevel:opts.disableLevel,
            showExpand:opts.showExpand,
            selectLockLevel:opts.selectLockLevel,
            selectLockedCls:opts.selectLockedCls,
            selectLockedProperty:opts.selectLockedProperty
        });

        function autoPrependEmptyNode()
        {
            if(opts.showEmptyNode && opts.emptyNode)
            {
                treeContainer.find("."+opts.emptyNodeCls).remove();
                var emptyNode=document.createElement("div");
                var text=opts.emptyNode.text || "";
                var value=opts.emptyNode.value || "";
                var displayText = opts.emptyNode.displayText||"";
                $(emptyNode).addClass(opts.treeItemCls+" "+opts.emptyNodeCls).css({paddingLeft:opts.levelWidth,cursor:"pointer"}).text(text).data({
                    text:text,
                    value:value,
                    displayText:displayText
                }).click(function(){
                    var text=$(this).data("displayText");
                    var value=$(this).data("value");
                    //console.log(value);
                    tree.deselectAll();
                    me.attr("value",text).trigger("change").blur();
                    input.attr("value",value).trigger("change").blur();
                    hideTree();
                    me.trigger("onTreeSelectChange",[input,$(emptyNode),tree]).trigger("change");
                    tree.onSelectChange.fire(value,$(emptyNode),tree);
                    return false;
                });
                $(div).prepend(emptyNode);
                /*tree.onFirstLoad.add(function(renderData){
                 if(renderData)
                 {
                 $(div).prepend(emptyNode);
                 }
                 });*/
                //tree.onFirstLoad.remove(autoPrependEmptyNode);
            }
        }
        tree.onFirstLoad.add(autoPrependEmptyNode);
        tree.onBeforeSelect=opts.onBeforeSelect;
        tree.sels=input.val()?input.val().split(","):[];
        me.after(inputDom);
        $("body").append(div);
        me[0].tree=tree;
        me[0].getTree = function(){
            return tree;
        };
        me[0].setConfig = function(key,val)
        {
            if(arguments.length>1)
            {
                var opt={};
                opt[key]=val;
            }
            else
            {
                opt=key;
            }
            opts = $.extend({},opts,opt);
            //console.log(opt);
        };
        me[0].setTreeConfig = function(key,val)
        {
            tree.setConfig(key,val);
        };
        function setDefaultValueHandler(data,isFire){
            /*if($.isArray(data))
             {
             data = {value:data};
             }*/
            //console.log(typeof(data));
            //console.log(data);
            if(data.value !==undefined && data.text!==undefined)
            {
                input.attr("value",data.value).trigger("change");
                me.attr("value",data.text).trigger("change");
            }
            //console.log(data);
            var v=[];
            var s = data.value;
            if(s || s == 0)
            {
                v= (s+"").split(",");
            }
            tree.resetSelect(v,isFire);
            //tree.sels = v;
            //console.log("sss");
            return false;
        }
        me[0].setDefaultValue=function(data,isFire)
        {
            /*if(tree.isFirstLoad)
             {
             function setDefault(dt){
             //console.log(dt);
             if(!dt)
             {
             me[0].setEmpty();
             }
             else
             {
             setDefaultValueHandler(data,isFire);
             }
             //防止重复执行
             tree.onFirstLoad.remove(setDefault);
             }
             //tree.onFirstLoad.disable();
             //tree.onFirstLoad.remove(setDefault);
             tree.onFirstLoad.add(setDefault);
             }
             else
             {
             setDefaultValueHandler(data);
             }*/
            setDefaultValueHandler(data,isFire);
        };
        me[0].getValue = function(decode)
        {
            decode = decode==undefined?true:decode;
            var text = me.val();
            var value = input.val();
            if(decode)
            {
                text = text.split(",");
                value = value.split(",");
            }
            return {text:text,value:value};
        };
        me[0].setValue = me[0].setDefaultValue;
        me[0].setEmpty=function(){
            me[0].setDefaultValue({text:null,value:null});
        };
        function doLoad(deselectAll){
            hideTree();
            if(deselectAll===undefined)
            {
                deselectAll = true;
            }
            //tree.onFirstLoad.remove(setDefault);
            tree.load(deselectAll);
            me[0].setEmpty();
            //autoPrependEmptyNode();
        }
        //刷新
        me[0].load = function(deselectAll)
        {
            doLoad(deselectAll);
        };
        me[0].opts = opts;
        //自动判断设置位置
        function showTree(){
            var cBLW = parseInt(treeContainer.css("border-left-width"));
            var cBRW = parseInt(treeContainer.css("border-right-width"));

            var cBTW = parseInt(treeContainer.css("border-top-width"));
            var cBBW = parseInt(treeContainer.css("border-bottom-width"));
            //input的宽度
            var w=opts.width || (me.outerWidth()-cBLW-cBRW);
            //input的高度
            var h=me.outerHeight()-cBTW;
            //input的位置
            var pos=me.offset();
            //input左间距
            var mL=parseInt(me.css("margin-left"));
            mL = mL <= 0 ? 0 :mL;
            var mT=parseInt(me.css("margin-top"));
            //input左边距
            var l=pos.left+mL+opts.offsetX;
            //input上边距
            var t=pos.top+h+mT+opts.offsetY;
            var checkTop = $(window).height()-t;
            //console.log($(window).height());
            if(checkTop<opts.height)
            {
                t = t - opts.height - h-cBTW;
            }
            //容器的高度
            var cH = opts.height;
            treeContainer.css({width:w,position:'absolute',left:l,height:opts.height,maxHeight:opts.maxHeight,overflow:"auto",top:t}).css(opts.containerCss);
            var sel = input.val();
            sel = sel?sel.split(","):[];
            me.removeClass(opts.collapsedCls).addClass(opts.expandedCls);
        }
        //隐藏树
        function hideTree(e)
        {
            //console.log(e);
            var container=treeContainer;
            container.fadeOut("fast");
            me.removeClass(opts.expandedCls).addClass(opts.collapsedCls);
            //$("body").unbind("click",hideTree);
        }
        function adjustShowTree()
        {

            if(treeContainer.is(":visible"))
            {
                showTree();
            }
            else
            {
                me.removeClass(opts.expandedCls).addClass(opts.collapsedCls);
            }
        }
        me.bind({
            click:function(e){
                if(treeContainer.is(":hidden"))
                {
                    $("."+opts.containerCls).hide();
                    showTree();
                    $(window).unbind("resize",adjustShowTree).bind("resize",adjustShowTree);
                    $("body").bind({
                        click:hideTree,
                        mousedown:hideTree,
                        mousewheel:adjustShowTree
                    });
                    treeContainer.show();
                }
                else
                {
                    hideTree();
                }
                e.stopPropagation();
                return false;
            }
        });
        treeContainer.bind({
            click:function(e){
                e.stopPropagation();
                e.preventDefault();
            },
            mousedown:function(e)
            {
                e.stopPropagation();
                e.preventDefault();
            }
        });
        //console.log(2222);
        tree.onSelectChange.add(function(id,n,obj){
            if(opts.emptyNode && opts.emptyNode.value==id)
            {
                return;
            }
            //console.log(n);
            //console.log(obj.ts);
            var ids=[],text=[];
            if(n && n.isSelected(tree.getConfig("selectedCls")) && (tree.getConfig('selMode') == "single" || tree.getConfig('selMode') == "simple"))
            {
                ids = [String(id)];
                text = [String(n.data(opts.textProperty))];
                //ids.push(id);
            }
            else
            {
                var inputVal = String(input.val());
                var meVal = String(me.val());
                //console.log(inputVal);

                ids = inputVal && inputVal.length>0?String(inputVal).split(","):[];
                text = meVal&&meVal.length>0?String(meVal).split(","):[];
                //console.log(text);
                //console.log(ids);
                //text = String(me.val()).split(",");
                var nTxt,nId;
                if(n && !n.isSelected(tree.getConfig("selectedCls")))
                {
                    nTxt = String(n.data(opts.textProperty));
                    nId = String(n.data(opts.idProperty));
                    //console.log(ids);
                    //console.log($.inArray(nId,ids));
                    ids.splice($.inArray(nId,ids),1);
                    text.splice($.inArray(nTxt,text),1);
                }
                else if(n && n.isSelected(tree.getConfig("selectedCls")))
                {

                    nId = String(n.data(opts.idProperty));
                    nTxt = String(n.data(opts.textProperty));
                    /*ids.push(nId);
                     text.push(nTxt);*/
                    if($.inArray(nId,ids) < 0)
                    {
                        ids.push(nId);
                        text.push(nTxt);
                    }
                    /*if($.inArray(nTxt,text) < 0)
                     {
                     text.push(nTxt);
                     }*/
                }
                var treeSels = tree.getSelectIds();
                if(treeSels)
                {
                    ids.concat(treeSels);
                }

                //console.log(text);
                //text.concat();
            }
            //console.log(text);
            var node=tree.getSelectNodes();
            /*if(node.length<=0 && n && n.length>0)
             {
             node = n;
             }*/
            //console.log(node);
            if(node && node.length>0)
            {
                $.each(node,function(){
                    var txt = $(this).data(opts.textProperty);
                    if($.inArray(txt,text) < 0)
                    {
                        text.push(txt);
                    }
                });
            }
            $.unique(ids);
            //$.unique(text);
            text = $.grep(text,function(v,k){
                return v && v.length>0;
            });
            //console.log(ids);
            //if(node.is())
            input.attr("value",ids.join(",")).trigger("change").blur();
            text = text.join(",");
            me.attr({"value":text,"title":text}).trigger("change").blur();
            me.trigger("onTreeSelectChange",[input,node,obj]);
        });
        tree.onAfterLoad.add(function(data,node,obj){
            me.trigger("onTreeAfterLoad",[input,data,node,obj]);
        });
        tree.onSelect.add(function(){
            var mode = tree.getConfig('selMode')!="multiple";
            //console.log(tree.getConfig("autoSelectFire"));
            if(mode)
            {
                hideTree();
            }
        });
    });
};
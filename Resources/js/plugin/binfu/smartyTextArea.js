/**
 * Created by HongBinfu
 *
 * @author:hongbinfu
 * @email:hongbinfu@163.com
 *
.u-smarty-textarea .item{
    border-bottom: 1px dotted #82b4f8;
    display: inline-block;
    vertical-align: top;
    cursor: default;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    padding-left: 5px;
    margin-left: 5px;
}
.u-smarty-textarea .item.import{
    background-color: #e3f6ff;
}
.u-smarty-textarea .item.z-active{
    background: #ededed;
    border-radius: 3px;
    border-bottom: none;
}

.u-smarty-textarea .close{
    padding:5px;
    font-size: 16px;
    color: #999;
}
.u-smarty-textarea .close:hover{
    color: #333333;
}
.u-smarty-textarea .add-input{
    background: none;
    border: 1px solid transparent;
    line-height: 24px;
    font-size: 13px;
    box-shadow: none;
    height: 24px;
    padding: 0;
    vertical-align: top;
}
.u-smarty-textarea .add-input.error,.u-smarty-textarea .add-input.z-error{
    background-color: #ffe6e5;
}
.u-smarty-textarea-msg{
    display: inline-block;
    vertical-align: bottom;
    color: #ff0000;
} 
 
 
 
 
 
 
 
 *///^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
///^(\w)+(\.\w)*@(\w)+(\.\w{2,3})*(\.[a-zA-Z])+
///^[a-zA-Z0-9_\.]{1,35}@[a-zA-Z0-9-]+\.[a-zA-Z]+$/
(function($){

    $.smartyTextAreaDefaults={
        inputMinWidth:220,
        placeholder:"请在这里输入内容,Tab键或回车切换",
        placeholderCls:"placeholder",
        activeCls:"z-active",
        itemCls:'item',
        itemLabelCls:'label',
        itemCloseCls:'close',
        addInputCls:'add-input',
        editInputCls:"edit-input",
        valueInput:"",
        name:"",
        split:",",
        errorCls:"z-error",
        validate:/^((\w)|([\u4e00-\u9fa5]))+(((\.)|(\-))((\w)|([\u4e00-\u9fa5]))+)*@(([\u4e00-\u9fa5])|(\w))+(((\.)|(\-))((\w)|([\u4e00-\u9fa5]))+)*((\.)(([a-zA-Z])|([\u4e00-\u9fa5]))+)+$/,
        inputPadding:"0 5px",
        unique:true,
        msg: {
            formatError: "你输入的格式不对",
            uniqueError:"你输入的内容已经存在"
        },
        msgBox:"",
        errorHandler:"",
        successHandler:"",
        //9:Tab键 13:回车 32:空格 188:逗号
        blurKeyCode:[9,13,32,188]
    };
    /**
     *
     * 获取光标位置
     * @returns {number}
     */
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    };
    $.fn.smartyTextArea=function(options)
    {
        var opts  = $.extend({},$.smartyTextAreaDefaults,options);
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
        var isPlaceholderSupport = ('placeholder' in document.createElement('input'));
        //isPlaceholderSupport = false;
        $(this).each(function(){
            var me=$(this);
            if(me.attr("data-init"))
            {
                return;
            }
            var input = document.createElement("input");
            var inputJq=$(input);
            var inputID = "smartytextarea_"+new Date().getTime();
            inputJq.attr({"novalidate":"novalidate","id":inputID});

            //隐藏的div用于计算input的文字是否溢出
            var hiddenDiv = document.createElement("div");
            var hiddenDivJq = $(hiddenDiv);
            hiddenDivJq.css({"visibility":"hidden","position":"absolute"});
            me.after(hiddenDivJq);
            if(!isPlaceholderSupport)
            {
                var placeHolderDiv = document.createElement("div");
                var placeHolderDivJq = $(placeHolderDiv);
                placeHolderDivJq.hide().text(getConfig("placeholder")).css({position:"absolute","overflow":"hidden"}).addClass(getConfig("placeholderCls"));
                placeHolderDivJq.bind({
                    click:function(){
                        inputJq.trigger("focus");
                    }
                });
                function autoSetPlaceholderPos(){
                    var pos = inputJq.position();
                    var w = inputJq.width();
                    var h = inputJq.height();
                    //console.log(pos);
                    placeHolderDivJq.css({
                        top:pos.top,
                        left:pos.left,
                        width:w,
                        height:h,
                        lineHeight:h+"px"
                    });
                }
                me.delegate("."+getConfig("addInputCls"),"inputPosChange",function(){
                    autoSetPlaceholderPos();
                });
                inputJq.after(placeHolderDiv);
            }


            var minWidth = getConfig("inputMinWidth");
            var containerWidth = me.width()-parseInt(me.css("paddingLeft"))-parseInt(me.css("paddingRight"));
            //console.log(parseInt(me.css("paddingLeft")));
            var valueInput,data=[],msgBox;
            //插件初始化
            function init()
            {
                inputJq.css({minWidth:minWidth,padding:getConfig("inputPadding")}).attr({placeholder:getConfig("placeholder")}).addClass(getConfig("addInputCls"));
                me.append(input);
                if(!isPlaceholderSupport)
                {
                    autoSetPlaceholderPos();
                    placeHolderDivJq.show();
                }
                var backCount= 0,leftCount=0;
                me.delegate("."+getConfig("addInputCls"),{
                    keydown:function(e)
                    {
                        //console.log(e.keyCode);
                        var val = $(this).val();
                        var keyCode = e.keyCode;
                        if(keyCode==8 && val.length<=1 && inputJq.prev().length>0 && inputJq.getCursorPosition()==0)
                        {
                            setActiveItem(inputJq.prev());
                            inputJq.trigger("blur");
                        }
                        if(keyCode==37 && inputJq.prev().length>0 && inputJq.getCursorPosition()<=0)
                        {
                            setActiveItem(inputJq.prev(),true);
                        }
                        var blurKeyCode = getConfig("blurKeyCode");
                        if($.inArray(keyCode,blurKeyCode)>=0)
                        {
                            //add($(this).val());
                            //$(this).trigger("blur");
                            //return false;
                            var activeCls = getConfig("activeCls");
                            getActiveItem().removeClass(activeCls);
                            //addFromInput();
                            inputJq.trigger("blur").trigger("focus");
                            return false;
                        }
                        e.stopPropagation();
                    },
                    blur:function(e,o){
                        //console.log(e);
                        addFromInput();
                        if(!isPlaceholderSupport && inputJq.val().length<=0)
                        {
                            placeHolderDivJq.show();
                        }
                        //inputJq.focus();
                    },
                    keyup:function(e){
                        //console.log(e.keyCode);
                        var keyCode = e.keyCode;
                        var val =$(this).val();
                        //替换空格
                        val = val.replace(/\s/g,"");
                        hiddenDivJq.text(val);
                        var blurKeyCode = getConfig("blurKeyCode");
                        if($.inArray(e.keyCode,blurKeyCode)<0&&check($(this).val()))
                        {
                            inputJq.removeClass(getConfig("errorCls"));
                            hideError();
                        }
                        var hiddenDivW = hiddenDivJq.width();
                        if(hiddenDivW>inputJq.width())
                        {
                            //containerWidth = me.width()-parseInt(me.css("paddingLeft"))-parseInt(me.css("paddingRight"));
                            var inputPL = parseInt(inputJq.css("paddingLeft")) || 0;
                            var inputPR = parseInt(inputJq.css("paddingRight")) || 0;
                            var maxW = containerWidth-inputPL-inputPR-3;
                            var curInputW = hiddenDivW>maxW?maxW:hiddenDivW;
                            inputJq.css("width",curInputW);
                            inputJq.trigger("inputPosChange");
                            //autoSetInputPos();
                        }/*
                        else
                        {
                            autoSetInputPos();
                        }*/


                    },change:function(){
                       /* var ds = $(this);
                        var val =ds.val();
                        val = val.replace(/\s/g,"");
                        $(this).val(val);
                        hiddenDivJq.text(val);*/
                    },
                    focus:function()
                    {
                        if(!isPlaceholderSupport)
                        {
                            placeHolderDivJq.hide();
                        }
                       /* var activeCls = getConfig("activeCls");
                        me.find("."+activeCls).removeClass(activeCls);*/
                    },
                    click:function(){
                        var activeCls = getConfig("activeCls");
                        me.find("."+activeCls).removeClass(activeCls);
                    }
                });
                bindInputPlaceHolder();
                function bodyClick(){
                    if(typeof(me)=="undefined" || me.length<=0)
                    {
                        $("body").unbind("click",bodyClick);
                    }
                    var activeCls = getConfig("activeCls");
                    me.find("."+activeCls).removeClass(activeCls);
                }
                function getMe(){
                    return me;
                }
                function getAddInput(){
                    return inputJq;
                }
                function bodyKeyDown(e){
                    if(typeof(me)=="undefined" || me.length<=0)
                    {
                        $("body").unbind("keydown",bodyKeyDown);
                    }
                    if(me.is(":visible"))
                    {
                        var keyCode = e.keyCode;
                       // console.log(keyCode);
                        //console.log(e);
                        switch (keyCode)
                        {
                            case 8:
                                var cur = getActiveItem();
                                remove(getActiveItem());
                                /*if(cur.length>0)
                                {
                                    var addinput = cur.nextAll("."+getConfig("addInputCls"));
                                    //console.log(addinput);
                                    //addinput.trigger("focus");
                                }*/

                                //console.log(inputID);
                                //me.find("."+getConfig("addInputCls")).focus();
                                e.stopPropagation();
                                break;
                            case 13:
                                var cur = getActiveItem();
                                if(cur.length>0)
                                {
                                    cur.last().trigger("dblclick");
                                }
                                break;
                            case 46:
                                var cur = getActiveItem();
                                remove(getActiveItem());
                                e.stopPropagation();
                                break;
                            case 37:
                                var cur = getActiveItem();
                                var inacitve = getInactiveItem();
                                var prev = cur.prev(":first");
                                if(cur.length>0 && prev.length>0)
                                {
                                    //console.log(cur[0]);
                                    if(!e.ctrlKey||inacitve.length<=0)
                                    {
                                        setInactiveItem(cur);
                                    }
                                    setActiveItem(prev);
                                }
                                //e.stopPropagation();
                                break;
                            case 39:
                                var cur = getActiveItem();
                                var inacitve = getInactiveItem();
                                var next = cur.next(":last");
                                if(next.length>0)
                                {
                                    var itemCls = getConfig("itemCls");
                                    //console.log(inacitve);
                                    if(!e.ctrlKey || inacitve.length<=0) {
                                        setInactiveItem(cur);
                                    }
                                    if(next.is("input"))
                                    {
                                        next.trigger("focus");
                                    }
                                    else{
                                        setActiveItem(next);
                                    }
                                }
                                //e.stopPropagation();
                                break;
                        }
                    }
                }
                $("body").bind({
                    //click:bodyClick
                    keydown:bodyKeyDown
                });
                resetInputPos();
                me.attr("data-init",true);
                valueInput = $(getConfig("valueInput"));
                if(valueInput.length<=0 && me.nextAll("[data-input]").length>0)
                {
                    valueInput = me.nextAll("[data-input]");
                    initValueInput();
                }
                else if(valueInput.length<=0)
                {
                    var valueInputDom = document.createElement("input");
                    valueInput = $(valueInputDom);
                    valueInput.attr({type:"hidden",name:getConfig("name")});
                    getAllItem().each(function(){
                        itemBindEvent($(this));
                    });
                    setValueInput();
                    me.after(valueInputDom);
                }
                else
                {
                    initValueInput();
                }


                if(getConfig("msgBox")=="")
                {
                    msgBox = me.nextAll("[data-msg]");
                }
                else
                {
                    msgBox = $(getConfig("msgBox"));
                }
            }
            function bindInputPlaceHolder(){

            }
            //获取当前选中的元素
            function getActiveItem(){
                return me.find("."+getConfig("activeCls"));
            }
            function getInactiveItem(){
                return me.find("."+getConfig("itemCls")).not("."+getConfig("activeCls"));
            }
            //显示错误信息
            function showError($type)
            {
                //console.log(msgBox);
                if(msgBox.length<=0)
                {
                    return false;
                }
                var msg = getConfig("msg");
                msgBox.text(msg[$type]).show();
                var errorHandler = getConfig("errorHandler");
                if($.isFunction(errorHandler))
                {
                    errorHandler(me);
                }
            }
            //隐藏错误信息
            function hideError()
            {
                msgBox.hide();
                var successHandler = getConfig("successHandler");
                if($.isFunction(successHandler))
                {
                    successHandler(me);
                }
            }
            //添加从input值中添加元素
            function addFromInput()
            {
                var val = inputJq.val();
                val = val.replace(/\s/g,"");

                //inputJq.val(val);
                var errorCls = getConfig("errorCls");
                var activeCls = getConfig("activeCls");

                var split = getConfig("split");
                var value;
                if(val.indexOf("×")>=0)
                {
                    value = val.substr(0,(val.length-1)).split("×");
                }
                else{
                    value = val.split(split);
                }
                var checked=true;
                if(val.length<=0)
                {
                    hideError();
                    inputJq.removeClass(errorCls);
                    return;
                }
                $.each(value,function(k,v){
                    if(v==""||v==undefined)
                    {
                        hideError();
                        inputJq.removeClass(errorCls);
                        checked=false;
                        return false;
                    }
                    var chk = check(v);
                    if(!chk)
                    {
                        inputJq.addClass(errorCls);
                        showError("formatError");
                        checked=false;
                        return false;
                    }
                    //console.log(data);
                    if($.inArray(v,data)>=0)
                    {
                        inputJq.addClass(errorCls);
                        showError("uniqueError");
                        me.find("[data-value='"+v+"']").addClass(activeCls);
                        checked=false;
                        return false;
                    }
                });

                if(!checked)
                {
                    return;
                }
                //inputJq.removeClass(errorCls);
               // hideError();
                //console.log(value);
                //console.log(checked);
                add(value);
                inputJq.focus();
            }
            function initValueInput(){
                var split = getConfig("split");
                var val = valueInput.val();
                //console.log(val);
                if(val!=""&&val!=undefined)
                {
                    val = val.split(split);
                    //console.log(val);
                    add(val);
                }
            }
            function getValue(item)
            {
                var text = item.text();
                return text.substr(0,(text.length-1));
            }
            //设置装值的隐藏input
            function setValueInput()
            {
                var split = getConfig("split");
                data = getAllItem().map(function () {
                    return getValue($(this));
                }).get();
                //console.log(getAllItem());
                valueInput.val(data.join(split));
            }

            //自动设置输入框的位置
            function autoSetInputPos(){
                inputJq.css({width:0});
                containerWidth = me.width()-parseInt(me.css("paddingLeft"))-parseInt(me.css("paddingRight"));
                var setWidth = containerWidth;
                var inputPos = inputJq.position();
                var tryWidth = containerWidth-inputPos.left;
                if(tryWidth>=minWidth)
                {
                    setWidth= tryWidth-parseInt(inputJq.css("paddingLeft"))-parseInt(inputJq.css("paddingRight"))-parseInt(inputJq.css("marginLeft"))-parseInt(inputJq.css("marginRight"))-3;
                }
                else{
                    setWidth = containerWidth;
                }
                inputJq.css({width:setWidth});
                inputJq.trigger("inputPosChange");
            }
            //重置输入框位置
            function resetInputPos(){
                me.append(inputJq);
                autoSetInputPos();
            }
            function getAllItem()
            {
                return me.find("."+getConfig("itemCls"));
            }
            //设置选中的元素
            function setActiveItem(item,blurInput,removeOther){
                var activeCls = getConfig("activeCls");
                removeOther = removeOther=="undefined"?true:removeOther;
                if(removeOther)
                {
                    getAllItem().removeClass(activeCls);
                }
                item.addClass(getConfig("activeCls"));
                $("body").one("click",function(){
                    setInactiveItem(item);
                });
                if(blurInput)
                {
                    inputJq.trigger("blur");
                }
            }
            //
            function setInactiveItem(item)
            {
                var activeCls = getConfig("activeCls");
                item.removeClass(activeCls);
            }
            function itemBindEvent(item){
                item.bind({
                    click:function(e){
                       // console.log(e);
                        setActiveItem(item,true,!e.ctrlKey);
                        return false;
                    },
                    dblclick:function(){
                        item.hide(function(){
                            var v = getValue(item);
                            inputJq.val(v);
                            hiddenDivJq.text(v);
                            var index = $.inArray(v,data);
                            data.splice(index, v.length);
                            item.after(inputJq).remove();
                            //inputJq.css({width:0});
                            //autoSetInputPos();
                            //inputJq.trigger("focus");
                            inputJq.css("width",hiddenDivJq.width());
                            inputJq.focus();
                            //setTimeout(function () { inputJq.focus(); }, 1000);
                        });
                    }
                });
                item.find("."+getConfig("itemCloseCls")).click(function(){
                    $(this).parents("."+getConfig("itemCls")+":first").hide(function(){
                        remove($(this));
                    });
                });
            }
            function remove(node){
                if(node.length>0)
                {
                    node.remove();
                    setValueInput();
                    resetInputPos();
                    inputJq.trigger("focus");
                }
            }
            function check(name)
            {
                var validate = new RegExp(getConfig("validate"));
                //console.log(validate);
                var chk = false;
                if($.isFunction(validate))
                {
                    chk = validate(name);
                }
                else if(typeof(validate)=="object" && $.isFunction(validate.test))
                {
                    chk = validate.test(name);
                }
                else if(typeof(validate)=="string")
                {
                    chk = name==validate;
                }
                return chk;
            }
            function add(name,cls)
            {
                var value = [];
                var split = getConfig("split");
                var errorCls = getConfig("errorCls");
                if(name==""||name==undefined)
                {
                    return;
                }
                //console.log(name);
                if(!$.isArray(name))
                {
                    //console.log(name.indexOf("×"));
                    if(name.indexOf(split)>=0)
                    {
                        value = name.split(split);
                    }
                    else if(name.indexOf("×")>=0)
                    {
                        value  = name.split("×");
                    }
                }
                else{
                    value = name;
                }
                //console.log(value);
                $.unique(value);
                //console.log(name);
                value = $.grep(value,function(v){
                    return v!="" && check(v) && $.inArray(v,data)<0;
                });
                //value = data.concat(value);

                /*if(getConfig("unique") && me.find("[data-value='"+name+"']").length>0)
                {
                    me.find("[data-value='"+name+"']").addClass(getConfig("activeCls"));
                    return false;
                }*/
                //console.log(value);
                $.each(value,function(k,v){
                    //console.log(v);
                    appendItem(v,cls);
                });
                resetInputPos();
                setValueInput();
                //inputJq.trigger("focus");
                //inputJq[0].focus();
            }
            function appendItem(name,cls)
            {
                //console.log(name);
                cls = cls ||"";
                var div = document.createElement("div");
                var label = document.createElement("label");
                label.className=getConfig("itemLabelCls");
                var close = document.createElement("a");
                $(close).attr("class",getConfig("itemCloseCls")).text("×");
                $(label).text(name).append(close);
                var item = $(div);
                item.attr("data-value",name).append(label).addClass(getConfig("itemCls")+" "+cls);
                itemBindEvent(item);
                inputJq.val("");
                inputJq.first().before(item);
                me.append(inputJq);
                //item.after(input);
                //item.fadeIn();

            }
            function clear()
            {
                getAllItem().each(function(){
                    $(this).remove();
                });
                setValueInput();
            }
            init();
            var obj={
                bf:{
                    clear:clear,
                    check:check,
                    add:add,
                    getAllItem:getAllItem,
                    getConfig:getConfig,
                    setConfig:setConfig,
                    resetInputPos:resetInputPos,
                    autoSetInputPos:autoSetInputPos
                }
            };
            me[0] = $.extend(me[0],obj);
        });
    }
})(jQuery);

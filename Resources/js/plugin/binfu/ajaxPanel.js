/**
 * Created by HongBinfu
 */
/**
 * 标准jquery插件
 * @依赖 jquery
 */
(function($){
    $.ajaxPanelDefaults={
        url:"",
        params:{},//url附带参数
        loadingCls:"z-loading",
        hidePanel:"",//需要隐藏的panel对象
        success:function(){},
        error:function(){},
        errorInfoProperty:'error_info',
        ajaxPanelVar:{isAjaxPanel:true}//标记是ajaxPanel
    };
    $.fn.ajaxPanel=function(options){
        var opts  = $.extend({},$.ajaxPanelDefaults,options);
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
        $(this).each(function(){
            var me = $(this);
            var hidePanel = $(getConfig('hidePanel'));
            var loadingCls = getConfig("loadingCls");
            var url = getConfig("url");
            var params = $.extend({},getConfig("ajaxPanelVar"),getConfig("params"));
            if(params)
            {
                url+=("&"+ $.param(params));
            }
            //初始化
            function init(){
                hidePanel.hide();
            }
            //加载动作
            function load(){
                me.empty().addClass(loadingCls).show().load(url,function(data){
                    me.removeClass(loadingCls);
                    //判断返回值不是 json 格式
                    if (/^\{(.+:.+,*){1,}\}$/.test(data))
                    {
                        close();
                        var errorFunc = getConfig("error");
                        if($.isFunction(errorFunc))
                        {
                            var error = jQuery.parseJSON(data);
                            errorFunc(error);
                        }
                    }
                    else
                    {
                        var successFunc = getConfig("success");
                        if($.isFunction(successFunc))
                        {
                            successFunc(me,hidePanel);
                        }
                    }
                });
            }
            //恢复之前的状态
            function close()
            {
                hidePanel.show();
                me.hide().empty();
            }
            init();
            load();
            var obj={
                bf:{
                    getConfig:getConfig,
                    setConfig:setConfig,
                    close:close,
                    reload:function(){
                        load();
                    }
                }
            };
            me[0] = $.extend(me[0],obj);
        });
        return $(this);
    }
})(jQuery);


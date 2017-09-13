/**
 * Created by Administrator on 2014/12/30.
 */
(function($){
    $.collapsePanelDeafults={
        expandedCls:"z-expanded"
    };
    $.fn.collapsePanel = function(options)
    {
        var opts  = $.extend({},$.collapsePanelDeafults,options);
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
            function init()
            {
                var expandedCls = getConfig("expandedCls");
                me.addClass(expandedCls);
                var body = me.next();
                body.show();
                me.click(function(){
                    if(body.is(":hidden"))
                    {
                        me.addClass(expandedCls);
                        body.slideDown();
                    }
                    else{
                        me.removeClass(expandedCls);
                        body.slideUp();
                    }
                });
            }
            init();
        });
    }
})(jQuery);

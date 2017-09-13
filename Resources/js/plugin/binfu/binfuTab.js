/**
 * Created by Administrator on 2014/12/29.
 */
(function($){
    $.binfuTabDefaults = {
        mode:"dom",
        switchEvent:"click",
        activeCls:"z-active"
    };
    $.fn.binfuTab = function(options)
    {
        var opts= $.extend({}, $.binfuTabDefaults,options);

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
        $(this).each(function(){
            var me=$(this);
            if(me.attr("data-init"))
            {
                return;
            }
            //初始化
            function init()
            {
                switch(getConfig("mode"))
                {
                    case "dom":
                        domMode();
                        break;
                }
                me.attr("data-init",true);
            }
            function getTarget(id)
            {
                return $("#"+id);
            }
            //dom标记模式
            function domMode()
            {
                var menuList = me.find("ul li[data-target]");

                var switchEvent = getConfig("switchEvent");
                menuList.each(function(){
                    var li = $(this);
                    var target = li.attr("data-target");
                    var activeCls = getConfig("activeCls");

                    li.bind(switchEvent,function(e){

                        var cur = menuList.filter("."+activeCls);
                        var curTarget = cur.attr("data-target");
                        cur.removeClass(activeCls);
                        getTarget(curTarget).hide();
                        li.addClass(activeCls);
                        getTarget(target).show();
                    })
                });
            }
            init();
            return me;
        });
        return $(this);
    }
})(jQuery);
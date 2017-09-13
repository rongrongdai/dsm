/**
 * Created by Administrator on 2014/12/29.
 */
(function($){
    $.collapseFloatPanelDefaults = {
        panelCls:"collapse-float-panel",
        switchBtnCls:"collapse-float-panel-switch-btn",
        expandedCls:"z-expanded",
        isLeft:false,
        enableSwitchBtn:true,
        blurHide:true
    };
    $.fn.collapseFloatPanel = function(options)
    {
        var opts= $.extend({}, $.collapseFloatPanelDefaults,options);

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
            var ts= this;
            var me=$(this);
            if(me.attr("data-init"))
            {
                return;
            }
            var switchBtn,panelWidth;
            var isLeft = getConfig("isLeft");
            var enableSwitchBtn = getConfig("enableSwitchBtn");
            //初始化
            function init()
            {
                //给panel加基础样式
                me.addClass(getConfig("panelCls"));

                panelWidth = me.width();

                var swtBtnDom = document.createElement("div");
                switchBtn = $(swtBtnDom);
                switchBtn.addClass(getConfig("switchBtnCls"));
                me.after(switchBtn);
                switchBtn.bind({
                    click: function () {
                        if(isExpanded())
                        {
                            collapse();
                        }
                        else
                        {
                            expand();
                        }
                        return false;
                    }
                });
                if(isLeft)
                {
                    me.css({left:-panelWidth});
                    switchBtn.css({left:0});
                }
                else{
                    me.css({right:-panelWidth});
                    switchBtn.css({right:0});
                }
                if(getConfig("blurHide"))
                {
                    $("body").one("mousedown",collapse);
                }
                if(!enableSwitchBtn)
                {
                    switchBtn.hide();
                }
                me.add(switchBtn).bind({
                    mousedown:function(){
                        return false;
                    }
                });
                me.attr("data-init",true);
            }
            function expand()
            {
                var switchBtnWidth = switchBtn.width();
                if(isLeft)
                {
                    me.animate({left:0});
                    switchBtn.animate({left:panelWidth-switchBtnWidth});
                }
                else
                {
                    me.animate({right:0});
                    switchBtn.animate({right:panelWidth-switchBtnWidth});
                }
                switchBtn.addClass(getConfig("expandedCls"));
                if(getConfig("blurHide"))
                {
                    $("body").one("mousedown",collapse);
                }
                me.trigger("expand",[me,switchBtn]);
            }
            function collapse(){
                var switchBtnWidth = switchBtn.width();
                if(isLeft)
                {
                    me.animate({left:-panelWidth-switchBtnWidth});
                    switchBtn.animate({left:0});
                }
                else{
                    me.animate({right:-panelWidth-switchBtnWidth});
                    switchBtn.animate({right:0});
                }
                switchBtn.removeClass(getConfig("expandedCls"));
                me.trigger("collapse",[me,switchBtn]);
            }
            function isExpanded(){
                var expandedCls = getConfig("expandedCls");
                return switchBtn.is("."+expandedCls);
            }
            function getTarget(id)
            {
                return $("#"+id);
            }
            init();
            var obj={
                bf:{
                    expand:expand,
                    collapse:collapse
                }
            };
            me[0] = $.extend(me[0],obj);
        });
        return $(this);
    }
})(jQuery);
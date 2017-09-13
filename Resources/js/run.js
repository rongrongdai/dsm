/**
 * Created by Hongbinfu
 */


/**
 * 框架运行入口
 */
//防止退格键导致浏览器上一步操作
$(document).bind({
    keydown:function (e) {
        var doPrevent;
        if (e.keyCode == 8) {
            var d = e.srcElement || e.target;
            if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA')
            {
                doPrevent = d.readOnly || d.disabled;
            }
            else
            {
                doPrevent = true;
            }
        }
        else
        {
            doPrevent = false;
        }
        if (doPrevent){
            e.preventDefault();
        }
    },
    contextmenu:function(e){
        //e.preventDefault();
    }

});
$(function(){
    if( $.browser.msie && parseInt($.browser.version)<=7)
    {
        window.location.href =API.system.canNotSupport;
        return;
    }
    var MAIN_PROCESS=null;

    $.ajaxSetup($.bf.ajaxSetup);

    $.validator.setDefaults({
        labelContainer:''/*,
        errorPlacement:function(error, element){
            layer.tips(error.text(),element,{
                guide:1
            });
        },*//*
        success:function(){
            layer.closeTips();
        }*/
    });
    //=========顶部消息=============

    $("#u-txt-login-time").text($.bf.date("yyyy年MM月dd日 hh时mm分ss秒"));
    setInterval(function(){
        $("#u-txt-crt-time").text($.bf.date("yyyy年MM月dd日 hh时mm分ss秒"));
    },1000);




    //========主页面===============
    /*var MAIN_BOX = $("#main-container").mainBox({
        navigation:navigation
    });*/
	//默认加载模块
	//var DEFAULT_MODULE = $.hash("action") || $(".u-nav-item:first:visible").attr("data-id");
	//MAIN_BOX.load(DEFAULT_MODULE);
    function keepAlive()
    {
        $.ajax(
            {
                cache:false,
                url : API.login.keepAlive,
                data : {},
                success : function(e) {
                    switch(e)
                    {
                        case -1:
                            window.location.href = "index.php"+location.hash;
                            break;
                    }
                }
            }
        );
    }
    setInterval(keepAlive, 1000 * 60);

    //数字input禁止输入其他字符

    $("body").delegate("[type=number]","keypress",function(e){
        return e.keyCode>=4 && e.keyCode<=57;
    });

    //注销登录操作
    $("#u-do-logout").click(function(){
        layer.confirm(L.logoutConfirm,function(){
            $.fastAction(API.login.doLogout,{},function(res){
                if(res)
                {
                    $.cookie("PHPSESSID", null,{path:"/",expires:-1});
                    location.href = "index.php";
                }
            });
        });
    });
    //搜索条件下拉框
    $("#u-search-condition").ajaxTreeSelect({
        localData:[],
        idProperty:'value',
        textProperty:'text',
        autoLoad:false,
        itemWidth:false,
        emptyNode:false,
        height:'auto',
        selMode:'single',
        width:78,
        offsetX:0,
        lastChildLevel:1,
        autoSelectFire:true,
        levelWidth:10,
        showExpand:false,
        treeItemCls:'u-ajax-tree-select-item u-ajax-common-select-item'
    });

    $("body").delegate(".xubox_shade","click",function(e){return false;});
    //兼容placeholder
    $('input[placeholder]').placeholder({isUseSpan:true});


    /*
     * 关于我们
     * layer custom window
     */
    $("#sys-about").on("click",function(){
        $.layer({
            type:1,
            shade: [0.3, '#000'],
            title:false,
            area: ['460px','290px'],
            move:'#u-about-top',
            page: {
                dom: '#u-about-box'
            }
        });
    });
    /*
     * 显示系统信息下拉列表
     */
    function showSystemInfoListDrop(){
        $("#m-top-drop").show();
    }
    /*
     * 隐藏系统信息下拉列表
     */
    function hideSystemInfoListDrop(){
        $("#m-top-drop").hide();
    }

    /**
     * 鼠标以上顶部图标呼出系统信息列表
     */
    $("#u-top-role").bind({
        mouseover:function(){
            showSystemInfoListDrop();
        },
        mouseleave:function()
        {
            hideSystemInfoListDrop();
        }
    });
    /*
     * 鼠标挪出系统信息列表则隐藏列表
     */
    $("#m-top-drop").hover(function(){
        showSystemInfoListDrop();
    },function(){
        hideSystemInfoListDrop();
    });
    /*$("#m-top-drop").bind({
        mouseleave:function(){
            hideSystemInfoListDrop();
        }
    });*/
    //点击其他地方隐藏系统信息下拉列表
    $("body").bind({
        click:hideSystemInfoListDrop
    });
    //关闭指定窗口的索引
    var _closeRegManage,_closeRegComp;

    /**
     * 注册信息面板
     */
    function showRegManageMain()
    {
        _closeRegManage=$.layer({
            type: 1,
            title: false,
            area: ['460px', '290px'],
            shade: [0.3, '#000'],
            move: '#reg-manage-title1',
            page: {
                dom: '#reg-manage-box-msg'
            }
        });
    }

    /**
     * 显示注册功能面板
     */
    function showRegCompMain()
    {

        $("#reg-manage-box").find("form").clearForm();
        _closeRegComp=$.layer({
            type: 1,
            title: false,
            area: ['460px', '290px'],
            shade: [0.3, '#000'],
            move: '#reg-manage-title',
            page: {
                dom: '#reg-manage-box'
            }
        });
        $("#u-select-license-file-btn").selectFileBtn({
            fileBtn:"#u-select-license-file"
        });
    }
    /*
     * 注册信息面板
     * layer custom window
     */
    $("#reg-manage").bind("click",function(){
        if(IS_REG)
        {
            showRegManageMain();
        }
        else
        {
            showRegCompMain();
        }
    });
    /*
     * 注册面板
     * layer custom window
     */
    $("#reg-comp").bind("click",function(){
        //alert("heihei");

        layer.close(_closeRegManage);
        showRegCompMain();
    });
    $("#u-select-license-file-btn").bind({
        click:function(){
            $("#u-select-license-file").trigger("click");
        }
    });


    $("#u-select-license-file").change(function(){
        $("#u-license-file-input").attr("value",$(this).val());
    });

    //注册
    $("#u-reg-system-btn").bind({
        click:function(){
            //检查参数
            /*var company = $("#u-reg-company-name-input").val();
            if(!company)
            {
                var index = layer.alert(L.companyCanNotNull,0,function(){
                    $("#u-reg-company-name-input").focus();
                    layer.close(index);
                });
                return false;
            }*/
            /*var regCode = $("#u-reg-code-input").val();
            if(!regCode)
            {
                var index= layer.alert(L.regCodeCanNotNull,0,function(){
                    $("#u-reg-code-input").focus();
                    layer.close(index);
                });
                return false;
            }*/
            var license = $("#u-license-file-input").val();
            if(!license)
            {
               var index = layer.alert(L.pleaseSelectLicenseFile,0,function(){
                   $("#u-license-file-input").focus();
                   layer.close(index);
               });
               return false;
            }
            $.bf.operationWaiting(L.doReg);
            $("#do-reg-form").ajaxSubmit({
                url:API.system.doReg,
                type:'POST',
                success:function(data)
                {
                    //console.log(data);return;
                    $.bf.ajaxCommonCallback(data,function(ret,res){
                        if(res)
                        {
                            location.reload();
                        }
                    });
                }
            });
        }
    });

    /**
     * 制作注册码
     */
    $("#u-make-reg-code").bind({
        click:function(){
            var company = $("#u-reg-company-name-input").val();
            if(!company)
            {
                var index = layer.alert(L.companyCanNotNull,0,function(){
                    $("#u-reg-company-name-input").focus();
                    layer.close(index);
                });
                return false;
            }
            $.download(API.system.createMachineCode,{company:company},company+"-机器码.txt",'', L.onGenerate, L.generatedSucceed);
            /*$.fastAction(API.system.createMachineCode,{company:company},function(ret,res){
                if(res && ret.MACHINE_CODE)
                {
                    $("#u-reg-code-input").attr("value",ret.MACHINE_CODE);
                }
            },false, L.makingRegCode);*/
        }
    });

    /**
     * 点击取消返回注册信息面板
     */
    $("#u-back-reg-box-btn").bind({
        click:function(){
            layer.close(_closeRegComp);
            if(IS_REG)
            {
                showRegManageMain();
            }
        }
    });
    /*
    *修改密码
     */
    var editPwdLayer;
    $("#update-pws").bind("click",function(){
        editPwdLayer = $.layer({
            type: 1,
            title: false,
            area: ['460px', '290px'],
            shade: [0.3, '#000'],
            move: '#update-pws-title1',
            page: {
                dom: '#update-pws-box'
            }
        });
        var form = $("#u-edit-pwd-form");
        var valid = form.validate();
        form.clearForm();
        valid.resetForm();
    });
    /**
     * 软件升级
     */
    $("#software-upgrade").bind("click",function(){
        editPwdLayer = $.layer({
            type: 1,
            title: false,
            area: ['610px', '290px'],
            shade: [0.3, '#000'],
            closeBtn:[1,false],
            move: '#software-upgrade-title1',
            page: {
                dom: '#software-upgrade-box'
            }
        });
        $("#close-window").bind({
            "click":function(){
            layer.close(editPwdLayer);
            },
            "mousedown":function(e){
                e.stopPropagation();
            }
        });
        /*立即更新*/
        $("#immediately-update").bind({
            "click":function(){
                var updateBox=layer.confirm("确定更新该版本？",function(){
                    layer.close(editPwdLayer);
                    editPwdLayer=$.layer({
                        type: 1,
                        title: false,
                        area: ['610px', '290px'],
                        shade: [0.3, '#000'],
                        closeBtn:[1,false],
                        move: '#software-upgraded-box',
                        page: {
                            dom: '#software-upgraded-box'
                        }
                    },layer.close(updateBox));
                });

                $("#updated-button").bind({
                   "click":function(){
                       layer.close(editPwdLayer);
                   },
                    "mousedown":function(e){
                        e.stopPropagation();
                    }
                });
            }
        });
    });

    /*隐藏软件升级详细信息*/
    function putAwayHidden(){
        $("#put-away-tr").hide();
    }
    function putAwayShow(){
        $("#put-away-tr").show();
    }
    $("#put-away-img").bind("click",function(){
        putAwayHidden();
    });
    $("#new-description").bind("click",function(){
        putAwayShow();
    });


    $("#u-submit-edit-pwd-form-btn").bind({
        click:function(){
            var form = $("#u-edit-pwd-form");
            var valid = form.validate();
            if(valid.form())
            {
                var data = form.serializeArray();
                $.fastAction(API.login.changeMyPassword,data,function(ret,suc){
                    if(suc)
                    {
                        layer.close(editPwdLayer);
                    }
                });
            }
        }
    });
    /*
     * 卸载管理
     * layer custom window
     */
    $("#drop-manage").bind("click",function(){
        $("#u-uninstall-timeout").text("");
        $("#drop-manage-box").find("form").clearForm();
        $.layer({
            type: 1,
            title: false,
            area: ['460px', '290px'],
            shade: [0.3, '#000'],
            move: '#drop-manage-title1',
            page: {
                dom: '#drop-manage-box'
            }
        });
    });
    $("#u-make-uninstall-btn").bind({
        click:function(){
            var machineCode = $("#u-client-machine-code").val();
            if(!machineCode)
            {
                var index=layer.alert(L.machineCodeCanNotNull,0,function(){
                    $("#u-client-machine-code").focus();
                    layer.close(index);
                });
                return;
            }
            $.fastAction(API.system.makeUninstall,{code:machineCode},function(ret,res){
                if(res)
                {
                    $("#u-uninstall-timeout").text(ret.time);
                    $("#u-client-uninstall-code").attr("value",ret.code);
                }
            });
        }
    });
    /*$("#u-copy-client-uninstall-code").zclip({
        copy:function(){
            return "sssss";
        }
    });*/
    /**
     * 复制按钮
     */
    $("#u-copy-client-uninstall-code").zclip({
        path: "./Resources/ZeroClipboard.swf",
        //更新剪切板的内容
        copy:function(){
            var str = $("#u-client-uninstall-code").val();
            return str;
        },
        //复制之后的处理函数
        afterCopy:function(e,str){
		    if(str)
			{
               layer.alert(L.copySucceed,1);
			   //+"<div class='u-copy-content' title='"+str+"'>"+str+"</div>"
			}
        }
    });
    // 注册一个 button，参数为 id。点击这个 button 就会复制。
    //这个 button 不一定要求是一个 input 按钮，也可以是其他 DOM 元素。

    /*$("#u-copy-client-uninstall-code").click(function(){
       // console.log("sssssss");
        var str = $("#u-client-uninstall-code").val();
        _clip.setText(str); // 设置要复制的文本。
    });*/


    /*$("body").delegate(".close-win","click",function(){
        //layer.close();
    });*/
    $(".cancel-btn").click(function(){
        layer.closeAll();
    });
});

$(function(){
    if( $.browser.msie && parseInt($.browser.version)<=7)
    {
        window.location.href = API.system.canNotSupport;
        return;
    }
	//存储用户信息cookie key
	var userInfoCookieKey = "_historyUsers"+VERSION_MD5;
    $('input[placeholder]').placeholder({isUseSpan:true});
    var form=$("form");
    var valid = form.validate({
        rules:{
            name:{
                required:true
            }
        },
        messages:{
            name:{
                required: L.accountShouldNotNull
            }
        }
    });

    $.ajaxSetup({
        dataType:'json',
        type:'post',
        timeout:15000,
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

            layer.closeAll();
        }/*,
         success:function(data)
         {
         layer.closeAll();
         if(data && !data.ret)
         {
         location.href="webpage-new/index.php";
         }
         else if(data && data.ret)
         {
         layer.msg(parseCode(data.ret),3);
         }
         else
         {
         layer.msg(L.unknownError,3);
         }
         }*/
    });

    function submit()
    {
        if(valid.form())
        {
            layer.load(L.onLogin);
            var params={
                name:$("[name=name]").val(),
                password:$("[name=password]").val()
            };
            $.post(API.login.doLogin,params,function(data){
                if(data && data.ret===0)
                {
				    
                    //记录登录过的用户名
                    var userListStr = $.cookie(userInfoCookieKey);
                    var userList = userListStr ? userListStr.split(","):[];
                    var newUser =  $("#m-ipt-username").val();
                    //userList.splice($.inArray(newUser,userList),1);
                    newUser = newUser.toLowerCase();
                    userList.push(newUser);
                    $.unique(userList);
                    //userList.sort();
                    var users = userList.join(",");
                    $.cookie(userInfoCookieKey,users,{expires:30});
                    layer.msg(L.loginSuccess,1,1,function(){
                        location.reload();
                    });
                }
                else if(data && data.error_info)
                {
                    layer.msg(data.error_info,1,2,L.errorInfo);
                }
                else if(data)
                {
                    layer.msg(parseCode(data.ret),1,2,L.errorInfo);
                }
                else
                {
                    layer.msg(L.unknownError,1,2,L.errorInfo);
                }
            });
            /*form.ajaxSubmit({
             url:API.login.doLogin,
             type:'post',
             success:function(data)
             {
             if(data && data.ret===0)
             {
             //记录登录过的用户名
             var userListStr = $.cookie("_historyUsers");
             var userList = userListStr ? userListStr.split(","):[];
             var newUser =  $("#m-ipt-username").val();
             //userList.splice($.inArray(newUser,userList),1);
             newUser = newUser.toLowerCase();
             userList.push(newUser);
             $.unique(userList);
             //userList.sort();
             var users = userList.join(",");
             $.cookie("_historyUsers",users,{expires:30});
             layer.msg(L.loginSuccess,1,1,function(){
             location.href="./webpage-new/index.php"+location.hash;
             });
             }
             else if(data && data.error_info)
             {
             layer.msg(data.error_info,1,2,L.errorInfo);
             }
             else if(data)
             {
             layer.msg(parseCode(data.ret),1,2,L.errorInfo);
             }
             else
             {
             layer.msg(L.unknownError,1,2,L.errorInfo);
             }
             }
             });*/
        }
    }
    $("#submit").click(function(){
        submit();
    });
    //console.log($("#removes").length);
    $("#removes").bind({
        click:function(){
            var valMsg =$('#m-ipt-username').val();
            if(valMsg == null){
                return;
            }else{
                hiddenRemove();
                $('#m-ipt-username').attr("value","");
                //$("#u-select").show();
                showSelectBox();
            }
        }
    });
    /**
     * 输入账号框的效果
     *
     **/
    $("#m-ipt-username").bind({
        focus:function(){
            var val = $(this).val();
            if(val)
            {
                showRemove();
                loadSelectBox();
            }
            //console.log($("#u-select-box>ul>li").length);
            if($("#u-select-box>ul>li").length<=0)
            {
                hideSelectBox();
            }
            //showSelectBox();
            //loadSelectBox();
        },
        //阻止输入框冒泡
        click:function(e){
            e.stopPropagation();
        },
        keyup:function(e){
            //console.log(e.keyCode);
            if($.inArray(e.keyCode,[40,38,13])<0)
            {
                //console.log(e.keyCode);
                //console.log(e.keyCode);
                var val = $(this).val();
                if(val)
                {
                    showRemove();
                    loadSelectBox();
                }
                else
                {
                    hiddenRemove();
                    hideSelectBox();
                }
            }
        },
        keydown:function(e){
            var selectBox = $("#u-select-box");
            var input = $("#m-ipt-username");
            var current = selectBox.find("li.z-selected");
            if(e.keyCode == "40")
            {
                if(!selectBox.is(":hidden") && $(".u-select-menu>ul>li").length>0)
                {
                    if(current.length<=0)
                    {
                        current = selectBox.find("li:first");
                        current.addClass("z-selected");
                    }
                    else
                    {
                        var next = current.next();
                        current.removeClass("z-selected");
                        if(next.length>0)
                        {
                            next.addClass("z-selected");
                        }
                    }

                    return false;
                }
            }
            else if(e.keyCode == "38")
            {
                if(!selectBox.is(":hidden") && $(".u-select-menu>ul>li").length>0)
                {
                    if(current.length<=0)
                    {
                        current = selectBox.find("li:first");
                        current.addClass("z-selected");
                    }
                    else
                    {
                        var prev = current.prev();
                        current.removeClass("z-selected");
                        if(prev.length>0)
                        {
                            prev.addClass("z-selected");
                        }
                    }

                    return false;
                }
            }
            else if(e.keyCode == "13" && current.length<=0 && input.val())
            {
                hideSelectBox();
                $("#u-password").trigger("focus");
                return false;
            }
            else if(e.keyCode == "13" && current.length>0)
            {
                input.attr("value",current.text());
                current.removeClass("z-selected");
                hideSelectBox();
            }
        },
        keypress:function(e)
        {
            var selectBox = $("#u-select-box");
            var current = selectBox.find("li.z-selected");
        }
    });

    /*$("#m-ipt-username").bind({
     focus:function(){
     var val = $(this).val();
     if(val)
     {
     showRemove();
     }
     }
     });*/

    /*$("#m-ipt-username").focus(function(){
     var msg = $("#m-ipt-username").val();
     if(msg != ""){
     showRemove();
     }else{
     hiddenRemove();
     }
     }).blur(function(){
     var msg = $("#m-ipt-username").val();
     if(msg != ""){
     }else{
     hiddenRemove();
     }

     });*/
    /*$("#m-ipt-username").keydown(function(){
     $("#u-select").hide();
     showRemove();
     });*/
    function hiddenRemove(){
        $("#removes").hide();
        $("#u-select").show();
        $("body").unbind("click",hiddenRemove);
    }
    function showRemove(){
        $("#u-select").hide();
        $("#removes").show();
        $("body").bind("click",hiddenRemove);
    }
    function showSelectBox()
    {
        $("#u-select-box").show();
        $("#u-select").addClass("z-collapse");
        $("body").bind("click",hideSelectBox);
    }
    function removeHistoryUser(key){
	    
        var userListStr = $.cookie(userInfoCookieKey);
        var userList = userListStr ? userListStr.split(","):[];
        userList.splice($.inArray(key,userList),1);
        var users = userList.join(",");
        $.cookie(userInfoCookieKey,users,{expires:30});
    }
    /**
     *  selectBox DOM渲染
     */
    function selectBoxRenderer(data)
    {
        var selectBox =$("#u-select-box");
        var input = $("#m-ipt-username");
        var ul=document.createElement("ul");
        $.each(data,function(k,v){
            var li = document.createElement("li");
            var a = document.createElement("a");
            $(a).addClass("u-delete-history-user").bind({click:function(){
                removeHistoryUser(v);
                $(li).remove();
                if($(ul).children().length<=0)
                {
                    hideSelectBox();
                }
                return false;
            }});
            $(li).append(v).bind({
                click:function(){
                    $(ul).find("li.z-selected").removeClass("z-selected");
                    $(this).addClass("z-selected");
                    input.attr("value",v);
                    $("#u-password").attr("value","");
                }
            }).append(a);
            $(ul).append(li);
        });
        selectBox.append(ul);
    }

    /**
     * 加载selectbox的数据
     * nolink true:不进行筛选，列出所有历史记录 false:根据输入框的内容进行筛选
     */
    function loadSelectBox(nolink)
    {
        var selectBox =$("#u-select-box");
        selectBox.empty();
		
        var userListStr = $.cookie(userInfoCookieKey);
        var userList = userListStr ? userListStr.split(","):[];
        var input = $("#m-ipt-username");
        var val = input.val();
        val = val.toLowerCase();
        userList = $.map(userList,function(v){
            if(val && !nolink)
            {
                //console.log(v);
                v = v.toLowerCase();
                var reg = new RegExp(val,"gi");
                if(val != v && reg.test(v))
                {
                    return v;
                }
            }
            else if(val != v)
            {
                return v;
            }
        });

        if(userList.length>0)
        {
            //自动排序
            userList.sort();
            selectBoxRenderer(userList);
            //console.log(selectBox);
            if(selectBox.is(":hidden"))
            {
                showSelectBox();
            }

        }
        else if(nolink)
        {
            if(selectBox.is(":hidden"))
            {
                showSelectBox();
            }
        }
        else
        {
            if(selectBox.is(":visible"))
            {
                hideSelectBox();
            }
        }
    }
    /**
     *  隐藏selectBox
     */
    function hideSelectBox(){
        $("#u-select-box").hide();
        $("#u-select").removeClass("z-collapse");
        $("body").unbind("click",hideSelectBox);
    }


    $("#u-select").bind("click",function(){
        /*$(this).toggleClass("u-select-hover");
         $(".u-select-menu").toggle();*/
        //$("#m-ipt-username").trigger("focus");
        //loadSelectBox(true);
        if($("#u-select-box").is(":hidden"))
        {
            loadSelectBox(true);
        }
        else
        {
            hideSelectBox();
        }
        return false;
    });

    /**
     * 密码输入框回车登录
     */
    $("#u-password").bind({
        "keypress":function(e){
            if(e.keyCode == "13")
            {
                $(this).blur();
                submit();
            }
        }
    });

    //loadSelectBox(true);
    //hideSelectBox();
});
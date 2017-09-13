/**
 * Created by Administrator on 2014/12/30.
 */

(function($){
    $.timePickerDeafults={
        inputCls:"tp-input",
        splitCls:"tp-split",
        format:["hh","mm","ss"],
        maxInput:false
    };
    $.fn.timePicker = function(options)
    {
        var opts  = $.extend({},$.timePickerDeafults,options);
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

        function fixZero(i){
            i = parseToInt(i).toString();
            return i<10?"0"+ i:i;
        }

        function createData(type){
            var data = [];
            var start = 0;
            var end = type=="hh"?23:59;
            for(var i=start;i<=end;i++){
                var v = fixZero(i);
                data.push({name:v,id:i,leaf:true});
            }
            return data;
        }

        function getData(str){
            var tmp = str.split(":") || [];
            var data = {};
            $.each(opts.format,function(k,v){
                data[v] = tmp[k] || "00";
            });
            return data;
        }
        function setData(me,data){
            $.each(data,function(k,v){
                //console.log(me[0][k]);
                me[0][k].setValue(v);
            });
        }
        function setInputData(me,type,value){
            var data = getData(me.val());
            //console.log(data);
            data[type]=fixZero(value);
            me.val(joinData(data));
        }


        function joinData(data){
            data = $.map(data,function(v){
                return v;
            });
            return data.join(":");
        }

        function parseToInt(i){
            return parseInt(i) ? parseInt(i) : 0;
        }

        function is24(data){
            return parseToInt(data["hh"])==0 && parseToInt(data["mm"])==0 && parseToInt(data["ss"])==0;
        }

        function compare(left,right){
            /*var t1 = 0;
            var t2 = 0;
            $.each(opts.format,function(k,v){
                var lv=parseToInt(left[v]);
                var rv=parseToInt(right[v]);
                /!*console.log(v=="hh" && parseToInt(right["hh"])==0 && parseToInt(right["mm"])==0 && parseToInt(right["ss"])==0);*!/
                if(v=="hh" && is24(right)){
                    t1+=lv*3600;
                    t2+=24*3600;
                }
                else if(v=="hh"){
                    t1+=lv*3600;
                    t2+=rv*3600;
                }
                else if(v=="mm"){
                    t1+=lv*60;
                    t2+=rv*60;
                }
                else if(v=="ss"){
                    t1+=lv;
                    t2+=rv;
                }
            });
            //console.log(t1-t2);
            return t1-t2;*/
            //console.log(toTime(left)-toTime(right));
            var t1=toTime(left),t2=toTime(right);
            /*if(is24(right)){
                t2=new Date("2015/11/11 23:59:59").getTime();
               /!* console.log(t2);
                console.log("//");
                console.log(t1);*!/
            }*/
            //console.log(t1-t2);
            return t1-t2;
        }


        function adjustMaxInput(me){
            var lData,rData,cmp;
            if($("[data-target='"+me.data("max-target")+"']").length>0){
                //console.log("min");
                $m = $("[data-target='"+me.data("max-target")+"']");
                lData = getData(me.val());
                rData = getData($m.val());
                cmp = compare(lData,rData);
                if(cmp>=0){
                    //console.log(lData);
                    $m.trigger("adjustValue",[lData,rData,cmp]);
                }
            }
            else if($("[data-max-target='"+me.data("target")+"']").length>0){
                //console.log("max");
                $n = $("[data-max-target='"+me.data("target")+"']");
                lData = getData($n.val());
                rData = getData(me.val());
                cmp = compare(lData,rData);
                if(cmp>=0){
                    //console.log(me);
                    me.trigger("adjustValue",[lData,rData,cmp]);
                }
            }
            //console.log(cmp);
        }

        /*function add(me,data,type){
            if(type=="ss"){
                if(parseToInt(data['ss'])+1<60){
                    me[0]['ss'].setValue(parseToInt(data['ss'])+1);
                    //setInputData(me,"ss",parseToInt(data['ss'])+1);
                } else if (parseToInt(data['mm'])+1<60) {
                    me[0]['mm'].setValue(parseToInt(data['mm'])+1);
                    //setInputData(me,"mm",parseToInt(data['mm'])+1);
                } else if (parseToInt(data['hh'])+1<24){
                    me[0]['hh'].setValue(parseToInt(data['hh'])+1);

                    //setInputData(me,"hh",parseToInt(data['hh'])+1);
                } else {
                    me[0]['hh'].setValue(0);
                    //setInputData(me,"hh",0);
                }
            } else if(type=="mm") {
                if (parseToInt(data['mm'])+1<60) {
                    me[0]['mm'].setValue(parseToInt(data['mm'])+1);
                    //setInputData(me,"mm",parseToInt(data['mm'])+1);
                } else if (parseToInt(data['hh'])+1<24){
                    me[0]['hh'].setValue(parseToInt(data['hh'])+1);
                    //setInputData(me,"hh",parseToInt(data['hh'])+1);
                } else {
                    me[0]['hh'].setValue(0);
                    //setInputData(me,"hh",0);
                }
            } else if (type=="hh"){
                if (parseToInt(data['hh'])+1<24){
                    me[0]['hh'].setValue(parseToInt(data['hh'])+1);

                    //setInputData(me,"hh",parseToInt(data['hh'])+1);
                } else {
                    me[0]['hh'].setValue(0);
                    //setInputData(me,"hh",0);
                }
            }
        }*/
        //数据转换成时间戳
        function toTime(data){
            var d = new Date("2015/11/11 00:00:00");
            $.each(opts.format,function(k,v){
                if(v=="hh"){
                    d.setHours(data[v]);
                }else if(v=="mm"){
                    d.setMinutes(data[v]);
                }else if(v=="ss"){
                    d.setSeconds(data[v]);
                }
            });

            return d.getTime();
        }
        //时间戳转成数据
        function toData(time){
            var date  = typeof(time)=="number"?new Date(time):time;
            //console.log(date);
            var data={};
            var isNewDate = false;
            if(date.getDate()>11){
                isNewDate = true;
            }
            $.each(opts.format,function(k,v){
                if(isNewDate){
                    if(v=="hh"){
                        data[v]="23";
                    }else{
                        data[v]="59";
                    }
                }else if(v=="hh"){
                    data[v]=fixZero(date.getHours());
                }else if(v=="mm"){
                    data[v]=fixZero(date.getMinutes());
                }else if(v=="ss"){
                    data[v]=fixZero(date.getSeconds());
                }
            });
            return data;
        }

        $(this).each(function(){
            var me = $(this);
            if(me.data("init")){
               return true;
            }
            //初始化
            function init()
            {
                me.data("init",true);
                me.hide();
                //初始化数据
                var data = getData(me.val());
                me.val(joinData(data));
                $.each(opts.format,function(k,v){
                    var input = document.createElement("input");
                    $input = $(input);
                    $input.addClass(opts.inputCls).data({"type":v});
                    if (k!=0 && k!=opts.format.length-1) {
                        $input.css({"borderLeft":"none","borderRight":"none"})
                    } else if (k==0) {
                        $input.css({"borderRight":"none"})
                    } else {
                        $input.css({"borderLeft":"none"})
                    }
                    //$input.attr({"readOnly":true});
                    me.before(input);
                    var select = $input.ajaxTreeSelect({
                        localData:createData(v),
                        autoLoad:true,
                        showExpand:false,
                        levelWidth:0,
                        itemWidth:"100%",
                        itemTextAlign:"center",
                        selMode:"single"
                    });
                    input.setDefaultValue({"value":parseToInt(data[v]),"text":data[v]});
                    $input.bind("onTreeSelectChange",function(e,inp,node,tree){

                        setInputData(me,v,tree.getSelectId());
                        adjustMaxInput(me);
                    });
                    me[0][v]={};
                    me[0][v].setValue = function(val){
                        //console.log(val);
                        //return true;
                        if(val == getData(me.val())[v]){
                            return true;
                        }
                        input.setDefaultValue({text:fixZero(val),value:parseToInt(val)});
                        setInputData(me,v,val);
                        //console.log(me.val());
                    }
                    if(k!=0){
                        var split = document.createElement("span");
                        split.innerText = ":";
                        split.className = opts.splitCls;
                        $input.before(split)
                    }
                });


                me.bind("adjustValue",function(e,lData,rData,cmp){
                    //console.log(is24(rData));
                    var add = 3600;
                    var data =toData(toTime(lData)+add*1000);
                    setData(me,data);
                    return false;
                });
                adjustMaxInput(me);
            }



            init();
        });
    }
})(jQuery);

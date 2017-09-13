fis.config.set('modules.preprocessor.html', function(content, file){
			//console.log(content);
			var url = file.getUrl(false,false);
			var urlArr = url.split("/");
			var preStr = "";
			var len = urlArr.length-2;
			for(var a=0;a<len;a++){
			   preStr +="../";
			}
			//console.log(preStr);
			
			return content.replace(/(__STATIC__\/)(.*?)(['"])/gi,preStr+"Resources/$2$3");
});
function p(s){
	if(s<10)
	{
		s = "0"+s;
	}
	return s;
}
fis.config.merge({
	//domain:'http://127.0.0.1/beta1_output', 
    roadmap:{
	
			path:[{
				reg: /\.bat/gi,
				release:false
			},{
                //前面规则未匹配到的其他文件
                reg : /layer\/skin\/.*/gi,
                //编译的时候不要产出了
                useStandard : false,
				useHash:false
            },{
				//前面规则未匹配到的其他文件
                reg : /laydate\/skins\/.*/gi,
                //编译的时候不要产出了
                useStandard : false,
				useHash:false
			},{
				//前面规则未匹配到的其他文件
                reg : /laydate\/need\/.*/gi,
                //编译的时候不要产出了
                useStandard : false,
				useHash:false
			},{
				reg:/ZeroClipboard\.swf/gi,
				useStandard : false,
				useHash:false
			},{
				reg: /Runtime\/.*/gi,
				release:false
			},{
				reg:/website_icon\/.*/gi,
				useStandard : false,
				useHash:false
			}
			]
	},modules : {
        //打包后调用fis-postpackager-your_postpackager插件进行处理
        postprocessor: {
			php:function(content, file){
			    var filePath = file.toString();
				//打包版本时间
			    if(/Core\/Controller\/SystemController.class.php/gi.test(filePath))
				{
				    var time = new Date();
					var month = (time.getMonth()+1);
					var day = time.getDate();
					var versionTime = p(month)+""+p(day);
					console.log("当前打包版本:"+versionTime+" "+time.getHours()+" "+time.getMinutes());
					content = content.replace("<!--[pacgetime]-->",versionTime);
				}
				//发布时关闭调试模式
				else if(fis.util.realpath('./index.php')==filePath)
				{
					content = content.replace('define("APP_DEBUG",true)','define("APP_DEBUG",false)');
				}
				//return content.replace(/(\/Resources\/.*?)(['"])/gi,"/beta1_output$1$2");
				return content;
			}
		}
    },
	settings: {
    }/* ,
    modules : {
        //打包后调用fis-postpackager-your_postpackager插件进行处理
        postprocessor: {
			html:function(content, file){
				return content.replace(/(\/Resources\/.*?)(['"])/gi,"/beta1_output$1$2");
			} ,
			js:function(content, file){
			
				return content.replace(/(\/Resources\/(!swf).*?)(['"])/gi,"/beta1_output$1$2");
			},
			css:function(content, file){
			
				return content.replace(/(\/Resources\/.*?)(['"])/gi,"/beta1_output$1$2");
			}
		}
    } */ 
});
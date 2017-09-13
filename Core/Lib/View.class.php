<?php
/**
 * Author: HongBinfu 
 * Date: 14-10-16
 * Time: 下午2:58
 */
defined("WOWOSTAR") or exit();
class View
{
     private $_tempRoot="";
     private $_tempSuffix=".php";
     private $tVar= array();
     public function __construct($templateSuffix=".tpl.php",$templateFileRoot="")
     {
         if(empty($templateFileRoot))
         {
             $this->_tempRoot = TEMPLATE_PATH;
         }
         else{
             $this->_tempRoot = $templateFileRoot;
         }
         $this->_tempSuffix = $templateSuffix;
     }
     private function _loadTemplateFunc()
     {
         include_once COMMON_PATH."template.php";
     }
    // 模板变量获取和设置
    public function get($name) {
        if(isset($this->tVar[$name]))
            return $this->tVar[$name];
        else
            return false;
    }

    public function set($name,$value) {
        if(is_array($name)) {
            $this->tVar   =  array_merge($this->tVar,$name);
        }else {
            $this->tVar[$name] = $value;
        }
    }
    /**
     * 显示视图
     * @param $group
     * @param string $temp
     * @throws Exception
     */
    public function display($group,$temp="")
    {
        $content = $this->fetch($group,$temp);
        $this->render($content);
    }

    /**
     * 获取模板内容
     * @param $group
     * @param string $temp
     * @return string
     * @throws Exception
     */
    public function fetch($group,$temp="")
    {
        $this->_loadTemplateFunc();
        //$tempFile = $this->_tempRoot.$group."/".$temp.$this->_tempSuffix;
        // 页面缓存
        ob_start();
        ob_implicit_flush(0);
        // 模板阵列变量分解成为独立变量
        extract($this->tVar, EXTR_OVERWRITE);
        include $this->parseTemplateFile($group,$temp);
        // 获取并清空缓存
        return ob_get_clean();
    }
    private function parseTemplateFile($group,$temp="")
    {

        $tempFile = $this->_tempRoot.$group."/".$temp.$this->_tempSuffix;
        if(empty($temp) && file_exists($group))
        {
            $includeFile= $group;
        }
        else if(file_exists($tempFile))
        {
            $includeFile= $tempFile;
        }
        else
        {
            throw new Exception("Template file does not exist!");
        }
        $cachePath = RUNTIME_PATH."Tpl/";
        $cacheFile = $cachePath.md5($includeFile).Common::config("TPL_CACHE_FILE_SUFFIX");
        if(!is_file($cacheFile) || filemtime($cacheFile)<filemtime($includeFile))
        {
            $html = $this->parseHtml(file_get_contents($includeFile));
            if(!is_dir($cachePath))
            {
                @mkdir($cachePath,0777,true);
            }
            $inputContent = file_put_contents($cacheFile,$html);
            if($inputContent===false)
            {
                return $includeFile;
            }
        }
        return $cacheFile;
    }
    private function parseHtml($html)
    {
        $tplVarFile = COMMON_PATH."tplVar.php";
        if(is_file($tplVarFile))
        {
            $tplVar=include $tplVarFile;
            if(is_array($tplVar) && !empty($tplVar))
            {
                foreach($tplVar as $k=>$v)
                {
                    $html = str_replace($k,$v,$html);
                }
            }

        }
        return preg_replace('/(\{)([^\d\s\{\}].+?)(\})/eis',"\$this->parseTag('\\2')",$html);
    }
    /**
     * 模板标签解析
     * 格式： {TagName:args [|content] }
     * @access public
     * @param string $tagStr 标签内容
     * @return string
     */
    public function parseTag($tagStr){
        //if (MAGIC_QUOTES_GPC) {
        $tagStr = stripslashes($tagStr);
        //}
        //还原非模板标签
        if(preg_match('/^[\s|\d]/is',$tagStr))
            //过滤空格和数字打头的标签
            return '{' . $tagStr .'}';
        $flag   =  substr($tagStr,0,1);
        $flag2  =  substr($tagStr,1,1);
        $name   = substr($tagStr,1);
        if('$' == $flag && '.' != $flag2 && '(' != $flag2){ //解析模板变量 格式 {$varName}
            return $this->parseVar($name);
        }elseif('-' == $flag || '+'== $flag){ // 输出计算
            return  '<?php echo '.$flag.$name.';?>';
        }elseif(':' == $flag){ // 输出某个函数的结果
            return  '<?php echo '.$name.';?>';
        }elseif('~' == $flag){ // 执行某个函数
            return  '<?php '.$name.';?>';
        }elseif(substr($tagStr,0,2)=='//' || (substr($tagStr,0,2)=='/*' && substr($tagStr,-2)=='*/')){
            //注释标签
            return '';
        }
        // 未识别的标签直接返回
        return '{' . $tagStr .'}';
    }
    /**
     * 分析XML属性
     * @access private
     * @param string $attrs  XML属性字符串
     * @return array
     */
    private function parseXmlAttrs($attrs) {
        $xml        =   '<tpl><tag '.$attrs.' /></tpl>';
        $xml        =   simplexml_load_string($xml);
        if(!$xml)
            throw new Exception("XML TAG ERROR");
        $xml        =   (array)($xml->tag->attributes());
        $array      =   array_change_key_case($xml['@attributes']);
        return $array;
    }
    // 解析模板中的include标签
    protected function parseInclude($content) {
        // 读取模板中的include标签
        $find       =   preg_match_all('/\<include\s(.+?)\s*?\/\>/is',$content,$matches);
        if($find) {
            for($i=0;$i<$find;$i++) {
                $include    =   $matches[1][$i];
                $array      =   $this->parseXmlAttrs($include);
                $file       =   $array['file'];
                unset($array['file']);
                $content    =   str_replace($matches[0][$i],$this->parseIncludeItem($file,$array),$content);
            }
        }
        return $content;
    }
    /**
     * 加载公共模板并缓存 和当前模板在同一路径，否则使用相对路径
     * @access private
     * @param string $tmplPublicName  公共模板文件名
     * @param array $vars  要传递的变量列表
     * @return string
     */
    private function parseIncludeItem($tmplPublicName,$vars=array()){
        // 分析模板文件名并读取内容
        $parseStr = $this->parseTemplateName($tmplPublicName);
        // 替换变量
        foreach ($vars as $key=>$val) {
            $parseStr = str_replace('['.$key.']',$val,$parseStr);
        }
        // 再次对包含文件进行模板分析
        return $this->parseInclude($parseStr);
    }
    /**
     * 分析加载的模板文件并读取内容 支持多个模板文件读取
     * @access private
     * @param string $tmplPublicName  模板文件名
     * @return string
     */
    private function parseTemplateName($templateName){
        if(substr($templateName,0,1)=='$')
            //支持加载变量文件名
            $templateName = $this->get(substr($templateName,1));
        $array  =   explode(',',$templateName);
        $parseStr   =   '';
        foreach ($array as $templateName){
            if(false === strpos($templateName,$this->_tempSuffix)) {
                $basePath = TEMPLATE_PATH;
                $templateName = str_replace(':', '/', $templateName);
                $path   =   explode('/',$templateName);
                $action =   array_pop($path);
                $module =   !empty($path)?array_pop($path):__CONTROLLER__;
                if(!empty($path)) {// 设置模板主题
                    $basePath = dirname($basePath).'/'.array_pop($path).'/';
                }
                $templateName  =  $basePath.$module."/".$action.$this->_tempSuffix;
            }
            // 获取模板文件内容
            $parseStr .= file_get_contents($templateName);
        }
        return $parseStr;
    }
    /**
     * 模板变量解析,支持使用函数
     * 格式： {$varname|function1|function2=arg1,arg2}
     * @access public
     * @param string $varStr 变量数据
     * @return string
     */
    public function parseVar($varStr){
        $varStr     =   trim($varStr);
        static $_varParseList = array();
        //如果已经解析过该变量字串，则直接返回变量值
        if(isset($_varParseList[$varStr])) return $_varParseList[$varStr];
        $parseStr   =   '';
        $varExists  =   true;
        if(!empty($varStr)){
            $varArray = explode('|',$varStr);
            //取得变量名称
            $var = array_shift($varArray);
            if( false !== strpos($var,'.')) {
                //支持 {$var.property}
                $vars = explode('.',$var);
                $var  =  array_shift($vars);
                $name = 'is_array($'.$var.')?$'.$var.'["'.$vars[0].'"]:$'.$var.'->'.$vars[0];
            }elseif(false !== strpos($var,'[')) {
                //支持 {$var['key']} 方式输出数组
                $name = "$".$var;
                preg_match('/(.+?)\[(.+?)\]/is',$var,$match);
                $var = $match[1];
            }elseif(false !==strpos($var,':') && false ===strpos($var,'(') && false ===strpos($var,'::') && false ===strpos($var,'?')){
                //支持 {$var:property} 方式输出对象的属性
                $vars = explode(':',$var);
                $var  =  str_replace(':','->',$var);
                $name = "$".$var;
                $var  = $vars[0];
            }else {
                $name = "$$var";
            }
            //对变量使用函数
            if(count($varArray)>0)
                $name = $this->parseVarFunction($name,$varArray);
            $parseStr = '<?php echo ('.$name.'); ?>';
        }
        $_varParseList[$varStr] = $parseStr;
        return $parseStr;
    }

    /**
     * 对模板变量使用函数
     * 格式 {$varname|function1|function2=arg1,arg2}
     * @access public
     * @param string $name 变量名
     * @param array $varArray  函数列表
     * @return string
     */
    public function parseVarFunction($name,$varArray){
        //对变量使用函数
        $length = count($varArray);
        for($i=0;$i<$length ;$i++ ){
            $args = explode('=',$varArray[$i],2);
            //模板函数过滤
            $fun = strtolower(trim($args[0]));
            switch($fun) {
                case 'default':  // 特殊模板函数
                    $name   = '('.$name.')?('.$name.'):'.$args[1];
                    break;
                default:  // 通用模板函数
                    if(isset($args[1])){
                        if(strstr($args[1],'###')){
                            $args[1] = str_replace('###',$name,$args[1]);
                            $name = "$fun($args[1])";
                        }else{
                            $name = "$fun($name,$args[1])";
                        }
                    }else if(!empty($args[0])){
                        $name = "$fun($name)";
                    }
            }
        }
        return $name;
    }
    /**
     *
     * 渲染网页内容
     * @param $content
     * @param string $charset
     * @param string $contentType
     */
    private function render($content,$charset='',$contentType='')
    {
        if(empty($charset))  $charset = Common::config('DEFAULT_CHARSET');
        if(empty($contentType)) $contentType = Common::config('TMPL_CONTENT_TYPE');
        // 网页字符编码
        header('Content-Type:'.$contentType.'; charset='.$charset);
        header("Cache-control:no-cache,no-store,must-revalidate");
        header("Pragma:no-cache");
        header("Expires:0");

        // 输出模板文件
        echo $content;
    }

    /**
     *
     * 赋值模板变量
     * @param $name
     * @param string $value
     */
    public function assign($name,$value=''){
       $this->set($name,$value);
    }
    /**
     * 简单的页面输出
     * @param $content
     */
     public function view($content)
     {
         $this->render($content);
     }

}
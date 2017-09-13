<?php
/**
 * Author: HongBinfu 
 * Date: 14-10-23
 * Time: 下午3:08
 *
 * 常用类（替换原有common.php里面的函数，common里面的函数尽量以后不用，最终会慢慢弃用掉）
 *
 */

class Common{

    static $widgetObj=array();
    static function _404()
    {
        header('HTTP/1.1 404 Not Found');
        header("status: 404 Not Found");
        exit();
    }

    static function getLogName($type,$index="")
    {
        $folder = LOG_PATH.$type."/".date("Y-m-d")."/";
        if(!is_dir($folder))
        {
            @mkdir($folder,777,true);
        }
        $base = $folder.date("Y-m-d");
        $filename = $index == "" ?$base."":$base."_".$index;
        $file = $filename.".log";
        if(!file_exists($file))
        {
            @touch($file);
            return $filename;
        }
        else if(filesize($file)>1024*1024*$GLOBALS['_CONFIG']['LOG_SINGLE_FILE_SIZE'])
        {
            $index = intval($index);
            $index++;
            return self::getLogName($type,$index);
        }
        else
        {
            return $filename;
        }
    }

    //简单的日志记录
    static function log($content,$scriptFile="",$line="",$type="Debug")
    {
        $debug=debug_backtrace();
        $filename = self::getLogName($type);
        $file=$filename.".log";
        if(!file_exists($file))
        {
            touch($file);
        }
        $log = file_get_contents($file);
        $string ="%1\$s 文件：%2\$s 第【%3\$u】行 时间：%4\$s\r\n";
        //$new=$old.$str." 文件：".$script."  第【".$line."】行 时间：\r\n";
        if(empty($scriptFile))
        {
            $scriptFile=$debug[0]['file'];
        }
        if(empty($line))
        {
            $line=$debug[0]['line'];
        }
        $log .= sprintf($string,var_export($content,true),$scriptFile,$line,date("Y-m-d H:i:s"));
        file_put_contents($file,$log);
    }
    static function safeWrite($file,$data="")
    {
        $type = self::getFileType($file);
        if($type=="php")
        {
            $data = "<?php defined('WOWOSTART') or exit();?>".$data;
        }
        return file_put_contents($file,$data);
    }
    //异常处理函数
    static function throwExceptionHandler($errorLevel, $errorMsg, $file, $line)
    {
        self::log($errorMsg,$file,$line,"System");
    }

    /**
     * 测试执行时间的函数，在日志debug里可以查看
     * 在测试代码前面G(),在测试代码再次G()即可
     *
     */
    static function record()
    {
        $debug=debug_backtrace();
        if(isset($GLOBALS["_MICRO_"]))
        {
            self::log(microtime()-$GLOBALS["_MICRO_"],$debug[0]['file'],$debug[0]['line']);
            $GLOBALS["_MICRO_"] = microtime();
        }
        else
        {
            $GLOBALS["_MICRO_"]=microtime();
        }
    }

    /**
     * 调用数据模型类
     * @param $modelName 模型名
     * @return mixed
     * @throws Exception
     */
    static function model($modelName)
    {
        if(!class_exists("Model"))
        {
            require_once LIB_PATH."Model.class.php";
        }
        $model = $modelName."Model";
        require_once MODEL_PATH.$model.".class.php";
        if(class_exists($model))
        {
            return new $model();
        }
        else
        {
            throw new Exception($model." does not exist");
        }
    }
    //过滤
    static function filterParams(&$v,$key)
    {
        $v = htmlspecialchars(trim($v),ENT_NOQUOTES);
    }
     //获取前端提交的参数
    static function getParams($key="",$default="",$dataType="str",$array="request")
    {
        if($array == "request")
        {
            $array=$GLOBALS['_SAFE_REQUEST'];
        }

        if(empty($key))
        {
            return $array;
        }
        else
        {
            $parse = $dataType."val";
            if( !is_array($array) || !isset($array[$key]))
            {
                return $default;
            }
            $notEmpty = ($array[$key] === 0 || $array[$key] === "0" || !empty($array[$key])) ? true:false;
            return $notEmpty?$parse($array[$key]):$default;
        }
    }


    static function emptyDefault($str="",$default="")
    {
        return !empty($str)?$str:$default;
    }

    /**
     * 判读数组是否存在某个键值（特别是多维数组）
     * @param $baseArr
     * @param $item
     * @return bool
     */
    static function issetItem($baseArr,$item)
    {

        if(is_array($item))
        {
            $temp = $baseArr;
            $ret = true;
            foreach($item as $k=>$v)
            {
                if(isset($temp[$v]) && !empty($temp[$v]))
                {

                }
            }
            return $ret;
        }
        else
        {
            return isset($baseArr[$item]) && !empty($baseArr[$item]);
        }
    }
    static function dump($param)
    {
        echo "<pre>";
        var_dump($param);
    }

    static function isNotEmpty($param)
    {
        return isset($param) && !empty($param);
    }

    /**
     * 快捷引入类包
     * @param $groupName 组名或包名
     * @param string $packageName
     */
    static function vendor($groupName,$packageName="")
    {
        if(empty($packageName))
        {
            $packageName = $groupName;
        }
        $include_once1 = VENDOR_PATH.$groupName."/".$packageName.".class.php";
        $include_once2 = VENDOR_PATH.$packageName.".class.php";
        if(file_exists($include_once1))
        {
            include_once $include_once1;
        }
        else if(file_exists($include_once2))
        {
            include_once $include_once2;
        }
        else
        {
            //主动抛出异常【包（类）文件不存在】
            throw new Exception("package file does not exist");
        }
        //include_once "./Core/Vendor/".$groupName."/".$packageName.".class.php";
    }

    /**
     * 快速使用其他控制器
     * @param $controller 控制器名称（不用加Controller）
     * @return mixed
     */
    static function controller($controller,$action="",$params=array())
    {
        $controllerName = ucfirst($controller)."Controller";
        if(!class_exists($controllerName))
        {
            require_once CONTROLLER_PATH.$controllerName.".class.php";
        }
        $obj =  new $controllerName(array("checkLimit"=>false));
        if(!empty($action) && method_exists($obj,$action))
        {

            return call_user_func_array(array($obj,$action),$params);
        }
        return $obj;
    }

    /**
     *
     * 获取静态数据（文件存储模式）
     * @param $controller
     * @param $fileName
     * @param string $type array（数组） json
     * @return mixed
     */
    static function getArrayData($controller,$fileName=false,$type="array")
    {
        if($fileName===false)
        {
            $fileName = $controller;
            $controller = __CONTROLLER__;
        }
        switch($type)
        {
            case 'array':
                return include_once DATA_PATH.ucfirst($controller)."/".$fileName.".php";
                break;
            case 'json':
                $data =  include_once DATA_PATH.ucfirst($controller)."/".$fileName.".json";
                return json_decode($data,true);
                break;
        }
    }

    /**
     * 返回前端结果
     * @param $ret
     * @param string $type (json/jsonp)
     */
    static function ajaxReturn($ret,$type=''){
        header("Access-Control-Allow-Origin:*");
        header('Content-Type:text/html; charset=utf-8');
        $echo =is_array($ret)?@json_encode($ret):$ret;
        if(empty($type))
        {
            $type = $GLOBALS['_CONFIG']['AJAX_RETURN_TYPE'];
        }
        switch($type)
        {
            case "json":
                //header('Content-type: application/json');
                exit($echo);
                break;
            case "jsonp":
                //header('Content-type: text/javascript');
                $callback = self::getParams($GLOBALS['_CONFIG']['JSONP_CALLBACK_KEY'],"callback");
                exit($callback."(".$echo.");");
                break;
        }
        exit();
    }

    /**
     * 根据路径获取文件后缀
     * @param $filename
     * @param string $split
     * @return mixed
     */
    static function getFileType($filename,$split=".")
    {
        $arr = explode($split,$filename);
        $last = count($arr)-1;
        return $arr[$last];
    }

    /**
     * 获取文件夹下面的所有
     * @param $dir
     * @return array|bool
     */
    static function getPathAllFiles($dir)
    {
        if(!is_dir($dir)) # 如果$dir变量不是一个目录，直接返回false
            return false;
        $dirs[] = '';     # 用于记录目录
        $files = array(); # 用于记录文件
        while(list($k,$path)=each($dirs))
        {
            $absDirPath = "$dir/$path";     # 当前要遍历的目录的绝对路径
            $handle = opendir($absDirPath); # 打开目录句柄
            readdir($handle);               # 先调用两次 readdir() 过滤 . 和 ..
            readdir($handle);               # 避免在 while 循环中 if 判断
            while(false !== $item=readdir($handle))
            {
                $relPath = "$path/$item";   # 子项目相对路径
                $absPath = "$dir/$relPath"; # 子项目绝对路径
                if(is_dir($absPath))        # 如果是一个目录，则存入到数组 $dirs
                    $dirs[] = $relPath;
                else                        # 否则是一个文件，则存入到数组 $files
                    $files[] = $relPath;
            }
            closedir($handle); # 关闭目录句柄
        }
        return $files;
    }

    /**
     *
     * 根据
     * @param $array
     * @param $on
     * @param int $order
     * @return array
     */
    static function arraySortByKey($array, $on, $order=SORT_ASC)
    {
        $newArray = array();
        $sortableArray = array();
        if (count($array) > 0) {
            foreach ($array as $k => $v) {
                if (is_array($v)) {
                    foreach ($v as $k2 => $v2) {
                        if ($k2 == $on) {
                            $sortableArray[$k] = $v2;
                        }
                    }
                } else {
                    $sortableArray[$k] = $v;
                }
            }
            array_multisort($sortableArray,$order);
            /*switch ($order) {
                case SORT_ASC:
                    asort($sortableArray);
                    break;
                case SORT_DESC:
                    arsort($sortableArray);
                    break;
            }*/
            foreach ($sortableArray as $k => $v) {
                $newArray[$k] = $array[$k];
            }
        }
        return $newArray;
    }

    /**
     *
     * 配置项（获取、设置）
     * @param $key
     * @param null $value
     * @return null
     */
    static function config($key,$value=null)
    {
        $key = mb_strtoupper($key);
        if(is_null($value))
        {
            return isset($GLOBALS['_CONFIG'][$key])?$GLOBALS['_CONFIG'][$key]:null;
        }
        else
        {
            $GLOBALS['_CONFIG'][$key] = $value;
        }
    }
    static function widget($widget)
    {
        $widget = ucfirst($widget);
        if(!class_exists("Widget"))
        {
            require_once LIB_PATH."Widget.class.php";
        }
        if(!class_exists($widget."Widget"))
        {
            /*$backtrace = debug_backtrace();
            //array_shift($backtrace);
            var_dump($backtrace[count($backtrace)-1]);
           exit;*/
            require_once WIDGET_PATH.$widget."Widget.class.php";
        }
        $className = $widget."Widget";
		if(!isset(self::$widgetObj[$widget]))
		{
			self::$widgetObj[$widget] =  new $className();
		}
        return self::$widgetObj[$widget];
    }
    static function includeTpl($group,$tpl)
    {
         include TEMPLATE_PATH.$group."/".$tpl.self::config("TEMPLATE_FILE_SUFFIX");
    }
    static function redirect($controller,$action="",$params="")
    {
        if(!empty($action))
        {
            $base = $_SERVER['PHP_SELF'];
            if(!empty($params))
            {
                $params = "&".$params;
            }
            $url = $base."?".self::config("URL_CONTROLLER_PARAM")."=".$controller."&".self::config("URL_ACTION_PARAM")."=".$action.$params;
        }
        else{
            $url = $controller;
        }
        //$url = "";
        //重定向浏览器
        header("Location: ".$url);
        exit;
    }
}
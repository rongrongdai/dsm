<?php
/**
 * Author: HongBinfu 
 * Date: 14-8-21
 * Time: 上午10:25
 * 下载类
 */
defined("WOWOSTAR") or exit();
class DownloadController extends Controller
{
    /**
     * 公开调用的接口 前台参数 _m = Download&_a = download&code=[必选]&filename=[可选]
     */
    public function download()
    {
        //清理过时文件
        $this->_removeTimeoutFile();
        $code = $this->getParams('code',false);
        $filename = $this->getParams('filename');
        if($code===false)
        {
            $this->_echoError($this->getLang('fileDoesNotExist'));
        }
        /*if($filename)
        {
            $filename = urlencode($filename);
        }*/
        $file = TEMP_PATH.$code.".".$GLOBALS['_CONFIG']['DOWNLOAD_FILE_TYPE'];
        if(!file_exists($file))
        {
            $this->_echoError($this->getLang('fileDoesNotExist'));
        }
        /*if(!file_exists($file))
        {
            $this->_echoError($this->getLang('fileDoesNotExist'));
        }
        $fileSize = filesize($file);
        Header("Content-type: application/octet-stream");
        Header("Accept-Ranges: bytes");
        Header("Accept-Length:".$fileSize);
        Header("Content-Disposition: attachment; filename=".$filename);
        readfile($file);
        unlink($file);*/
        $this->_resumeDownload($file,$filename);
    }

    /**
     * 删除过期文件
     */
    private function _removeTimeoutFile()
    {
        $path = TEMP_PATH;
        $files = Common::getPathAllFiles($path);
        if(!empty($files))
        {
            foreach($files as $k=>$v)
            {
                $file = $path.$v;
                if(is_file($file))
                {
                    $createTime = filectime($file);
                    $currentTime = time();
                    $limitLiveTime = $this->getConfig('TEMP_FILE_LIVE_TIME');
                    if(($currentTime-$createTime)>$limitLiveTime)
                    {
                        @unlink($file);
                    }
                }
            }
        }
    }
    /**
     * 断点续传
     * @param $file
     * @param $filename
     */
    private function _resumeDownload($file,$filename='')
    {
        //if(is_file("complete_".$file))
        //检测文件是否存在
        if (!is_file($file)) {
            $this->_echoError($this->getLang('fileDoesNotExist'));
        }
        $len = filesize($file);//获取文件大小
        if(empty($filename))
        {
            $filename = basename($file);//获取文件名字
        }
        $file_extension = Common::getFileType($filename);//获取文件扩展名

        //根据扩展名 指出输出浏览器格式
        switch( $file_extension ) {
            case "exe": $ctype="application/octet-stream"; break;
            case "zip": $ctype="application/zip"; break;
            case "mp3": $ctype="audio/mpeg"; break;
            case "mpg":$ctype="video/mpeg"; break;
            case "avi": $ctype="video/x-msvideo"; break;
            default: $ctype="application/force-download";
        }

        //Begin writing headers
        header("Cache-Control:");
        header("Cache-Control: public");

        //设置输出浏览器格式
        header("Content-Type: $ctype");
        //L(var_export($_SERVER['HTTP_USER_AGENT'],true),__FILE__,__LINE__);
        if (strstr($_SERVER['HTTP_USER_AGENT'], "MSIE") || strstr($_SERVER['HTTP_USER_AGENT'],"Trident")) {
            //如果是IE浏览器
            # workaround for IE filename bug with multiple periods / multiple dots in filename
            # that adds square brackets to filename - eg. setup.abc.exe becomes setup[1].abc.exe
            $iefilename = preg_replace('/\./', '%2e', $filename, substr_count($filename, '.') - 1);
            $filename = urlencode($filename);
            header("Content-Disposition: attachment; filename=\"$filename\"");
        } else {
            //$filename = urlencode($filename);
            header("Content-Disposition: attachment; filename=\"$filename\"");
        }
        header("Accept-Ranges: bytes");

        $size=filesize($file);
        $range = null;
        //如果有$_SERVER['HTTP_RANGE']参数
        if(isset($_SERVER['HTTP_RANGE'])) {
        /*   ---------------------------
              Range头域 　　Range头域可以请求实体的一个或者多个子范围。
              例如
          　　表示头500个字节：bytes=0-499 　　
              表示第二个500字节：bytes=500-999 　　
              表示最后500个字节：bytes=-500 　　
              表示500字节以后的范围：bytes=500- 　　
              第一个和最后一个字节：bytes=0-0,-1 　　
              同时指定几个范围：bytes=500-600,601-999 　　
              但是服务器可以忽略此请求头，如果无条件GET包含Range请求头，响应会以状态码206（PartialContent）返回而不是以200 （OK）。
           ---------------------------*/

            // 断点后再次连接 $_SERVER['HTTP_RANGE'] 的值 bytes=4390912-

            list($a, $range)=explode("=",$_SERVER['HTTP_RANGE']);
            str_replace($range, "-", $range);
            $size2=$size-1;//文件总字节数
            $new_length=$size2-$range;//获取下次下载的长度
            header("HTTP/1.1 206 Partial Content");
            header("Content-Length: $new_length");//输入总长
            header("Content-Range: bytes $range$size2/$size");//Content-Range: bytes 4908618-4988927/4988928   95%的时候
        } else {//第一次连接
            $size2=$size-1;
            header("Content-Range: bytes 0-$size2/$size"); //Content-Range: bytes 0-4988927/4988928
            header("Content-Length: ".$size);//输出总长
        }
        //打开文件
        $fp=fopen($file,"rb");
        //设置指针位置
        fseek($fp,$range);
        //虚幻输出
        while(!feof($fp)){
            //设置文件最长执行时间
            set_time_limit(0);
            print(fread($fp,1024*8));//输出文件
            flush();//输出缓冲
            ob_flush();
        }
        fclose($fp);
        //unlink($file);
        exit;
    }
    private function _echoError($msg)
    {
        header("Content-type:text/html;charset=utf-8");
        exit($msg);
    }
}
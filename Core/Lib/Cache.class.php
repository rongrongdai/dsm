<?php
/**
 * Author: HongBinfu 
 * Date: 14-10-20
 * Time: 下午2:13
 *
 * 缓存类
 *
 */
defined("WOWOSTAR") or exit();
class Cache
{
    public $expirationTime=3600;
    public $linkFile = "";
    public $autoClear = true;
    public $link = array("group"=>array(),"item"=>array());
    public $cacheFileSuffix=".cache";
    public function __construct($group="")
    {
        $this->_cacheGenerate($group);
    }
    /**
     * 初始化
     */
    private function _cacheGenerate($group="")
    {
        if(empty($this->linkFile)){
            $this->linkFile = CACHE_PATH."Cache.link.php";
        }
        $this->_createCacheManageFile();
        $linkStr = file_get_contents($this->linkFile);
        if($this->autoClear)
        {
            $link = @json_decode($linkStr,true);
            if(empty($link) || !is_array($link))
            {
                $this->clear();
            }
            else
            {
                $this->link = $link;
                $this->clearExpiation($group);
            }
        }
    }

    private function _saveLink()
    {
        $linkStr = json_encode($this->link);
        file_put_contents($this->linkFile,$linkStr);
    }
    /**
     * 创建缓存管理文件，删除该文件后，当执行执行该类的时候会清空所有缓存文件
     */
    private function _createCacheManageFile()
    {
        if(!file_exists($this->linkFile))
        {
            @touch($this->linkFile);
        }
    }

    /**
     * 缓存
     * @param $name
     * @param $value
     * @param string $group
     * @param bool $exp
     */
    public function cache($name,$value="",$group="",$exp=false)
    {
        if($value === null)
        {
            $this->clear($name,$group);
        }
        else if(empty($value))
        {
            return $this->_get($name,$group);
        }
        else
        {
            return $this->_put($name,$value,$group,$exp);
        }
    }

    /**
     * 获取某个缓存内容
     */
    private function _get($name,$group="")
    {

        //L($group);
        if(!empty($group))
        {
            $info = isset($this->link["group"][$group][$name]) ? $this->link["group"][$group][$name]:"";

            if(empty($info))
            {
                return "";
            }
            $file = CACHE_PATH.$group."/".md5($name).$this->cacheFileSuffix;
            if(!is_file($file))
            {
                return null;
            }
            $temp = file_get_contents($file);
            if($info['md5']!=md5($temp))
            {
                return null;
            }
            return $info['type']=="array"?json_decode($temp,true):$temp;
        }
        else
        {
            $info = isset($this->link["item"][$name]) ? $this->link["item"][$name]:"";
            if(empty($info))
            {
                return "";
            }
            $file = CACHE_PATH.md5($name).$this->cacheFileSuffix;
            $temp = file_get_contents($file);
            if($info['md5']!=md5($temp))
            {
                return null;
            }
            return $info['type']=="array"?json_decode($temp,true):$temp;
        }
    }

    /**
     * 写入某个缓存内容
     */
    private function _put($name,$value,$group="",$exp=false)
    {
        if($exp==false)
        {
            $exp = $this->expirationTime;
        }
        $type = is_array($value) ? "array" : "string";
        $data = $type == "array"?json_encode($value):$value;
        if(!empty($group))
        {
            $path = CACHE_PATH.$group."/";
            if(!is_dir($path))
            {
                mkdir($path,777,true);
            }
            $file = $path.md5($name).$this->cacheFileSuffix;
            file_put_contents($file,$data);
            $start = time();
            $end = $start+$exp;
            $this->link['group'][$group][$name] = array("type"=>$type,"name"=>$name,"group"=>$group,"exp"=>$exp,"md5"=>md5($data),"startTime"=>$start,"endTime"=>$end);
        }
        else
        {
            $file = CACHE_PATH.md5($name).$this->cacheFileSuffix;
            file_put_contents($file,$data);
            $start = time();
            $end = $start+$exp;
            $this->link['item'][$name] = array("type"=>$type,"name"=>$name,"exp"=>$exp,"md5"=>md5($data),"startTime"=>$start,"endTime"=>$end);
        }
        $this->_saveLink();
        return true;
    }

    /**
     * 清除缓存
     * @param string $name
     * @param string $group
     */
    public function clear($name="",$group="")
    {
        $delete = CACHE_PATH;
        $deleteSelf = false;
        if(!empty($name) && !empty($group))
        {
            unset($this->link['group'][$group][$name]);
            $delete = CACHE_PATH.$group."/".md5($name).$this->cacheFileSuffix;
        }
        else if(!empty($name))
        {
            unset($this->link['item'][$name]);
            if(is_file($name) || is_dir($name))
            {
                $delete = $name;
                $deleteSelf = true;
            }
            else
            {
                $delete = CACHE_PATH.md5($name).$this->cacheFileSuffix;
            }
        }
        else if(!empty($group) && is_array($group))
        {
            foreach($group as $g)
            {
                $this->clear($name,$g);
            }
            return;
        }
        else if(!empty($group))
        {
            unset($this->link['group'][$group]);
            $delete = CACHE_PATH.$group."/";
            $deleteSelf = true;
        }
        else
        {
            $this->link =array("group"=>array(),"item"=>array());
        }
        $this->_delete($delete,$deleteSelf);
        $this->_saveLink();
    }

    /**
     * 清除过期的缓存
     */
    public function clearExpiation($group="")
    {
        if(!empty($group))
        {
            if(is_array($group))
            {
                foreach($group as $g)
                {
                    if(!isset($this->link['group'][$g]))
                    {
                        continue;
                    }
                    foreach($this->link['group'][$g] as $gIK =>$gIV)
                    {
                        if(time()>$gIV['endTime'])
                        {
                            $this->clear($gIV['name'],$gIV['group']);
                        }
                    }
                }
            }
            else
            {
                if(isset($this->link['group'][$group]))
                {
                    foreach($this->link['group'][$group] as $gIK =>$gIV)
                    {
                        if(time()>$gIV['endTime'])
                        {
                            $this->clear($gIV['name'],$gIV['group']);
                        }
                    }
                }
            }
        }
        else
        {
            if(!empty($this->link['group']))
            {
                foreach($this->link['group'] as $gK => $gV)
                {
                    foreach($gV as $gIK =>$gIV)
                    {
                        if(time()>$gIV['endTime'])
                        {
                            $this->clear($gIV['name'],$gIV['group']);
                        }
                    }
                }
            }
            if(!empty($this->link['item']))
            {
                foreach($this->link['item'] as $iK =>$iV)
                {
                    if(time()>$iV['endTime'])
                    {
                        $this->clear($iV['name']);
                    }
                }
            }
        }

    }

    /**
     * 删除文件
     * @param string $dirOrFile
     * @param bool $deleteSelf
     */
    private function _delete($dirOrFile="",$deleteSelf=false)
    {
       if(is_file($dirOrFile))
       {
           @unlink($dirOrFile);
       }
       else if(is_dir($dirOrFile))
       {
           $child = $this->_getFolderAllChild($dirOrFile);
           if(!empty($child['file']))
           {
               foreach($child['file'] as $file)
               {
                   if($file!="/Cache.link.php")
                   {
                       //L($dirOrFile.$file);
                       @unlink($dirOrFile.$file);
                   }
               }
           }
           else if(!empty($child['dir']))
           {
               foreach($child['dir'] as $dir)
               {
                   @rmdir($dir);
               }
           }
           if($deleteSelf)
           {
               @rmdir($dirOrFile);
           }
       }
    }

    /**
     *
     * 获取所有子目录和文件
     * @param $dir
     * @return bool
     */
    private function _getFolderAllChild($dir)
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
        $mix['file'] = $files;
        $mix['dir']=$dirs;
        return $mix;
    }
}
<?php
/**
 * Author: HongBinfu 
 * Date: 14-10-16
 * Time: 上午11:44
 *
 * 【数据列表页】
 *
 */


class DataList
{
    private $_data=array();
    private $_currentData=array();
    //当前排序字段
    private $_sort="";
    //asc升序 desc降序
    private $_order="asc";
    public $sortProperty="sort";
    public $orderProperty="order";
    //每页的条数
    private $_rows=15;
    //当前分页数
    private $_page=1;
    private $_start=0;
    private $_end=14;
    private $_total=0;
    private $_totalPage=0;
    public  $linkNextAndPrev=false;
    public $prevProperty="prev";
    public $nextProperty="next";
    public $keyword="";
    public $fuzzyField="";
    public $customOrderHandler="";
    public $getSearchCompareHandler="";
    public $customFuzzySearchHandler="";
    //初始化
    public function __construct($data,$page=1,$rows=15,$sort="",$order="asc",$keyword="",$fuzzyField="")
    {
        if(!empty($data) && is_array($data))
        {
            $this->_data=array_values($data);
        }
        $page = intval($page);
        $rows = intval($rows);
        if($page>0)$this->_page = $page;
        if($rows>0)$this->_rows = $rows;
        $this->_sort = $sort;
        $this->_order = $this->_getOrderValue($order);
        if(!empty($keyword))
        {
            $this->keyword=$keyword;
        }
        if(!empty($fuzzyField))
        {
            $this->fuzzyField=$fuzzyField;
        }
    }

    /**
     * 计算分页
     */
    private function _executePage()
    {
        $this->_total = count($this->_data);
        $this->_totalPage = ceil($this->_total/$this->_rows);
        $this->_start = $this->_rows*($this->_page-1);
        $this->_end = $this->_start+$this->_rows;
        if($this->_end>=$this->_total)
        {
            $this->_end = $this->_total;
        }
    }
    /**
     * 获取分页后的数据
     */
    public function getData()
    {

        /**
         * 筛选
         */
        if(!empty($this->customFuzzySearchHandler))
        {
            $this->_data = call_user_func($this->customFuzzySearchHandler,$this->_data,$this->keyword,$this->fuzzyField);
        }
        else
        {
            $this->_data = $this->_fuzzySearchHandler($this->_data,$this->keyword,$this->fuzzyField);
        }
        if(!empty($this->customOrderHandler))
        {
            call_user_func($this->customOrderHandler,$this->_data,$this->_sort,$this->_order);
        }
        else
        {
           $this->_orderHandler($this->_data,$this->_sort,$this->_order);
        }
        $this->_executePage();
        if(empty($this->_data))
        {
            return array();
        }
        for($a=$this->_start;$a<$this->_end;$a++)
        {
            $tmp = $this->_data[$a];
            //是否关联上行下行数据
            if($this->linkNextAndPrev)
            {
                if(isset($this->_data[$a-1]))
                {
                    $tmp[$this->prevProperty] = $this->_data[$a-1];
                }
                if(isset($this->_data[$a+1]))
                {
                    $tmp[$this->nextProperty] = $this->_data[$a+1];
                }
            }
            $this->_currentData[]=$tmp;
        }
        return $this->_currentData;
    }

    /**
     * 模糊搜索
     * @param array $filterData
     * @param string $keyword
     * @param string $field
     * @return bool
     */
    private function _fuzzySearchHandler($filterData,$keyword="",$field="")
    {
        if(empty($keyword) || empty($field))
        {
            return $filterData;
        }
        $data=array();
        foreach($filterData as $k=>$v)
        {
            if(empty($v))
            {
                continue;
            }
            $filterCompare="";
            if(!empty($this->getSearchCompareHandler))
            {
                $filterCompare = call_user_func($this->getSearchCompareHandler,$v);
            }
            //联合多个字段模糊查询
            else if(!empty($keyword) && !empty($field) && is_array($field))
            {
                $temp = array();
                foreach($field as $f){
                    if(isset($v[$f]))
                    {
                        $temp[]=$v[$f];
                    }
                }
                $filterCompare = implode("",$temp);
            }
            else if(!empty($keyword) && !empty($field) && isset($v[$field]))
            {
                $filterCompare = $v[$field];
            }
            if(!empty($keyword) && !strstr(strtolower($filterCompare),strtolower($keyword)))
            {
                continue;
            }
            else
            {
                $data[]=$v;
            }
        }
        return $data;
    }
    /**
     * 获取全部数据
     */
    public function getAllData()
    {
        return $this->_data;
    }

    /**
     * 获取排序的值 （为了兼容传入asc、desc，自动转成整型）
     * @param $order
     * @return int
     */
    private function _getOrderValue($order)
    {
        if($order==SORT_ASC || $order==SORT_DESC)
        {
            return intval($order);
        }
        else if(strtolower($order)=="asc")
        {
            return SORT_ASC;
        }
        else if(strtolower($order)=="desc")
        {
            return SORT_DESC;
        }
    }

    /**
     * 解析排序数组
     * @param $rowData
     * @param $rowKey
     * @param $findKey
     * @param $output
     */
    private  function _parseOrderData($rowData,$findKey)
    {
        if (is_array($rowData) && isset($rowData[$findKey])){
            return strtolower($rowData[$findKey]);
        } else {
            return strtolower($rowData);
        }
    }
    /**
     * 排序处理
     * @param &$array 排序的数据数组
     * @param $sort 排序的字段 当此参数是数组时，$order
     * @param int $order
     * @return array
     */
    private function _orderHandler(&$array, $sort, $order=SORT_ASC)
    {
        if(empty($sort))
        {
            return;
        }
        /**
         * 排序
         */
        if (count($array) > 0){
            if(is_array($sort))
            {
                foreach($sort as $v)
                {
                    if(isset($v[$this->sortProperty])&&isset($v[$this->orderProperty]))
                    {
                        $this->_orderHandler($array,$v[$this->sortProperty],$v[$this->orderProperty]);
                    }
                }
            }
            else
            {
                $sortableArray = array();
                foreach ($array as $k => $v){
                    if(!empty($this->customOrderHandler))
                    {
                        //可以自定义获取某一字段的回调函数
                        $sortableArray[$k]=call_user_func($this->customOrderHandler,$v,$sort);
                    }
                    else
                    {
                        $sortableArray[$k]=$this->_parseOrderData($v,$sort);
                    }
                }
                $order = $this->_getOrderValue($order);
                array_multisort($sortableArray,$order,$array);
            }
        }
    }
}
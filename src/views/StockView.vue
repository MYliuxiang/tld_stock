<template>
    <div> 
        <el-tabs v-model="activeName" class="stock-tabs" @tab-click="handleClick">
            <el-tab-pane label="分时" name="first" lazy="false">
                <MineChart :stockCode="code" :line15="line15" :line30="line30" :classID='"stockview" + "1"' /></el-tab-pane>
            <!-- <el-tab-pane label="五日" name="second" lazy="false">
                <FiveDayMineChart :stockCode="code" :line15="line15" :line30="line30" :classID='"stockview" + "2"'/></el-tab-pane> -->
            <el-tab-pane label="日线" name="third" lazy="false">
                <DayLineChart :stockCode="code" :line15="line15" :line30="line30" :classID='"stockview" + "3"'/></el-tab-pane> 
        </el-tabs> 
    </div>
    
</template>

<script setup lang="ts" name="StockView">

import { ref } from 'vue'
import { TabsPaneContext } from 'element-plus'

const code = getQueryString('code') as string
const line15 = getQueryString('line15') as string
const line30 = getQueryString('line30') as string

function getQueryString(name:string){
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substring(1).match(reg)
  if(r!= null){
    return r[2]
  }
  return null
}

const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab)
  console.log(event)
}

</script>

<style>
.el-tabs__nav-wrap::after{
    position: static !important;
}

.el-tabs__active-bar{
    background-color: transparent !important;
}

.stock-tabs > .el-tabs__content{
    color: #6b778c;
    font-size: 16px;
    font-weight: 600;
}

.stock-tabs .el-tabs__item{
    padding: 0px;
    margin-right: 0px;
    margin-left: 15px;
    margin-top: 25px;
    width: 25px;
    height: 20px;
}

.el-tabs__header{
    margin: 0px;
}


</style>
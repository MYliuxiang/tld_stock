<template>
   <el-container>
    <el-header>
        <div class="div">
                <el-row type="flex" justify="space-evenly">
                    <el-col :span="5">
                        <el-row :gutter="12" justify="right">
                            <label class="contenr price">17.07</label>
                        </el-row>
                        <el-row :gutter="12" type="flex" justify="space-between">
                            <label class="contenr">0.45</label>
                            <label class="contenr">10.00%</label>
                        </el-row>
                    </el-col>
                    <el-col :span="5">
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">高</label>
                            <label class="contenr">17.07</label>
                        </el-row>
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">低</label>
                            <label class="contenr">17.07</label>
                        </el-row>
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">开</label>
                            <label class="contenr">17.07</label>
                        </el-row>
                    </el-col>
                    <el-col :span="5">
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">换手</label>
                            <label class="contenr">17.07</label>
                        </el-row>
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">市值</label>
                            <label class="contenr">17.07</label>
                        </el-row>
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">流通</label>
                            <label class="contenr">17.07</label>
                        </el-row>
                    </el-col>
                    <el-col :span="5">
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">振幅</label>
                            <label class="contenr">振幅</label>
                        </el-row>
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">金额</label>
                            <label class="contenr">振幅</label>
                        </el-row>
                        <el-row :gutter="8" justify="space-between">
                            <label class="grad">距离</label>
                            <label class="contenr">振幅</label>
                        </el-row>
                    </el-col> 
                </el-row>
            </div> 
    </el-header>
        
    <el_main> 
        <div> 
            <el-tabs v-model="activeName" class="stock-tabs" @tab-click="handleClick">
                <el-tab-pane label="分时" name="first" lazy="false">
                    <MineChart :stockCode="code" :line15="line15" :line30="line30" :classID='"stockview" + "1"' /></el-tab-pane>
                <!-- <el-tab-pane label="五日" name="second" lazy="false">
                    <FiveDayMineChart :stockCode="code" :line15="line15" :line30="line30" :classID='"stockview" + "2"'/></el-tab-pane> -->
                <el-tab-pane label="日线" name="third" lazy="false">
                    <DayLineChart :stockCode="code" :line15="line15" :line30="line30" :stockData="stockData"/></el-tab-pane> 
            </el-tabs> 
        </div>
    </el_main>
   </el-container>
</template>

<script setup lang="ts" name="StockView">

import { ref ,onBeforeMount, onUnmounted, reactive} from 'vue'
import { TabsPaneContext } from 'element-plus'
import { postAPI } from '@/service'

const intervalId = ref()

const code = getQueryString('code') as string
const line15 = getQueryString('line15') as string
const line30 = getQueryString('line30') as string

const stockData = reactive<any>({})

function getQueryString(name:string){
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substring(1).match(reg)
  if(r!= null){
    return r[2]
  }
  return null
}

onBeforeMount(async () => {
  if(code == null){
    return
  }
  // if(isCurrentTimeInRange()){
   
  // }

  intervalId.value = setInterval(() => {
    loadNewData()
  }, 5 * 1000)

})

onUnmounted(()=>{
  if(intervalId.value){
    clearInterval(intervalId.value)
  }
})



async function loadNewData(){

  const params = {code:code}
  const data:any = await postAPI('/sdata/narrow',params)
  stockData.value = data
  //   const day:string = data['day']
  //   let total_amount = data['real']['total_amount']
  //   const open_px = data['real']['open_px']
  //   let last_px = data['real']['last_px']
  //   const low_px = data['real']['low_px']
  //   const high_px = data['real']['high_px']
  //   count.value++

//   last_px = last_px + 0.2 * count.value++
//   total_amount = total_amount + 114226189 * count.value
//   const isRed = last_px >= open_px
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

.el-header{
    margin-right: 0px !important;
    margin-left: 0px !important;
    padding: 0 !important;

}


.el-row{
    padding: 0 !important;
    margin: 0 !important;
}

.div{
    margin-top: 10px;
}

.grad{
    color: #686868;
    font-size: 14px;
}

.contenr{
    color: #EA3323;
    font-weight: 600;
    font-size: 14px;
}
.price{
    font-weight: 600;
    font-size: 18px;
}



</style>
<template>
    <el-container>
     <el-header>
         <div class="div">
                 <el-row type="flex" justify="space-between">
                     <el-col :span="5">
                         <el-row :gutter="12">
                             <label class="contenr price" :style="{color:zdColor}">{{ last_px }}</label>
                         </el-row>
                         <el-row :gutter="12" type="flex" justify="space-between">
                             <label class="contenr" :style="{color:zdColor}">{{ px_change }}</label>
                             <label class="contenr" :style="{color:zdColor}">{{ pe_rate + '%' }}</label>
                         </el-row>
                     </el-col>
                     <el-col :span="4">
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad">高</label>
                             <label class="contenr" :style="{color:highColor}">{{ high_px }}</label>
                         </el-row>
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad">低</label>
                             <label class="contenr" :style="{color:lowColor}">{{low_px}}</label>
                         </el-row>
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad">开</label>
                             <label class="contenr" :style="{color:openColor}">{{ open_px }}</label>
                         </el-row>
                     </el-col>
                     <el-col :span="6">
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad">换手</label>
                             <label class="contenr blackFont">{{ turnover_ratio + "%" }}</label>
                         </el-row>
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad">市值</label>
                             <label class="contenr blackFont">{{market_value}}</label>
                         </el-row>
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad">流通</label>
                             <label class="contenr blackFont">{{circulation_value}}</label>
                         </el-row>
                     </el-col>
                     <el-col :span="6">
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad">量比</label>
                             <label class="contenr blackFont" >{{ vol_ratio }}</label>
                         </el-row>
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad ">金额</label>
                             <label class="contenr blackFont">{{total_turnover}}</label>
                         </el-row>
                         <el-row :gutter="8" justify="space-between">
                             <label class="grad">距离</label>
                             <label class="contenr" :style="{color:diffColor}">{{diff + 'cm'}}</label>
                         </el-row>
                     </el-col> 
                 </el-row>
             </div> 
     </el-header>
         
     <el-main style="display: flex; flex-direction: column;"> 
        <div style="flex: 1;">
            <el-tabs v-model="activeName" class="stock-tabs" @tab-click="handleClick">
                <el-tab-pane class="contentdetail" label="分时" name="first" lazy> 
                    <MineChart :stockCode="code" :line15="line15" :line30="line30" :color="color" :classID='"stockview" + "1"' />
                </el-tab-pane>
                <el-tab-pane class="contentdetail" label="五日" name="second" lazy>
                    <FiveDayMineChart  :stockCode="code" :line15="line15" :line30="line30" :color="color" :classID='"stockview" + "2"'/>
                </el-tab-pane>
                <el-tab-pane class="contentdetail" label="日线" name="third" lazy>
                    <DayLineChart :stockCode="code" :line15="line15" :line30="line30" :color="color" :stockData="stockData.value"/>
                </el-tab-pane> 
            </el-tabs> 
        </div>
        <el-space  wrap >
            <div v-for="(hot, index) in tags" :key="index">
                <el-tag text> {{ hot.name }} </el-tag>
            </div>
        </el-space>
     </el-main>
    </el-container>
 </template>
 
<script setup lang="ts" name="StockDetailView">
 
import { ref ,onBeforeMount, onUnmounted, reactive} from 'vue'
import { TabsPaneContext } from 'element-plus'
import { getAPI, postAPI } from '@/service'
import { grayColor, greenColor, redColor } from '@/color'
import { handFixed, handNumber } from '@/tools'
import { isCurrentTimeInRange } from '@/utils/timetool'
import { HotTag } from '@/type'
 
const intervalId = ref()
const code = getQueryString('code') as string
const line15 = getQueryString('line15') as string
const line30 = getQueryString('line30') as string
let color = getQueryString('color') as string
const stockData = reactive<any>({})
const zdColor = ref<string>('#323232')
const highColor = ref<string>('#323232')
const lowColor = ref<string>('#323232')
const openColor = ref<string>('#323232')
const diffColor = ref<string>('#323232')
const tags = ref<HotTag[]>([])
 
//最新价
const last_px = ref<string>('--')
//涨幅
const px_change = ref<string>('--')
//涨幅
const pe_rate = ref<string>('--')
//最高价
const high_px = ref<string>('--')
//最低价
const low_px = ref<string>('--')
//开盘价
const open_px = ref<string>('--')
//换手
const turnover_ratio = ref<string>('--')
//市值
const market_value = ref<string>('--')
//流通
const circulation_value = ref<string>('--')
//量比
const vol_ratio = ref<string>('--')
//金额
const total_turnover = ref<string>('--')
//diff
const diff = ref<string>('--')
 
function getQueryString(name:string){
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substring(1).match(reg)
  if(r!= null){
    return r[2]
  }
  return null
}

 
onBeforeMount(async () => {
 
  if (color == null){
    color = 'F09A37'
  }
  if(code == null){
    return
  }
  loadHots()
  loadNewData()
 
  if(isCurrentTimeInRange()){
    intervalId.value = setInterval(() => {
      loadNewData()
    }, 5 * 1000)
  }
   
 
})
 
onUnmounted(()=>{
  if(intervalId.value){
    clearInterval(intervalId.value)
  }
})

async function loadHots(){

  console.log('/kpl/getstockconcepts/'+ code)
  const data:any = await getAPI('/kpl/getstockconcepts/'+ code,{})
  const hots: string[] = data['kpl_concept'].split(',')
  const kpl_hot_concept = data['kpl_hot_concept'].split(',')
  for (let i = 0; i< hots.length;i++){
    let obj:{name:string,isHot:boolean}= {name:'',isHot:false}
    obj.name = hots[i]
    obj.isHot = kpl_hot_concept.includes(hots[i])
    tags.value.push(obj) 
  }

}
 
async function loadNewData(){
 
  const params = {code:code}
  const data:any = await postAPI('/sdata/narrow',params)
  // data['real']['last_px'] = data['real']['last_px'] + count.value * 0.02
  stockData.value = data
  const preclose_px = data['preclose_px']
  last_px.value = handFixed(data['real']['last_px'])
  console.log(data)
  px_change.value = data['real']['px_change']
  pe_rate.value = data['real']['px_change_rate']
  if(last_px.value > preclose_px){
    zdColor.value = redColor
  }else if(last_px.value == preclose_px){
    zdColor.value = grayColor
  }else{
    zdColor.value = greenColor
  }
 
  if(high_px.value > preclose_px){
    highColor.value = redColor
  }else if(high_px.value == preclose_px){
    highColor.value = grayColor
  }else{
    highColor.value = greenColor
  }
 
  if(low_px.value > preclose_px){
    lowColor.value = redColor
  }else if(low_px.value == preclose_px){
    lowColor.value = grayColor
  }else{
    lowColor.value = greenColor
  }
 
  if(open_px.value > preclose_px){
    openColor.value = redColor
  }else if(open_px.value == preclose_px){
    openColor.value = grayColor
  }else{
    openColor.value = greenColor
  }
  high_px.value = data['real']['high_px']
  low_px.value = data['real']['low_px']
  open_px.value = data['real']['open_px']
  turnover_ratio.value = data['real']['turnover_ratio']
  market_value.value = handNumber(data['real']['market_value']) 
  circulation_value.value = handNumber(data['real']['circulation_value'])
  vol_ratio.value = data['real']['vol_ratio']
  total_turnover.value = handNumber(data['real']['total_turnover'])
 
  //diff
  if(Number(line30) > 0){
    diff.value = ((parseFloat(last_px.value)  - parseFloat(line30)) / parseFloat(line30) * 100).toFixed(2)
  }
  if(parseFloat(last_px.value) > 0){
    diffColor.value = '#439629'
  }else if(parseFloat(last_px.value) ==0){
    diffColor.value = '#323232'
 
  }else{
    diffColor.value = '#EA392C'
 
  }
   
}
 
 
 
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab)
  // console.log(event)
}
 
</script>
 
 <style>

 .normal{
  background-color: #fff;
  color: #d81e06;
 }

 .normal{
  background-color: #fff;
  color: #1afa29;
 }


.tagContainer{
    padding-top: 10px;
    padding-bottom: 0px;
    display: flex;
    justify-content: space-between;
}
 
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
 
 .stock-tabs .el-tabs__item.is-active{
   color: #EA392C;
 }
 
 .stock-tabs .el-tabs__item:hover{
   color: #EA392C;
 }
 
 .stock-tabs .el-tabs__item{
     padding: 0px;
     margin-right: 15px;
     margin-left: 0px;
     margin-top: 0px;
     width: 30px;
     height: 40px;
 }
 
 .el-tabs__header{
     margin: 0px !important;
 }
 
 .el-header{
     margin-right: 0px !important;
     margin-left: 0px !important;
     padding: 0 !important;
     height: 80px !important;
 
 }
 
 .el-main{
   margin: 0px !important;
   padding: 0 !important;
 
 }
 
 .el-row{
     padding: 0 !important;
     margin: 0 !important;
 }
 
 .div{
   margin-top: 10px;
 }
 
 .contentdetail{
   height: 100%;
   width: 100%;
   /* height: calc(100vh - 120px) !important; */

 }

 .el-main{
    margin: 0px !important;
    padding: 0px !important;
    height: calc(100vh - 120px) !important;
 }

 .el-tabs{
    height: 100%;
 }
 
 .grad{
     color: #666666;
     font-size: 14px;
 }
 
 .contenr{
     color: #EA3323;
     font-weight: 600;
     font-size: 14px;
 }
 .price{
     font-weight: 600;
     font-size: 20px;
 }
 .blackFont{
     color: #323232;
 }
 
 
 </style>
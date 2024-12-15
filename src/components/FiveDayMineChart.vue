<template>
  <div class="stock-chart">
    <div class="stock-chart-box">
      <!-- 五日分时图 -->
      <v-chart ref="vchart" v-if="showCharts" :option="options" :update-options="{ notMerge: true }" />

      <div class="fix-date">
        <div v-for="(item, index) in xDates">{{ item.slice(5, 10) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick, onBeforeMount, onBeforeUnmount } from 'vue'
import 'echarts'
import VChart from 'vue-echarts'
// vchart组件的引用
const vchart = ref<any>(null)
// 昨日收盘价
let close = ref<number>(0)
// 现价数据
let prices = ref<number[]>([])
// 均价数据
let avgPrices = ref<number[]>([])
// 成交量
let volumes = ref<number[]>([])
// 涨跌幅
let ratios = ref<number[]>([])
// 涨跌额
let pcts = ref<number[]>([])
// 最高价
let limitUp = ref<number>(0)
// 最低价
let limitDown = ref<number>(0)
// 最高涨幅
let pctChangeUp = ref<number>(0)
// 最低跌幅
let pctChangeDown = ref<number>(0)

// 控制图表展示
let showCharts = ref<boolean>(false)

// 交易日期数据
let xDates = ref<string[]>([])
// 交易时间数据
let xTimes: string[] = initTime()

// 当前时间现价的闪烁点
let pricesEffectScatter = [] as any[]

// 图表配置项
let options = reactive({
  animation: false,
  grid: [
    {
      show: false,
      id: 'gd1',
      top: '7%',
      left: '5%',
      right: '5%',
      bottom: '40%'
    },
    {
      show: false,
      id: 'gd2',
      top: '7%',
      left: '5%',
      right: '5%',
      bottom: '40%'
    },
    {
      show: false,
      id: 'gd3',
      top: '60%',
      left: '5%',
      right: '5%',
      bottom: '7%'
    },
    {
      show: true,
      id: 'gd4',
      top: '7%',
      left: '5%',
      right: '5%',
      bottom: '7%',
      borderColor: '#2B2F39'
    }
  ],
  color: ['#FF3232', '#FFCE37'],
  blendMode: 'source-over',
  xAxis: [] as any[],
  yAxis: [] as any[],
  series: [] as any[]
})

function fomatFloat(src: any, pos = 2) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos)
}

const initChart = () => {
  limitUp.value = 12.05
  limitDown.value = 11.22
  close.value = 11.81
  let stockData: any = {}
  for (let key in stockData) {
    xDates.value.push(key)
    let length = 0
    stockData[key].forEach((item: any, index: any, array: any) => {
      length = index + 1
      prices.value.push(item[1])
      avgPrices.value.push(item[7])
      volumes.value.push(item[4])
      pcts.value.push(item[9])
      ratios.value.push(item[10])
    })
    if (length < 241) {
      length = 241 - length
      console.log(length)
    }
    let timeList = initTime()
    xTimes.push(...timeList)
  }

  // 闪烁点
  pricesEffectScatter = [
    {
      value: [prices.value.length, prices.value[prices.value.length - 1]],
      symbolSize: 5
    }
  ]

  // 现价图图表四角的数据
  // 最大差值：昨日收盘价 - 股票信息中的最高价 对比 昨日收盘价 - 股票信息中的最低价 取绝对值 ，两者哪个相差比较大就用哪个差值
  // 最高价：昨日收盘价 + 最大差值
  // 最低价：昨日收盘价 - 最大差值
  // 最高涨幅：((昨日收盘价 + 最大差值) - 1) * 100
  // 最低跌幅：-((昨日收盘价 + 最大差值) - 1) * 100
  let maxSplit = Math.abs(limitUp.value - close.value) > Math.abs(close.value - limitDown.value) ? Math.abs(limitUp.value - close.value) : Math.abs(close.value - limitDown.value)
  limitUp.value = fomatFloat(Number(close.value + maxSplit))
  limitDown.value = fomatFloat(Number(close.value - maxSplit))
  pctChangeUp.value = fomatFloat((limitUp.value / close.value - 1) * 100)
  pctChangeDown.value = pctChangeUp.value > 0 ? fomatFloat(0 - pctChangeUp.value) : fomatFloat(pctChangeUp.value)

  options['xAxis'] = [
    {
      //主图
      show: true,
      gridIndex: 0,
      min: 0,
      max: 1205,
      interval: 241,
      type: 'category',
      splitNumber: 4,
      data: xTimes,
      boundaryGap: true,
      axisLine: {
        lineStyle: {
          color: '#2B2F39'
        }
      },
      axisLabel: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisPointer: {
        fontSize: 10,
        label: {
          show: false
        }
      },
      splitLine: {
        show: true,
        interval: 240,
        lineStyle: {
          color: '#2B2F39',
          width: 1
        }
      }
    },
    {
      gridIndex: 1,
      show: false,
      min: 0,
      max: 1205,
      interval: 241,
      splitNumber: 20,
      data: xTimes,
      axisLabel: {
        show: false
      },
      axisPointer: {
        fontSize: 10,
        label: {
          show: false
        }
      },
      splitLine: {
        show: false
      }
    },
    {
      show: true,
      gridIndex: 2,
      min: 0,
      max: 1205,
      interval: 241,
      type: 'category',
      splitNumber: 240,
      axisLabel: {
        show: false,
        fontSize: 12,
        color: '#bcbcbc',
        interval: 240,
        padding: [0, 0, 0, 80]
      },
      data: xTimes,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisPointer: {
        show: true,
        label: {
          color: '#ffffff',
          backgroundColor: '#6E7079',
          fontSize: 10
        },
        lineStyle: {
          type: 'solid',
          width: 0.5
        }
      },
      splitLine: {
        show: true,
        interval: 240,
        lineStyle: {
          color: '2B2F39',
          width: 1
        }
      }
    },
    {
      show: false,
      gridIndex: 3,
      min: 0,
      max: 1205,
      type: 'category',
      interval: 240,
      axisLabel: {
        show: false,
        fontSize: 10,
        color: '#FC8952',
        interval: 240
      },
      splitLine: {
        show: false
      },
      data: xTimes,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisPointer: {
        show: true,
        label: {
          color: '#ffffff',
          backgroundColor: '#6E7079',
          fontSize: 10
        },
        lineStyle: {
          type: 'solid',
          width: 0.5
        }
      }
    }
  ]
  options['yAxis'] = [
    {
      show: true,
      scale: true,
      gridIndex: 0,
      boundaryGap: false,
      min: limitDown,
      max: limitUp,
      axisLabel: {
        show: false,
        inside: false,
        fontSize: 10,
        color: function (value: any) {
          if (value == close.value) {
            return '#CCCCCC'
          }
          return value > close.value ? '#F9293E' : '#00aa3b'
        }
      },
      z: 2,
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisPointer: {
        show: true,
        label: {
          color: '#ffffff',
          backgroundColor: '#6E7079',
          fontSize: 10,
          formatter: function ({ value }: any) {
            return value.toFixed(2)
          }
        },
        lineStyle: {
          type: 'solid',
          width: 0.5
        }
      }
    },
    {
      show: false,
      scale: true,
      gridIndex: 1,
      min: pctChangeDown.value,
      max: pctChangeUp.value,
      position: 'right',
      z: 3,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        inside: false,
        fontSize: 10,
        formatter: function (value: any) {
          return value + '%'
        }
      },
      splitLine: {
        //分割线设置
        show: false,
        lineStyle: {
          color: '#181a23',
          width: 1
        }
      },
      axisPointer: {
        show: true,
        label: {
          color: '#ffffff',
          backgroundColor: '#6E7079',
          fontSize: 10,
          formatter: function ({ value }: any) {
            return value.toFixed(2) + '%'
          }
        },
        lineStyle: {
          type: 'solid',
          width: 0.5
        }
      }
    },
    {
      show: false,
      gridIndex: 2,
      z: 4,
      scale: true,
      type: 'value',
      splitNumber: 1,
      axisTick: {
        show: false
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: '#FC8952',
          width: 1
        }
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#FC8952',
        fontSize: 10,
        formatter: function (value: any) {
          return fomatFloat(value / 10000, 0) + '万'
        }
      },
      axisPointer: {
        fontSize: 10,
        label: {
          formatter: function ({ value }: any) {
            return fomatFloat(value / 10000, 0) + '万'
          }
        },
        lineStyle: {
          type: 'solid',
          width: 0.5
        }
      }
    },
    {
      show: false,
      position: 'right',
      gridIndex: 3,
      z: 5,
      scale: true,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        fontSize: '12'
      },
      splitLine: {
        show: false
      }
    }
  ]
  options['series'] = [
    {
      name: '当前价',
      type: 'line',
      data: prices.value,
      smooth: true,
      symbol: 'none',
      gridIndex: 3,
      lineStyle: {
        opacity: 1,
        color: '#FF3232',
        width: 0.5
      },
      markPoint: {
        label: {
          color: '#ffffff',
          fontSize: 10,
          formatter: function ({ value }: any) {
            return fomatFloat(value, 2)
          }
        },
        data: [
          {
            type: 'max',
            symbolOffset: [0, -12] // 设置markpoint图标的位置
          },
          {
            type: 'min',
            symbolOffset: [0, 12] // 设置markpoint图标的位置
          }
        ],
        symbolSize: 0
      },
      markLine: {
        silent: true,
        symbol: 'none',
        label: {
          show: true,
          distance: [-40, 0]
        },
        lineStyle: {
          color: '#2B2F39',
          opacity: 1,
          type: 'dashed'
        },
        data: [
          {
            yAxis: close.value,
            lineStyle: {
              color: '#2b2f39'
            },
            label: {
              position: 'end',
              color: '#999999',
              fontWeight: 'bold',
              fontSize: 10,
              formatter: function () {
                return '0.00%'
              }
            }
          },
          {
            yAxis: close.value,
            lineStyle: {
              color: '#2b2f39'
            },
            label: {
              fontSize: 10,
              fontWeight: 'bold',
              color: '#999999',
              position: 'start',
              formatter: function (params: any) {
                return Number(params.value).toFixed(2)
              }
            }
          }
        ]
      },
      emphasis: {
        focus: 'none',
        scale: false,
        disabled: 'none',
        lineStyle: {
          width: 1
        }
      }
    },
    {
      type: 'line',
      data: ratios.value,
      smooth: true,
      symbol: 'none',
      gridIndex: 1,
      xAxisIndex: 1,
      yAxisIndex: 1,
      lineStyle: {
        width: 0
      }
    },
    {
      name: '成交量',
      type: 'bar',
      gridIndex: 2,
      xAxisIndex: 2,
      yAxisIndex: 2,
      data: volumes.value,
      barWidth: '50%',
      itemStyle: {
        color: function ({ dataIndex }: any) {
          if (prices.value[dataIndex] >= prices.value[dataIndex - 1]) {
            return '#F9293E'
          } else {
            return '#009900'
          }
        }
      }
    },
    {
      //坐标系
      type: 'bar',
      gridIndex: 3,
      xAxisIndex: 3,
      yAxisIndex: 3
    },
    {
      gridIndex: 0,
      // 设置涟漪特效动画
      type: 'effectScatter',
      // 有三种: cartesian2d(二维的直角坐标系) polar(极坐标系) geo(地理坐标系) ,此需求使用cartesian2d
      coordinateSystem: 'cartesian2d',
      // 单个闪烁点 ↓
      data: pricesEffectScatter, //2d坐标系--[x轴, y轴, 标记大小]
      // 何时显示特效:'render'-绘制完成后显示特效 'emphasis'-高亮（hover）的时候显示特效
      showEffectOn: 'render',
      // 涟漪特效配置
      rippleEffect: {
        // 波纹的绘制方式,可选'stroke'和'fill'
        brushType: 'stroke'
      },
      // hoverAnimation: true,
      itemStyle: {
        color: '#F9293E',
        shadowBlur: 5,
        shadowColor: '#F9293E'
      },
      zlevel: 9
    }
  ]
  nextTick(() => {
    showCharts.value = true
  })
}

const resizeTheChart = () => {
  if (vchart.value) {
    // vchart.value.resize && vchart.value.resize()
  }
}

onBeforeMount(() => {
  initChart()
  window.addEventListener('resize', resizeTheChart, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeTheChart)
})
</script>  
  <style scoped>
.stock-chart {
  width: 100vw;
  height: 100vh;
  background-color: #141923;
}
.stock-chart-box {
  position: relative;
  width: 100%;
  height: 6rem;
  z-index: 9;
}
.fix-date {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding-left: 0.32rem;
  padding-right: 0.32rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.fix-date > div {
  color: #b5b5b6;
  font-size: 0.24rem;
  flex: 0 1 20%;
  text-align: center;
  line-height: 1;
}
</style>
      




  
<script setup lang="ts" name="FiveDayMineChart">
import { init, dispose, Chart, KLineData } from 'klinecharts'
// import Layout from "./Layout.vue";
import { onMounted, onUnmounted } from 'vue'
import { postAPI } from '@/service'
  
const{stockCode,line15,line30,classID} = defineProps<{stockCode:string,
    line15:string,
    line30:string,
    classID:string }>()
  
const stockdata:KLineData[] = []
let chart:Chart 
  
onMounted(async()=> { 
     
  chart = init(classID) as Chart
  chart.setLocale('zh-CN')
  chart.setTimezone('Asia/Shanghai')
  chart.createOverlay({
    name:'simpleTag',
    extendData:line15,
    points:[{
      value:parseFloat(line15)
    }]
  })
  // const value1:number = 22.45
  // console.log(type(value1))
  
  chart.createOverlay({
    name:'simpleTag',
    extendData:line30,
    points:[{
      value:parseFloat(line30)
    }]
  })

  chart.setStyles({ candle: { type: 'area' }})
  chart.setBarSpace(1)

  //不允许滑动
  // chart.setScrollEnabled(false)
  
  //设置技术指标
  chart.createIndicator('MA', false, { id: 'candle_pane' })
  chart.createIndicator('VOL', false, { id: 'fefwewf' })
  
  const data = await loadData() as unknown as KLineData[]
  stockdata.unshift(...data)
  chart.applyNewData(stockdata)
  
  // chart.setLoadDataCallback(async(params: LoadDataParams)=>{
  //   if(params.type == 'forward'){
  //     console.log('向前更新')
  //     let data = await loadData(currentIndex) as unknown as KLineData[]
  //     stockdata.unshift(...data)
  //     chart.applyNewData(stockdata, true)
  //   }else if(params.type == 'init'){
  //     console.log('初始化更新')
  //   }else{
  //     console.log('实时更新')
  //     let data = await loadData(currentIndex) as unknown as KLineData[]
  //     stockdata.unshift(...data)
  //     // params.callback(stockdata)
  //     // chart.applyNewData(stockdata, true)
  //   }
  
  // })
   
  
})
  
async function loadData(){
  
  const params = {code:stockCode}
  const res = await postAPI('/sdata/getStockTrend5Min',params)
  return res
  
}
  
onUnmounted(()=>{
  dispose('chart-type-k-line')
})
  
  
</script>
  
  
  <style>
  .k-line-chart-container {
    display: flex;
    flex-direction: column;
    margin: 15px;
    width: 100vw;
    height: 112vw;
    padding: 30px;
    padding: 0px 20px 0px 0px;
    border-width: 1;
    border-color: rebeccapurple;
  }
  
  
  .k-line-chart {
    display: flex;
    flex: 1;
  }
  .k-line-chart-menu-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    color: #606060;
  }
  .k-line-chart-menu-container button {
    cursor: pointer;
    background-color: #1677ff;
    border-radius: 2px;
    margin-right: 8px;
    height: 24px;
    line-height: 26px;
    padding: 0 6px;
    font-size: 12px;
    color: #fff;
    border: none;
    outline: none;
  }
  </style>
  
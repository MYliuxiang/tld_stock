<template>
  <div class="stock-chart">
    <div class="stock-chart-box" @touchstart="start($event)" @touchend="end">
      <!-- K线图 -->
      <v-chart ref="vchart" v-if="showCharts" :option="options" :update-options="{ notMerge: true }" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount, nextTick, defineProps } from 'vue'
import 'echarts'
import VChart from 'vue-echarts'
import { postAPI } from '@/service'

const {stockCode, line15, line30} = defineProps<{stockCode:string,line15:string, line30:string}>()

// vchart组件的引用
const vchart: any = ref(null)
// 控制图表展示
let showCharts = ref<boolean>(false)
let timer = ref(null)
// MA均线
let ma5 = ref<number[]>([])
let ma10 = ref<number[]>([])
let ma20 = ref<number[]>([])
let ma30 = ref<number[]>([])
// MACD
let dif = ref<number[]>([])
let dea = ref<number[]>([])
let macd = ref<any[]>([])

// 控制图表缩放和数据滚动
let isOffset = ref<boolean>(false)
let startValue = ref<number>(60)
let endValue = ref<number>(100)

// 当前数据长度，K线和牛熊先知的数据长度保持一致
let currentDateLength = ref<number>(0)

// 交易日期数据
let xDates = ref<string[]>([])

// k线数据
let yDatas = ref<any[]>([])

// 成交量
let showVolumes = ref<any[]>([])

// 图表配置项
let options = reactive({
  animation: false, //禁止动画效果
  grid: [
    {
      show: true, //显示坐标系的边框
      id: 'gd1',
      top: '1%',
      left: '2%',
      right: '2%',
      bottom: '40%'
    },
    {
      show: true, //显示坐标系的边框
      id: 'gd2',
      top: '61%',
      left: '2%',
      right: '2%',
      bottom: '20%'
    },
    {
      show: true, //显示坐标系的边框
      id: 'gd3',
      top: '81%',
      left: '2%',
      right: '2%',
      bottom: '3%'
    },
  ],
  tooltip: {
    show: true,
    trigger: 'none',
    axisPointer: {
      type: 'cross',
      animation: false,
      snap: true,
      z: 999,
      crossStyle: {
        type: 'solid',
        width: 0.5
      },
      lineStyle: {
        type: 'solid',
        width: 0.5
      },
      fontSize: 10,
      label: {
        color: '#ffffff',
        backgroundColor: '#6E7079',
        // precision: 2,
        // padding: [5, 10, 5, 7],
        formatter: function (val: any) {
          if ((val.axisIndex == 0 || val.axisIndex == 1) && val.axisDimension == 'x') {
            return ''
          } else if (val.axisDimension == 'y') {
            return fomatFloat(val.value)
          } else {
            let ri = val.value
            return ri
          }
        }
      }
    }
  },
  axisPointer: { link: [{ xAxisIndex: 'all' }] },
  // 调色盘
  color: ['#B9291E', '#009900'],
  xAxis: [] as any[],
  yAxis: [] as any[],
  dataZoom: [] as any[],
  visualMap: [],
  series: [] as any[]
})
function fomatFloat(src: any, pos = 2) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos)
}
/**
 * MA均线(传统分析)
 */
function calculateMA() {
  ma5.value = []
  ma10.value = []
  ma20.value = []
  ma30.value = []
  let ma5close = 0.0
  let ma10close = 0.0
  let ma20close = 0.0
  let ma30close = 0.0
  yDatas.value.forEach((item: any, index: any) => {
    let close = fomatFloat(item.value[1])
    ma5close += close
    ma10close += close
    ma20close += close
    ma30close += close
    if (index >= 5) {
      ma5close = ma5close - fomatFloat(yDatas.value[index - 5].value[1])
      ma5.value.push(ma5close / 5)
    } else {
      ma5.value.push(ma5close / (index + 1))
    }
    if (index >= 10) {
      ma10close = ma10close - fomatFloat(yDatas.value[index - 10].value[1])
      ma10.value.push(ma10close / 10)
    } else {
      ma10.value.push(ma10close / (index + 1))
    }
    if (index >= 20) {
      ma20close = ma20close - fomatFloat(yDatas.value[index - 20].value[1])
      ma20.value.push(ma20close / 20)
    } else {
      ma20.value.push(ma20close / (index + 1))
    }
    if (index >= 30) {
      ma30close = ma30close - fomatFloat(yDatas.value[index - 30].value[1])
      ma30.value.push(ma30close / 30)
    } else {
      ma30.value.push(ma30close / (index + 1))
    }
  })

  options.series.push(
    {
      type: 'line',
      data: ma5.value,
      smooth: true,
      symbol: 'none',
      gridIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 0,
      z: 5,
      lineStyle: {
        opacity: 1,
        color: '#AFAFAF',
        width: 1
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
      data: ma10.value,
      smooth: true,
      symbol: 'none',
      gridIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 0,
      z: 5,
      lineStyle: {
        opacity: 1,
        color: '#9B37F6',
        width: 1
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
      data: ma20.value,
      smooth: true,
      symbol: 'none',
      gridIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 0,
      z: 5,
      lineStyle: {
        opacity: 1,
        color: '#F3B846',
        width: 1
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
      data: ma30.value,
      smooth: true,
      symbol: 'none',
      gridIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 0,
      z: 5,
      lineStyle: {
        opacity: 1,
        color: '#94C9B2',
        width: 1
      },
      emphasis: {
        focus: 'none',
        scale: false,
        disabled: 'none',
        lineStyle: {
          width: 1
        }
      }
    }
  )
}
/**
 * MACD(传统分析)
 */
function calculateMACD() {
  let ema12 = 0
  let ema26 = 0
  let difVal = 0
  let deaVal = 0
  let macdVal = 0
  yDatas.value.forEach((item: any, index: any,) => {
    let close = fomatFloat(item.value[1])
    if (index == 0) {
      ema12 = close
      ema26 = close
    } else {
      //  EMA（12） = 前一日EMA（12） X 11/13 + 今日收盘价 X 2/13
      //  EMA（26） = 前一日EMA（26） X 25/27 + 今日收盘价 X 2/27
      ema12 = (ema12 * 11) / 13 + (close * 2) / 13
      ema26 = (ema26 * 25) / 27 + (close * 2) / 27
    }
    //  DIF = EMA（12） - EMA（26） 。
    //  今日DEA = （前一日DEA X 8/10 + 今日DIF X 2/10）
    //  用（DIF-DEA）*2即为MACD柱状图。
    difVal = ema12 - ema26
    deaVal = (deaVal * 8) / 10 + (difVal * 2) / 10
    macdVal = (difVal - deaVal) * 2
    dif.value[index] = difVal
    dea.value[index] = deaVal
    macd.value[index] = {
      value: macdVal,
      itemStyle: {
        color: macdVal >= 0 ? '#B9291E' : '#2B6619',
        borderColor: macdVal >= 0 ? '#B9291E' : '#2B6619'
      }
    }
  })
  // value: stockData[i][4],
  // itemStyle: {
  //   color: stockData[i][1] >= stockData[i][0] ? '#B9291E' : '#009900',
  //   borderColor: stockData[i][1] >= stockData[i][0] ? '#B9291E' : '#009900'
  // }
  options.series.push(
    {
      gridIndex: 1,
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'bar',
      data: macd.value,
      barWidth: '60%',
      smooth: true,
      large: true, //大数据优化
      largeThreshold: 200 //优化阈值
    },
    {
      type: 'line',
      data: dif.value,
      smooth: true,
      symbol: 'none',
      gridIndex: 1,
      xAxisIndex: 1,
      yAxisIndex: 1,
      z: 5,
      lineStyle: {
        opacity: 1,
        color: '#A1A1A1',
        width: 1
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
      data: dea.value,
      smooth: true,
      symbol: 'none',
      gridIndex: 1,
      xAxisIndex: 1,
      yAxisIndex: 1,
      z: 5,
      lineStyle: {
        opacity: 1,
        color: '#18179B',
        width: 1
      },
      emphasis: {
        focus: 'none',
        scale: false,
        disabled: 'none',
        lineStyle: {
          width: 1
        }
      }
    }
  )
}
/**
 * 初始化图表
 */
function initChart(data:any) {
  const xs = data['x']
  const ys = data['y']
  const bals = data['bal']
  // const tunrnovers = data['turnover']
 
  // 年K只显示全部图表
  // （dataZoom显示的视图范围，数据多则从50% - 100%，数据少则从0% - 100%）
  startValue.value = 60
  if (xs.length <= 50) {
    startValue.value = 60
  }
  for (let i = 0; i < xs.length; i++) {
    
    if (i == xs.length - 1) {
      if (ys[i][0] == 0 || ys[i][1] == 0 || ys[i][2] == 0 || ys[i][3] == 0) {
        continue
      }
    }
    let forYData = []
    forYData.push(ys[i][0], ys[i][1], ys[i][3], ys[i][2])
    /* 如果功能指标类型不等于2，成交量push-- */
    // if (state.features !== 2) {
    showVolumes.value[i] = {
      value: bals[i],
      itemStyle: {
        color: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
        borderColor: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619'
      }
    }
    // }
    yDatas.value[i] = {
      value: forYData,
      itemStyle: {
        color: ys[i][1] >= ys[i][0] ? '#ffffff' : '#2B6619',
        color0: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
        borderColor: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
        borderColor0: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619'
      }
    }
    xDates.value[i] = xs[i]
  }
  // 当前数据长度
  currentDateLength.value = xDates.value.length

  options['xAxis'] = [
    {
      type: 'category',
      name: '',
      min: 0,
      max: currentDateLength.value,
      interval: currentDateLength.value,
      gridIndex: 0,
      data: xDates.value,
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        fontSize: 10,
        color: '#CCCCCC'
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#CCCCCC'
        }
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
      // 主图
      type: 'category',
      name: '',
      min: 0,
      max: currentDateLength.value,
      interval: currentDateLength.value,
      gridIndex: 1,
      data: xDates.value,
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        fontSize: 10,
        color: '#CCCCCC'
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#CCCCCC'
        }
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
      type: 'category',
      name: '',
      gridIndex: 2,
      min: 0,
      max: currentDateLength.value,
      // interval: currentDateLength.value,
      data: xDates.value,
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        fontSize: 10,
        color: '#bcbcbc',
        formatter: function (value: any) {
          return value
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#CCCCCC'
        }
      },
      axisPointer: {
        label: {
          show: true,
          fontSize: 10
        }
      },
      splitLine: {
        show: false
      }
    },
  ]

  options['yAxis'] = [
    {
      gridIndex: 0,
      show: true,
      scale: true,
      z: 5,
      splitNumber: 3,
      // interval: yDatas.value[0]?.value[0] || yDatas.value[0][0],
      axisLabel: {
        fontSize: 8,
        color: '#CCCCCC',
        show:true,
        inside:true,
        margin:2
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#CCCCCC'
        }
      },
      axisPointer: {
        snap: true,
        label: {
          show: true,
          fontSize: 10
        }
      },
      splitLine: {
        show: true
      }
    },
    {
      show: true,
      gridIndex: 1,
      scale: true,
      boundaryGap: ['10%', '10%'],
      z: 5,
      // min:0,
      splitNumber: 1,
      // axisLabel: {
      //   fontSize: 10,
      //   color: '#CCCCCC',
      //   show:true
      // },
      // axisLine: {
      //   show: false,
      //   lineStyle: {
      //     color: '#CCCCCC'
      //   }
      // },
      // axisPointer: {
      //   label: {
      //     show: true,
      //     fontSize: 10
      //   }
      // },
      // splitLine: {
      //   show: true
      // }
    },
    {
      show: true,
      gridIndex: 2,
      scale: true,
      z: 4,
      splitNumber: 0,
      axisLabel: {
        fontSize: 10,
        color: '#CCCCCC',
        show:false
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#CCCCCC'
        }
      },
      axisPointer: {
        snap: true,
        label: {
          show: true,
          fontSize: 10,
          formatter: function (params: any) {
            return fomatFloat(params.value)
          }
        }
      },
      splitLine: {
        show: false
      }
    },
    
  ]

  options['dataZoom'] = [
    {
      show: true,
      type: 'inside',
      xAxisIndex: [0, 1, 2, 3],
      start: startValue.value,
      end: endValue.value,
      filterMode: 'filter',
      moveOnMouseMove: !isOffset.value
    },
    {
      show: false,
      xAxisIndex: [0, 1, 2, 3],
      type: 'slider',
      bottom: '0%',
      start: startValue.value,
      end: endValue.value,
      height: 0,
      handleSize: 0,
      moveHandleSize: 0,
      filterMode: 'filter'
    }
  ]

  options['series'] = [
    {
      gridIndex: 0,
      xAxisIndex: 0,
      yAxisIndex: 0,
      type: 'candlestick',
      data: yDatas.value,
      barWidth: '60%',
      large: true, //大数据优化
      largeThreshold: 200, //优化阈值
      smooth: true,
      markPoint: {
        show:true,
        label: {
          color: '#cccccc',
          fontSize: 10,
          // formatter: function (param: any) {
          //   return param != null ? Math.round(param.value) + '' : ''
          // }
        },
        symbol: 'roundRect',
        symbolSize: [30,10],
        silent:true,
        data: [
          {
            name: 'highest value',
            type: 'max',
            valueDim: 'highest',
            // 设置markpoint图标的位置
            symbolOffset: [0, -6]
          },
          {
            name: 'lowest value',
            type: 'min',
            valueDim: 'lowest',
            // 设置markpoint图标的位置
            symbolOffset: [0, 6]
          }
        ]
      },
      itemStyle: {
        color: '#ffffff',
        color0: '#ffffff',
        borderColor: '#ffffff',
        borderColor0: '#ffffff'
      }, 
      markLine: {
        silent: true,
        symbol: 'none',
        label: {
          show: true,
          distance: [-30, 0]
        },
        lineStyle: {
          color: '#F09A37',
          opacity: 1,
          type: 'inherit'
        },
        data: [
          {
            yAxis: line15,
            lineStyle: {
              color: '#F09A37',
              width:1
            },
            label: {
              position: 'end',
              color: '#F09A37',
              fontSize: 10,
              formatter: function (params: any) {
                return fomatFloat(params.value, 2)
              }
            }
          },
          {
            yAxis: line30,
            lineStyle: {
              color: '#F09A37',
              width:1

            },
            label: {
              fontSize: 10,
              color: '#F09A37',
              position: 'end',
              formatter: function (params: any) {
                return fomatFloat(params.value, 2)
              }
            }
          }
        ]
      },
    
    },
    
    {
      gridIndex: 2,
      xAxisIndex: 2,
      yAxisIndex: 2,
      type: 'bar',
      data: showVolumes.value,
      barWidth: '60%',
      smooth: true,
      large: true, //大数据优化
      largeThreshold: 200 //优化阈值
    }
  ]

  // options.series.push(
  //   {
  //     type: 'line',
  //     data: line15,
  //     smooth: true,
  //     symbol: 'none',
  //     gridIndex: 0,
  //     xAxisIndex: 0,
  //     yAxisIndex: 0,
  //     z: 10,
  //     lineStyle: {
  //       opacity: 1,
  //       color: '#AFAFAF',
  //       width: 5
  //     },
  //     emphasis: {
  //       focus: 'none',
  //       scale: false,
  //       disabled: 'none',
  //       lineStyle: {
  //         width: 1
  //       }
  //     }
  //   }
  // )

  calculateMA()
  calculateMACD()
  nextTick(() => {
    showCharts.value = true
  })
}

function start(event: any) {
  // console.log('长按事件',event)
  if (timer.value) {
    clearTimeout(timer.value)
  }
  (timer.value as any) = setTimeout(() => {
    startValue.value = vchart.value.getOption().dataZoom[0].start
    endValue.value = vchart.value.getOption().dataZoom[0].end
    options.dataZoom[0].start = startValue.value
    options.dataZoom[1].start = startValue.value
    options.dataZoom[0].end = endValue.value
    options.dataZoom[1].end = endValue.value
    vchart.value.setOption(options)
    event.preventDefault()
    isOffset.value = true
    options.tooltip.show = isOffset.value
    // options.dataZoom['moveOnMouseMove'] = !isOffset.value
  }, 800)
}
function end() {
  if (timer.value) {
    clearTimeout(timer.value)
  }
  if (isOffset.value) {
    isOffset.value = false
    options.tooltip.show = isOffset.value
    // options.dataZoom['moveOnMouseMove'] = !isOffset.value
  }

}

async function loadData(index:number){
  console.log(stockCode)
  console.log(line15)
  console.log(line30)

  const params = {code:stockCode,index:index}
  const data = await postAPI('/sdata/kplStockLineData',params)
  return data

}
onBeforeMount(async () => {
  loadData(0).then(data=>{
    initChart(data)
  }) 
})

</script>
<style scoped>
.stock-chart {
  width: 100%;
  height: 80vh;
  background-color: #FFFFFF;
}
.stock-chart-box {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 9;
}
</style>


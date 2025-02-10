import { ref, reactive, onBeforeMount, nextTick, defineProps, onUnmounted, watch } from 'vue';
import 'echarts';
import VChart from 'vue-echarts';
import { postAPI } from '@/service';
const { defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const __VLS_props = defineProps();
const { stockCode, line15, line30, stockData, color } = __VLS_props;
const intervalId = ref();
// const childData = toRef(newData)
// vchart组件的引用
const vchart = ref(null);
const maxValue = 60;
const minValue = 20;
let haveMore = true;
let index = 0;
let isloading = false;
// 控制图表展示
let showCharts = ref(false);
let timer = ref(null);
// MA均线
let ma5 = ref([]);
let ma10 = ref([]);
let ma20 = ref([]);
let ma30 = ref([]);
// MACD
let dif = ref([]);
let dea = ref([]);
let macd = ref([]);
// 控制图表缩放和数据滚动
let isOffset = ref(false);
let startValue = 60;
let endValue = 100;
// 当前数据长度，K线和牛熊先知的数据长度保持一致
let currentDateLength = ref(0);
// 交易日期数据
let xDates = ref([]);
// k线数据
let yDatas = ref([]);
// 成交量
let showVolumes = ref([]);
// 图表配置项
let options = reactive({
    top: 0,
    legend: {
        symbol: 'none',
        // data: ['日K','MA5', 'MA10', 'MA20', 'MA30'],
        itemStyle: {
            borderWidth: 0,
            color: 'red',
            borderType: 'solid',
            opacity: 0,
        },
        lineStyle: {
            type: 'solid',
        },
        textStyle: {
            color: '#323232',
            fontSize: 10
        }
    },
    animation: false, //禁止动画效果
    grid: [
        {
            show: true, //显示坐标系的边框
            id: 'gd1',
            top: '3%',
            left: '0.1%',
            right: '0.1%',
            bottom: '38%'
        },
        {
            show: true, //显示坐标系的边框
            id: 'gd2',
            top: '63%',
            left: '0.1%',
            right: '0.1%',
            bottom: '20%'
        },
        {
            show: true, //显示坐标系的边框
            id: 'gd3',
            top: '81%',
            left: '0.1%',
            right: '0.1%',
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
                formatter: function (val) {
                    if ((val.axisIndex == 0 || val.axisIndex == 1) && val.axisDimension == 'x') {
                        return '';
                    }
                    else if (val.axisDimension == 'y') {
                        return fomatFloat(val.value);
                    }
                    else {
                        let ri = val.value;
                        return ri;
                    }
                }
            }
        }
    },
    axisPointer: { link: [{ xAxisIndex: 'all' }] },
    // 调色盘
    color: ['#AFAFAF', '#9B37F6', '#F3B846', '#94C9B2'],
    xAxis: [],
    yAxis: [],
    dataZoom: [],
    visualMap: [],
    series: []
});
function fomatFloat(src, pos = 2) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}
/**
 * MA均线(传统分析)
 */
function calculateMA() {
    ma5.value = [];
    ma10.value = [];
    ma20.value = [];
    ma30.value = [];
    let ma5close = 0.0;
    let ma10close = 0.0;
    let ma20close = 0.0;
    let ma30close = 0.0;
    yDatas.value.forEach((item, index) => {
        let close = fomatFloat(item.value[1]);
        ma5close += close;
        ma10close += close;
        ma20close += close;
        ma30close += close;
        if (index >= 5) {
            ma5close = ma5close - fomatFloat(yDatas.value[index - 5].value[1]);
            ma5.value.push(ma5close / 5);
        }
        else {
            ma5.value.push(ma5close / (index + 1));
        }
        if (index >= 10) {
            ma10close = ma10close - fomatFloat(yDatas.value[index - 10].value[1]);
            ma10.value.push(ma10close / 10);
        }
        else {
            ma10.value.push(ma10close / (index + 1));
        }
        if (index >= 20) {
            ma20close = ma20close - fomatFloat(yDatas.value[index - 20].value[1]);
            ma20.value.push(ma20close / 20);
        }
        else {
            ma20.value.push(ma20close / (index + 1));
        }
        if (index >= 30) {
            ma30close = ma30close - fomatFloat(yDatas.value[index - 30].value[1]);
            ma30.value.push(ma30close / 30);
        }
        else {
            ma30.value.push(ma30close / (index + 1));
        }
    });
}
/**
 * MACD(传统分析)
 */
function calculateMACD() {
    let ema12 = 0;
    let ema26 = 0;
    let difVal = 0;
    let deaVal = 0;
    let macdVal = 0;
    yDatas.value.forEach((item, index) => {
        let close = fomatFloat(item.value[1]);
        if (index == 0) {
            ema12 = close;
            ema26 = close;
        }
        else {
            //  EMA（12） = 前一日EMA（12） X 11/13 + 今日收盘价 X 2/13
            //  EMA（26） = 前一日EMA（26） X 25/27 + 今日收盘价 X 2/27
            ema12 = (ema12 * 11) / 13 + (close * 2) / 13;
            ema26 = (ema26 * 25) / 27 + (close * 2) / 27;
        }
        //  DIF = EMA（12） - EMA（26） 。
        //  今日DEA = （前一日DEA X 8/10 + 今日DIF X 2/10）
        //  用（DIF-DEA）*2即为MACD柱状图。
        difVal = ema12 - ema26;
        deaVal = (deaVal * 8) / 10 + (difVal * 2) / 10;
        macdVal = (difVal - deaVal) * 2;
        dif.value[index] = difVal;
        dea.value[index] = deaVal;
        macd.value[index] = {
            value: macdVal,
            itemStyle: {
                color: macdVal >= 0 ? '#B9291E' : '#2B6619',
                borderColor: macdVal >= 0 ? '#B9291E' : '#2B6619'
            }
        };
    });
    // value: stockData[i][4],
    // itemStyle: {
    //   color: stockData[i][1] >= stockData[i][0] ? '#B9291E' : '#009900',
    //   borderColor: stockData[i][1] >= stockData[i][0] ? '#B9291E' : '#009900'
    // }
}
/**
 * 初始化图表
 */
function initChart(data) {
    const xs = data['x'];
    const ys = data['y'];
    const bals = data['bal'];
    // const tunrnovers = data['turnover']
    // 年K只显示全部图表
    // （dataZoom显示的视图范围，数据多则从50% - 100%，数据少则从0% - 100%）
    startValue = 60;
    if (xs.length <= 50) {
        startValue = 0;
        endValue = xs.length / 100 * 50;
    }
    for (let i = 0; i < xs.length; i++) {
        if (i == xs.length - 1) {
            if (ys[i][0] == 0 || ys[i][1] == 0 || ys[i][2] == 0 || ys[i][3] == 0) {
                continue;
            }
        }
        let forYData = [];
        forYData.push(ys[i][0], ys[i][1], ys[i][3], ys[i][2]);
        /* 如果功能指标类型不等于2，成交量push-- */
        // if (state.features !== 2) {
        showVolumes.value[i] = {
            value: bals[i],
            itemStyle: {
                color: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
                borderColor: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619'
            }
        };
        // }
        yDatas.value[i] = {
            value: forYData,
            itemStyle: {
                color: ys[i][1] >= ys[i][0] ? '#ffffff' : '#2B6619',
                color0: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
                borderColor: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
                borderColor0: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619'
            }
        };
        xDates.value[i] = xs[i];
    }
    // 当前数据长度
    currentDateLength.value = xDates.value.length;
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
                formatter: function (value) {
                    return value;
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
    ];
    options['yAxis'] = [
        {
            gridIndex: 0,
            show: true,
            scale: true,
            z: 5,
            splitNumber: 3,
            // interval: yDatas.value[0]?.value[0] || yDatas.value[0][0],
            axisLabel: {
                fontSize: 10,
                color: '#CCCCCC',
                show: true,
                inside: true,
                margin: 5
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
            // boundaryGap: ['10%', '10%'],
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
                show: false
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
                    formatter: function (params) {
                        return fomatFloat(params.value);
                    }
                }
            },
            splitLine: {
                show: false
            }
        },
    ];
    options['dataZoom'] = [
        {
            show: true,
            type: 'inside',
            xAxisIndex: [0, 1, 2, 3],
            start: startValue,
            end: endValue,
            filterMode: 'filter',
            minSpan: minValue / (currentDateLength.value / 100),
            maxSpan: maxValue / (currentDateLength.value / 100),
            moveOnMouseMove: !isOffset.value
        },
        {
            show: false,
            xAxisIndex: [0, 1, 2, 3],
            type: 'slider',
            // bottom: '0%',
            minspan: minValue / (currentDateLength.value / 100),
            maxSpan: maxValue / (currentDateLength.value / 100),
            start: startValue,
            end: endValue,
            // height: 0,
            // handleSize: 0,
            // moveHandleSize: 0,
            filterMode: 'filter'
        }
    ];
    let markLineData = [];
    console.log(line15);
    if (Number(line15) > 0) {
        markLineData.push({
            yAxis: line15,
            lineStyle: {
                color: '#' + color,
                width: 1
            },
            label: {
                position: 'end',
                color: '#' + color,
                fontSize: 12,
                padding: [0, 0, 0, -10],
                formatter: function (params) {
                    return fomatFloat(params.value, 2);
                }
            }
        });
    }
    if (Number(line30) > 0) {
        markLineData.push({
            yAxis: line30,
            lineStyle: {
                color: '#' + color,
                width: 1
            },
            label: {
                fontSize: 12,
                color: '#' + color,
                position: 'end',
                padding: [0, 0, 0, -10],
                formatter: function (params) {
                    return fomatFloat(params.value, 2);
                }
            }
        });
    }
    const last_px = ys[currentDateLength.value - 1][0];
    markLineData.push({
        yAxis: last_px,
        lineStyle: {
            width: 1,
            color: '#E7D9C4',
            type: 'dashed'
        },
        label: {
            position: 'start',
            color: '#F09A37',
            fontSize: 10,
            formatter: function (params) {
                return fomatFloat(params.value, 2);
            }
        }
    });
    calculateMA();
    options['series'] = [
        {
            gridIndex: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            type: 'candlestick',
            data: yDatas,
            barWidth: '60%',
            large: true, //大数据优化
            largeThreshold: 200, //优化阈值
            smooth: true,
            markPoint: {
                show: true,
                label: {
                    color: '#cccccc',
                    fontSize: 10,
                    // formatter: function (param: any) {
                    //   return param != null ? Math.round(param.value) + '' : ''
                    // }
                },
                symbol: 'roundRect',
                symbolSize: [30, 10],
                silent: true,
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
                data: markLineData
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
        },
        {
            name: 'MA5',
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
                // color: '#AFAFAF',
                width: 1
            },
            // emphasis: {
            //   focus: 'none',
            //   scale: false,
            //   disabled: 'none',
            //   lineStyle: {
            //     width: 1
            //   }
            // }
        },
        {
            name: 'MA10',
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
                // color: '#9B37F6',
                width: 1
            },
            // emphasis: {
            //   focus: 'none',
            //   scale: false,
            //   disabled: 'none',
            //   lineStyle: {
            //     width: 1
            //   }
            // }
        },
        {
            name: 'MA20',
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
                // color: '#F3B846',
                width: 1
            },
            // emphasis: {
            //   focus: 'none',
            //   scale: false,
            //   disabled: 'none',
            //   lineStyle: {
            //     width: 1
            //   }
            // }
        },
        {
            name: 'MA30',
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
                // color: '#94C9B2',
                width: 1
            },
            // emphasis: {
            //   focus: 'none',
            //   scale: false,
            //   disabled: 'none',
            //   lineStyle: {
            //     width: 1
            //   }
            // }
        }
    ];
    calculateMACD();
    options.series.push({
        gridIndex: 1,
        xAxisIndex: 1,
        yAxisIndex: 1,
        type: 'bar',
        data: macd.value,
        barWidth: '60%',
        smooth: true,
        large: true, //大数据优化
        largeThreshold: 200 //优化阈值
    }, {
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
    }, {
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
    });
    nextTick(() => {
        showCharts.value = true;
    });
}
function start(event) {
    // console.log('长按事件',event)
    if (timer.value) {
        clearTimeout(timer.value);
    }
    timer.value = setTimeout(() => {
        startValue = vchart.value.getOption().dataZoom[0].start;
        endValue = vchart.value.getOption().dataZoom[0].end;
        options.dataZoom[0].start = startValue;
        options.dataZoom[1].start = startValue;
        options.dataZoom[0].end = endValue;
        options.dataZoom[1].end = endValue;
        vchart.value.setOption(options);
        event.preventDefault();
        isOffset.value = true;
        options.tooltip.show = isOffset.value;
        // options.dataZoom['moveOnMouseMove'] = !isOffset.value
    }, 800);
}
function end() {
    if (timer.value) {
        clearTimeout(timer.value);
    }
    if (isOffset.value) {
        isOffset.value = false;
        options.tooltip.show = isOffset.value;
        // options.dataZoom['moveOnMouseMove'] = !isOffset.value
    }
}
function moreChart(data) {
    const xs = data['x'];
    const ys = data['y'];
    const bals = data['bal'];
    if (xs.length < 240) {
        haveMore = false;
    }
    let mshowVolumes = [];
    let myDatas = [];
    // const tunrnovers = data['turnover']
    for (let i = 0; i < xs.length; i++) {
        if (i == xs.length - 1) {
            if (ys[i][0] == 0 || ys[i][1] == 0 || ys[i][2] == 0 || ys[i][3] == 0) {
                continue;
            }
        }
        let forYData = [];
        forYData.push(ys[i][0], ys[i][1], ys[i][3], ys[i][2]);
        /* 如果功能指标类型不等于2，成交量push-- */
        // if (state.features !== 2) {
        mshowVolumes[i] = {
            value: bals[i],
            itemStyle: {
                color: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
                borderColor: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619'
            }
        };
        // }
        myDatas[i] = {
            value: forYData,
            itemStyle: {
                color: ys[i][1] >= ys[i][0] ? '#ffffff' : '#2B6619',
                color0: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
                borderColor: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619',
                borderColor0: ys[i][1] >= ys[i][0] ? '#B9291E' : '#2B6619'
            }
        };
    }
    xDates.value.unshift(...xs);
    showVolumes.value.unshift(...mshowVolumes);
    yDatas.value.unshift(...myDatas);
    let startIndex = currentDateLength.value / 100 * startValue + xs.length;
    let endIndex = currentDateLength.value / 100 * endValue + xs.length;
    // 当前数据长度
    currentDateLength.value = xDates.value.length;
    calculateMA();
    calculateMACD();
    startValue = startIndex / (currentDateLength.value / 100);
    endValue = endIndex / (currentDateLength.value / 100);
    options.dataZoom[0] = {
        show: true,
        type: 'inside',
        xAxisIndex: [0, 1, 2, 3],
        start: startValue,
        end: endValue,
        minSpan: minValue / (currentDateLength.value / 100),
        maxSpan: maxValue / (currentDateLength.value / 100),
        filterMode: 'filter',
        moveOnMouseMove: !isOffset.value
    };
    options.dataZoom[1] = {
        show: false,
        xAxisIndex: [0, 1, 2, 3],
        type: 'slider',
        bottom: '0%',
        start: startValue,
        end: endValue,
        minSpan: minValue / (currentDateLength.value / 100),
        maxSpan: maxValue / (currentDateLength.value / 100),
        height: 0,
        handleSize: 0,
        moveHandleSize: 0,
        filterMode: 'filter'
    };
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
                formatter: function (value) {
                    return value;
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
    ];
    options['yAxis'] = [
        {
            gridIndex: 0,
            show: true,
            scale: true,
            z: 5,
            splitNumber: 3,
            // interval: yDatas.value[0]?.value[0] || yDatas.value[0][0],
            axisLabel: {
                fontSize: 10,
                color: '#CCCCCC',
                show: true,
                inside: true,
                margin: 5
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
            // boundaryGap: ['10%', '10%'],
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
                show: false
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
                    formatter: function (params) {
                        return fomatFloat(params.value);
                    }
                }
            },
            splitLine: {
                show: false
            }
        },
    ];
    let markLineData = [];
    if (Number(line15) > 0) {
        markLineData.push({
            yAxis: line15,
            lineStyle: {
                color: '#' + color,
                width: 1
            },
            label: {
                position: 'end',
                color: '#' + color,
                fontSize: 10,
                // padding:[0, 0, 0, 5],
                formatter: function (params) {
                    return fomatFloat(params.value, 2);
                }
            }
        });
    }
    if (Number(line30) > 0) {
        markLineData.push({
            yAxis: line30,
            lineStyle: {
                color: '#' + color,
                width: 1
            },
            label: {
                fontSize: 10,
                color: '#' + color,
                position: 'end',
                // padding:[0, 0, 0, 5],
                formatter: function (params) {
                    return fomatFloat(params.value, 2);
                }
            }
        });
    }
    const last_px = yDatas.value[currentDateLength.value - 1].value[0];
    markLineData.push({
        yAxis: last_px,
        lineStyle: {
            width: 1,
            color: '#E7D9C4',
            type: 'dashed'
        },
        label: {
            position: 'start',
            color: '#F09A37',
            fontSize: 10,
            formatter: function (params) {
                return fomatFloat(params.value, 2);
            }
        }
    });
    options['series'] = [
        {
            gridIndex: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            type: 'candlestick',
            data: yDatas,
            barWidth: '60%',
            large: true, //大数据优化
            largeThreshold: 200, //优化阈值
            smooth: true,
            markPoint: {
                show: true,
                label: {
                    color: '#cccccc',
                    fontSize: 10,
                    // formatter: function (param: any) {
                    //   return param != null ? Math.round(param.value) + '' : ''
                    // }
                },
                symbol: 'roundRect',
                symbolSize: [30, 10],
                silent: true,
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
                data: markLineData
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
    ];
    calculateMA();
    options.series.push({
        name: 'MA5',
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
            // color: '#AFAFAF',
            width: 1
        },
        // emphasis: {
        //   focus: 'none',
        //   scale: false,
        //   disabled: 'none',
        //   lineStyle: {
        //     width: 1
        //   }
        // }
    }, {
        name: 'MA10',
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
            // color: '#9B37F6',
            width: 1
        },
        // emphasis: {
        //   focus: 'none',
        //   scale: false,
        //   disabled: 'none',
        //   lineStyle: {
        //     width: 1
        //   }
        // }
    }, {
        name: 'MA20',
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
            // color: '#F3B846',
            width: 1
        },
        // emphasis: {
        //   focus: 'none',
        //   scale: false,
        //   disabled: 'none',
        //   lineStyle: {
        //     width: 1
        //   }
        // }
    }, {
        name: 'MA30',
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
            // color: '#94C9B2',
            width: 1
        },
        // emphasis: {
        //   focus: 'none',
        //   scale: false,
        //   disabled: 'none',
        //   lineStyle: {
        //     width: 1
        //   }
        // }
    });
    calculateMACD();
    options.series.push({
        gridIndex: 1,
        xAxisIndex: 1,
        yAxisIndex: 1,
        type: 'bar',
        data: macd.value,
        barWidth: '60%',
        smooth: true,
        large: true, //大数据优化
        largeThreshold: 200 //优化阈值
    }, {
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
    }, {
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
    });
    vchart.value.setOption(options);
}
function onDataZoom(event) {
    if (event.batch) {
        if (event.batch[0].start < 2) {
            // 当滑块靠近数据边缘时加载更多数据
            if (haveMore && isloading == false) {
                loadMoreData();
            }
        }
        // startValue = event.batch[0].start > 50 ? 50:event.batch[0].start
        startValue = event.batch[0].start;
        endValue = event.batch[0].end;
    }
    else {
        if (event.start < 2) {
            // 当滑块靠近数据边缘时加载更多数据
            if (haveMore && isloading == false) {
                loadMoreData();
            }
        }
        startValue = event.start > 50 ? 50 : event.batch[0].start;
        endValue = event.end;
    }
}
function handleNewData(newData) {
    const day = newData['day'];
    const open_px = newData['real']['open_px'];
    let total_amount = newData['real']['total_amount'];
    let last_px = newData['real']['last_px'];
    const low_px = newData['real']['low_px'];
    const high_px = newData['real']['high_px'];
    const isRed = last_px >= open_px;
    if (xDates.value[currentDateLength.value - 1] == day) {
        // 更新
        if (vchart.value) {
            showVolumes.value[currentDateLength.value - 1] = {
                value: total_amount,
                itemStyle: {
                    color: isRed ? '#B9291E' : '#2B6619',
                    borderColor: isRed ? '#B9291E' : '#2B6619'
                }
            };
            yDatas.value[currentDateLength.value - 1] = {
                value: [open_px, last_px, low_px, high_px],
                itemStyle: {
                    color: isRed ? '#ffffff' : '#2B6619',
                    color0: isRed ? '#B9291E' : '#2B6619',
                    borderColor: isRed ? '#B9291E' : '#2B6619',
                    borderColor0: isRed ? '#B9291E' : '#2B6619'
                }
            };
            calculateMA();
            //5
            options.series[2] = {
                name: 'MA5',
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
                    // color: '#AFAFAF',
                    width: 1
                },
                // emphasis: {
                //   focus: 'none',
                //   scale: false,
                //   disabled: 'none',
                //   lineStyle: {
                //     width: 1
                //   }
                // }
            };
            // 10
            options.series[3] = {
                name: 'MA10',
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
                    // color: '#9B37F6',
                    width: 1
                },
                // emphasis: {
                //   focus: 'none',
                //   scale: false,
                //   disabled: 'none',
                //   lineStyle: {
                //     width: 1
                //   }
                // }
            };
            // 20
            options.series[4] = {
                name: 'MA20',
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
                    // color: '#F3B846',
                    width: 1
                },
                // emphasis: {
                //   focus: 'none',
                //   scale: false,
                //   disabled: 'none',
                //   lineStyle: {
                //     width: 1
                //   }
                // }
            };
            // 30
            options.series[5] = {
                name: 'MA30',
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
                    // color: '#94C9B2',
                    width: 1
                },
                // emphasis: {
                //   focus: 'none',
                //   scale: false,
                //   disabled: 'none',
                //   lineStyle: {
                //     width: 1
                //   }
                // }
            };
            options.dataZoom[0] = {
                show: true,
                type: 'inside',
                xAxisIndex: [0, 1, 2, 3],
                start: startValue,
                end: endValue,
                minSpan: 5,
                maxSpan: 60,
                filterMode: 'filter',
                moveOnMouseMove: !isOffset.value
            };
            options.dataZoom[1] = {
                show: false,
                xAxisIndex: [0, 1, 2, 3],
                type: 'slider',
                bottom: '0%',
                start: startValue,
                end: endValue,
                minSpan: 5,
                maxSpan: 60,
                height: 0,
                handleSize: 0,
                moveHandleSize: 0,
                filterMode: 'filter'
            };
            calculateMACD();
        }
    }
    else {
        // 添加
        if (vchart.value) {
            showVolumes.value.push({
                value: total_amount,
                itemStyle: {
                    color: isRed ? '#B9291E' : '#2B6619',
                    borderColor: isRed ? '#B9291E' : '#2B6619'
                }
            });
            yDatas.value.push({
                value: [open_px, last_px, low_px, high_px],
                itemStyle: {
                    color: isRed ? '#ffffff' : '#2B6619',
                    color0: isRed ? '#B9291E' : '#2B6619',
                    borderColor: isRed ? '#B9291E' : '#2B6619',
                    borderColor0: isRed ? '#B9291E' : '#2B6619'
                }
            });
            xDates.value.push(day);
            currentDateLength.value = xDates.value.length;
            calculateMA();
            //5
            options.series[2] = {
                name: 'MA5',
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
                    // color: '#AFAFAF',
                    width: 1
                },
                // emphasis: {
                //   focus: 'none',
                //   scale: false,
                //   disabled: 'none',
                //   lineStyle: {
                //     width: 1
                //   }
                // }
            };
            // 10
            options.series[3] = {
                name: 'MA10',
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
                    // color: '#9B37F6',
                    width: 1
                },
                // emphasis: {
                //   focus: 'none',
                //   scale: false,
                //   disabled: 'none',
                //   lineStyle: {
                //     width: 1
                //   }
                // }
            };
            // 20
            options.series[4] = {
                name: 'MA20',
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
                    // color: '#F3B846',
                    width: 1
                },
                // emphasis: {
                //   focus: 'none',
                //   scale: false,
                //   disabled: 'none',
                //   lineStyle: {
                //     width: 1
                //   }
                // }
            };
            // 30
            options.series[5] = {
                name: 'MA30',
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
                    // color: '#94C9B2',
                    width: 1
                },
                // emphasis: {
                //   focus: 'none',
                //   scale: false,
                //   disabled: 'none',
                //   lineStyle: {
                //     width: 1
                //   }
                // }
            };
            calculateMACD();
            options.dataZoom[0] = {
                show: true,
                type: 'inside',
                xAxisIndex: [0, 1, 2, 3],
                start: startValue,
                end: endValue,
                minSpan: 5,
                maxSpan: 60,
                filterMode: 'filter',
                moveOnMouseMove: !isOffset.value
            };
            options.dataZoom[1] = {
                show: false,
                xAxisIndex: [0, 1, 2, 3],
                type: 'slider',
                bottom: '0%',
                start: startValue,
                end: endValue,
                minSpan: 5,
                maxSpan: 60,
                height: 0,
                handleSize: 0,
                moveHandleSize: 0,
                filterMode: 'filter'
            };
        }
    }
    options['series'][0].markLine.data[options['series'][0].markLine.data.length - 1] = {
        yAxis: last_px,
        lineStyle: {
            width: 1,
            color: '#E7D9C4',
            type: 'dashed'
        },
        label: {
            position: 'start',
            color: '#F09A37',
            fontSize: 10,
            formatter: function (params) {
                return fomatFloat(params.value, 2);
            }
        }
    };
    vchart.value.setOption(options);
}
async function loadData(index) {
    const params = { code: stockCode, index: index };
    const data = await postAPI('/sdata/kplStockLineData', params);
    return data;
}
async function loadMoreData() {
    isloading = true;
    index++;
    const data = await loadData(index * 240);
    moreChart(data);
    isloading = false;
}
watch(() => stockData, (newValue) => {
    if (!isloading) {
        handleNewData(newValue);
    }
}, { deep: true });
onBeforeMount(async () => {
    if (stockCode == null) {
        return;
    }
    const data = await loadData(0);
    initChart(data);
    if (stockData) {
        handleNewData(stockData);
    }
});
onUnmounted(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
}); /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stock-chart") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ onTouchstart: (...[$event]) => {
                __VLS_ctx.start($event);
            } }, ...{ onTouchend: (__VLS_ctx.end) }, ...{ class: ("stock-chart-box") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VChart;
    /** @type { [typeof __VLS_components.VChart, typeof __VLS_components.vChart, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onDatazoom': {} }, ref: ("vchart"), option: ((__VLS_ctx.options)), updateOptions: (({ notMerge: true })), }));
    const __VLS_2 = __VLS_1({ ...{ 'onDatazoom': {} }, ref: ("vchart"), option: ((__VLS_ctx.options)), updateOptions: (({ notMerge: true })), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    // @ts-ignore navigation for `const vchart = ref()`
    __VLS_ctx.vchart;
    var __VLS_6 = {};
    let __VLS_7;
    const __VLS_8 = {
        onDatazoom: (__VLS_ctx.onDataZoom)
    };
    let __VLS_3;
    let __VLS_4;
    var __VLS_5;
    __VLS_styleScopedClasses['stock-chart'];
    __VLS_styleScopedClasses['stock-chart-box'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {
        "vchart": __VLS_6,
    };
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            VChart: VChart,
            vchart: vchart,
            options: options,
            start: start,
            end: end,
            onDataZoom: onDataZoom,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=DayLineChart.vue.js.map
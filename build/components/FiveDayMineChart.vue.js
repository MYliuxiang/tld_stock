import { ref, reactive, nextTick, onBeforeMount, onBeforeUnmount } from 'vue';
import 'echarts';
import VChart from 'vue-echarts';
import { postAPI } from '@/service';
import { fiveTimes, isCurrentTimeInRange } from '@/utils';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const intervalId = ref();
const __VLS_props = defineProps();
const { stockCode, line15, line30 } = __VLS_props;
// vchart组件的引用
const vchart = ref(null);
// 昨日收盘价
let close = ref(0);
// 现价数据
let prices = ref([]);
let prices1 = ref([]);
let prices2 = ref([]);
let prices3 = ref([]);
let prices4 = ref([]);
let prices5 = ref([]);
// 均价数据
let avgPrices = ref([]);
let avgPrices1 = ref([]);
let avgPrices2 = ref([]);
let avgPrices3 = ref([]);
let avgPrices4 = ref([]);
let avgPrices5 = ref([]);
// 成交量
let volumes = ref([]);
// 涨跌幅
// 涨跌额
// let pcts = ref<number[]>([])
// 最高价
let limitUp = ref(0);
// 最低价
let limitDown = ref(0);
// 最高涨幅
let pctChangeUp = ref(0);
// 最低跌幅
let pctChangeDown = ref(0);
// 控制图表展示
let showCharts = ref(false);
// 交易日期数据
let xDates = ref([]);
// 交易时间数据
let xTimes = fiveTimes;
// 当前时间现价的闪烁点
// let pricesEffectScatter = [] as any[]
// 图表配置项
let options = reactive({
    animation: false,
    grid: [
        {
            show: true,
            id: 'gd1',
            top: '1%',
            left: '0.1%',
            right: '0.1%',
            bottom: '41%'
        },
        {
            show: true,
            id: 'gd2',
            top: '60%',
            left: '0.1%',
            right: '0.2%',
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
                    if ((val.axisIndex == 0) && val.axisDimension == 'x') {
                        return '';
                    }
                    else if (val.axisDimension == 'y') {
                        return '';
                    }
                    else {
                        let ri = val.value;
                        return ri;
                    }
                }
            }
        },
    },
    axisPointer: { link: [{ xAxisIndex: 'all' }] },
    color: ['#B9291E', '#009900'],
    blendMode: 'source-over',
    xAxis: [],
    yAxis: [],
    series: []
});
function fomatFloat(src, pos = 2) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}
const initChart = (data) => {
    let list = data['List'];
    close.value = data['List'][1]['preclose_px'];
    prices.value = [];
    avgPrices.value = [];
    volumes.value = [];
    prices1.value = [];
    prices2.value = [];
    prices3.value = [];
    prices4.value = [];
    prices5.value = [];
    avgPrices1.value = [];
    avgPrices2.value = [];
    avgPrices3.value = [];
    avgPrices4.value = [];
    avgPrices5.value = [];
    let high = 0;
    let low = 10000;
    let index = 0;
    list.forEach((item) => {
        xDates.value.push(item['day']);
        const hprice = item['hprice'];
        const lprice = item['lprice'];
        high = hprice > high ? hprice : high;
        low = low < lprice ? low : lprice;
        item['trend'].forEach((obj) => {
            // xTimes.push(obj[0])
            prices.value.push(obj[1]);
            if (index == 0) {
                prices1.value.push(obj[1]);
                prices2.value.push(null);
                prices3.value.push(null);
                prices4.value.push(null);
                prices5.value.push(null);
                avgPrices1.value.push(obj[2]);
                avgPrices2.value.push(null);
                avgPrices3.value.push(null);
                avgPrices4.value.push(null);
                avgPrices5.value.push(null);
            }
            else if (index <= 1) {
                prices1.value.push();
                prices2.value.push(obj[1]);
                prices3.value.push(null);
                prices4.value.push(null);
                prices5.value.push(null);
                avgPrices1.value.push();
                avgPrices2.value.push(obj[2]);
                avgPrices3.value.push(null);
                avgPrices4.value.push(null);
                avgPrices5.value.push(null);
            }
            else if (index <= 2) {
                prices1.value.push(null);
                prices2.value.push(null);
                prices3.value.push(obj[1]);
                prices4.value.push(null);
                prices5.value.push(null);
                avgPrices1.value.push(null);
                avgPrices2.value.push(null);
                avgPrices3.value.push(obj[2]);
                avgPrices4.value.push(null);
                avgPrices5.value.push(null);
            }
            else if (index <= 3) {
                prices1.value.push(null);
                prices2.value.push(null);
                prices3.value.push(null);
                prices4.value.push(obj[1]);
                prices5.value.push(null);
                avgPrices1.value.push(null);
                avgPrices2.value.push(null);
                avgPrices3.value.push(null);
                avgPrices4.value.push(obj[2]);
                avgPrices5.value.push(null);
            }
            else {
                prices1.value.push(null);
                prices2.value.push(null);
                prices3.value.push(null);
                prices4.value.push(null);
                prices5.value.push(obj[1]);
                avgPrices1.value.push(null);
                avgPrices2.value.push(null);
                avgPrices3.value.push(null);
                avgPrices4.value.push(null);
                avgPrices5.value.push(obj[2]);
            }
            avgPrices.value.push(obj[2]);
            volumes.value.push(obj[3]);
        });
        index++;
    });
    limitUp.value = high;
    limitDown.value = low;
    //16.69 16.15
    // 闪烁点
    // pricesEffectScatter = [
    //   {
    //     value: [prices.value.length, prices.value[prices.value.length - 1]],
    //     symbolSize: 5
    //   }
    // ]
    // 现价图图表四角的数据
    // 最大差值：昨日收盘价 - 股票信息中的最高价 对比 昨日收盘价 - 股票信息中的最低价 取绝对值 ，两者哪个相差比较大就用哪个差值
    // 最高价：昨日收盘价 + 最大差值
    // 最低价：昨日收盘价 - 最大差值
    // 最高涨幅：((昨日收盘价 + 最大差值) - 1) * 100
    // 最低跌幅：-((昨日收盘价 + 最大差值) - 1) * 100
    let maxSplit = Math.abs(limitUp.value - close.value) > Math.abs(close.value - limitDown.value) ? Math.abs(limitUp.value - close.value) : Math.abs(close.value - limitDown.value);
    limitUp.value = fomatFloat(Number(close.value + maxSplit));
    limitDown.value = fomatFloat(Number(close.value - maxSplit));
    pctChangeUp.value = fomatFloat((limitUp.value / close.value - 1) * 100);
    pctChangeDown.value = pctChangeUp.value > 0 ? fomatFloat(0 - pctChangeUp.value) : fomatFloat(pctChangeUp.value);
    options['xAxis'] = [
        {
            //主图
            gridIndex: 0,
            show: true,
            type: 'category',
            data: xTimes,
            axisLine: {
                lineStyle: {
                    color: '#2b2f39'
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
                interval: 48,
                lineStyle: {
                    color: '#cccccc',
                    width: 1
                }
            }
        },
        {
            //交易量图
            show: true,
            gridIndex: 1,
            type: 'category',
            // max: 240,
            axisLabel: {
                show: false,
                color: '#bcbcbc',
                fontSize: 10,
                interval: 48,
                margin: 5,
                // formatter: function (value: any, index: any) {
                //   if (index === 0) {
                //     return '      9:30'
                //   } else if (index === 120) {
                //     return '11:30'
                //   } else if (index === 240) {
                //     return '15:00          '
                //   } else {
                //     return ''
                //   }
                // }
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
                interval: 48,
                lineStyle: {
                    color: '#cccccc',
                    width: 1
                }
            }
        },
    ];
    options['yAxis'] = [
        {
            show: true,
            scale: true,
            gridIndex: 0,
            min: limitDown.value,
            max: limitUp.value,
            interval: (limitUp.value - limitDown.value) / 4,
            axisLabel: {
                show: false,
                inside: false,
                fontSize: 20,
                color: function (value) {
                    if (value == close.value) {
                        return '#CCCCCC';
                    }
                    return value > close.value ? '#F9293E' : '#00aa3b';
                }
            },
            z: 2,
            axisLine: {
                show: false
            },
            splitLine: {
                show: true
            },
            axisPointer: {
                show: true,
                label: {
                    color: '#ffffff',
                    backgroundColor: '#6E7079',
                    fontSize: 10,
                    formatter: function ({ value }) {
                        return value.toFixed(2);
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
            gridIndex: 1,
            z: 1,
            scale: true,
            type: 'value',
            splitNumber: 2,
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisPointer: {
                label: {
                    fontSize: 10,
                    formatter: function ({ value }) {
                        return fomatFloat(value / 10000, 0).toFixed(2) + '万';
                    }
                },
                lineStyle: {
                    type: 'solid',
                    width: 0.5
                }
            }
        }
    ];
    let markLineData = [];
    if (Number(line15) > 0) {
        markLineData.push({
            yAxis: line15,
            lineStyle: {
                color: '#F09A37',
                width: 1,
                type: 'solid'
            },
            label: {
                position: 'end',
                color: '#F09A37',
                fontSize: 10,
                // padding:[0, 0, 0, 16],
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
                color: '#F09A37',
                width: 1,
                type: 'solid'
            },
            label: {
                fontSize: 10,
                color: '#F09A37',
                position: 'end',
                // padding:[0, 0, 0, 16],
                formatter: function (params) {
                    return fomatFloat(params.value, 2);
                }
            }
        });
    }
    options['series'] = [
        {
            show: false,
            name: '当前价',
            type: 'line',
            data: prices.value,
            smooth: true,
            symbol: 'none',
            gridIndex: 0,
            lineStyle: {
                opacity: 1,
                color: '#FF3232',
                width: 0
            },
            markPoint: {
                label: {
                    color: '#cccccc',
                    fontSize: 10,
                    formatter: function ({ value }) {
                        return fomatFloat(value, 2);
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
                data: markLineData
            },
            emphasis: {
                focus: 'none',
                scale: false,
                disabled: 'none',
                lineStyle: {
                    width: 0
                }
            }
        },
        //1
        {
            //1
            name: '当前价1',
            type: 'line',
            data: prices1.value,
            symbol: 'none',
            gridIndex: 0,
            lineStyle: {
                opacity: 1,
                color: '#2b2f39',
                width: 1
            },
        },
        //2
        {
            //2
            name: '当前价2',
            type: 'line',
            data: prices2.value,
            symbol: 'none',
            gridIndex: 0,
            lineStyle: {
                opacity: 1,
                color: '#2b2f39',
                width: 1
            },
        },
        //3
        {
            //3
            name: '当前价2',
            type: 'line',
            data: prices3.value,
            symbol: 'none',
            gridIndex: 0,
            lineStyle: {
                opacity: 1,
                color: '#2b2f39',
                width: 1
            },
        },
        //4
        {
            name: '当前价',
            type: 'line',
            data: prices4.value,
            symbol: 'none',
            gridIndex: 0,
            lineStyle: {
                opacity: 1,
                color: '#2b2f39',
                width: 1
            },
        },
        //5
        {
            name: '当前价',
            type: 'line',
            data: prices5.value,
            smooth: true,
            symbol: 'none',
            gridIndex: 0,
            lineStyle: {
                opacity: 1,
                color: '#2b2f39',
                width: 1
            },
        },
        //平均价1
        {
            name: '平均价',
            type: 'line',
            data: avgPrices1.value,
            smooth: true,
            symbol: 'none',
            gridIndex: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            z: 5,
            lineStyle: {
                opacity: 0.8,
                color: '#F09A37',
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
        //平均价2
        {
            name: '平均价',
            type: 'line',
            data: avgPrices2.value,
            smooth: true,
            symbol: 'none',
            gridIndex: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            z: 5,
            lineStyle: {
                opacity: 0.8,
                color: '#F09A37',
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
        //平均价3
        {
            name: '平均价',
            type: 'line',
            data: avgPrices3.value,
            smooth: true,
            symbol: 'none',
            gridIndex: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            z: 5,
            lineStyle: {
                opacity: 0.8,
                color: '#F09A37',
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
        //平均价4
        {
            name: '平均价',
            type: 'line',
            data: avgPrices4.value,
            smooth: true,
            symbol: 'none',
            gridIndex: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            z: 5,
            lineStyle: {
                opacity: 0.8,
                color: '#F09A37',
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
        //平均价5
        {
            name: '平均价',
            type: 'line',
            data: avgPrices5.value,
            smooth: true,
            symbol: 'none',
            gridIndex: 0,
            xAxisIndex: 0,
            yAxisIndex: 0,
            z: 5,
            lineStyle: {
                opacity: 0.8,
                color: '#F09A37',
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
        //量图
        {
            name: '成交量',
            type: 'bar',
            gridIndex: 1,
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: volumes.value,
            barWidth: '50%',
            itemStyle: {
                color: function ({ dataIndex }) {
                    if (prices.value[dataIndex] >= prices.value[dataIndex - 1]) {
                        return '#F9293E';
                    }
                    else {
                        return '#009900';
                    }
                }
            }
        },
    ];
    nextTick(() => {
        showCharts.value = true;
    });
};
const resizeTheChart = () => {
    if (vchart.value) {
        // vchart.value.resize && vchart.value.resize()
    }
};
async function loadNewData() {
    const params = { code: stockCode };
    const data = await postAPI('/sdata/kplStockTrend5Min', params);
    initChart(data);
}
onBeforeMount(() => {
    if (stockCode == null) {
        return;
    }
    loadNewData();
    if (isCurrentTimeInRange()) {
        intervalId.value = setInterval(() => {
            loadNewData();
        }, 15 * 1000);
    }
    window.addEventListener('resize', resizeTheChart, { passive: true });
});
onBeforeUnmount(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
    window.removeEventListener('resize', resizeTheChart);
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
    __VLS_styleScopedClasses['fix-date'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stock-chart") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stock-chart-box") }, });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VChart;
    /** @type { [typeof __VLS_components.VChart, typeof __VLS_components.vChart, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ref: ("vchart"), option: ((__VLS_ctx.options)), updateOptions: (({ notMerge: true })), }));
    const __VLS_2 = __VLS_1({ ref: ("vchart"), option: ((__VLS_ctx.options)), updateOptions: (({ notMerge: true })), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    // @ts-ignore navigation for `const vchart = ref()`
    __VLS_ctx.vchart;
    var __VLS_6 = {};
    var __VLS_5;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("fix-date") }, });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.xDates))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((item)), });
        (item.slice(5, 10));
    }
    __VLS_styleScopedClasses['stock-chart'];
    __VLS_styleScopedClasses['stock-chart-box'];
    __VLS_styleScopedClasses['fix-date'];
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
            xDates: xDates,
            options: options,
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
//# sourceMappingURL=FiveDayMineChart.vue.js.map
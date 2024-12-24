import { ref, reactive, nextTick, onBeforeMount, onUnmounted } from 'vue';
import 'echarts';
import VChart from 'vue-echarts';
import { postAPI } from '@/service';
import { isCurrentTimeInRange, mineTimes } from '@/utils';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const intervalId = ref();
const __VLS_props = defineProps();
const { stockCode, line15, line30 } = __VLS_props;
// vchart组件的引用
const vchart = ref(null);
// 昨日收盘价
let preclose = ref(0);
// 现价数据
let prices = ref([]);
// 均价数据
let avgPrices = ref([]);
// 成交量
let volumes = ref([]);
// 涨跌幅
// let ratios = ref<number[]>([])
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
// 交易时间数据
let xTimes = ref(mineTimes);
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
    limitUp.value = data['hprice'];
    limitDown.value = data['lprice'];
    preclose.value = data['preclose_px'];
    let trends = data['trend'];
    prices.value = [];
    volumes.value = [];
    avgPrices.value = [];
    trends.forEach((item) => {
        prices.value.push(item[1]);
        // xTimes.value.push(item[0])
        avgPrices.value.push(item[2]);
        volumes.value.push(item[3]);
        // pcts.value.push(item[9])
        // ratios.value.push(item[10])
    });
    // 现价图图表四角的数据
    // 最大差值：昨日收盘价 - 股票信息中的最高价 对比 昨日收盘价 - 股票信息中的最低价 取绝对值 ，两者哪个相差比较大就用哪个差值
    // 最高价：昨日收盘价 + 最大差值
    // 最低价：昨日收盘价 - 最大差值
    // 最高涨幅：((昨日收盘价 + 最大差值) - 1) * 100
    // 最低跌幅：-((昨日收盘价 + 最大差值) - 1) * 100
    let maxSplit = Math.abs(limitUp.value - preclose.value) > Math.abs(preclose.value - limitDown.value) ? Math.abs(limitUp.value - preclose.value) : Math.abs(preclose.value - limitDown.value);
    limitUp.value = fomatFloat(Number(preclose.value + maxSplit));
    limitDown.value = fomatFloat(Number(preclose.value - maxSplit));
    pctChangeUp.value = fomatFloat((limitUp.value / preclose.value - 1) * 100);
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
                interval: 60,
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
                color: '#bcbcbc',
                fontSize: 10,
                interval: 59,
                margin: 5,
                formatter: function (value, index) {
                    if (index === 0) {
                        return '      9:30';
                    }
                    else if (index === 120) {
                        return '11:30';
                    }
                    else if (index === 240) {
                        return '15:00          ';
                    }
                    else {
                        return '';
                    }
                }
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
                interval: 60,
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
            // boundaryGap: false,
            min: limitDown.value,
            max: limitUp.value,
            interval: (limitUp.value - limitDown.value) / 4,
            axisLabel: {
                show: false,
                inside: false,
                fontSize: 20,
                color: function (value) {
                    if (value == preclose.value) {
                        return '#CCCCCC';
                    }
                    return value > preclose.value ? '#F9293E' : '#00aa3b';
                }
            },
            z: 2,
            axisLine: {
                show: false
            },
            splitLine: {
                show: true,
                // interval: (limitUp.value - limitDown.value) / 4,
                lineStyle: {
                    color: '#cccccc',
                    width: 1
                }
            },
            axisPointer: {
                show: true,
                label: {
                    color: '#ffffff',
                    backgroundColor: '#6E7079',
                    fontSize: 10,
                    formatter: function ({ value }) {
                        return fomatFloat(value, 2);
                    }
                },
                lineStyle: {
                    type: 'solid',
                    width: 0.5
                }
            }
        },
        {
            gridIndex: 1,
            z: 4,
            scale: true,
            type: 'value',
            splitNumber: 2,
            axisTick: {
                show: false
            },
            splitLine: {
                show: true
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
        },
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
                color: '#F09A37',
                width: 1,
                type: 'solid'
            },
            label: {
                fontSize: 10,
                color: '#F09A37',
                position: 'end',
                formatter: function (params) {
                    return fomatFloat(params.value, 2);
                }
            }
        });
    }
    markLineData.push({
        yAxis: preclose.value,
        lineStyle: {
            color: '#2b2f39',
        },
        label: {
            position: 'end',
            color: '#999999',
            fontWeight: 'bold',
            fontSize: 10,
            formatter: function () {
                return '0.00%';
            }
        }
    });
    markLineData.push({
        yAxis: preclose.value,
        lineStyle: {
            color: '#2b2f39'
        },
        label: {
            fontSize: 10,
            fontWeight: 'bold',
            color: '#999999',
            position: 'start',
            formatter: function (params) {
                return fomatFloat(params.value, 2);
            }
        }
    });
    options['series'] = [
        {
            name: '当前价',
            type: 'line',
            data: prices.value,
            smooth: true,
            symbol: 'none',
            gridIndex: 3,
            z: 2,
            lineStyle: {
                opacity: 0.8,
                color: '#2b2f39',
                width: 1
            },
            // areaStyle: {
            //   color: 'rgba(251, 136, 80,.1)'
            // },
            markLine: {
                silent: true,
                symbol: 'none',
                label: {
                    show: true,
                    distance: [-30, 0]
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
                    width: 1
                }
            }
        },
        {
            name: '平均价',
            type: 'line',
            data: avgPrices.value,
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
                    if (prices.value[dataIndex] > prices.value[dataIndex - 1]) {
                        return '#EA392C';
                    }
                    else if (prices.value[dataIndex] == prices.value[dataIndex - 1]) {
                        return '#666666';
                    }
                    else {
                        return '#439629';
                    }
                }
            }
        }
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
    const data = await postAPI('/sdata/kplTrendIncremental', params);
    initChart(data);
}
onBeforeMount(async () => {
    if (stockCode == null) {
        return;
    }
    loadNewData();
    if (isCurrentTimeInRange()) {
        intervalId.value = setInterval(() => {
            loadNewData();
        }, 3 * 1000);
    }
    window.addEventListener('resize', resizeTheChart, { passive: true });
});
onUnmounted(() => {
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
    __VLS_styleScopedClasses['fix-up'];
    __VLS_styleScopedClasses['fix-down'];
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stock-chart") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("stock-chart-box") }, });
    if (__VLS_ctx.showCharts) {
        const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VChart;
        /** @type { [typeof __VLS_components.VChart, typeof __VLS_components.vChart, ] } */
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ref: ("vchart"), option: ((__VLS_ctx.options)), updateOptions: (({ notMerge: true })), }));
        const __VLS_2 = __VLS_1({ ref: ("vchart"), option: ((__VLS_ctx.options)), updateOptions: (({ notMerge: true })), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        // @ts-ignore navigation for `const vchart = ref()`
        __VLS_ctx.vchart;
        var __VLS_6 = {};
        var __VLS_5;
    }
    if (__VLS_ctx.showCharts) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("fix-up up") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        (__VLS_ctx.limitUp);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        (__VLS_ctx.pctChangeUp);
    }
    if (__VLS_ctx.showCharts) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("fix-down down") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        (__VLS_ctx.limitDown);
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        (__VLS_ctx.pctChangeDown);
    }
    __VLS_styleScopedClasses['stock-chart'];
    __VLS_styleScopedClasses['stock-chart-box'];
    __VLS_styleScopedClasses['fix-up'];
    __VLS_styleScopedClasses['up'];
    __VLS_styleScopedClasses['fix-down'];
    __VLS_styleScopedClasses['down'];
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
            limitUp: limitUp,
            limitDown: limitDown,
            pctChangeUp: pctChangeUp,
            pctChangeDown: pctChangeDown,
            showCharts: showCharts,
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
//# sourceMappingURL=MineChart.vue.js.map
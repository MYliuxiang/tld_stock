import { init, dispose } from 'klinecharts';
// import Layout from "./Layout.vue";
import { onMounted, onUnmounted } from 'vue';
import { postAPI } from '@/service';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const __VLS_props = defineProps();
const { stockCode, line15, line30, classID } = __VLS_props;
console.log(stockCode);
console.log(line15);
console.log(line30);
console.log(classID);
let kLineChart;
const chartTypes = [
    { key: 'candle_solid', text: '蜡烛实心' },
    { key: 'candle_stroke', text: '蜡烛空心' },
    { key: 'candle_up_stroke', text: '蜡烛涨空心' },
    { key: 'candle_down_stroke', text: '蜡烛跌空心' },
    { key: 'ohlc', text: 'OHLC' },
    { key: 'area', text: '面积图' },
];
onMounted(async () => {
    console.log('挂载了');
    console.log(classID);
    kLineChart = init(classID);
    const data = await loadData(0);
    kLineChart.applyNewData(data);
});
async function loadData(index) {
    const params = { code: stockCode, index: index };
    const res = await postAPI('/sdata/stockLineData', params);
    console.log(res);
    return res;
}
function setChartType(type) {
    kLineChart.setStyles({
        candle: {
            type,
        },
    });
}
onUnmounted(() => {
    dispose('chart-type-k-line');
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
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Layout;
    /** @type { [typeof __VLS_components.Layout, typeof __VLS_components.Layout, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ title: ((stockCode)), }));
    const __VLS_2 = __VLS_1({ title: ((stockCode)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    __VLS_elementAsFunction(__VLS_intrinsicElements.div)({ id: ((classID)), ...{ class: ("k-line-chart") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("k-line-chart-menu-container") }, });
    for (const [{ key, text }] of __VLS_getVForSourceType((__VLS_ctx.chartTypes))) {
        __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (...[$event]) => {
                    __VLS_ctx.setChartType(key);
                } }, key: ((key)), });
        (text);
    }
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_styleScopedClasses['k-line-chart'];
    __VLS_styleScopedClasses['k-line-chart-menu-container'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
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
            chartTypes: chartTypes,
            setChartType: setChartType,
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
//# sourceMappingURL=ChartType.vue.js.map
import { ref, onBeforeMount, onUnmounted, reactive } from 'vue';
import { postAPI } from '@/service';
import { grayColor, greenColor, redColor } from '@/color';
import { handFixed, handNumber } from '@/tools';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const intervalId = ref();
const code = getQueryString('code');
const line15 = getQueryString('line15');
const line30 = getQueryString('line30');
const stockData = reactive({});
const zdColor = ref('#323232');
const highColor = ref('#323232');
const lowColor = ref('#323232');
const openColor = ref('#323232');
const diffColor = ref('#323232');
//最新价
const last_px = ref('--');
//涨幅
const px_change = ref('--');
//涨幅
const pe_rate = ref('--');
//最高价
const high_px = ref('--');
//最低价
const low_px = ref('--');
//开盘价
const open_px = ref('--');
//换手
const turnover_ratio = ref('--');
//市值
const market_value = ref('--');
//流通
const circulation_value = ref('--');
//量比
const vol_ratio = ref('--');
//金额
const total_turnover = ref('--');
//diff
const diff = ref('--');
function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substring(1).match(reg);
    if (r != null) {
        return r[2];
    }
    return null;
}
onBeforeMount(async () => {
    if (code == null) {
        return;
    }
    loadNewData();
    // if(isCurrentTimeInRange()){
    // }
    intervalId.value = setInterval(() => {
        loadNewData();
    }, 5 * 1000);
});
onUnmounted(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value);
    }
});
async function loadNewData() {
    const params = { code: code };
    const data = await postAPI('/sdata/narrow', params);
    // data['real']['last_px'] = data['real']['last_px'] + count.value * 0.02
    stockData.value = data;
    const preclose_px = data['preclose_px'];
    last_px.value = handFixed(data['real']['last_px']);
    px_change.value = data['real']['px_change'];
    pe_rate.value = data['real']['pe_rate'];
    if (last_px.value > preclose_px) {
        zdColor.value = redColor;
    }
    else if (last_px.value == preclose_px) {
        zdColor.value = grayColor;
    }
    else {
        zdColor.value = greenColor;
    }
    if (high_px.value > preclose_px) {
        highColor.value = redColor;
    }
    else if (high_px.value == preclose_px) {
        highColor.value = grayColor;
    }
    else {
        highColor.value = greenColor;
    }
    if (low_px.value > preclose_px) {
        lowColor.value = redColor;
    }
    else if (low_px.value == preclose_px) {
        lowColor.value = grayColor;
    }
    else {
        lowColor.value = greenColor;
    }
    if (open_px.value > preclose_px) {
        openColor.value = redColor;
    }
    else if (open_px.value == preclose_px) {
        openColor.value = grayColor;
    }
    else {
        openColor.value = greenColor;
    }
    high_px.value = data['real']['high_px'];
    low_px.value = data['real']['low_px'];
    open_px.value = data['real']['open_px'];
    turnover_ratio.value = data['real']['turnover_ratio'];
    market_value.value = handNumber(data['real']['market_value']);
    circulation_value.value = handNumber(data['real']['circulation_value']);
    vol_ratio.value = data['real']['vol_ratio'];
    total_turnover.value = handNumber(data['real']['total_turnover']);
    //diff
    if (Number(line30) > 0) {
        diff.value = ((parseFloat(last_px.value) - parseFloat(line30)) / parseFloat(line30) * 100).toFixed(2);
    }
    if (parseFloat(last_px.value) > 0) {
        diffColor.value = '#439629';
    }
    else if (parseFloat(last_px.value) == 0) {
        diffColor.value = '#323232';
    }
    else {
        diffColor.value = '#EA392C';
    }
}
const activeName = ref('first');
const handleClick = (tab, event) => {
    console.log(tab);
    console.log(event);
}; /* PartiallyEnd: #3632/scriptSetup.vue */
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
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.ElContainer;
    /** @type { [typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_6 = {};
    const __VLS_7 = __VLS_resolvedLocalAndGlobalComponents.ElHeader;
    /** @type { [typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ] } */
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(__VLS_7, new __VLS_7({}));
    const __VLS_9 = __VLS_8({}, ...__VLS_functionalComponentArgsRest(__VLS_8));
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("div") }, });
    const __VLS_13 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({ type: ("flex"), justify: ("space-between"), }));
    const __VLS_15 = __VLS_14({ type: ("flex"), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.ElCol;
    /** @type { [typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ] } */
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({ span: ((5)), }));
    const __VLS_21 = __VLS_20({ span: ((5)), }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    const __VLS_25 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({ gutter: ((12)), justify: ("right"), }));
    const __VLS_27 = __VLS_26({ gutter: ((12)), justify: ("right"), }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr price") }, ...{ style: (({ color: __VLS_ctx.zdColor })) }, });
    (__VLS_ctx.last_px);
    __VLS_nonNullable(__VLS_30.slots).default;
    var __VLS_30;
    const __VLS_31 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({ gutter: ((12)), type: ("flex"), justify: ("space-between"), }));
    const __VLS_33 = __VLS_32({ gutter: ((12)), type: ("flex"), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr") }, ...{ style: (({ color: __VLS_ctx.zdColor })) }, });
    (__VLS_ctx.px_change);
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr") }, ...{ style: (({ color: __VLS_ctx.zdColor })) }, });
    (__VLS_ctx.pe_rate + '%');
    __VLS_nonNullable(__VLS_36.slots).default;
    var __VLS_36;
    __VLS_nonNullable(__VLS_24.slots).default;
    var __VLS_24;
    const __VLS_37 = __VLS_resolvedLocalAndGlobalComponents.ElCol;
    /** @type { [typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ] } */
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({ span: ((4)), }));
    const __VLS_39 = __VLS_38({ span: ((4)), }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    const __VLS_43 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(__VLS_43, new __VLS_43({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_45 = __VLS_44({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr") }, ...{ style: (({ color: __VLS_ctx.highColor })) }, });
    (__VLS_ctx.high_px);
    __VLS_nonNullable(__VLS_48.slots).default;
    var __VLS_48;
    const __VLS_49 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_51 = __VLS_50({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr") }, ...{ style: (({ color: __VLS_ctx.lowColor })) }, });
    (__VLS_ctx.low_px);
    __VLS_nonNullable(__VLS_54.slots).default;
    var __VLS_54;
    const __VLS_55 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(__VLS_55, new __VLS_55({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_57 = __VLS_56({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr") }, ...{ style: (({ color: __VLS_ctx.openColor })) }, });
    (__VLS_ctx.open_px);
    __VLS_nonNullable(__VLS_60.slots).default;
    var __VLS_60;
    __VLS_nonNullable(__VLS_42.slots).default;
    var __VLS_42;
    const __VLS_61 = __VLS_resolvedLocalAndGlobalComponents.ElCol;
    /** @type { [typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ] } */
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({ span: ((6)), }));
    const __VLS_63 = __VLS_62({ span: ((6)), }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    const __VLS_67 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent(__VLS_67, new __VLS_67({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_69 = __VLS_68({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr blackFont") }, });
    (__VLS_ctx.turnover_ratio + "%");
    __VLS_nonNullable(__VLS_72.slots).default;
    var __VLS_72;
    const __VLS_73 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_75 = __VLS_74({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr blackFont") }, });
    (__VLS_ctx.market_value);
    __VLS_nonNullable(__VLS_78.slots).default;
    var __VLS_78;
    const __VLS_79 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent(__VLS_79, new __VLS_79({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_81 = __VLS_80({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr blackFont") }, });
    (__VLS_ctx.circulation_value);
    __VLS_nonNullable(__VLS_84.slots).default;
    var __VLS_84;
    __VLS_nonNullable(__VLS_66.slots).default;
    var __VLS_66;
    const __VLS_85 = __VLS_resolvedLocalAndGlobalComponents.ElCol;
    /** @type { [typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ] } */
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({ span: ((6)), }));
    const __VLS_87 = __VLS_86({ span: ((6)), }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    const __VLS_91 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent(__VLS_91, new __VLS_91({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_93 = __VLS_92({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr blackFont") }, });
    (__VLS_ctx.vol_ratio);
    __VLS_nonNullable(__VLS_96.slots).default;
    var __VLS_96;
    const __VLS_97 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_99 = __VLS_98({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad blackFont") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr blackFont") }, });
    (__VLS_ctx.total_turnover);
    __VLS_nonNullable(__VLS_102.slots).default;
    var __VLS_102;
    const __VLS_103 = __VLS_resolvedLocalAndGlobalComponents.ElRow;
    /** @type { [typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ] } */
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent(__VLS_103, new __VLS_103({ gutter: ((8)), justify: ("space-between"), }));
    const __VLS_105 = __VLS_104({ gutter: ((8)), justify: ("space-between"), }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("grad") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({ ...{ class: ("contenr") }, ...{ style: (({ color: __VLS_ctx.diffColor })) }, });
    (__VLS_ctx.diff + 'cm');
    __VLS_nonNullable(__VLS_108.slots).default;
    var __VLS_108;
    __VLS_nonNullable(__VLS_90.slots).default;
    var __VLS_90;
    __VLS_nonNullable(__VLS_18.slots).default;
    var __VLS_18;
    __VLS_nonNullable(__VLS_12.slots).default;
    var __VLS_12;
    const __VLS_109 = __VLS_resolvedLocalAndGlobalComponents.el_main;
    /** @type { [typeof __VLS_components.El_main, typeof __VLS_components.el_main, typeof __VLS_components.El_main, typeof __VLS_components.el_main, ] } */
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({}));
    const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
    const __VLS_115 = __VLS_resolvedLocalAndGlobalComponents.ElTabs;
    /** @type { [typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ] } */
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent(__VLS_115, new __VLS_115({ ...{ 'onTabClick': {} }, modelValue: ((__VLS_ctx.activeName)), ...{ class: ("stock-tabs") }, }));
    const __VLS_117 = __VLS_116({ ...{ 'onTabClick': {} }, modelValue: ((__VLS_ctx.activeName)), ...{ class: ("stock-tabs") }, }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    let __VLS_121;
    const __VLS_122 = {
        onTabClick: (__VLS_ctx.handleClick)
    };
    let __VLS_118;
    let __VLS_119;
    const __VLS_123 = __VLS_resolvedLocalAndGlobalComponents.ElTabPane;
    /** @type { [typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ] } */
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({ ...{ class: ("content") }, label: ("分时"), name: ("first"), lazy: ("false"), }));
    const __VLS_125 = __VLS_124({ ...{ class: ("content") }, label: ("分时"), name: ("first"), lazy: ("false"), }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    const __VLS_129 = __VLS_resolvedLocalAndGlobalComponents.MineChart;
    /** @type { [typeof __VLS_components.MineChart, ] } */
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "1")), }));
    const __VLS_131 = __VLS_130({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "1")), }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    __VLS_nonNullable(__VLS_128.slots).default;
    var __VLS_128;
    const __VLS_135 = __VLS_resolvedLocalAndGlobalComponents.ElTabPane;
    /** @type { [typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ] } */
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent(__VLS_135, new __VLS_135({ ...{ class: ("content") }, label: ("五日"), name: ("second"), lazy: ("false"), }));
    const __VLS_137 = __VLS_136({ ...{ class: ("content") }, label: ("五日"), name: ("second"), lazy: ("false"), }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    const __VLS_141 = __VLS_resolvedLocalAndGlobalComponents.FiveDayMineChart;
    /** @type { [typeof __VLS_components.FiveDayMineChart, ] } */
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "2")), }));
    const __VLS_143 = __VLS_142({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "2")), }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    __VLS_nonNullable(__VLS_140.slots).default;
    var __VLS_140;
    const __VLS_147 = __VLS_resolvedLocalAndGlobalComponents.ElTabPane;
    /** @type { [typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ] } */
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent(__VLS_147, new __VLS_147({ ...{ class: ("content") }, label: ("日线"), name: ("third"), lazy: ("false"), }));
    const __VLS_149 = __VLS_148({ ...{ class: ("content") }, label: ("日线"), name: ("third"), lazy: ("false"), }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    const __VLS_153 = __VLS_resolvedLocalAndGlobalComponents.DayLineChart;
    /** @type { [typeof __VLS_components.DayLineChart, ] } */
    // @ts-ignore
    const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), stockData: ((__VLS_ctx.stockData.value)), }));
    const __VLS_155 = __VLS_154({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), stockData: ((__VLS_ctx.stockData.value)), }, ...__VLS_functionalComponentArgsRest(__VLS_154));
    __VLS_nonNullable(__VLS_152.slots).default;
    var __VLS_152;
    __VLS_nonNullable(__VLS_120.slots).default;
    var __VLS_120;
    __VLS_nonNullable(__VLS_114.slots).default;
    var __VLS_114;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_styleScopedClasses['div'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['price'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['blackFont'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['blackFont'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['blackFont'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['blackFont'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['blackFont'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['blackFont'];
    __VLS_styleScopedClasses['grad'];
    __VLS_styleScopedClasses['contenr'];
    __VLS_styleScopedClasses['stock-tabs'];
    __VLS_styleScopedClasses['content'];
    __VLS_styleScopedClasses['content'];
    __VLS_styleScopedClasses['content'];
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
            code: code,
            line15: line15,
            line30: line30,
            stockData: stockData,
            zdColor: zdColor,
            highColor: highColor,
            lowColor: lowColor,
            openColor: openColor,
            diffColor: diffColor,
            last_px: last_px,
            px_change: px_change,
            pe_rate: pe_rate,
            high_px: high_px,
            low_px: low_px,
            open_px: open_px,
            turnover_ratio: turnover_ratio,
            market_value: market_value,
            circulation_value: circulation_value,
            vol_ratio: vol_ratio,
            total_turnover: total_turnover,
            diff: diff,
            activeName: activeName,
            handleClick: handleClick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=StockView.vue.js.map
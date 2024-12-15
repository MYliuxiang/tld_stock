import ChartType from '@/components/ChartType.vue';
import { ref } from 'vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
// import ChartType from '@/components/ChartType.vue'
// const route = useRoute()·
// const {code, line15, line30} = route.query;
const code = getQueryString('code');
const line15 = getQueryString('line15');
const line30 = getQueryString('line30');
function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substring(1).match(reg);
    if (r != null) {
        return r[2];
    }
    return null;
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.ElTabs;
    /** @type { [typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, typeof __VLS_components.ElTabs, typeof __VLS_components.elTabs, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{ 'onTabClick': {} }, modelValue: ((__VLS_ctx.activeName)), ...{ class: ("stock-tabs") }, }));
    const __VLS_2 = __VLS_1({ ...{ 'onTabClick': {} }, modelValue: ((__VLS_ctx.activeName)), ...{ class: ("stock-tabs") }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_6;
    const __VLS_7 = {
        onTabClick: (__VLS_ctx.handleClick)
    };
    let __VLS_3;
    let __VLS_4;
    const __VLS_8 = __VLS_resolvedLocalAndGlobalComponents.ElTabPane;
    /** @type { [typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ] } */
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({ label: ("分时"), name: ("first"), lazy: ("false"), }));
    const __VLS_10 = __VLS_9({ label: ("分时"), name: ("first"), lazy: ("false"), }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    // @ts-ignore
    [ChartType,];
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent(ChartType, new ChartType({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "1")), }));
    const __VLS_15 = __VLS_14({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "1")), }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    __VLS_nonNullable(__VLS_13.slots).default;
    var __VLS_13;
    const __VLS_19 = __VLS_resolvedLocalAndGlobalComponents.ElTabPane;
    /** @type { [typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ] } */
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({ label: ("五日"), name: ("second"), lazy: ("false"), }));
    const __VLS_21 = __VLS_20({ label: ("五日"), name: ("second"), lazy: ("false"), }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    // @ts-ignore
    [ChartType,];
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(ChartType, new ChartType({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "2")), }));
    const __VLS_26 = __VLS_25({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "2")), }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_nonNullable(__VLS_24.slots).default;
    var __VLS_24;
    const __VLS_30 = __VLS_resolvedLocalAndGlobalComponents.ElTabPane;
    /** @type { [typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, typeof __VLS_components.ElTabPane, typeof __VLS_components.elTabPane, ] } */
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({ label: ("日线"), name: ("third"), lazy: ("false"), }));
    const __VLS_32 = __VLS_31({ label: ("日线"), name: ("third"), lazy: ("false"), }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    // @ts-ignore
    [ChartType,];
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent(ChartType, new ChartType({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "3")), }));
    const __VLS_37 = __VLS_36({ stockCode: ((__VLS_ctx.code)), line15: ((__VLS_ctx.line15)), line30: ((__VLS_ctx.line30)), classID: (("stockview" + "3")), }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    __VLS_nonNullable(__VLS_35.slots).default;
    var __VLS_35;
    __VLS_nonNullable(__VLS_5.slots).default;
    var __VLS_5;
    __VLS_styleScopedClasses['stock-tabs'];
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
            ChartType: ChartType,
            code: code,
            line15: line15,
            line30: line30,
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
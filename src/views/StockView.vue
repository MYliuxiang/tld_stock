<template>
    <div> 
        <el-tabs v-model="activeName" class="stock-tabs" @tab-click="handleClick">
            <el-tab-pane label="分时" name="first"><ChartType/></el-tab-pane>
            <el-tab-pane label="五日" name="second"><ChartType/></el-tab-pane>
            <el-tab-pane label="日线" name="third"><ChartType/></el-tab-pane>
        </el-tabs>
    </div>
    
</template>

<script setup lang="ts">
// import { useRoute } from 'vue-router';
// import ChartType from '@/components/ChartType.vue';
import { ref } from 'vue'
import { TabsPaneContext } from 'element-plus'
import ChartType from '@/components/ChartType.vue'
// const route = useRoute()·
// const {code, line15, line30} = route.query;
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
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
    font-size: 20px;
    font-weight: 600;
}

.stock-tabs .el-tabs__item{
    padding: 0px;
    margin: 5px;
    width: 30px;
}

.custom-tab-pane{
    width: 50px;
}

</style>
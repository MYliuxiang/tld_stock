<template>
  <Layout title="图表类型">
    <div id="chart-type-k-line" class="k-line-chart" />
    <div class="k-line-chart-menu-container">
      <button
        v-for="{ key, text } in chartTypes"
        :key="key"
        v-on:click="setChartType(key)"
      >
        {{ text }}
      </button>
    </div>
  </Layout>
</template>

<script setup lang="ts" name="ChartType">
import { init, dispose, Chart } from "klinecharts";
import generatedDataList from "../generatedDataList";
import Layout from "./Layout.vue";
import { onMounted, onUnmounted } from "vue";

let kLineChart:Chart;
const chartTypes = [
        { key: "candle_solid", text: "蜡烛实心" },
        { key: "candle_stroke", text: "蜡烛空心" },
        { key: "candle_up_stroke", text: "蜡烛涨空心" },
        { key: "candle_down_stroke", text: "蜡烛跌空心" },
        { key: "ohlc", text: "OHLC" },
        { key: "area", text: "面积图" },
      ];

onMounted(()=>{
  kLineChart = init("chart-type-k-line") as Chart;
  kLineChart.applyNewData(generatedDataList());
});

function setChartType(type:any){
  kLineChart.setStyles({
        candle: {
          type,
        },
     
  });
}

onUnmounted(()=>{
  dispose("chart-type-k-line");
});


</script>


<style>
.k-line-chart-container {
  display: flex;
  flex-direction: column;
  margin: 10px;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
  width: 620px;
  height: 440px;
  padding: 16px 6px 16px 16px;
}

.k-line-chart-title {
  margin: 0;
  color: #252525;
  padding-bottom: 10px;
}

.k-line-chart {
  display: flex;
  flex: 1;
}
.k-line-chart-menu-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
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

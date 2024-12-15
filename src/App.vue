<template>
  <div class="home">
    <router-view >
      <StockView class="stockView"/>
  </router-view>
</div>
  
</template>

<script setup lang="ts">
import StockView from './views/StockView.vue'  
// import router from './router'
</script>
<style scoped>
.home{
  width: 100%;
  height: 100%;
  margin: 0px;
}
.stockView{
  padding-left: 15px;
  padding-right: 15px;
}

</style>

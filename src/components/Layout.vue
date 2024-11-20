<template>
  <div class="k-line-chart-container">
    <h3 class="k-line-chart-title">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="Layout">
import { defineProps } from 'vue'
defineProps({title:String})
</script>

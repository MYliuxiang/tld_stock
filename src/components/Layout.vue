<template>
  <div class="k-line-chart-container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="Layout">
import { defineProps } from 'vue'
defineProps({title:String})
</script>

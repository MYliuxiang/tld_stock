import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'


const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.provide('$axios',axios)
app.mount('#app')

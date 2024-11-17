import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)
// axios.defaults.baseURL = "https://apphis.longhuvip.com/w1/api/index.php"
// axios.defaults.baseURL = '/apphis';
 
let config = {
// 这里的api就是获取configJS中的地址
  baseURL: '/api'
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);
app.config.globalProperties.$axios = axios;
app.use(createPinia())
app.use(router)
app.provide('$axios',axios)

app.mount('#app')

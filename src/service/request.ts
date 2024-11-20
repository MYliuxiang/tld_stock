import axios from 'axios'
import { ElMessage } from 'element-plus'

/*
 * 创建实例
 * 与后端服务通信
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
})

/**
 * 请求拦截器
 * 功能：配置请求头
 */
service.interceptors.request.use(
  (config) => {
    // 一般会在这里对请求头进行一些设置 ; 可以根据自己项目的需求进行设置
    // const token = '222'
    // config.headers.authorization = 'Bearer ' + token
    return config
  },
  (error) => {
    console.error('网络错误，请稍后重试')
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 功能：处理异常
 */
service.interceptors.response.use(
  // 响应成功
  (response) => {
    const { data, message, success } = response.data
    if (success) {
      return data
    } else {
      ElMessage.error(message)
    }
  },

  (error) => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 401
    ) {
      ElMessage.error(error.message)
    }

    return Promise.reject(error)
  }
)

export default service

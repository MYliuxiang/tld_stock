<template>
    <ChartType/>
</template>

<script setup lang="ts">
    import { useRoute } from 'vue-router';
    import ChartType from '../components/ChartType.vue';
    import { onMounted } from 'vue';
    import axios from 'axios';
    import { getCurrentInstance } from 'vue';
    const route = useRoute()
    const {code, line15, line30} = route.query;

    let reqInstance = axios.create({
        timeout: 6000,
    })

    const header = {
             "User-Agent" : 'PostmanRuntime/7.42.0',
             'Accept-Encoding': 'gzip, deflate, br',
             "Content-Type":"multipart/form-data; boundary=<calculated when request is sent>",
             "Accept":"*/*"
         };

   
    reqInstance.interceptors.request.use(config=>{
        // config.headers['User-Agent']  = 'PostmanRuntime/7.42';
        return config;
    }, error=>{
        return Promise.reject(error);
    })


     onMounted(()=>{
      
        const jsonData = loadData();
        // console.log('hahah');
        // console.log(jsonData);

    });

     function loadData(){

        // const params = {
        //     'Index':'4',
        //     'Is_FS':'1',
        //     'PhoneOSNew':'2',
        //     'StockID':'603679',
        //     'Type':'d',
        //     'VerSion':'5.16.0.5',
        //     'a':'GetKLineDay_W14',
        //     'apiv':'w38',
        //     'c':'StockLineData',
        //     'st':'240',
        // }
        const params = {
            'Day':'2024-11-18',
            'PhoneOSNew':'2',
            'StockID':'603679',
            'VerSion':'5.16.0.5',
            'a':'GetStockTrendMin',
            'apiv':'w38',
            'c':'StockL2Data',
        }
    
        
        const respose =  reqInstance.get('/kpl/getseleted').then((data)=>{
            console.log(data.data);
        })
        // return respose;
    }


</script>

<style>

</style>
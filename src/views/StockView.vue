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

    const {proxy} = getCurrentInstance()


     onMounted(()=>{
      
        const jsonData = loadData();
        console.log('hahah');
        console.log(jsonData);

    });

     function loadData(){
        const respose =  axios.post('/getseleted',{
            Index:'0',
            Is_FS:'1',
            PhoneOSNew:'2',
            StockID:'603679',
            Type:'d',
            VerSion:'5.16.0.5',
            a:'GetKLineDay_W14',
            apiv:'w38',
            c:'StockLineData',
            st:'240',

        }).then((data)=>{
            console.log(data);

        })
        return respose;
    }


</script>

<style>

</style>
import { createRouter, createWebHistory } from 'vue-router';
import StockView from '../views/StockView.vue';
const routes = [
    {
        path: '/stock',
        component: StockView,
        name: 'stock',
        props: true
    },
    // {path: '/',redirect:'/stock'}
];
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});
export default router;
//# sourceMappingURL=index.js.map
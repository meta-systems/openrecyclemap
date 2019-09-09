import moment from 'moment'
import Vue from 'vue'
import VueRouter from 'vue-router'
import aboutComponent from '../components/About'
import mapComponent from '../components/Map'

moment.locale('ru');

Vue.use(VueRouter);

const routes = [
    {
        name: 'root',
        path: '/',
        redirect: to => {
            return { name: 'about' };
        }
    },
    {
        name: 'about',
        path: '/about',
        component: aboutComponent
    },
    {
        name: 'map',
        path: '/map',
        component: mapComponent
    }
];

const router = new VueRouter({
    mode: 'history',
    routes: routes
});

export default router
import moment from 'moment'
import Vue from 'vue'
import VueRouter from 'vue-router'
import aboutComponent from '../components/About'
import mapComponent from '../components/Map'
import loginComponent from '../components/Login'
import landComponent from '../components/Land'

moment.locale('ru');

Vue.use(VueRouter);

const routes = [
    {
        name: 'root',
        path: '/',
        redirect: to => {
            return { name: 'login' };
        }
    },
    {
        name: 'about',
        path: '/about',
        component: aboutComponent
    },
    {
        name: 'node',
        path: '/r/:node',
        component: mapComponent
    },
    {
        name: 'position',
        path: '/map/:zoom/:lat/:lon',
        component: mapComponent
    },
    {
        name: 'map',
        path: '/map/:action?',
        component: mapComponent
    },
    {
        name: 'login',
        path: '/login',
        component: loginComponent
    },
    {
        name: 'land',
        path: '/land',
        component: landComponent
    }
];

const router = new VueRouter({
    mode: 'history',
    routes: routes
});

export default router
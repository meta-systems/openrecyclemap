import moment from 'moment'
import Vue from 'vue'
import VueRouter from 'vue-router'
import listComponent from '../components/List'
import mapComponent from '../components/Map'

moment.locale('ru');

Vue.use(VueRouter);

const routes = [
    {
        name: 'root',
        path: '/',
        redirect: to => {
            return { name: 'list' };
        }
    },
    {
        name: 'list',
        path: '/list',
        component: listComponent
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
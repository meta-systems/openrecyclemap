import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import colors from 'vuetify/lib/util/colors'
import VueAnalytics from 'vue-analytics'
import i18n from './i18n'

Vue.use(Vuetify, {
    iconfont: 'md',
    theme: {
        primary: colors.green.darken4,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3
    }
});

Vue.use(VueAnalytics, {
    id: 'UA-122809-35',
    router
});

Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            // exclude buttons
            if(event.target.classList.contains('popup_activator')) {
                return;
            }
            // here I check that click was outside the el and his childrens
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    },
});

Vue.config.productionTip = false;

import 'vuetify/dist/vuetify.min.css'

new Vue({
    i18n,
    router: router,
    render: h => h(App)
}).$mount('#app');

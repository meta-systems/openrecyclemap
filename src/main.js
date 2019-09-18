import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from './router'
import colors from 'vuetify/lib/util/colors'
import VueAnalytics from 'vue-analytics'

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
    id: 'G-Q93XCW3E1M',
    router
});

Vue.config.productionTip = false;

import 'vuetify/dist/vuetify.min.css'

new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app');

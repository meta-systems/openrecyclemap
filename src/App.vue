<template>
    <v-app id="inspire">
        <v-content>
            <router-view></router-view>
        </v-content>
        <v-bottom-nav color="primary" :value="true" fixed dark>
            <v-btn :to="{path: '/map'}" dark>
                <span>Карта</span>
                <v-icon>map</v-icon>
            </v-btn>
            <v-btn :to="{path: '/login'}" dark>
                <span>Пользователь</span>
                <v-icon>account_circle</v-icon>
            </v-btn>
            <v-btn :to="{path: '/about'}" dark>
                <span>О проекте</span>
                <v-icon>info</v-icon>
            </v-btn>
            <v-btn :to="{path: '/map/add'}" dark>
                <span>Добавить</span>
                <v-icon>add_circle</v-icon>
            </v-btn>
        </v-bottom-nav>
    </v-app>
</template>

<script>
    import moment from 'moment'

    export default {
        data: function () {
            return {
                title: 'OpenRecycleMap'
            }
        },
        methods: {
            processParams: function (route) {
                if(route.name === 'about') {
                }
            }
        },
        created() {
            this.processParams(this.$route);
        },
        mounted() {

            let height = 
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;

            document.getElementsByClassName('application--wrap')[0].setAttribute("style","min-height:"+height+"px");
        },
        watch: {
            '$route' (to, from) {
                this.processParams(to);
            }
        }
    }
</script>

<style>

</style>
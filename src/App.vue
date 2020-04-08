<template>
    <v-app id="inspire">
        <v-content>
            <router-view></router-view>
        </v-content>
        <!-- <v-bottom-nav color="primary" :value="true" fixed dark>
            <v-btn :to="{path: '/map'}" dark>
                <span>{{ $t('menu.map') }}</span>
                <v-icon>map</v-icon>
            </v-btn>
            <v-btn :to="{path: '/login'}" dark>
                <span>{{ $t('menu.user') }}</span>
                <v-icon>account_circle</v-icon>
            </v-btn>
            <v-btn :to="{path: '/about'}" dark>
                <span>{{ $t('menu.about') }}</span>
                <v-icon>info</v-icon>
            </v-btn>
            <v-btn :to="{path: '/map/add'}" dark>
                <span>{{ $t('menu.add') }}</span>
                <v-icon>add_circle</v-icon>
            </v-btn>
        </v-bottom-nav> -->
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
            },
            fixHeight: function () {
                let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                let wrapEl = document.getElementsByClassName('application--wrap')[0];
                wrapEl.setAttribute("style", "min-height:"+height+"px");
            }
        },
        created() {
            this.processParams(this.$route);
        },
        mounted() {
            this.fixHeight();
            window.addEventListener('resize', this.fixHeight);
        },
        watch: {
            '$route' (to, from) {
                this.processParams(to);
            }
        }
    }
</script>

<style>
    html,body {
        height: 100%;
    }
    .v-item-group.v-bottom-nav--fixed {
        z-index: 11;
    }
</style>
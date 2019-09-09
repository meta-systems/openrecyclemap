<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" fixed app>
            <v-list dense>
                <v-list-tile :to="{path: '/about'}">
                    <v-list-tile-action><v-icon>home</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>О проекте</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{path: '/map'}">
                    <v-list-tile-action><v-icon>map</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>Карта</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="">
                <v-icon>info</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
    import moment from 'moment'
    import fetchMixin from './mixins/Fetch'

    export default {
        data: function () {
            return {
                title: 'OSM Recycling',
                drawer: null
            }
        },
        mixins: [fetchMixin],
        methods: {
            processParams: function (route) {
                if(route.name === 'about') {
                    //this.title = 'OSM Recycling';
                }
                else {
                    this.title = 'OSM Recycling';
                }
            }
        },
        created() {
            this.processParams(this.$route);

            /*
            this.fetch('index', [], function (result) {
                if(result.status && result.inserted) {
                    console.log(result.inserted);
                }
                else if(!result.status) {
                    console.log(result.message);
                }
            })*/
        },
        watch: {
            '$route' (to, from) {
                this.processParams(to);
            }
        }
    }
</script>
<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" fixed app>
            <v-list dense>
                <v-list-tile :to="{path: '/about'}">
                    <v-list-tile-action><v-icon>info</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>О проекте</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{path: '/login'}">
                    <v-list-tile-action><v-icon>account_circle</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>Пользователь</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{path: '/map'}">
                    <v-list-tile-action><v-icon>map</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>Карта</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
                <v-list-tile :to="{path: '/map/add'}">
                    <v-list-tile-action><v-icon>add_circle</v-icon></v-list-tile-action>
                    <v-list-tile-content><v-list-tile-title>Добавить</v-list-tile-title></v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fixed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon :to="{path: '/map/add'}">
                <v-icon>add</v-icon>
            </v-btn>
        </v-toolbar>
        <v-content>
            <router-view></router-view>
        </v-content>
    </v-app>
</template>

<script>
    import moment from 'moment'

    export default {
        data: function () {
            return {
                title: 'OpenRecycleMap',
                drawer: null
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
        watch: {
            '$route' (to, from) {
                this.processParams(to);
            }
        }
    }
</script>

<style>
    .v-navigation-drawer--is-mobile {
        z-index: 1111 !important;
    }
</style>
<template>
    <div>
        <v-list two-line subheader>
            <v-subheader inset>Test</v-subheader>
            <v-list-tile @click="loadReport">
                <v-list-tile-avatar>
                    <v-icon>cloud_upload</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                    <v-list-tile-title>Загрузить</v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </div>
</template>

<script>
    import fetchMixin from '../mixins/Fetch'

    export default {
        data: function () {
            return {
                list: []
            };
        },
        mixins: [fetchMixin],
        methods: {
            loadReport: function () {

            },
            fetchLists: function () {
                this.fetch('list', [], function (operations) {
                    console.log(operations);
                });
            }
        },
        created() {
            this.fetchLists();
        }
    }
</script>

<style>
    .card-form {
        display: none;
    }
</style>
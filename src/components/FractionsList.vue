<template>
    <div>
        <v-layout row wrap class="fractions-list">
            <v-flex xs6 sm4>
                <v-checkbox @change="clearRecycling" v-model="waste.waste_disposal" label="Несортируемые отходы" color="red darken-3" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="waste.glass_bottles" label="Стеклянные бутылки" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="waste.plastic" label="Пластик" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="waste.paper" label="Бумага" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="waste.cans" label="Алюминиевые банки" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="waste.batteries" label="Батарейки" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="waste.low_energy_bulbs" label="Лампочки" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="waste.plastic_bags" label="Пакеты" color="success" hide-details></v-checkbox>
            </v-flex>
        </v-layout>
        <v-text-field label="Описание" box v-model="description"></v-text-field>
    </div>
</template>

<script>
    export default {
        name: "fractions-list",
        props: ['waste', 'sheet', 'description'],
        methods: {
            clearRecycling: function () {
                for (let key in this.waste) {
                    if(key !== 'waste_disposal') {
                        this.waste[key] = false;
                    }
                }
            },
            clearWaste: function () {
                this.waste.waste_disposal = false;
            },
            initWaste: function () {
                this.clearWaste();
                this.clearRecycling();
                this.description = '';
            }
        },
        watch: {
            sheet: {
                handler(val) {
                    if(val) {
                        this.initWaste();
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .fractions-list {
        margin-bottom:10px;
    }
</style>
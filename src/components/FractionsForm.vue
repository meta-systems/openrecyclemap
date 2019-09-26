<template>
    <div>
        <v-layout row wrap class="fractions-list">
            <v-flex xs6 sm4>
                <v-checkbox @change="clearRecycling" v-model="waste_disposal" label="Несортируемые отходы" color="red darken-3" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="recycling.glass_bottles" label="Стеклянные бутылки" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="recycling.plastic" label="Пластик" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="recycling.paper" label="Бумага" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="recycling.cans" label="Алюминиевые банки" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="recycling.batteries" label="Батарейки" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="recycling.low_energy_bulbs" label="Лампочки" color="success" hide-details></v-checkbox>
            </v-flex>
            <v-flex xs6 sm4>
                <v-checkbox @change="clearWaste" v-model="recycling.plastic_bags" label="Пакеты" color="success" hide-details></v-checkbox>
            </v-flex>
        </v-layout>
        <v-text-field label="Описание" box v-model="description"></v-text-field>
        <v-btn class="mt-6" color="primary" @click="saveData">Сохранить</v-btn>
        <v-btn class="mt-6" flat color="primary" @click="cancelAddMode">Отмена</v-btn>
    </div>
</template>

<script>
    export default {
        name: "fractions-form",
        props: ['sheet'],
        data: function () {
            return {
                description: '',
                waste_disposal: false,
                recycling: {
                    plastic: false,
                    paper: false,
                    cans: false,
                    glass_bottles: false,
                    batteries: false,
                    low_energy_bulbs: false,
                    plastic_bags: false,
                    plastic_bottles: false
                }
            }
        },
        methods: {
            clearRecycling: function () {
                for (let key in this.recycling) {
                    this.recycling[key] = false;
                }
            },
            clearWaste: function () {
                this.waste_disposal = false;
            },
            initWaste: function () {
                this.clearWaste();
                this.clearRecycling();
                this.description = null;
            },
            hasData: function () {
                for (let key in this.recycling) {
                    if(this.recycling.hasOwnProperty(key) && this.recycling[key]) {
                        return true;
                    }
                }
                return this.waste_disposal;
            },
            buildTags: function () {
                let tags = {
                    amenity: this.waste_disposal ? 'waste_disposal' : 'recycling'
                };
                if (this.description) {
                    tags.description = this.description;
                }
                if (!this.waste_disposal) {
                    for (let key in this.recycling) {
                        if(this.recycling.hasOwnProperty(key) && this.recycling[key]) {
                            tags['recycling:'+key] = 'yes';
                        }
                    }
                }
                return tags;
            },
            saveData: function () {
                if(!this.hasData()) {
                    return;
                }
                let tags = this.buildTags();
                this.$emit('form-save', {
                    tags: tags,
                    amenity: tags.amenity
                });
            },
            cancelAddMode: function () {
                this.$emit('form-cancel');
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
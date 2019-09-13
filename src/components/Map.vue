<template>
    <div id="map_parent" class="text-center">
        <div id="map_container" :class="{map_container_behind: sheet}"></div>
        <v-snackbar v-model="snackbar">
            {{ snackbar_text }}
            <v-btn color="pink" @click="snackbar = false" flat>Ок</v-btn>
        </v-snackbar>
        <v-bottom-sheet v-model="sheet" class="add-sheet" persistent>
            <v-sheet class="text-center" height="50%">
                <h3>Подтвердите, что маркер установлен верно и укажите типы принимаемых отходов.</h3>
                <v-checkbox @click="clearRecycling" v-model="waste.waste_disposal" label="Несортируемые отходы" color="red darken-3" hide-details row></v-checkbox>
                <v-checkbox @click="clearWaste" v-model="waste.plastic" label="Пластик" color="success" hide-details row></v-checkbox>
                <v-checkbox @click="clearWaste" v-model="waste.paper" label="Бумага" color="success" hide-details row></v-checkbox>
                <v-checkbox @click="clearWaste" v-model="waste.glass" label="Стекло" color="success" hide-details row></v-checkbox>
                <v-checkbox @click="clearWaste" v-model="waste.batteries" label="Батарейки" color="success" hide-details row></v-checkbox>
                <v-checkbox @click="clearWaste" v-model="waste.low_energy_bulbs" label="Ртутные лампы" color="success" hide-details row></v-checkbox>
                <v-btn class="mt-6" color="primary" @click="saveData">Сохранить</v-btn>
                <v-btn class="mt-6" flat color="pink" @click="cancelAddMode">Отмена</v-btn>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>
    import overpassMixin from '../mixins/Overpass'
    import oauthMixin from '../mixins/Oauth'

    export default {
        data: function () {
            return {
                map: null,
                snackbar_text: null,
                snackbar: false,
                adding: false,
                marker: null,
                sheet: false,
                waste: {
                    waste_disposal: false,
                    plastic: false,
                    paper: false,
                    glass: false,
                    batteries: false,
                    low_energy_bulbs: false
                }
            };
        },
        mixins: [overpassMixin, oauthMixin],
        methods: {
            setupMap: function () {
                this.map = L.map('map_container').setView([57.82, 28.35], 13);
                L.tileLayer('//api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoicGV0cm92bm4iLCJhIjoibVlfV3c0OCJ9.9me_07zQBJKqR7LEEEY_Rg'
                }).addTo(this.map);
            },
            loadData: function () {
                let map = this.map;
                this.fetchAmenity(function (data) {
                    let ovData = osmtogeojson(data);
                    L.geoJson(ovData, {
                        style: function (feature) {
                            let color = feature.properties.tags.amenity === 'recycling'
                                ? '#2E7D32'
                                : '#8D6E63';
                            return  {
                                weight: 2,
                                opacity: 0.7,
                                color: color,
                                fillOpacity: 0.2
                            };
                        },
                        onEachFeature: function (feature, layer) {
                            layer.on('click', function () {
                                console.log(feature.properties.tags);
                            })
                        },
                        pointToLayer: function(geoJsonPoint, latlng) {
                            return new L.CircleMarker(latlng);
                        }
                    }).addTo(map);
                });
            },
            enableAddMode: function () {
                if(!this.authenticated) {
                    this.$router.replace({path: '/login'});
                }
                let mapElem = this.map.getContainer();
                mapElem.style.cursor = 'crosshair';
                this.snackbar_text = 'Укажите точку на карте';
                this.snackbar = true;
                this.adding = true;
            },
            disableAddMode: function () {
                let mapElem = this.map.getContainer();
                this.snackbar = false;
                this.adding = false;
                mapElem.style.cursor = 'default';
                this.$router.replace({path: '/map'});
            },
            cancelAddMode: function () {
                this.sheet = false;
                if(this.marker) {
                    this.map.removeLayer(this.marker);
                    this.marker = null;
                }
            },
            saveData: function () {
                if(!this.waste.waste_disposal && !this.waste.plastic && !this.waste.paper
                        && !this.waste.glass && !this.waste.batteries && !this.waste.low_energy_bulbs) {
                    return;
                }
                this.sheet = false;
                if(this.marker) {
                    this.addNodeSuccess = function () {
                        this.snackbar_text = 'Информация успешно добавлена.';
                        this.snackbar = true;
                    };
                    this.addNodeFail = function () {
                        this.snackbar_text = 'Ошибка! Попробуйте позже.';
                        this.snackbar = true;
                    };
                    this.addNode(this.marker.getLatLng(), this.waste);
                }
            },
            clearRecycling: function () {
                this.waste.plastic = false;
                this.waste.paper = false;
                this.waste.glass = false;
                this.waste.batteries = false;
                this.waste.low_energy_bulbs = false;
            },
            clearWaste: function () {
                this.waste.waste_disposal = false;
            }
        },
        mounted() {
            this.authInit();
            this.setupMap();
            this.loadData();
            if(this.$route.params.action === 'add') {
                this.enableAddMode();
            }
            let component = this;
            this.map.on('click', function(e) {
                if(component.adding) {
                    component.disableAddMode();
                    if(component.marker) {
                        component.map.removeLayer(component.marker);
                    }
                    component.marker = L.marker(e.latlng).addTo(component.map);
                    component.sheet = true;
                    component.map.setView(e.latlng, 18, {animate: false});
                }
            });
        },
        watch: {
            '$route'(to, from) {
                if(to.params.action === 'add') {
                    this.enableAddMode();
                }
                else {
                    this.disableAddMode();
                }
            },
            sheet() {
                setTimeout(() => this.map.invalidateSize(), 10);
            }
        }
    }
</script>

<style>
    #map_parent, #map_container {
        height: 100%;
        overflow: hidden;
    }
    #map_container {
        z-index: 0;
    }
    .map_container_behind {
        height: calc(100% - 336px) !important;
    }
</style>
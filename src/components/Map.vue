<template>
    <div id="map_parent" class="text-center">
        <div id="map_container" style="z-index: 0;"></div>
        <v-snackbar v-model="snackbar">
            Укажите точку на карте
            <v-btn color="pink" @click="snackbar = false" flat>Ок</v-btn>
        </v-snackbar>
        <v-bottom-sheet v-model="sheet" class="add-sheet" persistent>
            <v-sheet class="text-center" height="50%">
                <h3>Подтвердите, что маркер установлен верно и укажите типы принимаемых отходов.</h3>
                <v-checkbox v-model="waste.waste_disposal" label="Несортируемые отходы" color="red darken-3" hide-details row></v-checkbox>
                <v-checkbox v-model="waste.plastic" label="Пластик" color="success" hide-details row></v-checkbox>
                <v-checkbox v-model="waste.paper" label="Бумага" color="success" hide-details row></v-checkbox>
                <v-checkbox v-model="waste.glass" label="Стекло" color="success" hide-details row></v-checkbox>
                <v-checkbox v-model="waste.batteries" label="Батарейки" color="success" hide-details row></v-checkbox>
                <v-checkbox v-model="waste.low_energy_bulbs" label="Ртутные лампы" color="success" hide-details row></v-checkbox>
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
                this.map = L.map('map_container').setView([57.82, 28.37], 13);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoicGV0cm92bm4iLCJhIjoibVlfV3c0OCJ9.9me_07zQBJKqR7LEEEY_Rg'
                }).addTo(this.map);
            },
            loadData: function () {
                var map = this.map;
                fetch('https://lz4.overpass-api.de/api/interpreter', {
                    method: 'POST',
                    body: 'data='+this.queryWasteDisposal()
                })
                    .then(function (response) {
                        console.log(response);
                        if(!response.ok) {
                            throw new Error(response.status);
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        var ovData = osmtogeojson(data);
                        L.geoJson(ovData, {
                            style: {
                                weight: 2,
                                opacity: 0.6,
                                color: '#3245ad',
                                fillOpacity: 0.2
                            },
                            onEachFeature: function (feature, layer) {

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
                    this.addNode(this.marker.getLatLng(), this.waste);
                }
            }
        },
        mounted() {
            this.authInit();
            console.log(this.authenticated);
            this.setupMap();
            this.loadData();
            if(this.$route.params.action === 'add') {
                this.enableAddMode();
            }
            let component = this;
            this.map.on('click', function(e) {
                if(component.adding) {
                    component.disableAddMode();
                    component.marker = L.marker(e.latlng).addTo(component.map);
                    component.sheet = true;
                    component.map.setView(e.latlng, 18);
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
            }
        }
    }
</script>

<style>
    #map_parent, #map_container {
        height: 100%;
    }
</style>
<template>
    <div id="map_parent" class="text-center">
        <router-link class="orm_logo orm_logo_map" to="/about"></router-link>
        <router-link class="orm_map_add" to="/map/add"></router-link>
        <div id="map_container"></div>
        <nodes-filter></nodes-filter>
        <v-snackbar v-model="snackbar">
            {{ snackbar_text }}
            <v-btn color="pink" @click="snackbar = false" flat>Ок</v-btn>
        </v-snackbar>
        <v-bottom-sheet v-model="sheet" add-sheet persistent>
            <v-sheet class="text-center" height="50%">
                <h3>Подтвердите, что маркер установлен верно и укажите типы принимаемых отходов.</h3>
                <v-layout row wrap fractions-list>
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
                <v-btn class="mt-6" color="primary" @click="saveData">Сохранить</v-btn>
                <v-btn class="mt-6" flat color="primary" @click="cancelAddMode">Отмена</v-btn>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>
    import osmtogeojson from 'osmtogeojson'
    import overpassMixin from '../mixins/Overpass'
    import oauthMixin from '../mixins/Oauth'
    import NodesFilter from './NodesFilter'
    import L from 'leaflet'
    import 'font-awesome/css/font-awesome.min.css'
    import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
    import 'leaflet.locatecontrol';

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
                    cans: false,
                    glass_bottles: false,
                    batteries: false,
                    low_energy_bulbs: false,
                    plastic_bags: false,
                    plastic_bottles: false
                },
                labels: {
                    recycling: {
                        plastic: 'Пластик',
                        paper: 'Бумага',
                        cans: 'Алюминиевые банки',
                        glass_bottles: 'Стеклянные бутылки',
                        batteries: 'Батарейки',
                        low_energy_bulbs: 'Лампочки',
                        plastic_bags: 'Пакеты',
                        plastic_bottles: 'Пластиковые бутылки'
                    },
                    waste_disposal: 'Мусорный контейнер'
                }
            };
        },
        components: {
            NodesFilter
        },
        mixins: [overpassMixin, oauthMixin],
        methods: {
            setupMap: function () {
                this.map = L.map('map_container',{
                    zoomControl: false
                }).setView([57.82, 28.35], 13);
                var mapbox = L.tileLayer('//api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 21,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoicGV0cm92bm4iLCJhIjoibVlfV3c0OCJ9.9me_07zQBJKqR7LEEEY_Rg'
                }).addTo(this.map);

                var mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 21,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });



                var baseLayers = {
                    "Mapbox": mapbox,
                    "Mapnik": mapnik
                };

                L.control.layers(baseLayers).addTo(this.map);

                //map.removeLayer(grayscale);
                //map.addLayer(streets);

                L.control.locate({
                     position:'bottomright'
                }).addTo(this.map);

                L.control.zoom({
                     position:'topright'
                }).addTo(this.map);
            },
            loadData: function () {
                let map = this.map;
                let component = this;
                this.fetchAmenity(function (data) {
                    let ovData = osmtogeojson(data);
                    L.geoJson(ovData, {
                        style: function (feature) {
                            let color = feature.properties.amenity === 'recycling'
                                ? '#2E7D32'
                                : '#8D6E63';
                            return  {
                                opacity: 1,
                                fillOpacity: 1,
                                color: 'white',
                                fillColor: color,
                                weight: 1,
                                radius: 8
                            };
                        },
                        onEachFeature: function (feature, layer) {
                            layer.on('click', function (ev) {
                                console.log(feature.properties);
                            })
                        },
                        pointToLayer: function(geoJsonPoint, latlng) {
                            let nodeTypes = [];
                            let geoJsonProps = geoJsonPoint.properties;
                            if(geoJsonProps.hasOwnProperty('amenity') && geoJsonProps['amenity'] === 'waste_disposal') {
                                nodeTypes.push(component.labels.waste_disposal);
                            }
                            else {
                                for (let key in component.labels.recycling) {
                                    if(geoJsonProps.hasOwnProperty('recycling:'+key)) {
                                        nodeTypes.push(component.labels.recycling[key]);
                                    }
                                }
                            }
                            let osmLink = '<a target="_blank" href="https://openstreetmap.org/'+geoJsonProps.id+'">node</a>';
                            return new L.CircleMarker(latlng).bindPopup(nodeTypes.join(', ') + '<br/>' + osmLink);
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
            hasData: function () {
                for (let key in this.waste) {
                    if(this.waste.hasOwnProperty(key) && this.waste[key]) {
                        return true;
                    }
                }
                return false;
            },
            saveData: function () {
                if(!this.hasData()) {
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
            }
        },
        mounted() {
            this.initWaste();
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
                    component.initWaste();
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
            sheet(val) {
                let mapEl = this.map.getContainer();
                if(val) {
                    mapEl.classList.add('map_container_behind');
                }
                else {
                    mapEl.classList.remove('map_container_behind');
                }
                setTimeout(() => this.map.invalidateSize(), 10);
            }
        }
    }
</script>

<style>
    #map_parent {
        height: 100%;
        overflow: hidden;
    }
    #map_container {
        height: 90%;
        z-index: 0;
    }
    .map_container_behind {
        height: calc(100% - 204px) !important;
    }
    .add-sheet { /* not working */
        padding:10px;
    }
    .v-bottom-sheet .v-sheet{
    padding:10px;
    }
    .fractions-list {
    margin-bottom:10px;
    }
    .leaflet-top.leaflet-right {
        /*top:50%;*/
        /*transform: translateY(-50%);*/
    }
    .orm_logo_map {
        position:absolute;
        top:15px;
        left:15px;
        z-index: 1;
    }
    .orm_map_add {
        position:absolute;
        bottom:21%;
        right:20px;
        background:white;
        border-radius:30px;
        width:40px;
        height:40px;
        z-index: 1;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='36' height='36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='15.46' y='8.45' width='5.14' height='19.47' rx='.84' fill='%23248A00'/%3E%3Crect x='8.29' y='20.76' width='5.14' height='19.47' rx='.84' transform='rotate(-90 8.3 20.76)' fill='%23248A00'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        /*background-size:contain;*/
        background-position: center;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.26);
    }
</style>
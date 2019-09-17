<template>
    <div id="map_parent" class="text-center">
        <router-link class="orm_logo orm_logo_map" to="/about"></router-link>
        <div class="orm_layers" @click="changeLayers"></div>
        <router-link class="orm_map_add" to="/map/add"></router-link>
        <div id="map_container"></div>
        <div class="node_info" v-if="selectedLayer">
            {{ selected.info }}
            <a target="_blank" :href="selected.osmLink">node</a>
            <a target="_blank" :href="selected.josmLink">josm</a>
        </div>
        <nodes-filter v-on:filter-nodes="filterNodes" :filter="filter" v-if="!selectedLayer"></nodes-filter>
        <v-snackbar v-model="snackbar">
            {{ snackbar_text }}
            <v-btn color="pink" @click="snackbar = false" flat>Ок</v-btn>
        </v-snackbar>
        <v-bottom-sheet v-model="sheet" persistent>
            <v-sheet class="text-center" height="50%">
                <h3>Подтвердите, что маркер установлен верно и укажите типы принимаемых отходов.</h3>
                <fractions-list :waste="waste" :sheet="sheet"></fractions-list>
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
    import FractionsList from './FractionsList'
    import L from 'leaflet'
    import 'font-awesome/css/font-awesome.min.css'
    import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
    import 'leaflet.locatecontrol';

    export default {
        data: function () {
            return {
                map: null,
                baseLayers: [],
                selectedLayer: null,
                selected: {},
                snackbar_text: null,
                snackbar: false,
                adding: false,
                marker: null,
                sheet: false,
                layer: null,
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
                filter: {
                    plastic: true,
                    paper: true,
                    cans: true,
                    glass_bottles: true,
                    batteries: true,
                    low_energy_bulbs: true,
                    plastic_bags: true,
                    //plastic_bottles: true,
                    waste_disposal: false
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
            NodesFilter,
            FractionsList
        },
        mixins: [overpassMixin, oauthMixin],
        methods: {
            setupMap: function () {
                this.map = L.map('map_container', {
                    zoomControl: false
                }).setView([57.82, 28.35], 13);

                let mapbox = L.tileLayer('//api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 21,
                    id: 'mapbox.streets',
                    accessToken: process.env.VUE_APP_MAPBOX_TOKEN
                }).addTo(this.map);

                let mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 21,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });

                let here = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}', {
                    attribution: 'Map &copy; 2016 <a href="http://developer.here.com">HERE</a>',
                    subdomains: '1234',
                    base: 'aerial',
                    type: 'maptile',
                    scheme: 'satellite.day',
                    app_id: process.env.VUE_APP_HERE_ID,
                    app_code: process.env.VUE_APP_HERE_APPCODE,
                    mapID: 'newest',
                    maxZoom: 20,
                    language: 'eng',
                    format: 'png8',
                    size: '256',
                    url: 'here'
                });

                this.baseLayers = {
                    "Mapbox": mapbox,
                    "Mapnik": mapnik,
                    "Спутник": here
                };
                //L.control.layers(this.baseLayers).addTo(this.map);

                L.control.locate({
                     position:'bottomright'
                }).addTo(this.map);

                L.control.zoom({
                     position:'topright'
                }).addTo(this.map);
            },
            loadData: function (filter) {
                let map = this.map;
                let component = this;
                if(this.layer) {
                    map.removeLayer(this.layer);
                }
                this.fetchAmenity(function (data) {
                    let ovData = osmtogeojson(data);
                    component.layer = L.geoJson(ovData, {
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
                        filter: function (feature) {
                            let geoJsonProps = feature.properties;
                            if(!filter) {
                                return true;
                            }
                            if(geoJsonProps.hasOwnProperty('amenity') && geoJsonProps['amenity'] === 'waste_disposal') {
                                return filter.waste_disposal;
                            }
                            else {
                                for (let key in filter) {
                                    if(!filter[key] || key === 'waste_disposal') {
                                        continue;
                                    }
                                    if(geoJsonProps.hasOwnProperty('recycling:'+key) && geoJsonProps['recycling:'+key] === 'yes') {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        },
                        onEachFeature: function (feature, layer) {
                            layer.on('click', function (ev) {
                                L.DomEvent.stopPropagation(ev);
                                if(component.selectedLayer) {
                                    component.selectedLayer.setStyle({
                                        weight: 1
                                    });
                                }
                                let nodeTypes = [];
                                let geoJsonProps = feature.properties;
                                if(geoJsonProps.hasOwnProperty('amenity') && geoJsonProps['amenity'] === 'waste_disposal') {
                                    nodeTypes.push(component.labels.waste_disposal);
                                }
                                else {
                                    for (let key in component.labels.recycling) {
                                        if(geoJsonProps.hasOwnProperty('recycling:'+key) && geoJsonProps['recycling:'+key] === 'yes') {
                                            nodeTypes.push(component.labels.recycling[key]);
                                        }
                                    }
                                }
                                component.selectedLayer = layer;
                                component.selected = {
                                    info: nodeTypes.join(', '),
                                    osmLink: 'https://openstreetmap.org/' + geoJsonProps.id,
                                    josmLink: 'http://127.0.0.1:8111/load_object?objects=n' + geoJsonProps.id.replace('node/', '')
                                };
                                layer.setStyle({
                                    weight: 5
                                });
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
            changeLayers: function () {
                let nextkey = Object.keys(this.baseLayers)[0];
                let removed = false;
                for (let key in this.baseLayers) {
                    if(removed) {
                        nextkey = key;
                        break;
                    }
                    if(this.map.hasLayer(this.baseLayers[key])) {
                        this.map.removeLayer(this.baseLayers[key]);
                        removed = true;
                    }
                }
                this.map.addLayer(this.baseLayers[nextkey]);
            },
            filterNodes: function () {
                this.loadData(this.filter);
            }
        },
        mounted() {
            this.authInit();
            this.setupMap();
            this.loadData(this.filter);
            if(this.$route.params.action === 'add') {
                this.enableAddMode();
            }
            let component = this;
            this.map.on('click', function(e) {
                if(component.selectedLayer) {
                    component.selectedLayer.setStyle({
                        weight: 1
                    });
                    component.selectedLayer = null;
                }
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
    .v-bottom-sheet .v-sheet{
    padding:10px;
    }
    .leaflet-top.leaflet-right {
        top:10%;
        /*transform: translateY(-50%);*/
    }
    .orm_logo_map {
        position:absolute;
        top:15px;
        left:15px;
        z-index: 1;
    }

    .orm_layers {
        position:absolute;
        top:21px;
        right:20px;
        background:white;
        border-radius:30px;
        width:40px;
        height:40px;
        z-index: 1;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='50' height='50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22.47 21.38L9.23 27.52C8 28.09 8 29 9.23 29.58l13.24 6.13c1.23.57 3.22.57 4.45 0l13.24-6.13c1.23-.57 1.23-1.5 0-2.06l-13.24-6.14a6.02 6.02 0 0 0-4.45 0z' fill='%23B3B3B3'/%3E%3Cpath d='M22.47 13.03L9.23 19.16c-1.23.57-1.23 1.5 0 2.06l13.24 6.14c1.23.56 3.22.56 4.45 0l13.24-6.14c1.23-.57 1.23-1.49 0-2.06l-13.24-6.13a6.02 6.02 0 0 0-4.45 0z' fill='%239C9C9C' fill-opacity='.55'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        /*background-size:contain;*/
        background-position: center;
        background-size:contain;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.26);
        cursor:pointer;
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
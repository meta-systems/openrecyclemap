<template>
    <div class="map_root text-center">
        <v-progress-circular indeterminate color="primary" v-if="loading" class="main_loading"></v-progress-circular>

        <router-link class="orm_logo orm_logo_map" aria-label="About" to="/about"></router-link>
        <router-link class="orm_control orm_map_add" to="/map/add"></router-link>
        <leaflet-map v-on:map-init="initMap" v-on:location-found="loadData" v-on:map-click="onMapClick" v-on:map-change="onMapChange" :sheet="sheet"></leaflet-map>

        <div class="node_info" v-if="selectedLayer">
            {{ selected.info }}
            <a target="_blank" :href="selected.osmLink">node</a>
            <a target="_blank" :href="selected.josmLink">josm</a>
        </div>
        <nodes-filter v-on:filter-nodes="loadData" :filter="filter" v-if="!selectedLayer"></nodes-filter>
        <v-snackbar v-model="snackbar">
            {{ snackbar_text }}
            <v-btn color="pink" @click="snackbar = false" flat>Ок</v-btn>
        </v-snackbar>
        <v-snackbar v-model="zoomMessage" :timeout="0">
            Для загрузки данных приблизьте карту
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
    import LeafletMap from './LeafletMap'
    import L from 'leaflet'
    import 'leaflet.snogylop'

    export default {
        data: function () {
            return {
                map: null,
                zoomMessage: false,
                selectedLayer: null,
                selected: {},
                rectangle: null,
                loading: false,
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
            FractionsList,
            LeafletMap
        },
        mixins: [overpassMixin, oauthMixin],
        methods: {
            initMap: function (map) {
                this.map = map;
                if(this.$route.name === 'node') {
                    this.loadNode(this.$route.params.node);
                }
                else {
                    this.loadData();
                }
            },
            loadData: function (node_id) {
                let filter = this.filter;
                let map = this.map;
                let component = this;
                this.loading = true;
                this.fetchAmenity(map.getCenter(), function (data) {
                    if(component.layer) {
                        map.removeLayer(component.layer);
                    }
                    if(component.rectangle) {
                        component.map.removeLayer(component.rectangle);
                    }
                    component.loading = false;
                    component.rectangle = L.geoJson(component.boundsToGeojson(), {
                        invert: true, color: "#424242", weight: 0
                    }).addTo(map);
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
                                let node_id = geoJsonProps.id.replace('node/', '');
                                component.selectedLayer = layer;
                                component.selected = {
                                    info: nodeTypes.join(', '),
                                    osmLink: 'https://openstreetmap.org/' + geoJsonProps.id,
                                    josmLink: 'http://127.0.0.1:8111/load_object?objects=n' + node_id
                                };
                                layer.setStyle({
                                    weight: 5
                                });
                                component.$router.push({name: 'node', params: {node: node_id}});
                            });
                            if(feature.properties.id === 'node/'+node_id) {
                                layer.fire('click');
                            }
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
            onMapChange: function (e) {
                if(!this.bounds) {
                    return;
                }
                let zoomInvalid = this.map.getZoom() < 13;
                let fit = this.bounds.contains(this.map.getCenter());
                this.zoomMessage = zoomInvalid && !fit;
                if(zoomInvalid) {
                    return;
                }
                if(!fit) {
                    this.loadData();
                }
            },
            onMapClick: function (e) {
                if(this.selectedLayer) {
                    this.selectedLayer.setStyle({
                        weight: 1
                    });
                    this.selectedLayer = null;
                    this.$router.push({name: 'map'});
                }
                if(this.adding) {
                    this.disableAddMode();
                    if(this.marker) {
                        this.map.removeLayer(this.marker);
                    }
                    this.marker = L.marker(e.latlng).addTo(this.map);
                    this.sheet = true;
                    this.map.setView(e.latlng, 18, {animate: false});
                }
            },
            loadNode: function (node_id) {
                let component = this;
                this.fetchNode(node_id, function (data) {
                    if(data.elements.length > 0) {
                        let node = data.elements[0];
                        component.map.setView([node.lat, node.lon], 17, {animate: false});
                        component.loadData(node_id);
                    }
                });
            }
        },
        mounted() {
            this.authInit();
            if(this.$route.params.action === 'add') {
                this.enableAddMode();
            }
        },
        watch: {
            '$route'(to, from) {
                if(to.name === 'node') {
                    //this.loadNode(to.params.node);
                }
                else {
                    if (to.params.action === 'add') {
                        this.enableAddMode();
                    }
                    else {
                        this.disableAddMode();
                    }
                }
            }
        }
    }
</script>

<style>
    .node_info {
        background:white;
        border-radius:15px;
        padding:20px;
        position:absolute;
        top:10px;
        left:10px;
        padding-top:80px;   
    }
    @media screen and (max-width: 500px) {
        .node_info {
            position:static;
        }
    }
    .main_loading {
        position: fixed !important;
        bottom: 60px;
        z-index: 9;
    }
    .map_root {
        height: 100%;
        overflow: hidden;
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
    .orm_map_add {
        bottom:25%;
        right:20px;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='36' height='36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='15.46' y='8.45' width='5.14' height='19.47' rx='.84' fill='%23248A00'/%3E%3Crect x='8.29' y='20.76' width='5.14' height='19.47' rx='.84' transform='rotate(-90 8.3 20.76)' fill='%23248A00'/%3E%3C/svg%3E");
    }
    .orm_control {
        background-repeat: no-repeat;
        background-size:contain;
        z-index: 1;
        position:absolute;
        background-position: center;
        background-color:white;
        border-radius:30px;
        height:40px;
        width:40px;
        opacity:0.7;
        cursor:pointer;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.26);
    }
    .leaflet-control-locate {
        display: none;
    }
</style>
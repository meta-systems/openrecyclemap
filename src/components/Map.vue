<template>
    <div :class="['map_root text-center', { add_mode: add_mode }]" >
        <div class="map_cross" v-if="add_mode"><div class="map_cross2"></div></div>
        <div class="add_mode_message" v-if="set_coord_mode"><div>Режим добавления новой точки.</div> Потяните карту чтобы выбрать правильное расположение точки</div>
        <div class="add_mode_steps" v-if="add_mode">
            <div class="btn btn_gray" @click="disableAddMode">Отмена</div>
            <div class="btn btn_green btn_add_next" @click="goNext">Далее</div>
        </div>
        <v-progress-circular indeterminate color="primary" v-if="loading" class="main_loading"></v-progress-circular>

        <router-link class="orm_logo orm_logo_map" aria-label="About" to="/about"></router-link>
        <router-link v-if="!add_mode" class="orm_control orm_map_add" to="/map/add"></router-link>
        <leaflet-map v-on:map-init="initMap" v-on:location-found="loadData" v-on:map-click="onMapClick" v-on:map-change="onMapChange"></leaflet-map>

        <fractions-form :selected="selected" :labels="labels" v-if="edit_tags" v-on:form-cancel="disableAddMode" v-on:form-save="saveData"></fractions-form>

        <div class="node_info" v-if="selectedLayer">
            <span class="p_close" @click="deselectLayer">×</span>
            
            <div class="f_list">
                <span v-for="item in selected.info" :class="['p_fraction', 'ico_'+item]">{{ labels[item] }}</span>
            </div>
            <div v-if="selected.description" class="f_description">{{ selected.description }}</div>
            
            <a target="_blank" class="p_link" :href="selected.osmLink">Смотреть в OSM</a>
            <a target="_blank" class="p_link" :href="selected.josmLink" title="Редактировать в JOSM">(J)</a>
            
            <div class="edit_box">
                <!-- <span @click="goEdit" class="btn btn_gray">Редактировать</span> -->
            </div>
        </div>
        <nodes-filter v-on:filter-nodes="loadData" :filter="filter" v-if="!selectedLayer && !add_mode"></nodes-filter>
        <v-snackbar v-model="snackbar" top multi-line>
            {{ snackbar_text }}
            <v-btn color="pink" @click="snackbar = false" flat>Ок</v-btn>
        </v-snackbar>
        <v-snackbar v-model="zoomMessage" :timeout="0" top>
            Для загрузки данных приблизьте карту
        </v-snackbar>
    </div>
</template>

<script>
    import osmtogeojson from 'osmtogeojson'
    import overpassMixin from '../mixins/Overpass'
    import oauthMixin from '../mixins/Oauth'
    import NodesFilter from './NodesFilter'
    import FractionsForm from './FractionsForm'
    import LeafletMap from './LeafletMap'
    import L from 'leaflet'
    import 'leaflet.snogylop'

    export default {
        data: function () {
            return {
                edit_tags: false,
                set_coord_mode: false,
                add_mode: false,
                map: null,
                zoomMessage: false,
                selectedLayer: null,
                selected: null,
                rectangle: null,
                loading: false,
                snackbar_text: null,
                snackbar: false,
                marker: null,
                layer: null,
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
                    plastic: 'Пластик',
                    paper: 'Бумага',
                    cans: 'Алюминиевые банки',
                    glass_bottles: 'Стеклянные бутылки',
                    batteries: 'Батарейки',
                    low_energy_bulbs: 'Лампочки',
                    plastic_bags: 'Пакеты',
                    plastic_bottles: 'Пластиковые бутылки',
                    waste_disposal: 'Мусорный контейнер'
                },
                lastData: null
            };
        },
        components: {
            NodesFilter,
            FractionsForm,
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
            displayData: function (data, filter, node_id) {
                if(!data) {
                    return;
                }
                let component = this;
                let map = this.map;
                this.lastData = data;
                if(this.layer) {
                    map.removeLayer(this.layer);
                }
                if(this.rectangle) {
                    this.map.removeLayer(this.rectangle);
                }
                this.loading = false;
                this.rectangle = L.geoJson(this.boundsToGeojson(), {
                    invert: true, color: "#424242", weight: 0
                }).addTo(map);
                let ovData = osmtogeojson(data);
                this.layer = L.geoJson(ovData, {
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
                            if(component.add_mode) {
                                return;
                            }
                            if(component.selectedLayer) {
                                component.selectedLayer.setStyle({
                                    weight: 1
                                });
                            }
                            let nodeTypes = [];
                            let selAmenity;
                            let geoJsonProps = feature.properties;
                            if(geoJsonProps.hasOwnProperty('amenity') && geoJsonProps['amenity'] === 'waste_disposal') {
                                nodeTypes.push('waste_disposal');
                                selAmenity = 'waste_disposal';
                            }
                            else {
                                selAmenity = 'recycling';
                                for (let key in component.labels) {
                                    if(geoJsonProps.hasOwnProperty('recycling:'+key) && geoJsonProps['recycling:'+key] === 'yes') {
                                        nodeTypes.push(key);
                                    }
                                }
                            }
                            let node_id = geoJsonProps.id.replace('node/', '');
                            component.selectedLayer = layer;
                            component.selected = {
                                info: nodeTypes,
                                amenity: selAmenity,
                                osmLink: 'https://openstreetmap.org/' + geoJsonProps.id,
                                josmLink: 'http://127.0.0.1:8111/load_object?objects=n' + node_id,
                                description: geoJsonProps.description
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
            },
            loadData: function (node_id) {
                this.loading = true;
                this.fetchAmenity(this.map.getCenter(), (data) => this.displayData(data, this.filter, node_id));
            },
            enableAddMode: function () {
                if(!this.authenticated) {
                    this.$router.replace({path: '/login'});
                }
                this.displayData(this.lastData, {
                    plastic: true, paper: true,
                    cans: true,
                    glass_bottles: true,
                    batteries: true,
                    low_energy_bulbs: true,
                    plastic_bags: true,
                    waste_disposal: true
                });
                this.add_mode = true;
                this.set_coord_mode = true;
                if(this.selectedLayer) {
                    this.deselectLayer();
                }
            },
            disableAddMode: function () {
                this.marker = null;
                this.displayData(this.lastData, this.filter);
                this.edit_tags = false;
                this.add_mode = false;
                this.$router.push({name: 'map'});
            },
            saveData: function (event) {
                let position = this.marker ? this.marker.getLatLng() : null;
                this.disableAddMode();
                if(position) {
                    this.addNodeSuccess = function () {
                        this.snackbar_text = 'Спасибо за добавление информации! Ваши данные появятся на карте в течение получаса.';
                        this.snackbar = true;
                    };
                    this.addNodeFail = function () {
                        this.snackbar_text = 'Ошибка! Попробуйте позже.';
                        this.snackbar = true;
                    };
                    this.addNode(position, event.tags);

                    this.$ga.event({
                        eventCategory: 'map_interaction',
                        eventAction: 'add_point',
                        eventLabel: event.amenity,
                        eventValue: 1
                    });
                }
            },
            pushPosition: function () {
                if((this.$route.params.action === 'add' || this.$route.name === 'node')) {
                    return;
                }
                let position = this.map.getCenter();
                let zoom = this.map.getZoom();
                let lat = position.lat.toFixed(5);
                let lon = position.lng.toFixed(5);
                if(this.$route.params.lat !== lat || this.$route.params.lon !== lon || this.$route.params.zoom != zoom) {
                    this.$router.push({name: 'position', params: {lat: lat, lon: lon, zoom: zoom}});
                }
            },
            onMapChange: function (e) {
                this.pushPosition();
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
            deselectLayer: function () {
                this.selectedLayer.setStyle({
                    weight: 1
                });
                this.selectedLayer = null;
                this.selected = null;
                this.$router.push({name: 'map'});
            },
            onMapClick: function (e) {
                if(this.selectedLayer) {
                    this.deselectLayer();
                }
            },
            goNext: function () {
                // this.add_mode = false;
                this.set_coord_mode = false;
                this.edit_tags = true;
                this.marker = L.marker(this.map.getCenter());
            },
            goEdit: function () {
                this.edit_tags = true;
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
        padding-top:40px; 
        z-index:1;  
    }
    .main_loading {
        position: fixed !important;
        bottom: 140px;
        bottom: 200px;
        left:20px;
        z-index: 9;
    }
    .map_root {
        height: 100%;
        overflow: hidden;
        height: calc(100% - 56px);
        position:relative;
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
        bottom:100px;
        right:20px;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='36' height='36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='15.46' y='8.45' width='5.14' height='19.47' rx='.84' fill='%23248A00'/%3E%3Crect x='8.29' y='20.76' width='5.14' height='19.47' rx='.84' transform='rotate(-90 8.3 20.76)' fill='%23248A00'/%3E%3C/svg%3E");
    }
    @media screen and (max-width: 900px) {
        .orm_map_add {
            bottom:210px;
        }
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

    .btn {
        padding:7px 15px;
        border-radius:4px;
        cursor:pointer;
        display:inline-block;
        line-height:1.3em;
    }
    .p_link {
        color:black;
        margin-right:5px;
        text-decoration:none;
        color:#666;
        margin-top:10px;
        display:inline-block;
        font-size:11px;
    }
    .p_close:hover {
        background:#eee;
    }
    .p_close {
        font-size:30px;
        color:#999;
        position:absolute;
        top:10px;
        right:10px;
        cursor:pointer;
        line-height:30px;
        width:30px;
        height:30px;
        border-radius:15px;
        text-align:center;
    }
    .btn_green {
        background:#1b5e20;
        color:white;
    }
    .btn_gray:hover {
        background:#eee;
    }
    .btn_gray {
        box-shadow: inset 0 0 0 2px #eee;
    }
    .edit_box {
        margin-top:15px;
    }
    .add_mode_message,
    .add_mode_steps {
        background:white;
        position:absolute;
        left:0;
        right:0;
        z-index: 2;
    }
    .add_mode_steps {
        bottom:0;
        padding:10px 15px;
        display:flex;
        position: fixed;
        bottom:56px;
    }
    .add_mode_message div {
        font-weight: bold;
    }


    .add_mode_message {
        padding:15px 12%;
        text-align:center;
        top:0;
    }
    @media screen and (max-width: 320px) {
        .add_mode_message {
            font-size:4vw;   
        }
    }

    .map_cross {
        position:absolute;
        top:50%;
        left:50%;
        z-index: 1;
        border:1px solid red;
        pointer-events: none;
    }
    .map_cross2 {
        height:44px;
        width:44px;
        position:absolute;
        top:-22px;
        left:-22px;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='42' height='42' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='a' maskUnits='userSpaceOnUse' x='0' y='0' width='42' height='42' fill='%23000'%3E%3Cpath fill='%23fff' d='M0 0h42v42H0z'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M21 1a1 1 0 0 0-1 1v18H2a1 1 0 1 0 0 2h18v18a1 1 0 1 0 2 0V22h18a1 1 0 1 0 0-2H22V2a1 1 0 0 0-1-1z'/%3E%3C/mask%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M21 1a1 1 0 0 0-1 1v18H2a1 1 0 1 0 0 2h18v18a1 1 0 1 0 2 0V22h18a1 1 0 1 0 0-2H22V2a1 1 0 0 0-1-1z' fill='%23000'/%3E%3Cpath d='M20 20v.6h.6V20H20zm0 2h.6v-.6H20v.6zm2 0v-.6h-.6v.6h.6zm0-2h-.6v.6h.6V20zM20.6 2c0-.22.18-.4.4-.4V.4c-.88 0-1.6.72-1.6 1.6h1.2zm0 18V2h-1.2v18h1.2zM2 20.6h18v-1.2H2v1.2zm-.4.4c0-.22.18-.4.4-.4v-1.2c-.88 0-1.6.72-1.6 1.6h1.2zm.4.4a.4.4 0 0 1-.4-.4H.4c0 .88.72 1.6 1.6 1.6v-1.2zm18 0H2v1.2h18v-1.2zm.6 18.6V22h-1.2v18h1.2zm.4.4a.4.4 0 0 1-.4-.4h-1.2c0 .88.72 1.6 1.6 1.6v-1.2zm.4-.4a.4.4 0 0 1-.4.4v1.2c.88 0 1.6-.72 1.6-1.6h-1.2zm0-18v18h1.2V22h-1.2zm18.6-.6H22v1.2h18v-1.2zm.4-.4a.4.4 0 0 1-.4.4v1.2c.88 0 1.6-.72 1.6-1.6h-1.2zm-.4-.4c.22 0 .4.18.4.4h1.2c0-.88-.72-1.6-1.6-1.6v1.2zm-18 0h18v-1.2H22v1.2zM21.4 2v18h1.2V2h-1.2zm-.4-.4c.22 0 .4.18.4.4h1.2c0-.88-.72-1.6-1.6-1.6v1.2z' fill='%23fff' mask='url(%23a)'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: center;
        /*background-size: contain;*/
    }
    .btn_add_next {
        margin-left:auto;
    }
    .node_type .btn {
        margin-right:30px;
    }
</style>
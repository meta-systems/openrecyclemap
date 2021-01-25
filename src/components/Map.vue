<template>
    <div :class="['map_root text-center', { add_mode: add_mode }]" >
        <div class="map_cross" v-if="add_mode"><div class="map_cross2"></div></div>
        <div class="add_mode_message" v-if="set_coord_mode">
            <div>{{ $t('message.addMode') }}</div> {{ $t('message.addModeHint') }}
        </div>
        <div class="add_mode_steps" v-if="add_mode">
            <div class="btn btn_gray" @click="disableAddMode">{{ $t('button.cancel') }}</div>
            <div class="btn btn_green btn_add_next" @click="goNext">{{ $t('button.next') }}</div>
        </div>
        <v-progress-circular indeterminate color="primary" v-if="loading" class="main_loading"></v-progress-circular>

        <div class="orm_logo orm_logo_map"></div>
        <leaflet-map v-on:map-init="initMap" v-on:location-found="onMapChange" v-on:map-click="onMapClick" v-on:map-change="onMapChange"></leaflet-map>

        <fractions-form :selected="selected" :labels="labels" v-if="edit_tags" v-on:form-cancel="disableAddMode" v-on:form-save="saveData"></fractions-form>

        <node-info :key="selectedId" :selected="selected" :labels="labels" v-if="selectedLayer"
                   v-on:close-info="deselectLayer" v-on:edit-click="goEdit" v-on:delete-click="goDelete"></node-info>

        <nodes-filter v-on:filter-nodes="loadData" :filter="filter" v-if="!selectedLayer && !add_mode"></nodes-filter>
        <v-snackbar v-model="snackbar" top multi-line>
            {{ snackbar_text }}
            <v-btn color="pink" @click="snackbar = false" flat>Ok</v-btn>
        </v-snackbar>
        <v-snackbar v-model="zoomMessage" :timeout="0" top>
            {{ $t('message.zoomIn') }}
        </v-snackbar>
    </div>
</template>

<script>
    import osmtogeojson from 'osmtogeojson'
    import overpassMixin from '../mixins/Overpass'
    import oauthMixin from '../mixins/Oauth'
    import NodesFilter from './NodesFilter'
    import NodeInfo from './NodeInfo'
    import FractionsForm from './FractionsForm'
    import Filter from '../mixins/Filter'
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
                selectedId: null,
                selected: null,
                rectangle: null,
                loading: false,
                snackbar_text: null,
                snackbar: false,
                marker: null,
                layer: null,
                filter: new Filter(),
                labels: {
                    plastic: this.$t('fraction.plastic'),
                    paper: this.$t('fraction.paper'),
                    cans: this.$t('fraction.cans'),
                    glass: this.$t('fraction.glass'),
                    glass_bottles: this.$t('fraction.glass_bottles'),
                    batteries: this.$t('fraction.batteries'),
                    plastic_bottles: this.$t('fraction.plastic_bottles'),
                    hazardous_waste: this.$t('fraction.hazardous_waste'),
                    engine_oil: this.$t('fraction.engine_oil'),
                    clothes: this.$t('fraction.clothes'),
                    low_energy_bulbs: this.$t('fraction.low_energy_bulbs'),
                    plastic_bags: this.$t('fraction.plastic_bags'),
                    scrap_metal: this.$t('fraction.scrap_metal'),
                    car_batteries: this.$t('fraction.car_batteries'),
                    tyres: this.$t('fraction.tyres'),
                    waste_disposal: this.$t('fraction.wasteDisposal'),

                },
                lastData: null
            };
        },
        components: {
            NodesFilter,
            NodeInfo,
            FractionsForm,
            LeafletMap
        },
        mixins: [overpassMixin, oauthMixin],
        methods: {
            initMap: function (map) {
                this.map = map;
                if(this.$route.name === 'node') {
                    this.loadNode(this.$route.params);
                }
                else {
                    this.loadData();
                }
            },
            displayData: function (data, filter, to_select) {
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
                        var color = feature.properties.amenity === 'recycling'
                            ? '#ff0000' // RED - Show nodes with no factions in red (materials not specified)
                            : '#8D6E63'; // BROWN
                        for (let key in feature.properties) {
                          if(key.startsWith("recycling:")){ // recycling:* - display in green
                            color = '#2E7D32'; // GREEN
                          }
                        }
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
                        if(!filter.enabled()) {
                            return true;
                        }
                        return filter.fit(feature.properties);
                    },
                    onEachFeature: function (feature, layer) {
                        layer.on('click', function (ev) {
                            L.DomEvent.stopPropagation(ev);
                            if(component.add_mode || component.edit_tags) {
                                return;
                            }
                            if(component.selectedLayer) {
                                component.selectedLayer.setStyle({
                                    weight: 1
                                });
                            }
                            let geoJsonProps = feature.properties;
                            let sel_type = geoJsonProps.id.includes('way') ? 'way' : 'node';
                            let sel_id = geoJsonProps.id.replace(sel_type+'/', '');
                            component.selectedLayer = layer;
                            component.selected = {
                                props: geoJsonProps,
                                fractions: component.parseFractions(geoJsonProps),
                                node_id: sel_id,
                                node_type: sel_type
                            };
                            component.selectedId = sel_id;
                            layer.setStyle({
                                weight: 5
                            });
                            component.$router.push({name: 'node', params: {node: sel_id, type: sel_type}});
                        });
                        if(feature.properties.id === to_select) {
                            layer.fire('click');
                        }
                    },
                    pointToLayer: function(geoJsonPoint, latlng) {
                        return new L.CircleMarker(latlng);
                    }
                }).addTo(map);
            },
            loadData: function (params) {
                this.loading = true;
                let to_select = (params && params.node) ? params.type+'/'+params.node : false;
                this.fetchAmenity(this.map.getCenter(),
                    (data) => this.displayData(data, this.filter, to_select),
                    () => {
                        this.snackbar_text = this.$t('message.loadDataError');
                        this.snackbar = true;
                        this.loading = false;
                    }
                );
            },
            showAllFilter: function () {
                return {
                    enabled: function () {
                        return false;
                    }
                };
            },
            enableAddMode: function () {
                if(!this.authenticated) {
                    this.$router.replace({path: '/login'});
                }
                this.displayData(this.lastData, this.showAllFilter());
                this.add_mode = true;
                this.set_coord_mode = true;
                this.deselectLayer();
            },
            disableAddMode: function () {
                this.set_coord_mode = false;
                this.marker = null;
                this.displayData(this.lastData, this.filter);
                this.edit_tags = false;
                this.add_mode = false;
                this.$router.push({name: 'map'});
            },
            saveData: function (event) {
                let nposition = this.marker ? this.marker.getLatLng() : null;
                this.disableAddMode();
                this.addNodeSuccess = function () {
                    this.snackbar_text = this.$t('message.saveNodeSuccess');
                    this.snackbar = true;
                };
                this.addNodeFail = function () {
                    this.snackbar_text = this.$t('message.saveNodeError');
                    this.snackbar = true;
                };
                if(event.id) {
                    let position = this.selectedLayer ? this.selectedLayer.getLatLng() : null;
                    if (position) {
                        this.updateNode(event.id, event.type, position, event.tags);

                        this.$ga.event({
                            eventCategory: 'map_interaction',
                            eventAction: 'update_point',
                            eventLabel: event.amenity,
                            eventValue: 1
                        });
                    }
                }
                else {
                    if (nposition) {
                        this.addNode(nposition, event.tags);

                        this.$ga.event({
                            eventCategory: 'map_interaction',
                            eventAction: 'add_point',
                            eventLabel: event.amenity,
                            eventValue: 1
                        });
                    }
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
                    this.$router.replace({name: 'position', params: {lat: lat, lon: lon, zoom: zoom}});
                }
            },
            onMapClick: function () {
                if(!this.edit_tags) {
                    this.deselectLayer();
                }
            },
            onMapChange: function () {
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
                if(!this.selectedLayer) {
                    return;
                }
                this.selectedLayer.setStyle({
                    weight: 1
                });
                this.selectedLayer = null;
                this.selected = null;
                this.selectedId = null;
                this.$router.push({name: 'map'});
            },
            goNext: function () {
                // this.add_mode = false;
                this.set_coord_mode = false;
                this.edit_tags = true;
                this.marker = L.marker(this.map.getCenter());
            },
            goEdit: function () {
                if(!this.authenticated) {
                    this.$router.replace({path: '/login'});
                }
                else {
                    this.edit_tags = true;
                }
            },
            goDelete: function () {
                if(!this.selected) {
                    return;
                }
                if(!this.authenticated) {
                    this.$router.replace({path: '/login'});
                }
                else {
                    if(confirm('Are you sure you want to delete a node?')) {
                        this.addNodeSuccess = function () {
                            this.snackbar_text = this.$t('message.saveNodeSuccess');
                            this.snackbar = true;
                        };
                        this.addNodeFail = function () {
                            this.snackbar_text = this.$t('message.saveNodeError');
                            this.snackbar = true;
                        };
                        let position = this.selectedLayer ? this.selectedLayer.getLatLng() : null;
                        if (position) {
                            this.deleteNode(this.selected.node_id, this.selected.node_type, position);

                            this.$ga.event({
                                eventCategory: 'map_interaction',
                                eventAction: 'remove_point',
                                eventLabel: event.amenity,
                                eventValue: 1
                            });
                            this.deselectLayer();
                        }
                    }
                }
            },
            loadNode: function (params) {
                let component = this;
                this.fetchNode(params, function (data) {
                    if(data.elements.length > 0) {
                        let element = data.elements[0];
                        let node = element.type === 'way' ? element.center : element;
                        component.map.setView([node.lat, node.lon], 17, {animate: false});
                        component.loadData(params);
                    }
                });
            },
            parseFractions: function (geoJsonProps) {
                let nodeTypes = [];
                if(geoJsonProps.hasOwnProperty('amenity') && geoJsonProps['amenity'] === 'waste_disposal') {
                    nodeTypes.push('waste_disposal');
                }
                else {
                    for (let key in this.labels) {
                        if(geoJsonProps.hasOwnProperty('recycling:'+key) && geoJsonProps['recycling:'+key] === 'yes') {
                            nodeTypes.push(key);
                        }
                    }
                }
                return nodeTypes;
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
                    //this.loadNode(to.params);
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
        /*height: calc(100% - 56px);*/
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
    .leaflet-control-locate {
        display: none;
    }

    .btn {
        padding:9px 15px;
        border-radius:4px;
        cursor:pointer;
        display:inline-block;
        line-height:1.3em;
        user-select: none;
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
        background:#ddd;
    }
    .btn_gray {
        box-shadow: inset 0 0 0 2px #eee;
        background:#eee;
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
        padding:15px 15px;
        display:flex;
        position: fixed;
        box-shadow: 0 0 6px rgba(0,0,0,.26);
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

<template>
    <div class="map_parent">

        <div class="control_top">
            <div class="layers_popup" v-if="layersPopup" v-click-outside="closeLayers">
                <div class="btn layer_btn" @click="setLayer('Mapbox')">Mapbox</div>
                <div class="btn layer_btn" @click="setLayer('Mapnik')">Mapnik</div>
                <div class="btn layer_btn" @click="setLayer('Mapbox sat')">Mapbox sat</div>
                <div class="btn layer_btn" @click="setLayer('ESRI sat')">ESRI sat</div>
            </div>
            <router-link class="orm_control orm_info" to="/about"></router-link>
            <router-link class="orm_control orm_map_add" to="/map/add" title="Add new point"></router-link>
            <div class="orm_control orm_layers popup_activator" @click="layersPopup = !layersPopup"></div>
            <div class="orm_control orm_position" @click="showPosition"></div>
        </div>

        <div class="orm_control orm_zoom">
            <div class="zoom_btn" @click="zoomPlus">+</div>
            <div class="zoom_btn" @click="zoomMinus">−</div>
        </div>
        <div id="map_container"></div>
    </div>
</template>

<script>
    import 'leaflet/dist/leaflet.css'
    import L from 'leaflet'
    import layersMixin from '../mixins/Layers'
    import 'mapbox-gl/dist/mapbox-gl.css'
    import mapboxgl from 'mapbox-gl'
    import 'mapbox-gl-leaflet'
    //import 'font-awesome/css/font-awesome.min.css'
    //import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
    import 'leaflet.locatecontrol';

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    });

    export default {
        name: "leaflet-map",
        mixins: [layersMixin],
        data: function () {
            return {
                map: null,
                baseLayers: [],
                locateControl: null,
                layersPopup:false
            };
        },
        methods: {
            closeLayers: function () {
                this.layersPopup = false;
            },
            setLayer: function (layer) {
                for (let key in this.baseLayers) {
                    if(this.map.hasLayer(this.baseLayers[key])) {
                        this.map.removeLayer(this.baseLayers[key]);
                    }
                }
                this.map.addLayer(this.baseLayers[layer]);
                this.saveLayer(layer);
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
                this.saveLayer(nextkey);
            },
            zoomPlus: function () {
                this.map.zoomIn();
            },
            zoomMinus: function () {
                this.map.zoomOut(); 
            },
            showPosition: function () {
                // request location update and set location
                this.locateControl.start();
            },
            savePosition: function () {
                let position = this.map.getCenter();
                localStorage.setItem('lat', position.lat);
                localStorage.setItem('lng', position.lng);
                localStorage.setItem('zoom', this.map.getZoom());
            },
            saveLayer: function (layer) {
                localStorage.setItem('layer', layer);
            },
            getDefaultCoords: function (lang) {
                let coords = {
                    en: {lat: 51.5, lng: -0.1, zoom: 13},
                    ru: {lat: 55.75, lng: 37.61, zoom: 13},
                    fr: {lat: 48.84, lng: 2.35, zoom: 13},
                    pt: {lat: 38.72, lng: -9.14, zoom: 14},
                    de: {lat: 52.5, lng: 13.38, zoom: 13},
                    it: {lat: 41.87, lng: 12.49, zoom: 13}
                };
                if(lang in coords) {
                    return coords[lang];
                }
                return coords.en;
            }
        },
        created() {
            this.baseLayers = {
                "Mapbox": this.mapboxVector(),
                "Mapnik": this.mapnikLayer(),
                "Mapbox sat": this.mapboxSat(),
                "ESRI sat": this.esriSat()
            };
        },
        mounted() {
            let defaultCoords = this.getDefaultCoords(this.$i18n.locale);
            let lat = this.$route.params.lat || localStorage.getItem('lat') || defaultCoords.lat;
            let lng = this.$route.params.lon || localStorage.getItem('lng') || defaultCoords.lng;
            let zoom = this.$route.params.zoom || localStorage.getItem('zoom') || defaultCoords.zoom;

            this.map = L.map('map_container', {
                zoomControl: false
            }).setView([lat, lng], zoom);

            let defLayer = localStorage.getItem('layer') || 'Mapbox';
            this.baseLayers[defLayer].addTo(this.map);

            this.locateControl = L.control.locate({
                showPopup: false
            }).addTo(this.map);

            this.map.on('click', (e) => this.$emit('map-click', e));
            this.map.on('moveend', (e) => this.$emit('map-change', e));
            this.map.on('zoomend', (e) => this.$emit('map-change', e));
            this.map.on('locationfound', (e) => this.$emit('location-found', e));
            this.map.on('moveend', this.savePosition);
            this.map.on('zoomend', this.savePosition);

            this.$emit('map-init', this.map);
        }
    }
</script>

<style>
    .layer_btn:hover {
        background:#ccc;
    }
    .layer_btn {
        background:#ddd;
        color:black;
        margin-bottom:20px;
        white-space: nowrap;
    }
    .layers_popup {
        background:white;
        padding:30px;
        padding-bottom:10px;
        position: absolute;
        top:110px;
        right:-10px; 
        border-radius:8px;
        display: flex;
        flex-direction: column;
        z-index: 2;
    }
    .control_top .orm_control {
        margin-bottom:20px;
    }
    .orm_control {
        background-repeat: no-repeat;
        background-size:contain;
        z-index: 1;
        /*position:absolute;*/
        background-position: center;
        background-color:white;
        border-radius:30px;
        height:40px;
        width:40px;
        opacity:0.7;
        cursor:pointer;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.26);
        user-select: none;
        display:block;
    }
    .orm_info {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='41' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22.61 9.65a1.65 1.65 0 11-3.3 0 1.65 1.65 0 013.3 0zM20.96 31.14c-.69 0-1.24-.55-1.24-1.24V17.1h-1.65a1.24 1.24 0 010-2.49h2.89c.68 0 1.24.56 1.24 1.24V29.9c0 .69-.56 1.24-1.24 1.24z' fill='%23000'/%3E%3Cpath d='M24.68 31.14h-7.44a1.24 1.24 0 010-2.48h7.44a1.24 1.24 0 010 2.48z' fill='%23000'/%3E%3C/svg%3E");
    }
    .orm_map_add {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='36' height='36' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='15.46' y='8.45' width='5.14' height='19.47' rx='.84' fill='%23248A00'/%3E%3Crect x='8.29' y='20.76' width='5.14' height='19.47' rx='.84' transform='rotate(-90 8.3 20.76)' fill='%23248A00'/%3E%3C/svg%3E");
    }
    .add_mode .orm_map_add {
        display:none;
    }
    .add_mode .control_top {
        top:110px;
    }
    .control_top {
        position: absolute;
        top:25px;
        right:25px;
        z-index: 1;
    }
    .map_parent {
        height: 100%;
    }
    #map_container {
        height: 100%;
        z-index: 0;
    }
    .orm_layers {
        z-index: 3;
        position: relative;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='50' height='50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22.47 21.38L9.23 27.52C8 28.09 8 29 9.23 29.58l13.24 6.13c1.23.57 3.22.57 4.45 0l13.24-6.13c1.23-.57 1.23-1.5 0-2.06l-13.24-6.14a6.02 6.02 0 0 0-4.45 0z' fill='%23B3B3B3'/%3E%3Cpath d='M22.47 13.03L9.23 19.16c-1.23.57-1.23 1.5 0 2.06l13.24 6.14c1.23.56 3.22.56 4.45 0l13.24-6.14c1.23-.57 1.23-1.49 0-2.06l-13.24-6.13a6.02 6.02 0 0 0-4.45 0z' fill='%239C9C9C' fill-opacity='.55'/%3E%3C/svg%3E");
    }

    .add_mode .orm_zoom {
        /*top:170px;*/
    }
    .orm_zoom {
        bottom:150px;
        right:20px;
        height:80px !important;
        position: absolute;
    }
    .zoom_btn {
        line-height:40px;
        text-align:center;
        font-size:30px;
        height:40px;
        border-radius:30px;
    }
    .zoom_btn:hover {
        background:#eee;
    }
    .add_mode .orm_position {
        /*bottom:80px;*/
    }
    .orm_position {
            top:140px;
        right:20px;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='50' height='50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24.64' cy='25.08' r='9.53' stroke='%23000' stroke-width='2.38'/%3E%3Cpath fill='%23000' d='M23.45 9.6h2.38v5.95h-2.38zM23.45 34.61h2.38v5.95h-2.38zM40.12 23.88v2.38h-5.95v-2.38zM15.12 23.9v2.37H9.17V23.9z'/%3E%3Ccircle cx='24.64' cy='25.08' r='4.76' fill='%23000'/%3E%3C/svg%3E");
    }
</style>
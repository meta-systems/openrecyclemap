<template>
    <div class="map_parent">
        <div class="orm_control orm_layers" @click="changeLayers"></div>
        <div class="orm_control orm_position" @click="showPosition"></div>
        <div class="orm_control orm_zoom">
            <div class="zoom_btn" @click="zoomPlus">+</div>
            <div class="zoom_btn" @click="zoomMinus">−</div>
        </div>
        <div id="map_container"></div>
    </div>
</template>

<script>
    import layersMixin from '../mixins/Layers'
    import L from 'leaflet'
    //import 'font-awesome/css/font-awesome.min.css'
    //import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
    import 'leaflet.locatecontrol';

    export default {
        name: "leaflet-map",
        props: ['sheet'],
        mixins: [layersMixin],
        data: function () {
            return {
                map: null,
                baseLayers: [],
                locateControl: null
            };
        },
        methods: {
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
            }
        },
        mounted() {
            let lat = this.$route.params.lat || localStorage.getItem('lat') || 57.82;
            let lng = this.$route.params.lon || localStorage.getItem('lng') || 28.35;
            let zoom = this.$route.params.zoom || localStorage.getItem('zoom') || 13;

            this.map = L.map('map_container', {
                zoomControl: false
            }).setView([lat, lng], zoom);

            let mapbox = this.mapboxLayer().addTo(this.map);
            this.baseLayers = {
                "Mapbox": mapbox,
                "Mapnik": this.mapnikLayer(),
                "Mapbox sat": this.mapboxSat(),
                "HERE sat": this.hereSat(),
            };

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
        },
        watch: {
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

<style scoped>
    .map_parent {
        height: calc(100% - 115px);
        height: 100%;
    }
    #map_container {
        height: 100%;
        z-index: 0;
    }
    .map_container_behind {
        height: calc(100% - 165px) !important;
    }

    .orm_control:hover {
        opacity:1;
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
    .orm_layers {
        top:21px;
        right:20px;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='50' height='50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22.47 21.38L9.23 27.52C8 28.09 8 29 9.23 29.58l13.24 6.13c1.23.57 3.22.57 4.45 0l13.24-6.13c1.23-.57 1.23-1.5 0-2.06l-13.24-6.14a6.02 6.02 0 0 0-4.45 0z' fill='%23B3B3B3'/%3E%3Cpath d='M22.47 13.03L9.23 19.16c-1.23.57-1.23 1.5 0 2.06l13.24 6.14c1.23.56 3.22.56 4.45 0l13.24-6.14c1.23-.57 1.23-1.49 0-2.06l-13.24-6.13a6.02 6.02 0 0 0-4.45 0z' fill='%239C9C9C' fill-opacity='.55'/%3E%3C/svg%3E");
    }
    .orm_zoom {
        top:80px;
        right:20px;
        height:80px;
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
    .orm_position {
        bottom:30px;
        right:20px;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='50' height='50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='24.64' cy='25.08' r='9.53' stroke='%23000' stroke-width='2.38'/%3E%3Cpath fill='%23000' d='M23.45 9.6h2.38v5.95h-2.38zM23.45 34.61h2.38v5.95h-2.38zM40.12 23.88v2.38h-5.95v-2.38zM15.12 23.9v2.37H9.17V23.9z'/%3E%3Ccircle cx='24.64' cy='25.08' r='4.76' fill='%23000'/%3E%3C/svg%3E");
    }
    @media screen and (max-width: 900px) {
        .orm_position {
            bottom:200px;
        }
    }
</style>
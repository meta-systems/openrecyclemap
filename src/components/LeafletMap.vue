<template>
    <div class="map_parent">
        <div class="orm_layers" @click="changeLayers"></div>
        <div id="map_container"></div>
    </div>
</template>

<script>
    import layersMixin from '../mixins/Layers'
    import L from 'leaflet'
    import 'font-awesome/css/font-awesome.min.css'
    import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
    import 'leaflet.locatecontrol';

    export default {
        name: "leaflet-map",
        props: ['sheet'],
        mixins: [layersMixin],
        data: function () {
            return {
                map: null,
                baseLayers: []
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
            }
        },
        mounted() {
            this.map = L.map('map_container', {
                zoomControl: false
            }).setView([57.82, 28.35], 13);

            let mapbox = this.mapboxLayer().addTo(this.map);
            this.baseLayers = {
                "Mapbox": mapbox,
                "Mapnik": this.mapnikLayer(),
                "Спутник": this.hereLayer()
            };
            //L.control.layers(this.baseLayers).addTo(this.map);

            L.control.locate({
                position:'bottomright'
            }).addTo(this.map);

            L.control.zoom({
                position:'topright'
            }).addTo(this.map);

            this.map.on('click', (e) => this.$emit('map-click', e));
            this.map.on('locationfound', (e) => this.$emit('location-found', e));
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
        height: 90%;
    }
    #map_container {
        height: 100%;
        z-index: 0;
    }
    .map_container_behind {
        height: calc(100% - 204px) !important;
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
</style>
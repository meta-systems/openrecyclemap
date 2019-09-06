<template>
    <div id="map_container"></div>
</template>

<script>
    import overpassMixin from '../mixins/Overpass'

    export default {
        data: function () {
            return {
                map: null
            };
        },
        mixins: [overpassMixin],
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
            }
        },
        mounted() {
            this.setupMap();
            this.loadData();
        }
    }
</script>

<style>
    #map_container {
        height: 100%;
    }
</style>
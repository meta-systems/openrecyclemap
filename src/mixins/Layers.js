export default {
    methods: {
        mapboxVector: function () {
            return L.mapboxGL({
                accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
                style: 'mapbox://styles/mapbox/bright-v8'
            });
        },
        mapboxRecycling: function () {
            return L.mapboxGL({
                accessToken: 'pk.eyJ1Ijoiem9qbCIsImEiOiJjazFqOWVreTMwOHp0M2NvY2k5NXlnOG5qIn0.nIWy30T5RHsCPSSETaTBVA',
                style: 'mapbox://styles/zojl/ck1j96uck09qe1cqmkj4r5l4v'
            });
        },
        brightVector: function () {
            return L.mapboxGL({
                accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
                style: 'https://raw.githubusercontent.com/osm2vectortiles/mapbox-gl-styles/master/styles/bright-v9-cdn.json'
            });
        },
        mapboxLayer: function () {
            return L.tileLayer('//api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 21,
                id: 'mapbox.streets',
                accessToken: process.env.VUE_APP_MAPBOX_TOKEN
            });
        },
        mapnikLayer: function () {
            return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 21,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
        },
        hyddaLayer: function () {
            return  L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });
        },
        hereSat: function () {
            return L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/{scheme}/{z}/{x}/{y}/{size}/{format}'
                    + '?app_id={app_id}&app_code={app_code}&lg={language}', {
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
        },
        mapboxSat: function () {
            return L.tileLayer('//api.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token={accessToken}', {
                maxZoom: 19,
                url: 'MapboxSat',
                attribution: 'Тайлы <a href="http://mapbox.com/about/maps/">MapBox</a>',
                subdomains: 'abcd',
                accessToken: process.env.VUE_APP_MAPBOX_TOKEN
            });
        },
        esriSat: function () {
            return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            });
        }
    }
}
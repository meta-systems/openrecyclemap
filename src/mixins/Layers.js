export default {
    methods: {
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
        hereLayer: function () {
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
        }
    }
}
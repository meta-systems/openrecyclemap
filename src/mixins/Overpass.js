export default {
    methods: {
        bboxToString: function (bounds) {
            return bounds._southWest.lat + ',' + bounds._southWest.lng + ','
                + bounds._northEast.lat + ',' + bounds._northEast.lng;
        },
        bboxFromCenter: function (latlon) {
            let bounds = {
                _southWest: {
                    lat: latlon.lat - 0.05,
                    lng: latlon.lng - 0.1
                },
                _northEast: {
                    lat: latlon.lat + 0.05,
                    lng: latlon.lng + 0.1
                }
            };
            return this.bboxToString(bounds);
        },
        buildQuery: function (center) {
            var bbox = this.bboxFromCenter(center);
            return '[out:json][timeout:25];\n' +
                '(\n' +
                '  node["amenity"="recycling"]('+bbox+');\n' +
                '  node["amenity"="waste_disposal"]('+bbox+');\n' +
                ');\n' +
                'out body;'+
                '>;\n' +
                'out skel qt;';
        },
        fetchAmenity: function (center, callback) {
            fetch(process.env.VUE_APP_OVERPASS_URL, {
                method: 'POST',
                body: 'data='+this.buildQuery(center)
            })
                .then(function (response) {
                    if(!response.ok) {
                        throw new Error(response.status);
                    }
                    return response.json();
                })
                .then(callback);
        }
    }
}
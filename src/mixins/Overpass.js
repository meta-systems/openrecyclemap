export default {
    data: function () {
        return {
            bounds: null
        }
    },
    methods: {
        bboxToString: function (bounds) {
            return bounds._southWest.lat + ',' + bounds._southWest.lng + ','
                + bounds._northEast.lat + ',' + bounds._northEast.lng;
        },
        bboxFromCenter: function (latlon) {
            let bounds = L.latLngBounds([
                [
                    latlon.lat - 0.05,
                    latlon.lng - 0.1
                ],
                [
                    latlon.lat + 0.05,
                    latlon.lng + 0.1
                ]
            ]);
            this.bounds = bounds;
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
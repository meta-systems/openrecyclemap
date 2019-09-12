export default {
    methods: {
        bboxToString: function (bounds) {
            return bounds._southWest.lat + ',' + bounds._southWest.lng + ','
                + bounds._northEast.lat + ',' + bounds._northEast.lng;
        },
        defaultBbox: function () {
            return '57.776714401669885,28.20671081542969,57.86320114565444,28.533382415771488';
        },
        buildQuery: function (bounds) {
            var bbox = bounds ? this.bboxToString(bounds) : this.defaultBbox();
            return '[out:json][timeout:25];\n' +
                '(\n' +
                '  node["amenity"="recycling"]('+bbox+');\n' +
                '  node["amenity"="waste_disposal"]('+bbox+');\n' +
                ');\n' +
                'out body;'+
                '>;\n' +
                'out skel qt;';
        },
        fetchAmenity: function (callback) {
            fetch(process.env.VUE_APP_OVERPASS_URL, {
                method: 'POST',
                body: 'data='+this.buildQuery()
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
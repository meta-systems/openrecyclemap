import OverpassQuery from '../osm/OverpassQuery'

export default {
    data: function () {
        return {
            bounds: null
        }
    },
    methods: {
        boundsToGeojson: function () {
            if(!this.bounds) {
                return {};
            }
            let sw = this.bounds._southWest;
            let ne = this.bounds._northEast;
            return {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [[
                        [sw.lng, sw.lat], [ne.lng, sw.lat],
                        [ne.lng, ne.lat], [sw.lng, ne.lat]
                    ]]
                }
            };
        },
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
            let bbox = this.bboxFromCenter(center);
            let query = new OverpassQuery();
            let tags = [
                {k: 'amenity', v: 'recycling'},
                {k: 'amenity', v: 'waste_disposal'}
            ];
            return query.nodeByTags(tags, bbox).body;
        },
        fetchAmenity: function (center, callback) {
            fetch(process.env.VUE_APP_OVERPASS_URL, {
                method: 'POST',
                body: this.buildQuery(center)
            })
                .then(function (response) {
                    if(!response.ok) {
                        throw new Error(response.status);
                    }
                    return response.json();
                })
                .then(callback);
        },
        fetchNode: function (node, callback) {
            let query = new OverpassQuery();
            fetch(process.env.VUE_APP_OVERPASS_URL, {
                method: 'POST',
                body: query.nodeById(node).body
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
import convert from 'xml-js'

export default class OsmNode {
    constructor(latlon, tags) {
        this.node = {
            'type': 'element',
            'name': 'node',
            'elements': [],
            'attributes': {'lat': latlon.lat, 'lon': latlon.lng}
        };
        if(tags) {
            this.setTags(tags);
        }
    }
    setChangeset(id) {
        this.node.attributes.changeset = id;
        return this;
    }
    setExisting(node_id, version) {
        if(node_id) {
            this.node.attributes.id = node_id;
        }
        if(version) {
            this.node.attributes.version = version;
        }
        return this;
    }
    setTags(tags) {
        for (let key in tags) {
            if(tags.hasOwnProperty(key)) {
                this.node.elements.push({'type': 'element', 'name': 'tag', 'attributes': {'k': key, 'v': tags[key]}});
            }
        }
        return this;
    }
    get tree() {
        return {'elements': [this.node]};
    }
    get xml() {
        return '<osm>'
            + convert.js2xml(this.tree)
            + '</osm>';
    }
}
import convert from 'xml-js'

export default class OsmNode {
    constructor(node_type, latlon) {
        this.node = {
            'type': 'element',
            'name': node_type,
            'elements': [],
            'attributes': {}
        };
        if(node_type === 'node' && latlon) {
            this.node.attributes.lat = latlon.lat;
            this.node.attributes.lon = latlon.lng;
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
    setRefs(refs) {
        refs.forEach((ref) => this.node.elements.push({'type': 'element', 'name': 'nd', 'attributes': {'ref': ref}}));
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
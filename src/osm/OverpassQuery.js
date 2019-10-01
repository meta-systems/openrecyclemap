export default class OverpassQuery {
    constructor() {
        this.query = '';
    }
    nodeById(id) {
        this.query = '  node('+id+');\n';
        return this;
    }
    nodeByTags(tags, bbox) {
        tags.forEach((tag) => this.query += '  node["'+tag.k+'"="'+tag.v+'"]('+bbox+');\n');
        return this;
    }
    get qlString() {
        return '[out:json][timeout:25];\n' +
            '(\n' +
            this.query +
            ');\n' +
            'out body;'+
            '>;\n' +
            'out skel qt;';
    }
    get body() {
        return 'data='+this.qlString;
    }
}
export default class Changeset {
    constructor(changeset_name) {
        this.name = changeset_name;
    }
    get xml() {
        return '<osm><changeset>' +
            '<tag k="created_by" v="OpenRecycleMap"/>' +
            '<tag k="comment" v="' + this.name + '"/>' +
            '</changeset></osm>';
    }
}
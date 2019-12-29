export default class OsmParser {
    constructor(xmlDoc) {
        this.doc = xmlDoc;
    }
    supportedTags() {
        return [
            'name',
            'amenity',
            'description',
            'recycling_type',
            'recycling:plastic',
            'recycling:plastic_bottles',
            'recycling:hazardous_waste',
            'recycling:engine_oil',
            'recycling:paper',
            'recycling:cans',
            'recycling:glass',
            'recycling:glass_bottles',
            'recycling:plastic_bags',
            'recycling:clothes',
            'recycling:batteries',
            'recycling:low_energy_bulbs',
            'recycling:scrap_metal',
            'recycling:car_batteries',
        ];
    }
    get osm_type() {
        let nodeEl = this.doc.documentElement.firstElementChild;
        return nodeEl.tagName;
    }
    get version() {
        let nodeEl = this.doc.documentElement.firstElementChild;
        return nodeEl.getAttribute('version');
    }
    get refs() {
        let refs = [];
        this.doc.querySelectorAll('nd').forEach((nd) => refs.push(nd.getAttribute('ref')));
        return refs;
    }
    get tags() {
        let notSupportedTags = {};
        let supportedTags = this.supportedTags();
        this.doc.querySelectorAll('tag').forEach(function (tag) {
            let key = tag.getAttribute('k');
            if(key && !supportedTags.includes(key)) {
                notSupportedTags[key] = tag.getAttribute('v');
            }
        });
        return notSupportedTags;
    }
}

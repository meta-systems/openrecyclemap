export default class NodeParser {
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
            'recycling:paper',
            'recycling:cans',
            'recycling:glass',
            'recycling:glass_bottles',
            'recycling:plastic_bags',
            'recycling:clothes',
            'recycling:batteries',
            'recycling:low_energy_bulbs',
        ];
    }
    get version() {
        let nodeEl = this.doc.getElementsByTagName('node')[0];
        return nodeEl.getAttribute('version');
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
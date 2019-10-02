export default class Filter {
    constructor() {
        this.plastic = false;
        this.paper = false;
        this.cans = false;
        this.glass = false;
        this.glass_bottles = false;
        this.plastic_bags = false;
        this.clothes = false;
        this.batteries = false;
        this.low_energy_bulbs = false;
        //this.plastic_bottles: true;
        this.waste_disposal = false;
    }
    enabled() {
        for (let key in this) {
            if(this.hasOwnProperty(key) && this[key]) {
                return true;
            }
        }
        return false;
    }
    fit(geoJsonProps) {
        if(geoJsonProps.hasOwnProperty('amenity') && geoJsonProps['amenity'] === 'waste_disposal') {
            return this.waste_disposal;
        }
        for (let key in this) {
            if(!this.hasOwnProperty(key) || !this[key] || key === 'waste_disposal') {
                continue;
            }
            if(geoJsonProps.hasOwnProperty('recycling:'+key) && geoJsonProps['recycling:'+key] === 'yes') {
                return true;
            }
        }
        return false;
    }
}
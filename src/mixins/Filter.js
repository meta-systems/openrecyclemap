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
        this.plastic_bottles = false;
        this.waste_disposal = false;
        this.recycling = true;
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
        if(geoJsonProps.hasOwnProperty('amenity') && geoJsonProps['amenity'] === 'recycling' && this.recycling) {
            return true;
        }
        for (let key in this) {
            if(!this.hasOwnProperty(key) || !this[key] || key === 'waste_disposal' || key === 'recycling') {
                continue;
            }
            if(geoJsonProps.hasOwnProperty('recycling:'+key) && geoJsonProps['recycling:'+key] === 'yes') {
                return true;
            }
        }
        return false;
    }
}
<template>
    <div class="map_filters">
        <div :class="['map_filter', {filter_active: filter.plastic}]" @click="filter.plastic = !filter.plastic">
            <span>Пластик</span>
        </div>
        <div :class="['map_filter', {filter_active: filter.glass_bottles}]" @click="filter.glass_bottles = !filter.glass_bottles">
            <span>Стекло</span>
        </div>
        <div :class="['map_filter', {filter_active: filter.paper}]" @click="filter.paper = !filter.paper">
            <span>Бумага</span>
        </div>
        <div :class="['map_filter', {filter_active: filter.cans}]" @click="filter.cans = !filter.cans">
            <span>Алюминий</span>
        </div>
        <div :class="['map_filter', {filter_active: filter.low_energy_bulbs}]" @click="filter.low_energy_bulbs = !filter.low_energy_bulbs">
            <span>Лампочки</span>
        </div>
        <div :class="['map_filter', {filter_active: filter.batteries}]" @click="filter.batteries = !filter.batteries">
            <span>Батарейки</span>
        </div>
        <div :class="['map_filter', {filter_active: filter.plastic_bags}]" @click="filter.plastic_bags = !filter.plastic_bags">
            <span>Пакеты</span>
        </div>
        <div :class="['map_filter', {filter_active: filter.waste_disposal}]" @click="filter.waste_disposal = !filter.waste_disposal">
            <span>Несортируемые</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "nodes-filter",
        data: function () {
            return {
                filter: {
                    plastic: true,
                    paper: true,
                    cans: true,
                    glass_bottles: true,
                    batteries: true,
                    low_energy_bulbs: true,
                    plastic_bags: true,
                    plastic_bottles: true,
                    waste_disposal: false
                }
            }
        },
        watch: {
            filter: {
                handler(val) {
                    console.log(this.filter);
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
    .map_filters {
        background:white;
        height:10%;
        display:flex;
        overflow-x: auto;
    }
    .map_filter:hover {
        background:#eee;
    }
    .filter_active span {
        box-shadow: #d5afff 0 -4px 0 0 inset;
    }
    .map_filter {
        margin:10px;
        padding:5px;
        cursor:pointer;
    }
</style>
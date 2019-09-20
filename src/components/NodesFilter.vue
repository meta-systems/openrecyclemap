<template>
    <div class="map_filters">
        <div :class="['map_filter ico_plastic', {filter_active: filter.plastic}]" @click="filter.plastic = !filter.plastic">
            <span>Пластик</span>
        </div>
        <div :class="['map_filter', {filter_active: filter.glass_bottles}]" @click="filter.glass_bottles = !filter.glass_bottles">
            <span>Стекло</span>
        </div>
        <div :class="['map_filter ico_paper', {filter_active: filter.paper}]" @click="filter.paper = !filter.paper">
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
        props: ['filter'],
        data: function () {
            return {}
        },
        watch: {
            filter: {
                handler(val) {
                    this.$emit('filter-nodes', val);
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
        background-color:#eee;
    }
    .filter_active:before {
        width:10px;
        height:10px;
        border-radius:10px;
        content: '';
        display:block;
        background:#2E7D32;
        position:absolute;
        top:10px;
        left:45%;
        /*box-shadow: #d5afff 0 -4px 0 0 inset;*/
    }
    .map_filter {
        margin:10px;
        padding:5px;
        cursor:pointer;
        background-repeat:no-repeat;
        background-position: center;
        padding-top:60px;
        position:relative;
        border-radius:8px;
    }
    .ico_paper {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M34.8 15.9l-5.25-2.22c-1.98-.94-4.54-3.5-4.56-3.52a.54.54 0 0 0-.87.15c-.88 1.86-3.44 2.42-3.5 2.43L4.4 17.2a.54.54 0 0 0-.13.98l8.67 5.1a.54.54 0 0 0 .43.05l21.37-6.41a.54.54 0 0 0 .06-1.01zm-21.51 6.33L5.9 17.9l14.96-4.11c.12-.03 2.56-.55 3.85-2.39.88.83 2.76 2.49 4.39 3.26l3.9 1.65-19.72 5.92z' fill='%23000'/%3E%3Cpath d='M34.43 18.04L13.3 24.38 4.8 19.41a.54.54 0 0 0-.54.92l8.88 5.21 21.59-6.47a.54.54 0 1 0-.3-1.03z' fill='%23000'/%3E%3Cpath d='M34.43 20.19L13.3 26.53 4.8 21.56a.54.54 0 1 0-.54.93l8.88 5.2 21.59-6.47a.54.54 0 1 0-.3-1.03z' fill='%23000'/%3E%3Cpath d='M34.43 22.34L13.3 28.68 4.8 23.71a.54.54 0 0 0-.54.93l8.88 5.2 21.59-6.47a.54.54 0 1 0-.3-1.03z' fill='%23000'/%3E%3Cpath d='M34.43 24.5L13.3 30.83 4.8 25.86a.54.54 0 1 0-.54.93L13.15 32l21.59-6.48a.54.54 0 1 0-.3-1.03z' fill='%23000'/%3E%3C/svg%3E");

    }
    .ico_plastic {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30.69 5.42a1.51 1.51 0 0 0-2.09 0l-1.7 1.71c-.2.2-.2.5 0 .7l.33.34-.33.33a1 1 0 0 0-1.39.01l-.67.68a.98.98 0 0 0-.27.91c-.36.09-.74.12-1.1.08a9.8 9.8 0 0 0-7.57 2.46L5.86 22.7a2.93 2.93 0 0 0 2.63 4.94 2.93 2.93 0 0 0 3.44 3.44 2.95 2.95 0 0 0 .73 2.57 2.83 2.83 0 0 0 2.1.89c.81 0 1.6-.33 2.18-.9l1.72-1.72 8.24-8.26a9.82 9.82 0 0 0 2.45-7.58c-.03-.37 0-.75.08-1.11.33.07.67-.03.91-.26l.68-.68c.38-.39.38-1 0-1.39l.34-.34.34.34c.2.2.5.2.7 0l1.7-1.7a1.48 1.48 0 0 0 0-2.1L30.7 5.42zM18.3 30.87l-5.48-5.49a.99.99 0 0 1 0-1.4l6.16-6.16a.98.98 0 0 1 1.39 0l5.48 5.49-7.55 7.56zm8.21-8.29l-5.45-5.46a1.97 1.97 0 0 0-2.78 0l-6.16 6.17a1.97 1.97 0 0 0 0 2.79l5.48 5.49-1.37 1.37c-.4.4-.95.63-1.52.61-.51 0-1-.2-1.35-.58-.71-.76-.69-1.96.05-2.7a.5.5 0 1 0-.7-.69A1.94 1.94 0 1 1 10 26.84a.5.5 0 0 0-.7-.7 1.94 1.94 0 1 1-2.74-2.75L16.6 13.33a8.94 8.94 0 0 1 6.77-2.17c.62.06 1.25-.01 1.83-.22l3.4 3.4a4.4 4.4 0 0 0-.22 1.84 9.05 9.05 0 0 1-1.85 6.4zm3.12-8.57l-.13-.14-3.84-3.85-.14-.13.68-.68 4.11 4.12-.68.68zm.7-2.07L27.58 9.2l.34-.34 2.74 2.75-.34.33zm3.07-1.7l-1.36 1.36-4.11-4.12 1.36-1.36a.5.5 0 0 1 .7 0l3.41 3.42a.5.5 0 0 1 0 .7z' fill='%23000'/%3E%3C/svg%3E");

    }
</style>
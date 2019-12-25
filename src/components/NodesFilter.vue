<template>
    <div class="map_filters">
        <div :class="['map_filter ico_plastic', {filter_active: filter.plastic}]" @click="filter.invert('plastic')">
            <span>{{ $t('fraction.plastic') }}</span>
        </div>
        <div :class="['map_filter ico_plastic_bottles', {filter_active: filter.plastic_bottles}]" @click="filter.invert('plastic_bottles')">
            <span>{{ $t('fraction.plastic_bottles') }}</span>
        </div>
        <div :class="['map_filter ico_glass_bottles', {filter_active: filter.glass_bottles}]" @click="filter.invert('glass_bottles')">
            <span>{{ $t('fraction.glass_bottles') }}</span>
        </div>
        <div :class="['map_filter ico_glass', {filter_active: filter.glass}]" @click="filter.invert('glass')">
            <span>{{ $t('fraction.glass') }}</span>
        </div>
        <div :class="['map_filter ico_paper', {filter_active: filter.paper}]" @click="filter.invert('paper')">
            <span>{{ $t('fraction.paper') }}</span>
        </div>
        <div :class="['map_filter ico_cans', {filter_active: filter.cans}]" @click="filter.invert('cans')">
            <span>{{ $t('fraction.cans') }}</span>
        </div>
        <div :class="['map_filter ico_plastic_bags', {filter_active: filter.plastic_bags}]" @click="filter.invert('plastic_bags')">
            <span>{{ $t('fraction.plastic_bags') }}</span>
        </div>
        <div :class="['map_filter ico_clothes', {filter_active: filter.clothes}]" @click="filter.invert('clothes')">
            <span>{{ $t('fraction.clothes') }}</span>
        </div>
        <div :class="['map_filter ico_hazardous_waste', {filter_active: filter.hazardous_waste}]" @click="filter.invert('hazardous_waste')">
            <span>{{ $t('fraction.hazardous_waste') }}</span>
        </div>
        <div :class="['map_filter ico_scrap_metal', {filter_active: filter.scrap_metal}]" @click="filter.invert('scrap_metal')">
            <span>{{ $t('fraction.scrap_metal') }}</span>
        </div>
        <div :class="['map_filter ico_engine_oil', {filter_active: filter.engine_oil}]" @click="filter.invert('engine_oil')">
            <span>{{ $t('fraction.engine_oil') }}</span>
        </div>
        <div :class="['map_filter ico_low_energy_bulbs', {filter_active: filter.low_energy_bulbs}]" @click="filter.invert('low_energy_bulbs')">
            <span>{{ $t('fraction.low_energy_bulbs') }}</span>
        </div>
        <div :class="['map_filter ico_batteries', {filter_active: filter.batteries}]" @click="filter.invert('batteries')">
            <span>{{ $t('fraction.batteries') }}</span>
        </div>
        <div :class="['map_filter ico_all', {filter_active: filter.recycling}]" @click="filter.invert('recycling')">
            <span>{{ $t('fraction.anyRecycling') }}</span>
        </div>
        <div :class="['map_filter ico_waste_disposal', {filter_active: filter.waste_disposal}]" @click="filter.invert('waste_disposal')">
            <span>{{ $t('fraction.wasteDisposal') }}</span>
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

<style>
    .map_filters {
        background:white;
        height:115px;
        display:flex;
        overflow-x: auto;
        position:absolute;
        left:20px;
        bottom:20px;
        border-radius:8px;
        right:20px;
        overflow-y:hidden;
    }
    @media screen and (max-width: 700px) {
        .map_filters {
            right:20px;
        }
    }
    @media screen and (min-width: 700px) {
        .map_filters {
            right:auto;
        }
    }
    @media screen and (min-width: 700px) {
        .map_filter:hover {
            background-color:#eee;
        }
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
    .ico_waste_disposal.filter_active:before {
        background:#8D6E63;
    }
    .map_filter:hover:before {
        width:10px;
        height:10px;
        border-radius:10px;
        content: '';
        display:block;
        border:1px solid #2E7D32;
        position:absolute;
        top:10px;
        left:45%;
    }
    .map_filter {
        margin:10px;
        padding:5px;
        cursor:pointer;
        background-repeat:no-repeat;
        background-position: center;
        padding-top:67px;
        position:relative;
        border-radius:8px;
        text-align: center;
        line-height: 1em;
        overflow-wrap: break-word;
    }
    .p_fraction.ico_notags:before,
    .ico_notags {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='41' height='41' viewBox='0 0 41 41' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M29.0483 20.1504C29.0483 22.5544 28.1122 24.8145 26.4123 26.5144C24.7124 28.2142 22.4523 29.1504 20.0483 29.1504C18.3654 29.1504 16.7534 28.691 15.3543 27.8327L16.3862 26.8008C17.4729 27.4016 18.7213 27.7441 20.0483 27.7441C24.2356 27.7441 27.6421 24.3376 27.6421 20.1504C27.6421 18.8233 27.2995 17.5749 26.6987 16.4883L27.7306 15.4564C28.589 16.8554 29.0483 18.4675 29.0483 20.1504ZM12.0729 29.1202L11.0785 28.1259L13.2064 25.9979C11.8101 24.3693 11.0483 22.3184 11.0483 20.1504C11.0483 17.7464 11.9845 15.4863 13.6844 13.7864C15.3843 12.0866 17.6444 11.1504 20.0483 11.1504C22.2164 11.1504 24.2673 11.9121 25.8959 13.3085L28.0238 11.1806L29.0182 12.1749L12.0729 29.1202ZM14.2072 24.9971L24.8951 14.3093C23.5791 13.2154 21.8893 12.5566 20.0483 12.5566C15.8611 12.5566 12.4546 15.9632 12.4546 20.1504C12.4546 21.9913 13.1133 23.6812 14.2072 24.9971V24.9971Z' fill='black'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_paper:before,
    .ico_paper {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M34.8 15.9l-5.25-2.22c-1.98-.94-4.54-3.5-4.56-3.52a.54.54 0 0 0-.87.15c-.88 1.86-3.44 2.42-3.5 2.43L4.4 17.2a.54.54 0 0 0-.13.98l8.67 5.1a.54.54 0 0 0 .43.05l21.37-6.41a.54.54 0 0 0 .06-1.01zm-21.51 6.33L5.9 17.9l14.96-4.11c.12-.03 2.56-.55 3.85-2.39.88.83 2.76 2.49 4.39 3.26l3.9 1.65-19.72 5.92z' fill='%23000'/%3E%3Cpath d='M34.43 19.04L13.3 25.38 4.8 20.41a.54.54 0 0 0-.54.92l8.88 5.21 21.59-6.47a.54.54 0 1 0-.3-1.03z' fill='%23000'/%3E%3Cpath d='M34.43 22.19L13.3 28.53 4.8 23.56a.54.54 0 1 0-.54.93l8.88 5.2 21.59-6.47a.54.54 0 1 0-.3-1.03z' fill='%23000'/%3E%3Cpath d='M34.43 25.34L13.3 31.68 4.8 26.71a.54.54 0 0 0-.54.93l8.88 5.2 21.59-6.47a.54.54 0 1 0-.3-1.03z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_glass_bottles:before,
    .ico_glass_bottles {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28.22 18.38c.52-1.32 1.3-2.51 2.3-3.52l1.85-1.84c.2.22.55.22.76 0l1.53-1.52a.54.54 0 0 0 0-.77L31.6 7.67a.54.54 0 0 0-.76 0L29.3 9.2a.54.54 0 0 0 0 .77l-1.84 1.84c-1 1-2.2 1.78-3.52 2.3l-3.53 1.38c-2.15.84-4.1 2.12-5.74 3.75l-8.3 8.3a.54.54 0 0 0 0 .77l7.64 7.64c.22.21.56.21.77 0l8.3-8.3a16.64 16.64 0 0 0 3.75-5.74l1.38-3.53zm3-9.56l2.3 2.3-.77.76-2.3-2.3.77-.76zM14.41 34.81l-6.88-6.88L15.45 20a15.58 15.58 0 0 1 5.37-3.51l3.52-1.38a11.3 11.3 0 0 0 3.9-2.55l1.83-1.84 1.53 1.53-1.84 1.84A11.29 11.29 0 0 0 27.22 18l-1.38 3.53a15.58 15.58 0 0 1-3.51 5.37L14.4 34.8z' fill='%23000'/%3E%3Cpath d='M17.46 20.29a.54.54 0 0 0-.76 0l-6.5 6.5a.54.54 0 0 0 0 .76l4.59 4.58c.21.21.55.21.76 0l6.5-6.5a.54.54 0 0 0 0-.76l-4.59-4.59zm-2.29 10.7l-3.82-3.83 5.73-5.73 3.82 3.82-5.73 5.73z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_clothes:before,
    .ico_clothes {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25.13 8.25H22.3a2.82 2.82 0 01-5.62 0h-2.81L6 12.75l2.25 6.19 3.38-1.13v12.94h15.75V17.81l3.37 1.13L33 12.75l-7.87-4.5zm4.94 9.27l-2.34-.77-1.48-.5V29.62h-13.5V16.25l-1.48.5-2.34.77-1.55-4.26 6.8-3.89h1.55a3.94 3.94 0 007.54 0h1.56l6.79 3.89-1.55 4.26z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_glass:before,
    .ico_glass {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 9h22v22H9V9z' fill='%23000'/%3E%3Cpath d='M9.8 9.7l2.4 2.3h.2l1.7.8 2.1-3H9.8zm7.4 0l-2.3 3.4 1.6.7.1.1 2.7 3 1.1 1.1.4-1 1.3-4.4-.9-2.9h-4zm4.9 0l.7 2.5 4.5-.9-.3-1.6h-5zm5.7 0l.4 1.9v.3l-.3.1-5.2 1-.7 2.4 2 2.4 6.2-4v-4h-2.4zm-18 1.1v7.3l3-1.2-.9-4.1-2-2zm3 2.3l.8 3.8 2.2.9 1.5-1.9-1.2-1.4-3.3-1.4zm17.4 1.6l-6.7 4.5-.6.4 7.3 4.6v-9.5zm-17 3l-3.4 1.2v7.2l7.8-4.5 2-1.4-1.6-.7-2.5-1h-.2l-2.1-.9zM23.6 21l-.2.3-2 2-.1 2.5 3 4 6-2.6v-2L23.5 21zm-6.5 1.8l-2.8 1.6 4.3 5.8h5l-3-4-.2-.2V26l.2-2-3.5-1zm-3.5 2L9.8 27v3.2h7.8l-4-5.4zm16.6 3.3l-4.9 2h5v-2z' fill='%23fff'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_plastic:before,
    .ico_plastic {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30.69 5.42a1.51 1.51 0 0 0-2.09 0l-1.7 1.71c-.2.2-.2.5 0 .7l.33.34-.33.33a1 1 0 0 0-1.39.01l-.67.68a.98.98 0 0 0-.27.91c-.36.09-.74.12-1.1.08a9.8 9.8 0 0 0-7.57 2.46L5.86 22.7a2.93 2.93 0 0 0 2.63 4.94 2.93 2.93 0 0 0 3.44 3.44 2.95 2.95 0 0 0 .73 2.57 2.83 2.83 0 0 0 2.1.89c.81 0 1.6-.33 2.18-.9l1.72-1.72 8.24-8.26a9.82 9.82 0 0 0 2.45-7.58c-.03-.37 0-.75.08-1.11.33.07.67-.03.91-.26l.68-.68c.38-.39.38-1 0-1.39l.34-.34.34.34c.2.2.5.2.7 0l1.7-1.7a1.48 1.48 0 0 0 0-2.1L30.7 5.42zM18.3 30.87l-5.48-5.49a.99.99 0 0 1 0-1.4l6.16-6.16a.98.98 0 0 1 1.39 0l5.48 5.49-7.55 7.56zm8.21-8.29l-5.45-5.46a1.97 1.97 0 0 0-2.78 0l-6.16 6.17a1.97 1.97 0 0 0 0 2.79l5.48 5.49-1.37 1.37c-.4.4-.95.63-1.52.61-.51 0-1-.2-1.35-.58-.71-.76-.69-1.96.05-2.7a.5.5 0 1 0-.7-.69A1.94 1.94 0 1 1 10 26.84a.5.5 0 0 0-.7-.7 1.94 1.94 0 1 1-2.74-2.75L16.6 13.33a8.94 8.94 0 0 1 6.77-2.17c.62.06 1.25-.01 1.83-.22l3.4 3.4a4.4 4.4 0 0 0-.22 1.84 9.05 9.05 0 0 1-1.85 6.4zm3.12-8.57l-.13-.14-3.84-3.85-.14-.13.68-.68 4.11 4.12-.68.68zm.7-2.07L27.58 9.2l.34-.34 2.74 2.75-.34.33zm3.07-1.7l-1.36 1.36-4.11-4.12 1.36-1.36a.5.5 0 0 1 .7 0l3.41 3.42a.5.5 0 0 1 0 .7z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_plastic_bottles:before,
    .ico_plastic_bottles {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30.69 5.42a1.51 1.51 0 0 0-2.09 0l-1.7 1.71c-.2.2-.2.5 0 .7l.33.34-.33.33a1 1 0 0 0-1.39.01l-.67.68a.98.98 0 0 0-.27.91c-.36.09-.74.12-1.1.08a9.8 9.8 0 0 0-7.57 2.46L5.86 22.7a2.93 2.93 0 0 0 2.63 4.94 2.93 2.93 0 0 0 3.44 3.44 2.95 2.95 0 0 0 .73 2.57 2.83 2.83 0 0 0 2.1.89c.81 0 1.6-.33 2.18-.9l1.72-1.72 8.24-8.26a9.82 9.82 0 0 0 2.45-7.58c-.03-.37 0-.75.08-1.11.33.07.67-.03.91-.26l.68-.68c.38-.39.38-1 0-1.39l.34-.34.34.34c.2.2.5.2.7 0l1.7-1.7a1.48 1.48 0 0 0 0-2.1L30.7 5.42zM18.3 30.87l-5.48-5.49a.99.99 0 0 1 0-1.4l6.16-6.16a.98.98 0 0 1 1.39 0l5.48 5.49-7.55 7.56zm8.21-8.29l-5.45-5.46a1.97 1.97 0 0 0-2.78 0l-6.16 6.17a1.97 1.97 0 0 0 0 2.79l5.48 5.49-1.37 1.37c-.4.4-.95.63-1.52.61-.51 0-1-.2-1.35-.58-.71-.76-.69-1.96.05-2.7a.5.5 0 1 0-.7-.69A1.94 1.94 0 1 1 10 26.84a.5.5 0 0 0-.7-.7 1.94 1.94 0 1 1-2.74-2.75L16.6 13.33a8.94 8.94 0 0 1 6.77-2.17c.62.06 1.25-.01 1.83-.22l3.4 3.4a4.4 4.4 0 0 0-.22 1.84 9.05 9.05 0 0 1-1.85 6.4zm3.12-8.57l-.13-.14-3.84-3.85-.14-.13.68-.68 4.11 4.12-.68.68zm.7-2.07L27.58 9.2l.34-.34 2.74 2.75-.34.33zm3.07-1.7l-1.36 1.36-4.11-4.12 1.36-1.36a.5.5 0 0 1 .7 0l3.41 3.42a.5.5 0 0 1 0 .7z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_hazardous_waste:before,
    .ico_hazardous_waste {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='30' height='30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23000' d='M15 .72l14.13 14.15L15 29 .85 14.87z'/%3E%3Cpath d='M10.81 17.72l.65-1.24v2.86c0 .34.21.66.52.82.56.27 1.56.63 2.91.63 1.22 0 2.12-.3 2.68-.55.39-.18.64-.57.64-1v-2.76l.03.07.62 1.14a4.81 4.81 0 001.64-3.59c0-2.8-2.54-5.08-5.68-5.08-3.13 0-5.68 2.27-5.68 5.08 0 1.42.63 2.7 1.67 3.62zm4.73-3c0-.17.15-.26.33-.26h2.02c.18 0 .32.09.32.26 0 .88-.6 1.6-1.34 1.6-.73 0-1.33-.72-1.33-1.6zm-.71 1.47c.1 0 .19.05.26.12l.8.9-.4.34-.44-.23a.47.47 0 00-.43 0l-.43.23-.39-.34.77-.9a.33.33 0 01.26-.12zm-3.23-1.47c0-.17.11-.26.29-.26h2.03c.17 0 .35.09.35.26 0 .88-.6 1.6-1.34 1.6-.73 0-1.33-.72-1.33-1.6z' fill='%23000'/%3E%3C/svg%3E");
    }

    .p_fraction.ico_scrap_metal,
    .ico_scrap_metal {
      background-size: 41px;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg height='512' viewBox='0 0 64 64' width='512' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='32' cy='14' r='2'/%3E%3Cpath d='m41 17a9 9 0 0 0 -18 0v3h18zm-9 1a4 4 0 1 1 4-4 4 4 0 0 1 -4 4z'/%3E%3Cpath d='m19 32h4v-5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5h4v-15a13 13 0 0 0 -26 0zm2-15a11 11 0 0 1 22 0v4a1 1 0 0 1 -1 1h-20a1 1 0 0 1 -1-1z'/%3E%3Cpath d='m17 20v-2h-3.142a3.592 3.592 0 0 1 0 2z'/%3E%3Crect height='4' rx='1' width='12' x='26' y='47'/%3E%3Cpath d='m50 47v1h2v2h-2v2h2v2h-2v2h2v2h-2v1a1 1 0 0 0 1 1h3v-14h-3a1 1 0 0 0 -1 1z'/%3E%3Cpath d='m46 51h2v4h-2z'/%3E%3Cpath d='m16 51h2v4h-2z'/%3E%3Cpath d='m14 59v-1h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-1a1 1 0 0 0 -1-1h-3v14h3a1 1 0 0 0 1-1z'/%3E%3Cpath d='m47 18v2h3.142a3.592 3.592 0 0 1 0-2z'/%3E%3Cpath d='m19 34h26v4h-26z'/%3E%3Cpath d='m25 28h14v4h-14z'/%3E%3Cpath d='m11 33v-10.142a3.592 3.592 0 0 1 -2 0v10.142a1 1 0 0 0 2 0z'/%3E%3Cpath d='m4 47v1h2v2h-2v2h2v2h-2v2h2v2h-2v1a1 1 0 0 0 1 1h3v-14h-3a1 1 0 0 0 -1 1z'/%3E%3Ccircle cx='10' cy='19' r='2'/%3E%3Cpath d='m60 59v-1h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-1a1 1 0 0 0 -1-1h-3v14h3a1 1 0 0 0 1-1z'/%3E%3Cpath d='m44 45a1 1 0 0 0 -1-1h-22a1 1 0 0 0 -1 1v10h24zm-4 5a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3-3v-2a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z'/%3E%3Cpath d='m53 22.858v10.142a1 1 0 0 0 2 0v-10.142a3.592 3.592 0 0 1 -2 0z'/%3E%3Cpath d='m23 40h18v2h-18z'/%3E%3Ccircle cx='54' cy='19' r='2'/%3E%3Cpath d='m59 39h-2a3 3 0 0 0 -6 0h-2a5 5 0 0 1 10 0z'/%3E%3Cpath d='m15 39h-2a3 3 0 0 0 -6 0h-2a5 5 0 0 1 10 0z'/%3E%3C/svg%3E");

    }
    .p_fraction.ico_engine_oil:before,
    .ico_engine_oil {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg height='30' viewBox='-72 0 496 496' width='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m296 64h-168v-16h8c4.425781 0 8-3.585938 8-8v-32c0-4.414062-3.574219-8-8-8h-112c-4.425781 0-8 3.585938-8 8v32c0 4.414062 3.574219 8 8 8h8v21.480469c-18.886719 9.007812-32 28.238281-32 50.519531v320c0 30.871094 25.128906 56 56 56h240c30.871094 0 56-25.128906 56-56v-320c0-30.878906-25.128906-56-56-56zm40 56v124.6875l-32-32v-76.6875c0-13.230469-10.769531-24-24-24h-76.6875l-32-32h124.6875c22.054688 0 40 17.945312 40 40zm-48 76.6875-68.6875-68.6875h60.6875c4.414062 0 8 3.59375 8 8zm-256-180.6875h96v16h-96zm16 32h64v16h-56c-2.71875 0-5.375.265625-8 .640625zm248 432h-240c-22.054688 0-40-17.945312-40-40v-320c0-22.054688 17.945312-40 40-40h92.6875l187.3125 187.3125v172.6875c0 22.054688-17.945312 40-40 40zm0 0'/%3E%3Cpath d='m141.65625 98.34375c-1.496094-1.503906-3.527344-2.34375-5.65625-2.34375h-72c-17.648438 0-32 14.351562-32 32v304c0 17.648438 14.351562 32 32 32h224c17.648438 0 32-14.351562 32-32v-152c0-2.128906-.839844-4.160156-2.34375-5.65625zm162.34375 333.65625c0 8.824219-7.175781 16-16 16h-224c-8.824219 0-16-7.175781-16-16v-304c0-8.824219 7.175781-16 16-16h68.6875l171.3125 171.3125zm0 0'/%3E%3Cpath d='m112 357.984375c0 29.535156 21.167969 54.3125 49.230469 57.617187 2.21875.253907 4.441406.390626 6.640625.390626 13.722656 0 27.039062-4.984376 37.320312-14.128907 11.960938-10.625 18.808594-25.878906 18.808594-41.863281v-2.015625c0-15.726563-3.976562-31.328125-11.503906-45.121094l-37.472656-68.695312c-2.800782-5.144531-11.246094-5.144531-14.046876 0l-37.472656 68.6875c-7.527344 13.800781-11.503906 29.402343-11.503906 45.128906zm25.550781-37.464844 30.449219-55.808593 30.449219 55.824218c6.246093 11.441406 9.550781 24.394532 9.550781 37.449219v2.015625c0 11.414062-4.894531 22.3125-13.441406 29.902344-8.648438 7.691406-19.839844 11.167968-31.453125 9.808594-19.679688-2.320313-35.105469-20.648438-35.105469-41.726563 0-13.054687 3.304688-26.007813 9.550781-37.464844zm0 0'/%3E%3Cpath d='m200 360h-16c0 8.824219-7.175781 16-16 16v16c17.648438 0 32-14.351562 32-32zm0 0'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_cans:before,
    .ico_cans {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M29.23 12.58l-.73-2.19c-.03-1.21-.88-2.33-2.4-3.15A11.7 11.7 0 0 0 20.64 6c-2.07 0-4.01.44-5.48 1.24-1.52.82-2.37 1.94-2.4 3.15l-.73 2.19a.4.4 0 0 0-.02.12v17.51a.4.4 0 0 0 0 .05c.06 1.3.98 2.5 2.62 3.38 1.6.88 3.74 1.36 6 1.36 2.27 0 4.4-.48 6.01-1.36 1.64-.89 2.56-2.08 2.62-3.38a.4.4 0 0 0 0-.05v-17.5a.4.4 0 0 0-.02-.13zm-13.7-4.65a10.91 10.91 0 0 1 5.1-1.14c1.93 0 3.74.4 5.1 1.14 1.28.7 1.99 1.6 1.99 2.53a2 2 0 0 1-.23.91c.02-.12.03-.25.03-.38 0-1.09-.75-2.1-2.11-2.84a10.21 10.21 0 0 0-4.78-1.08c-1.8 0-3.5.38-4.79 1.08-1.36.74-2.1 1.75-2.1 2.84 0 .13 0 .26.03.38a2 2 0 0 1-.23-.91c0-.94.7-1.83 1.98-2.53zm4.8 6.2c-3.18-.09-5.8-1.49-5.8-3.14 0-1.7 2.79-3.13 6.1-3.13 3.3 0 6.1 1.43 6.1 3.13 0 1.65-2.63 3.05-5.81 3.14a13.44 13.44 0 0 1-.59 0zm5.93 18.82c-1.5.81-3.5 1.26-5.63 1.26-2.14 0-4.14-.45-5.64-1.26-1.12-.6-1.84-1.36-2.1-2.16.5.58 1.21 1.1 2.1 1.52 1.55.76 3.56 1.17 5.64 1.17 2.35 0 4.55-.52 6.18-1.45a.4.4 0 0 0-.4-.69 12 12 0 0 1-5.78 1.35c-1.97 0-3.85-.38-5.3-1.09-1.4-.67-2.27-1.56-2.5-2.52a.4.4 0 0 0-.04-.12V14.02c.5.62 1.25 1.18 2.2 1.64 1.55.75 3.56 1.17 5.64 1.17 2.35 0 4.55-.52 6.18-1.46a.4.4 0 0 0-.4-.68 12 12 0 0 1-5.78 1.35c-1.97 0-3.85-.39-5.3-1.09-1.34-.65-2.21-1.5-2.46-2.42l.24-.72c.38.7 1.08 1.35 2.04 1.87a11.7 11.7 0 0 0 5.48 1.24c2.06 0 4-.44 5.48-1.24a4.94 4.94 0 0 0 2.04-1.87l.24.72c-.1.36-.3.7-.58 1.05a.4.4 0 1 0 .6.5l.05-.06v14.94a.4.4 0 0 0-.05.12c-.09.4-.29.78-.6 1.15a.4.4 0 0 0 .55.55c-.25.8-.98 1.56-2.1 2.17zm-4.47-20.29l3.01-.43a1.26 1.26 0 0 0 1.08-1.24c0-.62-.46-1.16-1.08-1.25l-3.01-.43a1.7 1.7 0 1 0 0 3.35zM20.64 11a.9.9 0 0 1 1.03-.9l3.02.43c.23.03.4.23.4.47 0 .23-.17.43-.4.46l-3.02.43-.13.01a.9.9 0 0 1-.9-.9zm1.21.34v-.7a.4.4 0 1 1 .79 0v.7a.4.4 0 0 1-.79 0z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_low_energy_bulbs:before,
    .ico_low_energy_bulbs {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M16.5 27.3v2.2l6.2-.7a135 135 0 0 1 0-1.5c1-2.5 4.3-9.6 4.3-11.8a7.5 7.5 0 0 0-15 0c0 2.5 3.4 9.3 4.5 11.8zm3-18.2c3.5 0 6.4 2.9 6.4 6.4 0 1.8-3 8.3-4.3 11.7h-4c-1.4-3.2-4.5-9.6-4.5-11.7 0-3.5 2.9-6.4 6.4-6.4zM16.5 30.7v.7l6.2-.7v-.1-.8l-6.2.6v.3zM19.7 33.2c2 0 2.6-.9 2.9-1.6l-5.6.6c.5.5 1.3 1 2.7 1z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_batteries:before,
    .ico_batteries {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25.4 7.88h-3.07V6h-5.64v1.88h-3.06c-.9 0-1.63.73-1.63 1.62v23.03c0 .9.73 1.63 1.63 1.63h11.76c.9 0 1.63-.73 1.63-1.63V9.5c0-.9-.73-1.62-1.63-1.62zm-7.77-.94h3.76v.94h-3.76v-.94zm8.45 25.6c0 .37-.3.68-.69.68H13.63a.69.69 0 0 1-.7-.69V9.5c0-.38.32-.68.7-.68h11.76c.38 0 .69.3.69.68v23.03z' fill='%23000'/%3E%3Cpath d='M21.39 14.03a.5.5 0 0 0-.29-.47l-.36-.15-.24.28-5.12 8.27h2.72V28c0 .2.1.39.27.47l.38.17.24-.3 4.58-8.73H21.4v-5.58zm.63 6.52l-2.98 5.68v-5.21h-1.97l3.38-5.46v4.99h1.57z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_plastic_bags:before,
    .ico_plastic_bags {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M25.07 17.02c-.24 0-.43.2-.43.43v14.24a.43.43 0 1 0 .86 0V17.45c0-.24-.19-.43-.43-.43zM13.93 17.02c-.24 0-.43.2-.43.43v1.72a.43.43 0 1 0 .86 0v-1.72c0-.24-.2-.43-.43-.43zM13.93 20.47c-.24 0-.43.19-.43.43v10.79a.43.43 0 0 0 .86 0v-10.8c0-.23-.2-.42-.43-.42z' fill='%23000'/%3E%3Cpath d='M28.8 7h-3.73c-.24 0-.43.2-.43.43v7.8H14.36v-7.8c0-.24-.2-.43-.43-.43H10.2c-.23 0-.43.2-.43.43V32.7c0 .72.59 1.3 1.3 1.3h16.85c.72 0 1.3-.58 1.3-1.3V7.43c0-.24-.19-.43-.42-.43zm-.44 25.7c0 .24-.2.44-.44.44H11.08a.44.44 0 0 1-.44-.44V7.86h2.86v7.8c0 .25.19.44.43.44h11.14c.24 0 .43-.2.43-.43v-7.8h2.86V32.7z' fill='%23000'/%3E%3C/svg%3E");
    }
    .p_fraction.ico_waste_disposal:before,
    .ico_waste_disposal {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='40' height='40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28.47 12.3h-.34v-.7c0-.6-.5-1.09-1.1-1.09h-4.02l-.49-1.72A1.1 1.1 0 0 0 21.47 8h-3.94c-.49 0-.92.33-1.05.8l-.5 1.71h-4.02c-.6 0-1.09.5-1.09 1.1v.7h-.34a.37.37 0 1 0 0 .74h.73l1.3 16.29c.08.93.87 1.66 1.8 1.66h10.28c.93 0 1.72-.73 1.8-1.66l1.3-16.29h.73a.37.37 0 0 0 0-.74zM17.2 9a.35.35 0 0 1 .33-.25h3.94c.15 0 .3.1.33.25l.44 1.51h-5.48L17.2 9zm-5.24 2.26h15.07c.2 0 .35.15.35.34v.7H11.62v-.7c0-.19.15-.34.34-.34zM25.7 29.28c-.05.55-.51.97-1.06.97H14.36c-.55 0-1.01-.42-1.06-.97L12 13.05h15l-1.3 16.23z' fill='%23000'/%3E%3Cpath d='M19.5 29.2c.2 0 .37-.16.37-.37v-14a.37.37 0 0 0-.74 0v14c0 .2.16.38.37.38zM15.9 28.85a.37.37 0 0 0 .74-.04l-.72-14a.37.37 0 1 0-.74.04l.72 14zM22.71 29.2h.02c.2 0 .36-.15.37-.35l.72-14a.37.37 0 0 0-.74-.04l-.72 14c-.01.2.15.38.35.4z' fill='%23000'/%3E%3C/svg%3E");
    }


</style>

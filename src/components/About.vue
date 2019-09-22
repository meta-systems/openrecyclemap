<template>
    <div class="about-container">
        <router-link class="orm_logo" aria-label="Map" to="/map"></router-link>
        <p><b>OpenRecycleMap</b> - приложение для просмотра и добавления информации о пунктах приема отходов,
            которые будут отправлены на переработку.</p>
        <div class="main_box">
            <router-link class="box_item" to="/login">Аккаунт</router-link>
            <router-link class="box_item" to="/map/add">Добавить</router-link>
            <router-link class="box_item ico_map" to="/map">Карта</router-link>
            
        </div>
     Работа над названиями фракций и их тегами ведется в этом <a rel="noopener" href="https://docs.google.com/document/d/1Ma4ku0M1T7Y-CYaA-d2-IDL-iJ1uGgOH5HlW3vfLWXQ/edit?usp=sharing" target="_blank">гугл документе</a>

     <h2>Данные</h2>
         Данные для этой карты берутся из <a rel="noopener" href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> - проекта свободной карты, составляемый тысячами добровольцев со всего мира.
        <div class="dev_box">
            Разработано в <a rel="noopener" href="https://msys.pro/" target="_blank">MetaSystems</a>
        </div>

    </div>
    

</template>

<script>
    export default {
        data: function () {
            return {
            };
        },
        methods: {

        },
        created() {

        }
    }
</script>

<style>
    .dev_box {
        position:absolute;
        bottom:20px;
        right:20px;
        margin-top:30px;
    }
    h2 {
        margin-top:20px;
        font-weight: normal;
    }
    table {
        border-collapse: collapse;
        margin:30px 0;
    }
    .thead {
        font-weight:bold;
    }
    tr:hover {
        background:#fff;
    }
    td {
        padding:8px 10px;
        border-bottom:1px solid #ccc;
        border-top:1px solid #ccc;
    }
    .v-content__wrap {
        background:#eee;
    }
    .main_box {
        display:flex;
        margin-bottom:30px;
    }
    .box_item:hover {
        box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.25);
    }
    .box_item:before {
        width:55px;
        height:55px;
        content:'';
    }
    .box_item {
        background:white;
        display:flex;
        width:110px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
        margin:10px;
        padding:15px;
        border-radius:10px;
        flex: 0 50%;
        box-sizing:border-box;
        color:black;
        text-decoration:none;
        background-repeat:no-repeat;
        background-position:top center;

        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .about-container {
        padding: 15px;
    }
    .orm_logo {
        width:60px;
        height:60px;
        background-size:contain;
        display:block;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='53' height='53' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='26.5' cy='26.5' r='17.71' fill='%23fff' filter='url(%23filter0_d)'/%3E%3Cpath d='M14.06 38.94a17.6 17.6 0 0 0 24.88 0 .88.88 0 0 1 1.32.07l2.27 3.03c.1.14.1.33-.03.46a22.63 22.63 0 1 1 6.52-13.79l2.27.02c.51-.02.98.26 1.18.73.25.43.2.97-.13 1.37l-5.28 7.08c-.66.87-1.9.28-2.12-.02l-5.3-7.06c-.32-.4-.36-.92-.14-1.37.23-.45.68-.75 1.2-.75H43.96a17.6 17.6 0 1 0-29.9 10.24z' fill='%23248A00'/%3E%3Cpath d='M34.4 36H30.1l-3.73-7.08h-2.68V36h-3.73V21c0-1.42.33-2.46 1-3.1.66-.66 1.76-1 3.32-1h3.16c1.9 0 3.4.59 4.51 1.75a5.97 5.97 0 0 1 1.69 4.37 5.6 5.6 0 0 1-1.02 3.35 5.16 5.16 0 0 1-2.47 1.93l4.27 7.7zm-7.2-10.2c.78 0 1.42-.26 1.92-.8.52-.55.78-1.23.78-2.03 0-.83-.25-1.49-.75-1.99a2.6 2.6 0 0 0-1.96-.75h-1.85c-1.1 0-1.66.56-1.66 1.7v3.88h3.51z' fill='%23000'/%3E%3Cdefs%3E%3Cfilter id='filter0_d' x='2.79' y='2.79' width='47.41' height='47.41' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.26 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E");
    }
    .ico_map:before {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='56' height='56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M45.33 10.35c.3.18.47.5.47.85v28a1 1 0 0 1-.55.9l-11.2 5.6a1 1 0 0 1-.9 0L22.4 40.31l-10.75 5.37a1 1 0 0 1-1.45-.89v-28a1 1 0 0 1 .55-.9l11.2-5.6a1 1 0 0 1 .9 0l10.75 5.38 10.75-5.37a1 1 0 0 1 .98.04zM32.6 17.42l-9.2-4.6v25.76l9.2 4.6V17.42zm2 25.76l9.2-4.6V12.82l-9.2 4.6v25.76zm-13.2-4.6V12.82l-9.2 4.6v25.76l9.2-4.6z' fill='%23000'/%3E%3C/svg%3E");
    }
</style>
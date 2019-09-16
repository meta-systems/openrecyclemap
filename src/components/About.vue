<template>
    <div class="about-container">
        <router-link class="orm_logo" to="/map"></router-link>
        <p><b>OpenRecycleMap</b> - приложение для просмотра и добавления информации о пунктах приема отходов,
            которые будут отправлены на переработку.</p>
        <div class="main_box">
            <router-link class="box_item" to="/login">Аккаунт</router-link>
            <router-link class="box_item" to="/map/add">Добавить</router-link>
            <router-link class="box_item" to="/map">Карта</router-link>
            
        </div>

        <p>Какими тегами обозначаются контейнеры для раздельного сбора мусора:</p>
        amenity=recycling<br/>
        recycling_type=container
        <table>
            <tr class="thead"><td>Вид мусора</td><td>Тэг</td><td><a href="https://taginfo.openstreetmap.org/tags/amenity=recycling#combinations" target="_blank">Taginfo</a></td></tr>
            <tr><td>Пластик</td><td>recycling:plastic=yes</td><td>10%</td></tr>
            <!-- <tr><td>Пластиковые бутылки</td><td>recycling:plastic_bottles=yes</td><td>5%</td></tr> -->
            <tr><td>Пакеты</td><td>recycling:plastic_bags=yes</td><td>нет в taginfo</td></tr>
            <tr><td>Бумага</td><td>recycling:paper=yes</td><td>25%</td></tr>
            <tr><td>Стеклянные бутылки</td><td>recycling:glass_bottles=yes</td><td>23%</td></tr>
            <tr><td>Алюминиевые банки</td><td>recycling:cans=yes</td><td>13%</td></tr>
            <tr><td>Батарейки</td><td>recycling:batteries=yes</td><td>4%</td></tr>
            <tr><td>Лампочки (люменесцентные лампы)</td><td>recycling:low_energy_bulbs=yes</td><td>нет в taginfo</td></tr>
        </table>

        Все возможные значения тега recycling см в вики: <a href="https://wiki.openstreetmap.org/wiki/RU:Tag:amenity%3Drecycling" target="_blank">amenity=recycling</a>
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
    .box_item {
        background:white;
        display:flex;
        height:90px;
        width:110px;
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
        margin:10px;
        padding:15px;
        border-radius:10px;
        flex: 0 50%;
        box-sizing:border-box
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
</style>
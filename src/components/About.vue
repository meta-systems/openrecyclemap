<template>
    <div class="about-container">
        <router-link class="orm_logo" to="/map"></router-link>
        <p><b>OpenRecycleMap</b> - приложение для просмотра и добавления информации о пунктах приема отходов,
            которые будут отправлены на переработку.</p>
        <div class="main_box">
            <router-link class="box_item" to="/map">Карта</router-link>
            <router-link class="box_item" to="/login">Аккаунт</router-link>
            <router-link class="box_item" to="/map/add">Добавить</router-link>
            
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
    .v-content__wrap {
        background:#eee;
    }
    .main_box {
        display:flex;
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
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='56' height='58' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='27.49' cy='26.51' r='17.81' fill='%23fff' filter='url(%23filter0_d)'/%3E%3Cpath d='M35.52 36H31.2l-3.72-7.08h-2.69V36h-3.72V21c0-1.42.33-2.46.99-3.1.66-.66 1.77-1 3.32-1h3.17c1.9 0 3.4.59 4.5 1.75a5.97 5.97 0 0 1 1.7 4.37 5.6 5.6 0 0 1-1.02 3.35 5.16 5.16 0 0 1-2.47 1.93l4.26 7.7zm-7.21-10.2c.78 0 1.43-.26 1.93-.8.52-.55.78-1.23.78-2.03 0-.83-.25-1.49-.75-1.99a2.6 2.6 0 0 0-1.96-.75h-1.85c-1.11 0-1.67.56-1.67 1.7v3.88h3.52z' fill='%23000'/%3E%3Cpath d='M40.06 39.08a17.6 17.6 0 1 1 3.58-5.14c-.13.28-.1.62.09.87l2.25 3.01a.8.8 0 0 0 1.35-.07 22.63 22.63 0 1 0-2.76 3.87c.26-.29.27-.72.04-1.03l-2.05-2.73a.88.88 0 0 0-1.38-.01c-.35.42-.72.83-1.12 1.23z' fill='%23248A00'/%3E%3Cpath d='M50.09 28.79l2.38.02c.5-.02.97.26 1.18.73.24.43.18.97-.13 1.37l-5.29 7.08c-.66.86-1.97.42-2.12-.02l-5.3-7.06c-.32-.4-.36-.92-.13-1.37.22-.45.67-.75 1.2-.75h2.85c1.71-.03 2.95-.03 5.36 0z' fill='%23248A00'/%3E%3Cdefs%3E%3Cfilter id='filter0_d' x='.27' y='2.66' width='54.43' height='54.43' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset dy='3.37'/%3E%3CfeGaussianBlur stdDeviation='4.7'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E");
    }
</style>
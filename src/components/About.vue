<template>
    <div class="about-container">
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
</style>
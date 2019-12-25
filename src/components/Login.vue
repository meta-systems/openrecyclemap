<template>
    <div class="login-container">
        <div v-if="authenticated">
            <p>{{ $t('message.username') }} <b>{{ username }}</b>.</p>
            <v-btn @click="toMap" color="primary">{{ $t('button.toMap') }}</v-btn>
        </div>
        <div v-if="authenticated === false">
            <p>Для того, чтобы вносить информацию о пунктах приема отходов, вам необходимо войти через аккаунт <b>OpenStreetMap</b>.</p>
            <p>OpenStreetMap - это глобальный проект по созданию открытой карты.</p>
            <p>Если у вас ещё нет аккаунта, вы можете зарегистрироваться. Это совсем просто. Перейдите по ссылке ниже.</p>
        </div>
        <v-btn @click="logout" color="primary" v-if="authenticated" flat>{{ $t('button.logout') }}</v-btn>
        <v-btn @click="authenticate" color="primary" v-if="!authenticated">{{ $t('button.login') }}</v-btn>
    </div>
</template>

<script>
    import oauthMixin from '../mixins/Oauth'

    export default {
        mixins: [oauthMixin],
        methods: {
            toMap: function () {
                this.$router.push({path: '/map'});
            }
        },
        created() {
            this.authInit();
        }
    }
</script>

<style>
    .login-container {
        padding: 15px;
    }
</style>
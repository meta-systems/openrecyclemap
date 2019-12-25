<template>
    <div class="login-container">
        <div v-if="authenticated">
            <p>{{ $t('message.username') }} <b>{{ username }}</b>.</p>
            <v-btn @click="toMap" color="primary">{{ $t('button.toMap') }}</v-btn>
        </div>
        <div v-if="authenticated === false">
            <p v-html="$t('message.needAccount')"></p>
            <p>{{ $t('message.aboutOsm') }}</p>
            <p>{{ $t('message.signUp') }}</p>
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
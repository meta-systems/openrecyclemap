<template>
    <div class="login-container">
        <v-select :items="languages" v-model="$i18n.locale" @change="changeLang" solo label="Language" class="language-select"></v-select>

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
        data: function() {
            return {
                languages: [
                    {text: 'English', value: 'en'},
                    {text: 'Русский', value: 'ru'},
                    {text: 'Français', value: 'fr'},
                    {text: 'Português', value: 'pt'}
                ]
            };
        },
        methods: {
            toMap: function () {
                this.$router.push({path: '/map'});
            },
            changeLang: function () {
                localStorage.setItem('lang', this.$i18n.locale);
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
    .language-select {
        max-width: 400px;
    }
</style>
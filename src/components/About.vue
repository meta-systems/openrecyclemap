<template>
    <div class="about-container">
        <router-link class="orm_logo" aria-label="Map" to="/map"></router-link>
        <router-link class="map_icon orm_control" aria-label="Map" to="/map"></router-link>
        <i18n path="about.app" tag="p">
            <b>OpenRecycleMap</b>
        </i18n>

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

        <div class="main_box">
            <!-- <router-link class="box_item ico_account" to="/login">{{ $t('menu.user') }}</router-link> -->
            <router-link class="box_item ico_add" to="/map/add">{{ $t('menu.add') }}</router-link>
            <router-link class="box_item ico_map" to="/map">{{ $t('menu.map') }}</router-link>
        </div>

        <h2>{{ $t('about.dataHeader') }}</h2>
        <i18n path="about.data" tag="p">
            <a rel="noopener" href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>
        </i18n>


        <h2>{{ $t('about.contributingHeader') }}</h2>
        <i18n path="about.contributing" tag="p">
            <a rel="noopener" href="https://github.com/meta-systems/openrecyclemap" target="_blank">Github</a>
        </i18n>
        <i18n path="about.contact" tag="p">
            <a rel="noopener" href="tg://resolve?domain=openrecyclemap" target="_blank">Telegram</a>
        </i18n>

        <h2>{{ $t('about.androidHeader') }}</h2>
        <i18n path="about.android" tag="p">
            <a rel="noopener" href="https://play.google.com/store/apps/details?id=org.openrecyclemap" target="_blank">Google Play</a>
        </i18n>

        <div class="dev_box">
            {{ $t('message.devBy') }} <a rel="noopener" href="https://msys.pro/" target="_blank">MetaSystems</a>
        </div>

    </div>

</template>

<script>
    import oauthMixin from '../mixins/Oauth'
    export default {
        mixins: [oauthMixin],
        data: function () {
            return {
                languages: [
                    {text: 'English', value: 'en'},
                    {text: 'Español', value: 'es'},
                    {text: 'Русский', value: 'ru'},
                    {text: 'Français', value: 'fr'},
                    {text: 'Français', value: 'fr'},
                    {text: 'Italiano', value: 'it'},
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
    .map_icon {
        position: absolute;
        top:25px;
        right:25px;
        background-size:80% !important;
    }
    .dev_box a {
        text-decoration: none;
    }
    .dev_box {
        position:absolute;
        bottom:65px;
        right:20px;
        margin-top:30px;
        font-size:12px;
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
        padding-bottom:130px;
        max-width: 800px;
    }
    .orm_logo {
        margin-bottom: 15px;
        width:60px;
        height:60px;
        background-size:contain;
        display:block;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='53' height='53' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='26.5' cy='26.5' r='17.71' fill='%23fff' filter='url(%23filter0_d)'/%3E%3Cpath d='M14.06 38.94a17.6 17.6 0 0 0 24.88 0 .88.88 0 0 1 1.32.07l2.27 3.03c.1.14.1.33-.03.46a22.63 22.63 0 1 1 6.52-13.79l2.27.02c.51-.02.98.26 1.18.73.25.43.2.97-.13 1.37l-5.28 7.08c-.66.87-1.9.28-2.12-.02l-5.3-7.06c-.32-.4-.36-.92-.14-1.37.23-.45.68-.75 1.2-.75H43.96a17.6 17.6 0 1 0-29.9 10.24z' fill='%23248A00'/%3E%3Cpath d='M34.4 36H30.1l-3.73-7.08h-2.68V36h-3.73V21c0-1.42.33-2.46 1-3.1.66-.66 1.76-1 3.32-1h3.16c1.9 0 3.4.59 4.51 1.75a5.97 5.97 0 0 1 1.69 4.37 5.6 5.6 0 0 1-1.02 3.35 5.16 5.16 0 0 1-2.47 1.93l4.27 7.7zm-7.2-10.2c.78 0 1.42-.26 1.92-.8.52-.55.78-1.23.78-2.03 0-.83-.25-1.49-.75-1.99a2.6 2.6 0 0 0-1.96-.75h-1.85c-1.1 0-1.66.56-1.66 1.7v3.88h3.51z' fill='%23000'/%3E%3Cdefs%3E%3Cfilter id='filter0_d' x='2.79' y='2.79' width='47.41' height='47.41' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/%3E%3CfeOffset/%3E%3CfeGaussianBlur stdDeviation='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.26 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E");
    }
    .map_icon,
    .ico_map:before {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='56' height='56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M45.33 10.35c.3.18.47.5.47.85v28a1 1 0 0 1-.55.9l-11.2 5.6a1 1 0 0 1-.9 0L22.4 40.31l-10.75 5.37a1 1 0 0 1-1.45-.89v-28a1 1 0 0 1 .55-.9l11.2-5.6a1 1 0 0 1 .9 0l10.75 5.38 10.75-5.37a1 1 0 0 1 .98.04zM32.6 17.42l-9.2-4.6v25.76l9.2 4.6V17.42zm2 25.76l9.2-4.6V12.82l-9.2 4.6v25.76zm-13.2-4.6V12.82l-9.2 4.6v25.76l9.2-4.6z' fill='%23000'/%3E%3C/svg%3E");
    }
    .ico_account:before {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='56' height='56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 9C17.52 9 9 17.52 9 28c0 5.61 2.45 10.67 6.33 14.15v.01l.28.24.15.12a19.36 19.36 0 0 0 2.52 1.8l.2.12c.45.25.9.5 1.36.72h.02c.98.47 2.02.86 3.1 1.15l.05.02c.51.14 1.03.26 1.55.35l.15.03c.5.09 1.01.16 1.53.2l.18.02a18.98 18.98 0 0 0 3.16 0l.18-.01a18.8 18.8 0 0 0 1.53-.21l.15-.03c.52-.1 1.04-.21 1.55-.35l.06-.02a19.22 19.22 0 0 0 4.47-1.88l.2-.11c.4-.24.8-.5 1.17-.77l.3-.2c.36-.27.71-.55 1.05-.83l.15-.12.28-.24v-.01A18.96 18.96 0 0 0 47 28c0-10.48-8.52-19-19-19zm0 19a6.34 6.34 0 1 1 .01-12.68A6.34 6.34 0 0 1 28 28zm2.38 1.58c4.8 0 8.7 3.91 8.7 8.71v3.14l-.1.08c-.31.25-.63.5-.96.72l-.22.16c-.35.24-.71.46-1.08.68l-.2.12a17.26 17.26 0 0 1-5.45 1.95l-.13.02c-.45.08-.9.14-1.36.18l-.19.02a18.1 18.1 0 0 1-2.78 0l-.2-.02c-.45-.04-.9-.1-1.35-.18l-.13-.02a17.43 17.43 0 0 1-4.13-1.29l-.13-.06a17.3 17.3 0 0 1-2.47-1.4l-.22-.16c-.33-.23-.65-.47-.96-.73l-.1-.08V38.3c0-4.8 3.9-8.7 8.7-8.7h4.75zm10.29 10.36v-1.65c0-4.96-3.54-9.12-8.22-10.08a7.91 7.91 0 1 0-8.9 0 10.31 10.31 0 0 0-8.22 10.08v1.65A17.35 17.35 0 0 1 10.58 28c0-9.6 7.82-17.42 17.42-17.42 9.6 0 17.42 7.82 17.42 17.42 0 4.62-1.81 8.82-4.75 11.94z' fill='%23000'/%3E%3C/svg%3E");
    }
    .ico_add:before {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='56' height='56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='28' cy='28' r='18.25' fill='%23fff' stroke='%23000' stroke-width='1.5'/%3E%3Crect x='25.89' y='20' width='4.22' height='16' rx='.84' fill='%23248A00'/%3E%3Crect x='20' y='30.11' width='4.22' height='16' rx='.84' transform='rotate(-90 20 30.11)' fill='%23248A00'/%3E%3C/svg%3E");
    }
</style>

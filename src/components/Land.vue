<template>
    <div class="text-xs-center land-container">
        <v-progress-circular
                :size="70"
                :width="7"
                color="primary"
                indeterminate
        ></v-progress-circular>
    </div>
</template>

<script>
    import oauthMixin from '../mixins/Oauth'

    export default {
        mixins: [oauthMixin],
        methods: {
            parseToken: function () {
                function stringQs(str) {
                    return str.split('&').filter(function (pair) {
                        return pair !== '';
                    }).reduce(function(obj, pair){
                        let parts = pair.split('=');
                        obj[decodeURIComponent(parts[0])] = (null === parts[1]) ?
                            '' : decodeURIComponent(parts[1]);
                        return obj;
                    }, {});
                }
                let path = window.location.href.split('?')[1];
                if(!path) {
                    return null;
                }
                return stringQs(path).oauth_token;
            }
        },
        created() {
            this.authInit();
            let router = this.$router;
            let token = this.parseToken();
            if(token) {
                this.auth.bootstrapToken(token, function(err, oauth) {
                    router.replace({name: 'login'});
                });
            }
            else {
                router.replace({name: 'login'});
            }
        }
    }
</script>

<style>
    .land-container {
        padding: 100px 0;
    }
</style>
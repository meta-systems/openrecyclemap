<template>
    <div>
        <p v-if="authenticated">Authorized.</p>
        <p v-if="authenticated === false">Not authorized.</p>
        <p v-if="authenticated"><b>{{ username }}</b></p>
        <v-btn @click="logout" color="primary" v-if="authenticated">Logout</v-btn>
        <v-btn @click="authenticate" color="primary" v-if="!authenticated">Login via OSM</v-btn>
    </div>
</template>

<script>
    import osmAuth from 'osm-auth'

    export default {
        data: function () {
            return {
                auth: null,
                username: null,
                authenticated: null
            };
        },
        methods: {
            logout: function () {
                this.auth.logout();
                this.authenticated = false;
            },
            details: function () {
                var component = this;
                this.auth.xhr({
                    method: 'GET',
                    path: '/api/0.6/user/details'
                }, function(err, details) {
                    var userTag = details.getElementsByTagName('user')[0];
                    component.username = userTag.attributes["display_name"].value;
                });
            },
            authenticate: function () {
                var component = this;
                this.auth.authenticate(function (err, oauth) {
                    component.authenticated = oauth.authenticated();
                    if(component.authenticated) {
                        component.details();
                    }
                });
            }
        },
        created() {
            this.auth = osmAuth({
                oauth_consumer_key: 'MN6LW9gpyK9RKMHxZ2AQ2BHvdDL1ZGVEebLuZ8fo',
                oauth_secret: 'FujOIM84AK1J6JtHoBBdENS2MIWz3xOpL2TqBpxa',
                auto: true
                //singlepage: true,
                //landing: 'auth'
            });
            this.authenticated = this.auth.authenticated();
            if(this.authenticated) {
                this.details();
            }
            else {
                // auto
                //this.authenticate();
            }
        }
    }
</script>
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
    import oauthMixin from '../mixins/Oauth'

    export default {
        mixins: [oauthMixin],
        created() {
            this.authInit();
        }
    }
</script>
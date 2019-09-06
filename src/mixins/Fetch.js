export default {
    methods: {
        fetch: function (url, params, callback, failCallback) {
            let component = this;
            let fetch_url = process.env.VUE_APP_BACKEND_URL + url + '?' + params.join('&');

            fetch(fetch_url, {
                method: 'GET'
            })
                .then(function (response) {
                    if(!response.ok) {
                        throw new Error(response.status);
                    }
                    return response.json();
                })
                .then(callback)
                .catch(function (e) {
                    if(e.message === '401') {
                        component.$router.push({name: 'login'});
                    }
                    else if(failCallback) {
                        failCallback();
                    }
                });
        }
    }
}
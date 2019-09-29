import osmAuth from 'osm-auth'
import convert from 'xml-js'

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
            let component = this;
            this.auth.xhr({
                method: 'GET',
                path: '/api/0.6/user/details'
            }, function(err, details) {
                let userTag = details.getElementsByTagName('user')[0];
                component.username = userTag.attributes["display_name"].value;
            });
        },
        addNodeXml: function (latlon, tags, changeset_id) {
            let xmlObj = {'elements': []};
            for (let key in tags) {
                if(tags.hasOwnProperty(key)) {
                    xmlObj.elements.push({'type': 'element', 'name': 'tag', 'attributes': {'k': key, 'v': tags[key]}});
                }
            }
            return '<osm><node changeset="'+changeset_id+'" lat="'+latlon.lat+'" lon="'+latlon.lng+'">'
                + convert.js2xml(xmlObj)
                + '</node></osm>';
        },
        createChangesetXml: function () {
            return '<osm><changeset>' +
                '<tag k="created_by" v="OpenRecycleMap"/>' +
                '<tag k="comment" v="Adding a recycling container"/>' +
                '</changeset></osm>'
        },
        addNodeSuccess: function () {},
        addNodeFail: function () {},
        addNode: function (latlon, tags) {
            let component = this;
            let auth = this.auth;
            auth.xhr({
                method: 'PUT',
                path: '/api/0.6/changeset/create',
                content: this.createChangesetXml(),
                options: {
                    header: {
                        'Content-Type': 'text/xml'
                    }
                }
            }, function(err, changeset_id) {
                if(changeset_id) {
                    auth.xhr({
                        method: 'PUT',
                        path: '/api/0.6/node/create',
                        content: component.addNodeXml(latlon, tags, changeset_id),
                        options: {
                            header: {
                                'Content-Type': 'text/xml'
                            }
                        }
                    }, function(err, node_id) {
                        if(node_id) {
                            auth.xhr({
                                method: 'PUT',
                                path: '/api/0.6/changeset/'+changeset_id+'/close'
                            }, function (err, closed_id) {
                                console.log('Changeset #'+closed_id+' has just been closed.')
                            });
                            component.addNodeSuccess();
                        }
                        else {
                            component.addNodeFail();
                        }
                    });
                }
            });
        },
        authenticate: function () {
            let component = this;
            this.auth.authenticate(function (err, oauth) {
                component.authenticated = oauth.authenticated();
                if(component.authenticated) {
                    component.details();
                }
            });
            // this.$ga.event({
            //     eventCategory: 'auth',
            //     eventAction: 'auth_init',
            //     eventLabel: 'auth_init,
            //     eventValue: 1
            // });
        },
        authInit: function () {
            this.auth = osmAuth({
                oauth_consumer_key: 'MN6LW9gpyK9RKMHxZ2AQ2BHvdDL1ZGVEebLuZ8fo',
                oauth_secret: 'FujOIM84AK1J6JtHoBBdENS2MIWz3xOpL2TqBpxa',
                auto: true,
                singlepage: true,
                landing: 'land'
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
}
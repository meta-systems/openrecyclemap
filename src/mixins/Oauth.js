import osmAuth from 'osm-auth'
import OsmBuilder from '../osm/OsmBuilder'
import OsmParser from '../osm/OsmParser'
import Changeset from '../osm/Changeset'

export default {
    data: function () {
        return {
            auth: null,
            username: null,
            authenticated: null,
            changeset_id: null
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
        nodeXml: function (latlon, tags, changeset_id, node_id, version) {
            let node = new OsmBuilder('node', latlon)
                .setChangeset(changeset_id)
                .setExisting(node_id, version)
                .setTags(tags);
            return node.xml;
        },
        createChangeset: function (changeset_name) {
            let component = this;
            return new Promise(function(resolve, reject) {
                component.auth.xhr({
                    method: 'PUT',
                    path: '/api/0.6/changeset/create',
                    content: (new Changeset(changeset_name)).xml,
                    options: {
                        header: {
                            'Content-Type': 'text/xml'
                        }
                    }
                }, function(err, changeset_id) {
                    if(changeset_id) {
                        component.changeset_id = changeset_id;
                        resolve(changeset_id);
                    }
                });
            });
        },
        closeChangeset: function (changeset_id) {
            this.auth.xhr({
                method: 'PUT',
                path: '/api/0.6/changeset/'+changeset_id+'/close'
            }, function (err, closed_id) {
                console.log('Changeset #'+closed_id+' has just been closed.')
            });
        },
        onNodeCreateResponse: function(err, node_id) {
            if(node_id) {
                this.closeChangeset(this.changeset_id);
                this.addNodeSuccess();
            }
            else {
                this.addNodeFail();
            }
            this.changeset_id = null;
        },
        addNodeSuccess: function () {},
        addNodeFail: function () {},
        addNode: function (latlon, tags) {
            let component = this;
            this.createChangeset('Add a recycling container')
                .then(function(changeset_id) {
                    component.auth.xhr({
                        method: 'PUT',
                        path: '/api/0.6/node/create',
                        content: component.nodeXml(latlon, tags, changeset_id),
                        options: {
                            header: {
                                'Content-Type': 'text/xml'
                            }
                        }
                    }, component.onNodeCreateResponse);
                });
        },
        deleteNode: function (node_id, node_type, latlon) {
            let component = this;
            let nodeObj = new OsmBuilder(node_type, latlon);
            this.readNode(node_id, node_type)
                .then(function(node) {
                    nodeObj.setExisting(node_id, node.version);
                    return component.createChangeset('Remove a recycling container');
                })
                .then(function(changeset_id) {
                    nodeObj.setChangeset(changeset_id);
                    component.auth.xhr({
                        method: 'DELETE',
                        path: '/api/0.6/'+node_type+'/'+node_id,
                        content: nodeObj.xml,
                        options: {
                            header: {
                                'Content-Type': 'text/xml'
                            }
                        }
                    }, component.onNodeCreateResponse);
                });
        },
        updateNode: function (node_id, node_type, latlon, tags) {
            let component = this;
            let nodeObj = new OsmBuilder(node_type, latlon);
            this.readNode(node_id, node_type)
                .then(function(node) {
                    nodeObj.setExisting(node_id, node.version);
                    nodeObj.setRefs(node.refs);
                    nodeObj.setTags(tags);
                    nodeObj.setTags(node.tags);
                    return component.createChangeset('Update a recycling container');
                })
                .then(function(changeset_id) {
                    nodeObj.setChangeset(changeset_id);
                    component.auth.xhr({
                        method: 'PUT',
                        path: '/api/0.6/'+node_type+'/'+node_id,
                        content: nodeObj.xml,
                        options: {
                            header: {
                                'Content-Type': 'text/xml'
                            }
                        }
                    }, component.onNodeCreateResponse);
                });
        },
        readNode: function (node_id, node_type) {
            let auth = this.auth;
            return new Promise(function(resolve, reject) {
                auth.xhr({
                    method: 'GET',
                    path: '/api/0.6/'+node_type+'/'+node_id
                }, function(err, response) {
                    let nodeParser = new OsmParser(response);
                    resolve({
                        version: nodeParser.version,
                        tags: nodeParser.tags,
                        refs: nodeParser.refs
                    });
                });
            });
        },
        authenticate: function () {
            let component = this;
            this.$ga.event({
                eventCategory: 'auth',
                eventAction: 'auth_init',
                eventLabel: 'auth_init',
                eventValue: 1
            });
            this.auth.authenticate(function (err, oauth) {
                component.authenticated = oauth.authenticated();
            });
        },
        authInit: function () {
            this.auth = osmAuth({
                oauth_consumer_key: process.env.VUE_APP_OSM_CONSUMER_KEY,
                oauth_secret: process.env.VUE_APP_OSM_SECRET,
                auto: true,
                singlepage: true,
                landing: 'land',
                url: process.env.VUE_APP_OSM_API_URL
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
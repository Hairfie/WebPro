'use strict'

var loading = false;
var resolvers = [];

import config from '../config';

const debug = require('debug')('facebook');

export default { getSdk };

function getSdk() {
    debug('SDK asked');

    if (typeof window === 'undefined') {
        debug('server side, aborting');
        return Promise.reject(new Error('facebook: cannot get SDK in server side'));
    }

    if (window.FB) {
        return Promise.resolve(window.FB);
    }

    return new Promise((resolve, reject) => {
        debug('appending resolver');
        resolvers.push(resolve);
        loadIfNecessary();
    });
}

function loadIfNecessary() {
    if (!loading) {
        loading = true;
        load();
    }
}

function load() {
    debug('loading SDK');
    window.fbAsyncInit = fbAsyncInit;

    (function(d, s, id){
        var fbRoot = document.createElement('div');
        fbRoot.setAttribute('id', 'fb-root');
        document.body.appendChild(fbRoot);
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

function fbAsyncInit() {
    window.FB.init({
        appId   : config.facebookAppId,
        version : 'v2.3'
    });

    debug('finished loading SDK, resolving all promises');
    resolvers.map(resolve => resolve(window.FB));
    resolvers = [];
}

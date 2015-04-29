'use strict';

const debug = require('debug')('google');
let resolvers = [];
let loading = false;

export default { loadMaps };

function loadMaps() {

    if (typeof window === 'undefined') {
        debug('non-browser environment, aborting google maps SDK loading');
        return Promise.reject(new Error('Not in browser'));
    }

    if (window.google && window.google.maps) {
        debug('google maps SDK already loaded, resolving promise');
        return Promise.resolve(window.google);
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
    debug('start loading google maps SDK');
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=onGoogleMapsLoaded';
    document.body.appendChild(script);
    window.onGoogleMapsLoaded = onGoogleMapsLoaded;
}

function onGoogleMapsLoaded() {
    debug('finished loading google maps, resolving all promises');
    resolvers.map(resolve => resolve(window.google));
    resolvers = [];
}
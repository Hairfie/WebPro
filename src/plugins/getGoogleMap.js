'use strict';

var _ = require('lodash');
var debug = require('debug')('Service:Google');

let loading = false;

export default function loadMaps() {
    return new Promise((resolve, reject) => {
        function loadscript() {
                    console.log("loadMaps");

            if (typeof window === 'undefined') {
                debug('non-browser environment, aborting google maps SDK loading');
                return reject(new Error('Not in browser'));
            }

            if (window.google && window.google.maps) {
                debug('google maps SDK already loaded, resolving promise');
                return resolve(window.google);
            }
            console.log("here");
            if (!loading) {
                loading = true;
                debug('start loading google maps SDK');
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=onGoogleMapsLoaded';
                document.body.appendChild(script);
                window.onGoogleMapsLoaded = onGoogleMapsLoaded;
            }
        }

        function onGoogleMapsLoaded() {
            return resolve(window.google);
        }

        return loadscript();
    });
}
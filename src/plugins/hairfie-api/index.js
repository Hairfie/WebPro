'use strict';

import Client from './client';

function hairfieApiPlugin(options) {
    return {
        name: 'HairfieApiPlugin',
        plugContext: function () {
            var client = new Client({
                apiUrl: options.apiUrl
            });

            return {
                plugActionContext: function (actionContext) {
                    actionContext.hairfieApi = client;
                }
            };
        }
    };
}

export default hairfieApiPlugin;

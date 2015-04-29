'use strict';

import Client from './client';

function hairfieApiPlugin(options) {
    var apiUrl = options.apiUrl || process.env.HAIRFIE_API_URL;

    return {
        name: 'HairfieApiPlugin',
        plugContext: function () {
            var client = new Client({ apiUrl });

            return {
                plugActionContext: function (actionContext) {
                    actionContext.hairfieApi = client;
                }
            };
        },
        dehydrate() {
            return { apiUrl };
        },
        rehydrate(state) {
            apiUrl = state.apiUrl;
        }
    };
}

export default hairfieApiPlugin;

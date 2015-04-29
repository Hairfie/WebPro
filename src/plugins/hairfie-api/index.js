'use strict';

import Client from './client';

function hairfieApiPlugin(options) {
    var options = options;

    return {
        name: 'HairfieApiPlugin',
        plugContext: function () {
            var client = new Client(options);

            return {
                plugActionContext: function (actionContext) {
                    actionContext.hairfieApi = client;
                }
            };
        },
        dehydrate() {
            return { options };
        },
        rehydrate(state) {
            options = state.options;
        }
    };
}

export default hairfieApiPlugin;

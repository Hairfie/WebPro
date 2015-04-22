'use strict';

export default {
    name: 'access-token',
    create: function (req, resource, params, body, config, callback) {
        HairfieApiUtils
            .post('/users/login', { body })
            .then(token => { cabllack(null, token); }, error => { callback(error); });
    }
}

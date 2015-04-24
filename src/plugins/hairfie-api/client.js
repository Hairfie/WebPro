'use strict';

import request from 'superagent';

export default class Client {
    constructor({ apiUrl, getApiKey }) {
        this.apiUrl = apiUrl;
    }

    get(path, options) {
        return this._send({ method: 'get', path, options });
    }

    post(path, data, options) {
        return this._send({ method: 'post', path, data, options });
    }

    _send({ method, path, data, options }) {
        var req = request[method](this.apiUrl+path);
        req.set('Accept', 'application/json');
        req.set('Accept-Language', 'fr');
        req.set('Authorization', options && options.token && options.token.id || null);
        req.send(data);

        return new Promise((ok, ko) => {
            req.end((err, res) => {
                if (res.ok) ok(res.body);
                else ko(err);
            });
        });
    }
}

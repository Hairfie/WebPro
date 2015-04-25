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

    put(path, data, options) {
        return this._send({ method: 'put', path, data, options });
    }

    upload(container, file, options) {
        var req = request.post(this._makeUrl(`/containers/${container}/upload`));
        this._configure(req, options || {});
        req.attach('file', file, file.name);
        return this._end(req).then(result => {
            return result.file
        });
    }

    _send({ method, path, data, options }) {
        var req = request[method](this._makeUrl(path));
        this._configure(req, options || {});
        req.send(data);
        return this._end(req);
    }

    _makeUrl(path) {
        return this.apiUrl+path;
    }

    _configure(req, { token, onProgress }) {
        req.set('Accept', 'application/json');
        req.set('Accept-Language', 'fr');
        if (token) req.set('Authorization', token.id);
        if (onProgress) req.on('progress', ({ percent }) => onProgress({ percent }));
    }

    _end(req) {
        return new Promise((resolve, reject) => {
            req.end((err, res) => {
                console.log(err, res);
                if (res.ok) resolve(res.body);
                else reject(err);
            });
        });
    }
}

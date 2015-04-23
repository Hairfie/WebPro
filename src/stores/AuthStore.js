'use strict';

import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';

export default class AuthStore extends BaseStore {

    static storeName = 'AuthStore';

    static handlers = {
        [Actions.LOGIN_START]: 'onLoginStart',
        [Actions.LOGIN_SUCCESS]: 'onLoginSuccess',
        [Actions.LOGIN_FAILURE]: 'onLoginFailure',
        [Actions.LOGOUT]: 'onLogout'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.token = null;
        this.loading = false;
    }

    onLoginStart() {
        this.loading = true;
        this.emitChange();
    }

    onLoginSuccess({ token }) {
        this.token = token;
        this.loading = false;
        this.emitChange();
    }

    onLoginFailure() {
        this.loading = false;
        this.emitChange();
    }

    onLogout() {
        this.token = null;
        this.emitChange();
    }

    getToken() {
        return this.token;
    }

    isLoading() {
        return this.loading;
    }

}

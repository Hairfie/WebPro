'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';

export default class AuthStore extends BaseStore {

    static storeName = 'AuthStore';

    static handlers = {
        [Actions.LOGIN_START]: 'onLoginStart',
        [Actions.LOGIN_SUCCESS]: 'onLoginSuccess',
        [Actions.LOGIN_FAILURE]: 'onLoginFailure',
        [Actions.LOGOUT]: 'onLogout'
    }

    static isomorphicProps = ['token'];

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
        this.afterLoginUrl = null;
        this.emitChange();
    }

    isAuthenticated() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    isLoading() {
        return this.loading;
    }

    getUserId() {
        return this.token && this.token.userId;
    }

    isImpersonated() {
        return !!this.getParentTokenId();
    }

    getParentTokenId() {
        return this.token && this.token.parentId;
    }

    hasPermission(permission) {
        return this.token && _.contains(this.token.permissions, permission);
    }
}

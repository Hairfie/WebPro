'use strict';

import { expect } from 'chai';

import Actions from '../../src/constants/Actions';
import testStore from './testStore';

describe('AuthStore', () => {
    const token = { id: 'a-token-id' };
    const error = new Error('An error');
    const loginStart = [Actions.LOGIN_START];
    const loginSuccess = [Actions.LOGIN_SUCCESS, { token }];
    const loginFailure = [Actions.LOGIN_FAILURE, { error }];
    const logout = [Actions.LOGOUT];

    var AuthStore, dispatch;
    beforeEach(() => {
        var test = testStore('AuthStore');
        AuthStore = test.store;
        dispatch = test.dispatch;
    });

    describe('getToken', () => {
        it('returns null after initialization', () => {
            expect(AuthStore.getToken()).to.be.null;
        });
        it('returns token after login success', () => {
            dispatch(loginSuccess);

            expect(AuthStore.getToken()).to.be.equal(token);
            expect(AuthStore.emitChange.callCount).to.be.equal(1);
        });
        it('returns null after logout', () => {
            dispatch(loginSuccess);
            dispatch(logout);

            expect(AuthStore.getToken()).to.be.equal(null);
            expect(AuthStore.emitChange.callCount).to.be.equal(2);
        });
    });
    describe('isLoading', () => {
        it('returns false after initialization', () => {
            expect(AuthStore.isLoading()).to.be.equal(false);
        });
        it('returns true after login start', () => {
            dispatch(loginStart);

            expect(AuthStore.isLoading()).to.be.equal(true);
            expect(AuthStore.emitChange.callCount).to.be.equal(1);
        });
        it('returns false fater login success', () => {
            dispatch(loginStart);
            dispatch(loginSuccess);

            expect(AuthStore.isLoading()).to.be.equal(false);
            expect(AuthStore.emitChange.callCount).to.be.equal(2);
        });
    });
});

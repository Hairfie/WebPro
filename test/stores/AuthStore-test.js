'use strict';

import testStore from './testStore';

import { expect } from 'chai';

import { LOGIN_START
       , LOGIN_SUCCESS
       , LOGIN_FAILURE
       , LOGOUT
       } from '../../src/constants/Actions';

describe('AuthStore', () => {
    const token = { id: 'a-token-id' };
    const error = new Error('An error');

    var AuthStore, dispatch;
    beforeEach(() => {
        var test = testStore('AuthStore');
        AuthStore = test.store;
        dispatch = test.dispatch;
    });

    describe('getToken', () => {
        it('returns NULL after initialization', () => {
            expect(AuthStore.getToken()).to.be.null;
        });
        it('returns token after login success', () => {
            dispatch(LOGIN_SUCCESS, { token });

            expect(AuthStore.getToken()).to.be.equal(token);
            expect(AuthStore.emitChange.callCount).to.be.equal(1);
        });
        it('returns NULL after logout', () => {
            dispatch(LOGIN_SUCCESS, { token });
            dispatch(LOGOUT);

            expect(AuthStore.getToken()).to.be.equal(null);
            expect(AuthStore.emitChange.callCount).to.be.equal(2);
        });
    });
    describe('isLoading', () => {
        it('returns FALSE after initialization', () => {
            expect(AuthStore.isLoading()).to.be.equal(false);
        });
        it('returns TRUE after login start', () => {
            dispatch(LOGIN_START);

            expect(AuthStore.isLoading()).to.be.equal(true);
            expect(AuthStore.emitChange.callCount).to.be.equal(1);
        });
        it('returns FALSE after login success', () => {
            dispatch(LOGIN_START);
            dispatch(LOGIN_SUCCESS, { token });

            expect(AuthStore.isLoading()).to.be.equal(false);
            expect(AuthStore.emitChange.callCount).to.be.equal(2);
        });
        it('returns FALSE after login failure', () => {
            dispatch(LOGIN_START);
            dispatch(LOGIN_FAILURE, { error });

            expect(AuthStore.isLoading()).to.be.equal(false);
            expect(AuthStore.emitChange.callCount).to.be.equal(2);
        });
    });
});

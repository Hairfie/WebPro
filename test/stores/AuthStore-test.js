'use strict';

import { expect } from 'chai';

import App from '../../src/app';
import Actions from '../../src/constants/Actions';

describe('AuthStore', () => {
    const token = { id: 'a-token-id' };
    const error = new Error('An error');
    const loginStart = [Actions.LOGIN_START];
    const loginSuccess = [Actions.LOGIN_SUCCESS, { token }];
    const loginFailure = [Actions.LOGIN_FAILURE, { error }];
    const logout = [Actions.LOGOUT];

    var context, AuthStore, emitChangeCalls;
    beforeEach(() => {
        context = App.createContext().getActionContext();
        AuthStore = context.getStore('AuthStore');

        // mock emit change
        emitChangeCalls = 0;
        AuthStore.emitChange = () => { emitChangeCalls++; };
    });

    function executeAction(action) {
        return context.executeAction(action[0], action[1])
            .catch((error) => assert.fail(error));
    }

    describe('getToken', () => {
        it('returns null after initialization', () => {
            expect(AuthStore.getToken()).to.be.null;
        });
        it('returns token after login success', () => {
            executeAction(loginSuccess).then(() => {
                expect(AuthStore.getToken()).to.be.equal(token);
                expect(emitChangeCalls).to.be.equal(1);
            });
        });
        it('returns null after logout', () => {
            executeAction(loginSuccess).then(() => {
                executeAction(logout).then(() => {
                    expect(AuthStore.getToken()).to.be.equal(null);
                    expect(emitChangeCalls).to.be.equal(2);
                });
            });
        });
    });
    describe('isLoading', () => {
        it('returns false after initialization', () => {
            expect(AuthStore.isLoading()).to.be.equal(false);
        });
        it('returns true after login start', () => {
            executeAction(loginStart).then(() => {
                expect(AuthStore.isLoading()).to.be.equal(true);
                expect(emitChangeCalls).to.be.equal(1);
            });
        });
        it('returns false fater login success', () => {
            executeAction(loginStart).then(() => {
                executeAction(loginSuccess).then(() => {
                    expect(AuthStore.isLoading()).to.be.equal(false);
                    expect(emitChangeCalls).to.be.equal(2);
                });
            });
        });
    });
});

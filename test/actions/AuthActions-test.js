'use strict';

import { expect } from 'chai';

import App from '../../src/app';
import Actions from '../../src/constants/Actions';

describe('AuthActions', () => {
    describe('login', () => {
        return;
        it('handles success', (done) => {
            execute(AuthActions.login, { email : 'george@gmail.com', password: 'georgepass' }, (error) => {
                expect(error).to.be.falsy;

                // TODO check dispatched events
                // 1. LOGIN_START
                // 2. LOGIN_SUCCESS { token: token }

                done();
            });
        });
        it('handles failure', () => {
        });
    });
});

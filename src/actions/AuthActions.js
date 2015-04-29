'use strict';

import Actions from '../constants/Actions';
import UserActions from './UserActions';
import RouteActions from './RouteActions';
import { writeCookie, clearCookie } from '../utils/CookieUtils';

const COOKIE_AUTH_TOKEN = 'authToken';

const AuthActions = {
    login(context, { email, password }) {
        context.dispatch(Actions.LOGIN_START);

        return context.hairfieApi
            .post('/users/login', { email, password })
            .then(
                token => loginWithToken(context, token, { remember: true, route: 'dashboard' }),
                error => context.dispatch(Actions.LOGIN_FAILURE, { error })
           );
    },
    loginWithFacebook(context, { response }) {
        const access_token = response.authResponse.accessToken;

        if (!access_token) {
            return;
        }

        return context.hairfieApi
            .post(`/auth/facebook/token`, { access_token })
            .then(
                token => loginWithToken(context, token, { remember: true, route: 'dashboard' }),
                () => {}
            );
    },
    loginWithCookie(context, { cookies }) {
        return loginWithTokenId(context, cookies[COOKIE_AUTH_TOKEN])
            .then(() => {}, () => {});
    },
    impersonateToken(context, { user }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .post(`/accessTokens/${token.id}/impersonate`, { userId: user.id })
            .then(
                token => loginWithToken(context, token, { remember: true, route: 'dashboard' }),
                () => {}
            );
    },
    repersonateToken(context) {
        const tokenId = context.getStore('AuthStore').getParentTokenId();

        return loginWithTokenId(context, tokenId, { remember: true, route: 'dashboard' });
    },
    logout(context) {
        clearCookie('authToken');
        context.dispatch(Actions.LOGOUT);
        return context.executeAction(RouteActions.navigate, { route: 'home' });
    }
};

function loginWithTokenId(context, tokenId, options) {
    if (!tokenId) return Promise.resolve(null);

    return context.hairfieApi
        .get(`/accessTokens/${tokenId}`)
        .then(token => loginWithToken(context, token, options));
}

function loginWithToken(context, token, options) {
    const { remember, route } = options || {};

    context.dispatch(Actions.LOGIN_SUCCESS, { token });

    var actions = [
        context.executeAction(UserActions.loadUser, token),
        context.executeAction(UserActions.loadUserBusinesses, token)
    ];

    if (token.parent) {
        actions.push(context.executeAction(UserActions.loadUser, token.parent));
    }

    return Promise.all(actions)
        .then(function () {
            if (remember) {
                writeCookie(COOKIE_AUTH_TOKEN, token.id, 7);
            }

            var promises = [];

            if (route) {
                promises.push(context.executeAction(RouteActions.navigate, { route }));
            }

            return Promise.all(promises)
        });
}

export default AuthActions;

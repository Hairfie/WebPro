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
            .then(token => {
                context.dispatch(Actions.LOGIN_SUCCESS, { token });
                return afterLogin(context, token)
                    .then(() => {
                        writeCookie(COOKIE_AUTH_TOKEN, token.id, 7);

                        return context.executeAction(RouteActions.navigate, { route: 'dashboard' });
                    });
            }, error => {
                context.dispatch(Actions.LOGIN_FAILURE, { error });
            });
    },
    loginWithCookie(context, { cookies }) {
        const tokenId = cookies[COOKIE_AUTH_TOKEN];

        if (!tokenId) return;

        return context.hairfieApi
            .get(`/accessTokens/${tokenId}`)
            .then(token => {
                context.dispatch(Actions.LOGIN_SUCCESS, { token });
                return afterLogin(context, token);
            }, () => {});
    }
};

function afterLogin(context, token) {
    return Promise
        .all([
            context.executeAction(UserActions.loadUser, token),
            context.executeAction(UserActions.loadUserBusinesses, token)
        ]);
}

function afterLogout(context) {
    clearCookie('authToken');
}

export default AuthActions;

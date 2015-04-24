'use strict';

import Actions from '../constants/Actions';
import UserActions from './UserActions';
import RouteActions from './RouteActions';

const AuthActions = {
    login(context, { email, password }) {
        context.dispatch(Actions.LOGIN_START);

        return context.hairfieApi
            .post('/users/login', { email, password })
            .then(token => {
                context.dispatch(Actions.LOGIN_SUCCESS, { token });

                return Promise.all([
                    context.executeAction(UserActions.loadUser, token),
                    context.executeAction(UserActions.loadUserBusinesses, token)
                ]);
            }, error => {
                context.dispatch(Actions.LOGIN_FAILURE, { error });
            })
            .then(() => {
                return context.executeAction(RouteActions.navigate, { route: 'dashboard' });
            });
    }
};

export default AuthActions;

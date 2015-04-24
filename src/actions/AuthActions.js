'use strict';

const AuthActions = {
    login(context, { email, password }) {
        context.dispatch(Actions.LOGIN_START, { email });
        return context.service
            .create('access-token', { email, password }, function (
            .then(token => {
                context.dispatch(Actions.LOGIN_SUCCESS, { token });
            }, error => {
                context.dispatch(Actions.LOGIN_FAILURE, { error });
            });
    }
};

export default AuthActions;

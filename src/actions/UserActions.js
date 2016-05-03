'use strict';

import Actions from '../constants/Actions';

const UserActions = {
    loadUser(context, { userId }) {
        const token = context.getStore('AuthStore').getToken();
        return context.hairfieApi
            .get(`/users/${userId}`, { token })
            .then(user => {
                console.log("user", user);
                context.dispatch(Actions.RECEIVE_USER, user);
            }, error => {
                console.log("error", error);
            });
    },
    loadUserBusinesses(context, { userId }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .get(`/users/${userId}/managed-businesses`)
            .then(function (businesses) {
                context.dispatch(Actions.RECEIVE_USER_BUSINESSES, { userId, businesses });
            });
    },
    loadUserSuggestions(context, { q }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .get('/users', { query: { q }, token: token})
            .then(users => context.dispatch(Actions.RECEIVE_USER_SUGGESTIONS, { q, users }));
    }
}

export default UserActions;

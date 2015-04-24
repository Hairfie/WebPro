'use strict';

import RouteActions from './RouteActions';
import Actions from '../constants/Actions';

const PageActions = {

    login(context, route) {
        var token = context.getStore('AuthStore').getToken();

        if (token) {
            return context.executeAction(RouteActions.navigate, { route: 'dashboard' });
        }
    },

    dashboard: authenticated(),

    business: authenticated((context, route, token) => {
        return context.hairfieApi
            .get(`/businesses/${route.params.businessId}`, { token })
            .then(business => context.dispatch(Actions.RECEIVE_BUSINESS, business));
    })
};

function authenticated(action) {
    return (context, route) => {
        var token = context.getStore('AuthStore').getToken();

        if (!token) {
            var error = new Error('Not authenticated');
            error.status = 401;
            throw error;
        }

        if (action) {
            return action(context, route);
        }
    }
}

export default PageActions;

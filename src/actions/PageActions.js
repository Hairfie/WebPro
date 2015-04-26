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

    business: authenticated((context, { params: { businessId } }, token) => {
        return context.hairfieApi
            .get(`/businesses/${businessId}`, { token })
            .then(business => context.dispatch(Actions.RECEIVE_BUSINESS, business));
    }),

    businessMembers: authenticated((context, { params: { businessId } }, token) => {
        return context.hairfieApi
            .get(`/businessMembers?filter[where][businessId]=${businessId}`, { token })
            .then(members => context.dispatch(Actions.RECEIVE_BUSINESS_MEMBERS, { businessId, members }));
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

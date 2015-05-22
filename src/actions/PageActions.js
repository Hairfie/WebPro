'use strict';

import RouteActions from './RouteActions';
import Actions from '../constants/Actions';
import _ from 'lodash';
import AuthActions from './AuthActions';

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
    }),

    businessMember: authenticated((context, { params: { businessMemberId } }, token) => {
        return context.hairfieApi
            .get(`/businessMembers/${businessMemberId}`, { token })
            .then(member => context.dispatch(Actions.RECEIVE_BUSINESS_MEMBER, member));
    }),

    businessServices: authenticated((context, { params: { businessId } }, token) => {
        return context.hairfieApi
            .get(`/businessServices?filter[where][businessId]=${businessId}`, { token })
            .then(services => context.dispatch(Actions.RECEIVE_BUSINESS_SERVICES, { businessId, services }));
    }),

    businessService: authenticated((context, { params: { businessServiceId } }, token) => {
        return context.hairfieApi
            .get(`/businessServices/${businessServiceId}`, { token })
            .then(service => context.dispatch(Actions.RECEIVE_BUSINESS_SERVICE, service));
    }),

    impersonateToken: hasPermissions(['IMPERSONATE_TOKEN']),

    repersonateToken: AuthActions.repersonateToken,
    logout: AuthActions.logout
};

function hasPermissions(perms, action) {
    return authenticated((context, payload) => {
        const granted = _.reduce(perms, (granted, perm) => granted && context.getStore('AuthStore').hasPermission(perm), true);
        if (!granted) {
            var error = new Error('Not authorized');
            error.status = 403;
            throw error;
        }

        if (action) {
            return action(context, payload);
        }
    });
}

function authenticated(action) {
    return (context, payload) => {
        var token = context.getStore('AuthStore').getToken();

        if (!token) {
            var error = new Error('Not authenticated');
            error.status = 401;
            throw error;
        }

        if (action) {
            return action(context, payload);
        }
    }
}

export default PageActions;

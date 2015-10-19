'use strict';

import RouteActions from './RouteActions';
import BookingActions from './BookingActions';
import Actions from '../constants/Actions';
import _ from 'lodash';
import AuthActions from './AuthActions';
import q from 'q';
import HairfieActions from './HairfieActions';

const PageActions = {

    login(context, route) {
        var token = context.getStore('AuthStore').getToken();

        if (token) {
            return context.executeAction(RouteActions.navigate, { route: 'dashboard' });
        }
    },

    dashboard: authenticated(),

    business: authenticated((context, route, token) => {
        const businessId = route.getIn(["params", "businessId"]);
        return context.hairfieApi
            .get(`/businesses/${businessId}`, { token })
            .then(business => context.dispatch(Actions.RECEIVE_BUSINESS, business));
    }),

    businessMembers: authenticated((context, route, token) => {
        const businessId = route.getIn(["params", "businessId"]);
        return context.hairfieApi
            .get(`/businessMembers?filter[where][businessId]=${businessId}`, { token })
            .then(members => context.dispatch(Actions.RECEIVE_BUSINESS_MEMBERS, { businessId, members }));
    }),

    businessMember: authenticated((context, route, token) => {
        const businessMemberId = route.getIn(["params", "businessMemberId"]);
        return context.hairfieApi
            .get(`/businessMembers/${businessMemberId}`, { token })
            .then(member => context.dispatch(Actions.RECEIVE_BUSINESS_MEMBER, member));
    }),

    businessServices: authenticated((context, route, token) => {
        const businessId = route.getIn(["params", "businessId"]);
        return context.hairfieApi
            .get(`/businessServices?filter[where][businessId]=${businessId}`, { token })
            .then(services => context.dispatch(Actions.RECEIVE_BUSINESS_SERVICES, { businessId, services }));
    }),

    businessService: authenticated((context, route, token) => {
        const businessServiceId = route.getIn(["params", "businessServiceId"]);
        return context.hairfieApi
            .get(`/businessServices/${businessServiceId}`, { token })
            .then(service => context.dispatch(Actions.RECEIVE_BUSINESS_SERVICE, service));
    }),

    bookings: hasPermissions(['IMPERSONATE_TOKEN'], (context, route, token) => {
        return context.executeAction(BookingActions.getBookings, {});
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

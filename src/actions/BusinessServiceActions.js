'use strict';

import Actions from '../constants/Actions';
import RouteActions from './RouteActions';
import _ from 'lodash';

const BusinessServiceActions = {
    createService(context, { businessId, values }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .post('/businessServices', _.assign({ businessId }, values), { token })
            .then(service => {
                context.dispatch(Actions.RECEIVE_BUSINESS_SERVICE, service);
                return context.executeAction(RouteActions.navigate, {
                    route: 'business_services',
                    params: { businessId: service.businessId }
                });
            });
    },
    updateService(context, { businessServiceId, values }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .put(`/businessServices/${businessServiceId}`, values, { token })
            .then(service => {
                context.dispatch(Actions.RECEIVE_BUSINESS_SERVICE, service);
                return context.executeAction(RouteActions.navigate, {
                    route: 'business_services',
                    params: { businessId: service.businessId }
                });
            });
    },
    deleteService(context, { businessServiceId, businessId }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .delete(`/businessServices/${businessServiceId}`, { active: false }, { token })
            .then(() => {
				context.dispatch(Actions.DELETE_BUSINESS_SERVICE, businessServiceId);

                // return context.executeAction(RouteActions.navigate, {
                //     route: 'business_services',
                //     params: { businessId: businessId }
                // });
            });
    }
}

export default BusinessServiceActions;

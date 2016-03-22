'use strict';

import Actions from '../constants/Actions';
import RouteActions from './RouteActions';
import _ from 'lodash';

const BusinessClaimActions = {
    createBusinessClaim(context, { values }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .post('/businessClaims', _.assign( values), { token })
            .then(businessClaim => {
                context.dispatch(Actions.RECEIVE_BUSINESS_CLAIM, businessClaim);
                return context.executeAction(RouteActions.navigate, {
                    route: 'update_business_claim',
                    params: { businessClaimId: businessClaim.id }
                });
            });
    },
    updateBusinessClaim(context, { businessClaimId, values }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .put(`/businessClaims/${businessClaimId}`, values, { token })
            .then(businessClaim => {
                context.dispatch(Actions.RECEIVE_BUSINESS_CLAIM, businessClaim);
                return context.executeAction(RouteActions.navigate, {
                    route: 'business',
                    params: { businessId: businessClaim.id }
                });
            });
    }
}

export default BusinessClaimActions;

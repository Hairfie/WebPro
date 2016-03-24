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
                    route: 'edit_business_claim',
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
            });
            
    },
    submitBusinessClaim(context, {businessClaimId}) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .post(`/businessClaims/${businessClaimId}/submit`, { token })
            .then(business => {
                context.dispatch(Actions.RECEIVE_BUSINESS, business);
                return context.executeAction(RouteActions.navigate, {
                    route: 'business',
                    params: { businessId: business.id }
                });
            });
    },
    getBusinessClaimById(context, {businessClaimId}) {
        if(!businessClaimId) return;
        return context.hairfieApi
            .get(`/businessClaims/${businessClaimId}`)
            .then(function (businessClaim) {
                context.dispatch(Actions.RECEIVE_BUSINESS_CLAIM, businessClaim);
            });
    }
}

export default BusinessClaimActions;

'use strict';

import Actions from '../constants/Actions';
import RouteActions from './RouteActions';
import _ from 'lodash';

const BusinessMemberActions = {
    createMember(context, { businessId, values }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .post('/businessMembers', _.assign({ businessId }, values), { token })
            .then(member => {
                context.dispatch(Actions.RECEIVE_BUSINESS_MEMBER, member);
                return context.executeAction(RouteActions.navigate, {
                    route: 'business_members',
                    params: { businessId: member.businessId }
                });
            });
    },
    updateMember(context, { businessMemberId, values }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .put(`/businessMembers/${businessMemberId}`, values, { token })
            .then(member => {
                context.dispatch(Actions.RECEIVE_BUSINESS_MEMBER, member);
                return context.executeAction(RouteActions.navigate, {
                    route: 'business_members',
                    params: { businessId: member.businessId }
                });
            });
    },
    deactivate(context, { memberId }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .put(`/businessMembers/${memberId}`, { active: false }, { token })
            .then(member => context.dispatch(Actions.RECEIVE_BUSINESS_MEMBER, member));
    },
    reactivate(context, { memberId }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .put(`/businessMembers/${memberId}`, { active: true }, { token })
            .then(member => context.dispatch(Actions.RECEIVE_BUSINESS_MEMBER, member));
    }
}

export default BusinessMemberActions;

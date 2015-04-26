'use strict';

import Actions from '../constants/Actions';

const BusinessMemberActions = {
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

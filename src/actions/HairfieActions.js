'use strict';

import Actions from '../constants/Actions';

const HairfieActions = {
    loadBusinessHairfies: function (context, {page, pageSize, businessId, add}) {
        const query = {
            'filter[where][businessId]': businessId,
            'filter[order]': 'createdAt DESC',
            'filter[skip]': (page - 1) * pageSize,
            'filter[limit]': pageSize + (add || 0)
        };

        return  context.hairfieApi
            .get('/hairfies', { query })
            .then(hairfies => context.dispatch(Actions.RECEIVE_BUSINESS_HAIRFIE, {
                    hairfies: hairfies,
                    businessId : businessId,
                    page: page
                })
            );
    }
}


export default HairfieActions;
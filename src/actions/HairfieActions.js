'use strict';

const HairfieActions = {
    loadBusinessHairfies: function (context, {page, pageSize, businessId, add}) {
        const query = {
            'filter[where][businessId]': businessId,
            'filter[order]': 'createdAt DESC',
            'filter[skip]': (page - 1) * pageSize,
            'filter[limit]': pageSize + (add || 0)
        };

        return  context.hairfieApi
            .get('/hairfies', { query: query })
            .then(hairfies => {
                context.dispatch(Actions.RECEIVE_HAIRFIE, {
                    hairfies: hairfies,
                    businessId : businessId,
                    page: page
                });
            });
    }
}


export default HairfieActions;
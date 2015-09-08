'use strict';

import Actions from '../constants/Actions';
import _ from 'lodash';

const PlaceActions = {
    loadAddressPlace(context, { address }) {
        const token = context.getStore('AuthStore').getToken();
        if(!address) return;

        return context.hairfieApi
            .get('/places', { query: { address: encodeURI(address) } })
            .then(places => {
            	const place = _.first(places);
                context.dispatch(Actions.RECEIVE_ADDRESS_PLACE, {
                    address : address,
                    place   : place
                });
                return place;
            });
    }
}

export default PlaceActions;
'use strict';

import Actions from '../constants/Actions';
import PlaceActions from './PlaceActions';

const SearchActions = {
    searchBusiness(context, { query: {address, q} }) {
        return context.executeAction(PlaceActions.loadAddressPlace, {address: address})
            .then(place => {
                const search = {
                    location    : place && !place.bounds && place.location,
                    bounds      : place && place.bounds,
                    q           : q
                };

                let query = {};

                if (search.bounds) {
                    query['bounds[northEast][lat]'] = search.bounds.northEast.lat;
                    query['bounds[northEast][lng]'] = search.bounds.northEast.lng;
                    query['bounds[southWest][lat]'] = search.bounds.southWest.lat;
                    query['bounds[southWest][lng]'] = search.bounds.southWest.lng;
                }
                if (search.location) {
                    query['location[lat]'] = search.location.lat;
                    query['location[lng]'] = search.location.lng;
                }
                if (search.q) query.query = search.q;

                query.limit = 20;

                return context.hairfieApi
                    .get('/businesses/search', { query: query })
                    .then(result => {
                        context.dispatch(Actions.RECEIVE_BUSINESS_SEARCH_RESULT, {
                            search: search,
                            result: result
                        });
                    });
            });
    }
}

export default SearchActions;
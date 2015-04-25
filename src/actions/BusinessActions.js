'use strict';

import Actions from '../constants/Actions';
import _ from 'lodash';

const BusinessActions = {
    addPicture(context, { business, file }) {
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi
            .upload('businesses', file, { token })
            .then(image => {
                var pictures = _.clone(business.pictures);
                pictures.push(image);
                return context.hairfieApi.put(`/businesses/${business.id}`, { pictures }, { token });
            })
            .then(
                business => context.dispatch(Actions.RECEIVE_BUSINESS, business),
                error    => console.log(error)
            );
    }
};

export default BusinessActions;

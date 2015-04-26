'use strict';

import Actions from '../constants/Actions';
import _ from 'lodash';
import Uuid from 'uuid';

const BusinessActions = {
    addPicture(context, { business, file }) {
        const token = context.getStore('AuthStore').getToken();
        const uploadId = Uuid.v4();

        context.dispatch(Actions.UPLOAD_BUSINESS_PICTURE_START, { businessId: business.id, uploadId });

        return context.hairfieApi
            .upload('businesses', file, { token })
            .then(image => {
                var pictures = _.clone(business.pictures || []);
                pictures.push(image);
                return context.hairfieApi.put(`/businesses/${business.id}`, { pictures }, { token });
            })
            .then(
                business => {
                    context.dispatch(Actions.RECEIVE_BUSINESS, business),
                    context.dispatch(Actions.UPLOAD_BUSINESS_PICTURE_END, { uploadId });
                },
                error    => console.log(error)
            );
    },
    removePicture(context, { business, picture: { id } }) {
        const token = context.getStore('AuthStore').getToken();
        const pictures = _.reject(business.pictures, { id });

        return context.hairfieApi
            .put(`/businesses/${business.id}`, { pictures }, { token })
            .then(business => context.dispatch(Actions.RECEIVE_BUSINESS, business));
    }
};

export default BusinessActions;

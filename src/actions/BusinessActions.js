'use strict';

import Actions from '../constants/Actions';
import _ from 'lodash';
import RouteActions from './RouteActions';
import Uuid from 'uuid';

const BusinessActions = {
    addPicture(context, { businessId, file }) {
        const token = context.getStore('AuthStore').getToken();
        const uploadId = Uuid.v4();

        context.dispatch(Actions.UPLOAD_BUSINESS_PICTURE_START, { businessId, uploadId });

        return context.hairfieApi
            .upload('businesses', file, { token })
            .then(image => {
                const business = context.getStore('BusinessStore').getById(businessId); // refresh business
                const pictures = _.clone(business.pictures || []);
                pictures.push(image);
                return context.hairfieApi.put(`/businesses/${businessId}`, { pictures }, { token });
            })
            .then(
                business => {
                    context.dispatch(Actions.RECEIVE_BUSINESS, business),
                    context.dispatch(Actions.UPLOAD_BUSINESS_PICTURE_END, { uploadId });
                },
                error    => console.log(error)
            );
    },
    orderPictures(context, {businessId, pictures}) {
        context.dispatch(Actions.REORDER_BUSINESS_PICTURE_START, { businessId,  pictures});
        const token = context.getStore('AuthStore').getToken();

        return context.hairfieApi.put(`/businesses/${businessId}`, { pictures }, { token })
            .then(business => context.dispatch(Actions.RECEIVE_BUSINESS, business));
    },
    removePicture(context, { businessId, pictureId }) {
        const token = context.getStore('AuthStore').getToken();
        const business = context.getStore('BusinessStore').getById(businessId);
        const pictures = _.reject(business.pictures, { id: pictureId });

        return context.hairfieApi
            .put(`/businesses/${businessId}`, { pictures }, { token })
            .then(business => context.dispatch(Actions.RECEIVE_BUSINESS, business));
    },

    updateInfos(context, { businessId, values }) {
        const token = context.getStore('AuthStore').getToken();
        const business = context.getStore('BusinessStore').getById(businessId);

        return context.hairfieApi
            .put(`/businesses/${businessId}`, values, { token })
            .then(
                business => {
                    context.dispatch(Actions.UPDATE_BUSINESS_INFOS_END, business);
                    context.executeAction(RouteActions.navigate, {
                        route: 'business',
                        params: { businessId: business.id }
                    })
                },
                error    => console.log(error)
            );
    },
};

export default BusinessActions;

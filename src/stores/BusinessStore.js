'use strict';

import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';
import _ from 'lodash';

export default class BusinessStore extends BaseStore {

    static storeName = 'BusinessStore';

    static handlers = {
        [Actions.RECEIVE_BUSINESS]: 'onReceiveBusiness',
        [Actions.RECEIVE_USER_BUSINESSES]: 'onReceiveUserBusinesses',
        [Actions.UPLOAD_BUSINESS_PICTURE_START]: 'onUploadBusinessPictureStart',
        [Actions.UPLOAD_BUSINESS_PICTURE_END]: 'onUploadBusinessPictureEnd',
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.businesses = {};
        this.pictureUploads = [];
    }

    dehydrate() {
        return {
            businesses: this.businesses
        }
    }

    rehydrate({ businesses }) {
        this.businesses = businesses;
    }

    onReceiveBusiness(business) {
        this.businesses[business.id] = business;
        this.emitChange();
    }

    onReceiveUserBusinesses({ businesses }) {
        this.businesses = _.merge({}, this.businesses, _.indexBy(businesses, 'id'));
        this.emitChange();
    }

    onUploadBusinessPictureStart({ businessId, uploadId }) {
        this.pictureUploads.push({ businessId, uploadId });
        this.emitChange();
    }

    onUploadBusinessPictureEnd({ uploadId }) {
        this.pictureUploads = _.reject(this.pictureUploads, { uploadId });
        this.emitChange();
    }

    getById(id) {
        return this.businesses[id];
    }

    getByIds(ids) {
        return _.map(ids, this.getById, this);
    }

    getPictureUploadIds(businessId) {
        console.log(businessId, this.pictureUploads);
        return _.pluck(_.filter(this.pictureUploads, { businessId }), 'uploadId');
    }
}

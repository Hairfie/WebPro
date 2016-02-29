'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import BusinessActions from '../actions/BusinessActions';
import _ from 'lodash';

export default class BusinessStore extends BaseStore {

    static storeName = 'BusinessStore';

    static handlers = {
        [Actions.RECEIVE_BUSINESS]: 'onReceiveBusiness',
        [Actions.RECEIVE_USER_BUSINESSES]: 'onReceiveUserBusinesses',
        [Actions.UPLOAD_BUSINESS_PICTURE_START]: 'onUploadBusinessPictureStart',
        [Actions.UPLOAD_BUSINESS_PICTURE_END]: 'onUploadBusinessPictureEnd',
        [Actions.REORDER_BUSINESS_PICTURE_START]: 'onReorderBusinessPictureStart',
        [Actions.UPDATE_BUSINESS_INFOS_END]: 'onUpdateBusinessInfosEnd',
        [Actions.RECEIVE_BUSINESS_SEARCH_RESULT]: 'onReceiveBusinessSearchResult',
    }

    static isomorphicProps = ['businesses'];

    constructor(dispatcher) {
        super(dispatcher);

        this.businesses = {};
        this.pictureUploads = [];
        this.pictureReorder = {};
    }

    onReceiveBusiness(business) {
        this.businesses[business.id] = business;
        this.pictureReorder = [];
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

    onReorderBusinessPictureStart({ businessId, pictures }) {
        this.pictureReorder[businessId] = pictures;
        this.emitChange();
    }

    onUpdateBusinessInfosEnd(business) {
        this.businesses[business.id] = business;
        this.emitChange();
    }

    onReceiveBusinessSearchResult(payload) {
        this.businesses = _.assign({}, this.businesses, _.indexBy(payload.result.hits, 'id'));

        this.searchResults = {
            hits: payload.result.hits,
            hitsPerPage: payload.result.hitsPerPage,
            nbHits: payload.result.nbHits,
            nbPages: payload.result.nbPages,
            page: payload.result.page
        };

        this.emitChange();
    }

    getById(id) {
        var business = this.businesses[id];
        if(!business) this.getContext().executeAction(BusinessActions.getBusinessById, {businessId: id});

        return business;
    }

    getByIds(ids) {
        return _.map(ids, this.getById, this);
    }

    getPictureUploadIds(businessId) {
        return _.pluck(_.filter(this.pictureUploads, { businessId }), 'uploadId');
    }

    getPictureReorderIds(businessId) {
        return this.pictureReorder[businessId] || [];
    }

    getBusinessSearchResults() {
        return this.searchResults;
    }
}

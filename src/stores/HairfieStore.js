'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';
import HairfieActions from '../actions/HairfieActions';

export default class HairfieStore extends BaseStore {
    static storeName = 'HairfieStore';

    static handlers =  {
        [Actions.RECEIVE_BUSINESS_HAIRFIE]: 'onReceiveBusinessHairfies',
        [Actions.RECEIVE_HAIRFIE]: 'onReceiveHairfie',
        [Actions.DELETE_HAIRFIE]: 'onDeleteHairfie'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.hairfies = {};
        this.businessHairfies = {};
    }

    onReceiveHairfie(hairfies) {
        if (_.isArray(hairfies)) {
            _.map(hairfies, hairfie => this.hairfies[hairfie.id] = hairfie, this);
        }
        else {
        this.hairfies[hairfies.id] = hairfies;
        }

        this.emitChange();
    }

    onDeleteHairfie({ id, businessId }) {
        delete this.hairfies[id];
        this.businessHairfies[businessId] = _.difference(this.businessHairfies[businessId], [ id ])
        this.hairfies = _.compact(this.hairfies);

        this.emitChange();
    }

    onReceiveBusinessHairfies({ hairfies, businessId, page }) {
        if (_.isUndefined(this.businessHairfies[businessId])) {
            this.businessHairfies[businessId] = [];
        }

        _.map(hairfies, hairfie => {
            this.hairfies[hairfie.id] = hairfie;
            this.businessHairfies[businessId].push(hairfie.id);
        }, this);
        this.businessHairfies[businessId] = _.uniq(this.businessHairfies[businessId]);
        this.businessHairfies[businessId].page = page;
        this.emitChange();
    }

    getByBusiness(id) {
        return _.map(this.businessHairfies[id], function(hairfieId) {
            return this.hairfies[hairfieId];
        }, this);
    }

    getBusinessPage(id) {
        if (_.isUndefined(this.businessHairfies[id])) {
            this.getContext().executeAction(HairfieActions.loadBusinessHairfies, {
                businessId: id,
                page: 1,
                pageSize: 12
            });
            return -1;
        }
        else {
            return this.businessHairfies[id].page;
        }
    }

    getById(id) {
        if (_.isUndefined(this.hairfies[id])) {
            this.getContext().executeAction(HairfieActions.loadHairfie, id);
            return null;
        }
        return this.hairfies[id];
    }
}
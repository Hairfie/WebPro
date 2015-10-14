'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';
import HairfieActions from '../actions/HairfieActions';

export default class HairfieStore extends BaseStore {
    static storeName = 'HairfieStore';

    static handlers =  {
        [Actions.RECEIVE_BUSINESS_HAIRFIE]: 'onReceiveBusinessHairfies'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.hairfies = {};
        this.businessHairfies = {};
    }

    onReceiveBusinessHairfies({ hairfies, businessId, page }) {
        if (_.isUndefined(this.businessHairfies[businessId])) {
            this.businessHairfies[businessId] = [];
        }

        _.map(hairfies, function(hairfie) {
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
        return this.hairfies[id];
    }
}
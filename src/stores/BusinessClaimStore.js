'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';

export default class BusinessClaimStore extends BaseStore {

    static storeName = 'BusinessClaimStore'

    static handlers = {
        [Actions.RECEIVE_BUSINESS_CLAIM]: 'onReceiveBusinessClaim'
    }

    static isomorphicProps = ['businessClaims'];

    constructor(dispatcher) {
        super(dispatcher);

        this.businessClaims = {};
    }

    onReceiveBusinessClaim(businessClaim) {
        this.businessClaims[businessClaim.id] = businessClaim;
        this.emitChange();
    }


    getById(id) {
        return this.businessClaims[id];
    }


}

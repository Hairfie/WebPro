'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';
import BusinessClaimActions from '../actions/BusinessClaimActions';

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
        const businessClaim = this.businessClaims[id];
        if(!businessClaim) this.getContext().executeAction(BusinessClaimActions.getBusinessClaimById, {businessClaimId: id});
        return businessClaim;
    }


}

'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';

export default class BusinessMemberStore extends BaseStore {

    static storeName = 'BusinessMemberStore'

    static handlers = {
        [Actions.RECEIVE_BUSINESS_MEMBER]: 'onReceiveBusinessMember',
        [Actions.RECEIVE_BUSINESS_MEMBERS]: 'onReceiveBusinessMembers'
    }

    static isomorphicProps = ['members'];

    constructor(dispatcher) {
        super(dispatcher);

        this.members = {};
    }

    onReceiveBusinessMember(member) {
        this.members[member.id] = member;
        this.emitChange();
    }

    onReceiveBusinessMembers({ members }) {
        this.members = _.merge({}, this.members, _.indexBy(members, 'id'));
        this.emitChange();
    }

    getById(id) {
        return this.members[id];
    }

    getAllActiveByBusinessId(businessId) {
        return _.filter(this.members, { businessId, active: true });
    }

    getAllInactiveByBusinessId(businessId) {
        return _.filter(this.members, { businessId, active: false });
    }

}

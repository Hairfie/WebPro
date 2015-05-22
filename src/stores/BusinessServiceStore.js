'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';

export default class BusinessServiceStore extends BaseStore {

    static storeName = 'BusinessServiceStore'

    static handlers = {
        [Actions.RECEIVE_BUSINESS_SERVICE]:     'onReceiveBusinessService',
        [Actions.RECEIVE_BUSINESS_SERVICES]:    'onReceiveBusinessServices',
        [Actions.DELETE_BUSINESS_SERVICE]:      'onDeleteBusinessService'
    }

    static isomorphicProps = ['services'];

    constructor(dispatcher) {
        super(dispatcher);

        this.services = {};
    }

    onReceiveBusinessService(service) {
        this.services[service.id] = service;
        this.emitChange();
    }

    onReceiveBusinessServices({ services }) {
        this.services = _.merge({}, this.services, _.indexBy(services, 'id'));
        this.emitChange();
    }

    onDeleteBusinessService(serviceId) {
        delete this.services[serviceId];
        this.emitChange();
    }

    getById(id) {
        return this.services[id];
    }

    getAllByBusinessId(businessId) {
        return _.filter(this.services, { businessId});
    }

}
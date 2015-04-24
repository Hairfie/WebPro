'use strict';

import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';

export default class UserBusinessStore extends BaseStore {

    static storeName = 'UserBusinessStore'

    static handlers = {
        [Actions.RECEIVE_USER_BUSINESSES]: 'onReceiveUserBusinesses'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.ids = {};
    }

    dehydrate() {
        return {
            ids: this.ids
        };
    }

    rehydrate({ ids }) {
        this.ids = ids;
    }

    onReceiveUserBusinesses({ userId, businesses }) {
        this.ids[userId] = businesses.map(b => b.id);
        this.emitChange();
    }

    getIds(userId) {
        return this.ids[userId]
    }

}

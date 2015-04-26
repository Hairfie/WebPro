'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';

export default class UserBusinessStore extends BaseStore {

    static storeName = 'UserBusinessStore'

    static handlers = {
        [Actions.RECEIVE_USER_BUSINESSES]: 'onReceiveUserBusinesses'
    }

    static isomorphicProps = ['ids'];

    constructor(dispatcher) {
        super(dispatcher);

        this.ids = {};
    }

    onReceiveUserBusinesses({ userId, businesses }) {
        this.ids[userId] = businesses.map(b => b.id);
        this.emitChange();
    }

    getIds(userId) {
        return this.ids[userId]
    }

}

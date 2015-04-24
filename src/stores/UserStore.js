'use strict';

import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';

export default class UserStore extends BaseStore {

    static storeName = 'UserStore'

    static handlers = {
        [Actions.RECEIVE_USER]: 'onReceiveUser'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.users = {};
    }

    dehydrate() {
        return {
            users: this.users
        }
    }

    rehydrate({ users }) {
        this.users = users;
    }

    onReceiveUser(user) {
        this.users[user.id] = user;
        this.emitChange();
    }

    get(id) {
        return this.users[id];
    }

}

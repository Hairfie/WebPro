'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';

export default class UserStore extends BaseStore {

    static storeName = 'UserStore'

    static handlers = {
        [Actions.RECEIVE_USER]: 'onReceiveUser'
    }

    static isomorphicProps = ['users'];

    constructor(dispatcher) {
        super(dispatcher);

        this.users = {};
    }

    onReceiveUser(user) {
        this.users[user.id] = user;
        this.emitChange();
    }

    get(id) {
        return this.users[id];
    }

}

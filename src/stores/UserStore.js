'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import UserActions from '../actions/UserActions';

export default class UserStore extends BaseStore {

    static storeName = 'UserStore'

    static handlers = {
        [Actions.RECEIVE_USER]: 'onReceiveUser',
        [Actions.RECEIVE_USER_SUGGESTIONS]: 'onReceiveUserSuggestions'
    }

    static isomorphicProps = ['users', 'suggestions'];

    constructor(dispatcher) {
        super(dispatcher);

        this.users = {};
        this.suggestions = {};
    }

    onReceiveUser(user) {
        this.users[user.id] = user;
        this.emitChange();
    }

    onReceiveUserSuggestions({ q, users }) {
        this.users = _.merge({}, this.users, _.indexBy(users, 'id'));
        this.suggestions[q] = _.pluck(users, 'id');
        this.emitChange();
    }

    getById(id) {
        return this.users[id];
    }

    getSuggestions(q) {
        const ids = this.suggestions[q];

        if (!ids) {
            this.getContext().executeAction(UserActions.loadUserSuggestions, { q });
        }

        return _.map(this.suggestions[q], this.getById, this);
    }
}

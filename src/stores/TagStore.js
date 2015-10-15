'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';
import TagActions from '../actions/TagActions';

export default class TagStore extends BaseStore {
    static storeName = 'TagStore';

    static handlers =  {
        [Actions.RECEIVE_TAGS]: 'onReceiveTags'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.tags = {};
    }

    onReceiveTags(tags) {
        this.tags = _.sortByAll(tags, ['category.position', 'position']);
        this.emitChange();
    }

    getAll() {
        if (!this.tags || _.isEmpty(this.tags)) {
            this.getContext().executeAction(TagActions.loadAll);
            return null;
        }
        return this.tags;
    }
}
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
        this.tagCategory = {};
    }

    onReceiveTags(tags) {
        this.tags = _.sortByAll(tags, ['category.position', 'position']);

        this.tagCategory = _.uniq(_.sortBy(_.map(tags, tag => {
            return tag.category;
        }), 'position'), 'id');

        this.emitChange();
    }

    getAll() {
        if (!this.tags || _.isEmpty(this.tags)) {
            this.getContext().executeAction(TagActions.loadAll);
            return null;
        }
        return this.tags;
    }

    getTagCategories() {
        if (!this.tagCategory || _.isEmpty(this.tagCategory))
            this.getContext().executeAction(TagActions.loadAll);
        return this.tagCategory;
    }
}
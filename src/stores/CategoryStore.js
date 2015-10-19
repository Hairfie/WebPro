'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';
import CategoryActions from '../actions/CategoryActions';

export default class CategoryStore extends BaseStore {
    static storeName = 'CategoryStore';

    static handlers =  {
        [Actions.RECEIVE_CATEGORIES]: 'onReceiveCategories'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.categories = {};
    }

    onReceiveCategories(categories) {
        this.categories = _.sortBy(categories, 'position');
        this.emitChange();
    }

    getAll() {
        if (!this.categories || _.isEmpty(this.categories))
            this.getContext().executeAction(CategoryActions.loadAll);
        return this.categories;
    }
}
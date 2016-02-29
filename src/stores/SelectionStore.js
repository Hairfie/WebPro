'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';
import SelectionAction from '../actions/SelectionActions';

export default class SelectionStore extends BaseStore {
    static storeName = 'SelectionStore';

    static handlers =  {
        [Actions.RECEIVE_SELECTIONS]: 'onReceiveSelections'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.selections = {};
    }

    onReceiveSelections(selections) {
        this.selections = _.sortBy(selections, 'position');
        this.emitChange();
    }

    getAll() {
        if (!this.selections || _.isEmpty(this.selections))
            this.getContext().executeAction(SelectionAction.loadAll);
        return this.selections;
    }
}
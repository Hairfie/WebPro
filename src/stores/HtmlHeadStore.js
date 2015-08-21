'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';

const DEFAULT_TITLE = 'Hairfie Pro';

export default class HtmlHeadStore extends BaseStore {

    static storeName = 'HtmlHeadStore'

    static handlers = {
        [Actions.CHANGE_ROUTE_START]: 'onChangeRouteStart',
        [Actions.STATUS_404]: 'on404Error',
        [Actions.STATUS_500]: 'on500Error',
        //[Actions.NAVIGATE_START]: 'handleNavigateStart',
        [Actions.NAVIGATE_SUCCESS]: 'handleNavigateSuccess',
        //[Actions.NAVIGATE_FAILURE]: 'handleNavigateFailure'
    }

    static isomorphicProps = ['title'];

    constructor(dispatcher) {
        super(dispatcher);

        this.title = DEFAULT_TITLE;
    }

    getTitle() {
        return this.title;
    }

    getHtmlHeadTitle() {
        return `${this.title} | Hairfie Pro`;
    }

    handleNavigateSuccess(route) {
        this.title = route.get('title') || DEFAULT_TITLE;

        this.emitChange();
    }

    onChangeRouteStart(payload) {
        this.title = payload.title || DEFAULT_TITLE;
        this.emitChange();
    }

    on500Error() {
        this.title = 'Erreur';
        this.emitChange();
    }

    on404Error() {
        this.title = 'Page introuvable';
        this.emitChange();
    }
}

'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';
import routes from '../routes';

export default class ApplicationStore extends BaseStore {

    static storeName = 'ApplicationStore';

    static handlers = {
        [Actions.CHANGE_ROUTE_SUCCESS]: '_handleNavigate'
    }
    initialize(dispatcher) {
        this.currentPageName = null;
        this.currentPage = null;
        this.currentRoute = null;
        this.currentPageTitle = 'HairfiePro';
        this.pages = routes;
    }
    _handleNavigate(route) {
        var pageName = route.name;
        var page = this.pages[pageName];

        if (pageName === this.getCurrentPageName()) {
            return;
        }

        this.currentPageName = pageName;
        this.currentPage = page;
        this.currentRoute = route;
        this.currentPageTitle = page.title ? page.title : 'HairfiePro';
        this.emitChange();
    }
    getCurrentPageName() {
        return this.currentPageName;
    }
    getCurrentPageTitle() {
        return this.currentPageTitle;
    }
    getState() {
        return {
            currentPageName: this.currentPageName,
            currentPage: this.currentPage,
            pages: this.pages,
            route: this.currentRoute
        };
    }
}
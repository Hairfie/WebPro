
import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';
import { isEqual } from 'lodash';

export default class RouteStore extends BaseStore {
    static storeName = 'RouteStore'

    static handlers = {
        [Actions.CHANGE_ROUTE_START]: 'onChangeRouteStart',
        [Actions.CHANGE_ROUTE_SUCCESS]: 'onChangeRouteSuccess',
        [Actions.CHANGE_ROUTE_FAILURE]: 'onChangeRouteFailure',
        [Actions.ERROR_404]: 'onError404',
        [Actions.ERROR_500]: 'onError500'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.loading = false;
        this.route = null;
        this.page = null;
    }

    dehydrate() {
        return {
            route: this.route,
            page: this.page
        }
    }

    rehydrate({ route, page }) {
        this.route = route;
        this.page = page;
    }

    onChangeRouteStart({ name, url, params, query }) {
        this.loading = true;
        this.route = { name, url, params, query };
        this.page = name;
        this.emitChange();
    }

    onChangeRouteSuccess(route) {
        if (!isEqual(route && route.url, this.route && this.route.url)) {
            return; // was a previous route change
        }

        this.loading = false;
        this.emitChange();
    }

    onChangeRouteFailure(route) {
        if (!isEqual(route, this.route)) {
            return; // was a previous route change
        }

        this.loading = false;
        this.emitChange();
    }

    onError404() {
        this.route = null;
        this.page = null;
        this.loading = false;
        this.emitChange();
    }

    onError500() {
        this.route = null;
        this.page = 'error';
        this.loading = false;
        this.emitChange();
    }

    isLoading() {
        return this.loading;
    }

    getCurrentRoute() {
        return this.route;
    }

    getCurrentPage() {
        return this.page;
    }
}

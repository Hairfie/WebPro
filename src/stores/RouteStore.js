
import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';

export default class RouteStore extends BaseStore {

    static storeName = 'RouteStore'

    static handlers = {
        [Actions.CHANGE_ROUTE_SUCCESS]: 'handleNavigate',
        [Actions.CHANGE_ROUTE_START]: 'changeRoute',
        [Actions.STATUS_404]: 'status404',
        [Actions.STATUS_500]: 'status500'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.currentRoute = null;
        this.currentPage = null;
        this.loading = false;
    }

    changeRoute(route) {
        if (this.currentRoute && this.currentRoute.url === route.url) {
            // Do nothing if trying to change to the same route
            return;
        }

        this.loading = true;
        this.currentRoute = route;
        this.currentPage = route.name;

        this.emitChange();
    }

    handleNavigate(route) {
        if (route.url !== (this.currentRoute || {}).url) {
            // Too late! This may happen when a route action has been finished
            // to load, but the route did change again.
            return;
        }

        this.loading = false;
        this.emitChange();
    }

    status404() {
        this.currentPage = '404';
        this.loading = false;
        this.emitChange();
    }

    status500({ error }) {
        this.error = error;
        this.currentPage = '500';
        this.loading = false;
        this.emitChange();
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    isLoading() {
        return this.loading;
    }

    dehydrate() {
        return {
            currentPage: this.currentPage,
            currentRoute: this.currentRoute
        };
    }

    rehydrate({ currentPage, currentRoute }) {
        this.currentPage = currentPage;
        this.currentRoute = currentRoute;
    }
}

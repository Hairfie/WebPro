import { BaseStore } from 'fluxible/addons';
import Actions from '../constants/Actions';

const DEFAULT_TITLE = 'Hairfie Pro';

export default class HtmlHeadStore extends BaseStore {

    static storeName = 'HtmlHeadStore'

    static handlers = {
        [Actions.CHANGE_ROUTE_START]: 'onChangeRouteStart',
        [Actions.STATUS_404]: 'on404Error',
        [Actions.STATUS_500]: 'on500Error'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.title = DEFAULT_TITLE;
    }

    getTitle() {
        return this.title;
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

    dehydrate() {
        return {
            title: this.title
        };
    }

    rehydrate({ title }) {
        this.title = title;
    }
}

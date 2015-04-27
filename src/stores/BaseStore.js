'use strict';

import { BaseStore as FluxibleStore } from 'fluxible/addons';
import _ from 'lodash';

export default class BaseStore extends FluxibleStore {

    getIsomorphicProps() {
        return this.constructor.isomorphicProps || [];
    }

    dehydrate() {
        return _.pick(this, this.getIsomorphicProps());
    }

    rehydrate(data) {
        this.getIsomorphicProps().forEach(prop => this[prop] = data[prop]);
    }

}

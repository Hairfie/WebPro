'use strict';

import { expect } from 'chai';
import _ from 'lodash';
import sinon from 'sinon';

import App from '../../src/app';

function testStore(storeName) {
    const context = App.createContext().getActionContext();
    const store = context.getStore(storeName);

    store.emitChange = sinon.spy();

    return {
        store: context.getStore(storeName),
        dispatch: context.dispatch.bind(context)
    };
}

export default testStore;

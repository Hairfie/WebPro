'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import _ from 'lodash';

export default class BookingStore extends BaseStore {

    static storeName = 'BookingStore';

    static handlers = {
        [Actions.RECEIVE_BOOKINGS]: 'onReceiveBookings'
    }

    static isomorphicProps = ['bookings'];

    constructor(dispatcher) {
        super(dispatcher);

        this.bookings = {};
    }

    onReceiveBookings({bookings}) {
        this.bookings = _.merge({}, this.bookings, _.indexBy(bookings, 'id'));
        this.emitChange();
    }

    getById(id) {
        return this.bookings[id];
    }

    getBookings() {
        return this.bookings;
    }
}
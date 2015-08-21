'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';
import BookingActions from '../actions/BookingActions';
import _ from 'lodash';

export default class BookingStore extends BaseStore {

    static storeName = 'BookingStore';

    static handlers = {
        [Actions.RECEIVE_BOOKINGS]: 'onReceiveBookings',
        [Actions.RECEIVE_BOOKING]:  'onReceiveBooking',
        [Actions.UPDATE_BOOKING_START]: 'onUpdateBookingStart'
    }

    static isomorphicProps = ['bookings'];

    constructor(dispatcher) {
        super(dispatcher);

        this.bookings = {};
        this.currentPage = 1;
    }

    onReceiveBookings({bookings, page}) {
        this.bookings = _.merge({}, this.bookings, _.indexBy(bookings, 'id'));
        this.bookings = _.indexBy(_.sortByOrder(this.bookings, 'createdAt', 'desc'), 'id');
        this.currentPage = page;
        this.emitChange();
    }

    onReceiveBooking({booking}) {
        this.bookings[booking.id] = booking;
        this.bookings[booking.id].loading = false;
        this.bookings = _.indexBy(_.sortByOrder(this.bookings, 'createdAt', 'desc'), 'id');

        this.emitChange();
    }

    onUpdateBookingStart({ bookingId }) {
        this.bookings[bookingId].loading = true;
        this.emitChange();
    }

    getById(id) {
        if(!this.bookings[id]) {
            this.getContext().executeAction(BookingActions.getBookingById, { bookingId: id });
        }
        return this.bookings[id];
    }

    getBookings() {
        return this.bookings;
    }

    getCurrentPage() {
        return this.currentPage;
    }
}
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
        [Actions.UPDATE_BOOKING_START]: 'onUpdateBookingStart',
        [Actions.DELETE_BOOKING_SUCCESS]:  'onDeleteBooking'
    }

    static isomorphicProps = ['bookings'];

    constructor(dispatcher) {
        super(dispatcher);

        this.bookings = {};
        this.currentPage = 1;
        this.currentPageByBusiness = {};
    }

    onReceiveBookings({bookings, page}) {
        this.bookings = _.merge({}, this.bookings, _.indexBy(bookings, 'id'));
        this.bookings = _.indexBy(_.sortByOrder(this.bookings, 'createdAt', 'desc'), 'id');
        this.currentPage = page;
        console.log("onReceiveBookings", _.keys(this.bookings).length);
        this.currentPage = Math.floor(_.keys(this.bookings).length / 10);
        this.emitChange();
    }

    onReceiveBooking({booking}) {
        this.bookings[booking.id] = booking;
        this.bookings[booking.id].loading = false;
        this.bookings = _.indexBy(_.sortByOrder(this.bookings, 'createdAt', 'desc'), 'id');

        this.emitChange();
    }

    onDeleteBooking({ bookingId }) {
        delete this.bookings[bookingId];

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

    getBookingsByBusinessId(businessId) {
        return _.filter(this.bookings, booking => {
            return booking.business.id == businessId
        });
    }

    getBookings() {
        return this.bookings;
    }

    getCurrentPage() {
        return this.currentPage;
    }
}
'use strict';

import Actions from '../constants/Actions';
import RouteActions from './RouteActions';
import _ from 'lodash';

import BookingStore from '../stores/BookingStore';

const BookingActions = {
    getBookings(context) {
        var bookingStore = context.getStore('BookingStore');
        if(_.size(bookingStore.getBookings()) > 0) {
            context.hairfieApi
                .get(`/bookings`)
                .then(function (bookings) {
                    context.dispatch(Actions.RECEIVE_BOOKINGS, { bookings });
                });
            return;
        } else {
            return context.hairfieApi
                .get(`/bookings`)
                .then(function (bookings) {
                    context.dispatch(Actions.RECEIVE_BOOKINGS, { bookings });
                });
        }
        return context.hairfieApi
            .get(`/bookings`)
            .then(function (bookings) {
                context.dispatch(Actions.RECEIVE_BOOKINGS, { bookings });
            });
    },

    getBookingById(context, { bookingId }) {
        const token = context.getStore('AuthStore').getToken();
        if (!token) {
            var error = new Error('Not authorized');
            error.status = 403;
            throw error;
        }

        return context.hairfieApi
            .get(`/bookings/${bookingId}`)
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, { booking });
            });
    }
}

export default BookingActions;
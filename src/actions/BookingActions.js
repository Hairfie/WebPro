'use strict';

import Actions from '../constants/Actions';
import RouteActions from './RouteActions';
import _ from 'lodash';

import BookingStore from '../stores/BookingStore';

const BookingActions = {
    getBookings(context) {
        const bookingStore = context.getStore('BookingStore');

        const query = {
            'filter[sort]': 'createdAt DESC'
        };

        if(_.size(bookingStore.getBookings()) > 0) {
            context.hairfieApi
                .get(`/bookings`, { query })
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
    },

    confirmBooking(context, { bookingId }) {
        const token = context.getStore('AuthStore').getToken();
        if (!token) {
            var error = new Error('Not authorized');
            error.status = 403;
            throw error;
        }

        context.dispatch(Actions.UPDATE_BOOKING_START, { bookingId });

        return context.hairfieApi
            .post(`/bookings/${bookingId}/confirm`, {}, { token })
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, { booking });
            });
    },

    cancelBooking(context, { bookingId }) {
        const token = context.getStore('AuthStore').getToken();
        if (!token) {
            var error = new Error('Not authorized');
            error.status = 403;
            throw error;
        }

        context.dispatch(Actions.UPDATE_BOOKING_START, { bookingId });

        return context.hairfieApi
            .delete(`/bookings/${bookingId}`, {}, { token })
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, { booking });
            });
    },

    honorBooking(context, { bookingId }) {
        const token = context.getStore('AuthStore').getToken();
        if (!token) {
            var error = new Error('Not authorized');
            error.status = 403;
            throw error;
        }

        context.dispatch(Actions.UPDATE_BOOKING_START, { bookingId });

        return context.hairfieApi
            .post(`/bookings/${bookingId}/honored`, {}, { token })
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, { booking });
            });
    },

    updateBooking(context, { bookingId, values }) {
        const token = context.getStore('AuthStore').getToken();

        if (!token) {
            var error = new Error('Not authorized');
            error.status = 403;
            throw error;
        }

        context.dispatch(Actions.UPDATE_BOOKING_START, { bookingId });

        return context.hairfieApi
            .put(`/bookings/${bookingId}`, values, { token })
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, { booking });
            });
    }
}

export default BookingActions;

'use strict';

import Actions from '../constants/Actions';
import RouteActions from './RouteActions';
import _ from 'lodash';

import BookingStore from '../stores/BookingStore';

const BookingActions = {
    getBookings(context, {page = 1, pageSize = 10}, done) {
        const bookingStore = context.getStore('BookingStore');

        const query = {
            'filter[order]': 'createdAt DESC',
            'filter[skip]': (page - 1) * pageSize,
            'filter[limit]': pageSize
        };

        if(_.size(bookingStore.getBookings()) > 0) {
            context.hairfieApi
                .get(`/bookings`, { query })
                .then(function (bookings) {
                    context.dispatch(Actions.RECEIVE_BOOKINGS, { bookings, page });
                });
            done();
        } else {
            context.hairfieApi
                .get(`/bookings`, { query })
                .then(function (bookings) {
                    context.dispatch(Actions.RECEIVE_BOOKINGS, { bookings, page });
                    done();
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
            .post(`/bookings/${bookingId}/cancel`, {}, { token })
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, { booking });
            });
    },

    deleteBooking(context, { bookingId }) {
        const token = context.getStore('AuthStore').getToken();
        if (!token) {
            var error = new Error('Not authorized');
            error.status = 403;
            throw error;
        }

        context.dispatch(Actions.UPDATE_BOOKING_START, { bookingId });

        return context.hairfieApi
            .delete(`/bookings/${bookingId}`, { token })
            .then(function () {
                context.dispatch(Actions.DELETE_BOOKING_SUCCESS, { bookingId });
                return context.executeAction(RouteActions.navigate, {
                    route: 'bookings'
                });
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
    },

    processBooking(context, { bookingId }) {
        const token = context.getStore('AuthStore').getToken();
        if (!token) {
            var error = new Error('Not authorized');
            error.status = 403;
            throw error;
        }

        context.dispatch(Actions.UPDATE_BOOKING_START, { bookingId });

        return context.hairfieApi
            .post(`/bookings/${bookingId}/processing`, {}, { token })
            .then(function (booking) {
                context.dispatch(Actions.RECEIVE_BOOKING, { booking });
            });
    }
}

export default BookingActions;

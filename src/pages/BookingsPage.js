'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper } from '../components/UIKit';
import BookingActions from '../actions/BookingActions';
import Link, {FlatLink} from '../components/Link';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';

class BookingsPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { bookings } = this.props;

        return (
            <Layout>
                <Paper>
                    <h5>Réservations</h5>
                    <br />
                    {_.map(bookings, booking => this.renderBooking(booking))}
                </Paper>
            </Layout>
        );
    }

    renderBooking(booking) {
        return (
            <li>
                {booking.id}
            </li>
        );
    }
}

BookingsPage = connectToStores(BookingsPage, [
    'BookingStore'
], (context, props) => ({
    bookings : context.getStore('BookingStore').getBookings()
}));

export default BookingsPage;
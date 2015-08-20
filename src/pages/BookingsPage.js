'use strict';

import React, { PropTypes } from 'react';
import _ from 'lodash';

import Layout from '../components/Layout';

import BookingActions from '../actions/BookingActions';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';

import { FlatButton, Table, Paper } from '../components/UIKit';
import Link, {FlatLink} from '../components/Link';

class BookingsPage extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            rowData: this.rowDataFromBookings()
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rowData: this.rowDataFromBookings(nextProps)
        });
    }

    rowDataFromBookings(nextProps) {
        const bookings = nextProps ? nextProps.bookings : this.props.bookings;

        return _.map(bookings, booking => {
            // ['id', 'status', 'dateTime', 'businessName', 'businessAddress', 'clientName'];
            return  {
                id: booking.id,
                status: {
                    content: booking.status,
                    style: this.styleFromStatus(booking.status)
                },
                dateTime: {content: booking.displayDateTime},
                businessName: {content: booking.business.name},
                businessAddress: {content: `${booking.business.address.city} ${booking.business.address.zipCode}`},
                clientName: {content: `${booking.firstName} ${booking.lastName}`}
            }
        })
    }

    styleFromStatus(status) {
        switch (status) {
            case 'HONORED':
                return { backgroundColor:'blue' };
            case 'CONFIRMED':
                return { backgroundColor:'green' };
            case 'NOT_CONFIRMED':
                return { backgroundColor:'orange' };
            case 'REQUEST':
                return { backgroundColor:'' };
            default:
                return {};
        }
    }

    render() {
        const colOrder = ['status', 'dateTime', 'businessName', 'businessAddress', 'clientName'];

        return (
            <Layout>
                <h2>Réservations</h2>
                <br />
                <Table
                    rowData={this.state.rowData}
                    columnOrder={colOrder}
                    displayRowCheckbox={false}
                    showRowHover={false}
                    onCellClick={this._onCellClick.bind(this)} />
            </Layout>
        );
    }

    _onCellClick(rowNumber, cell) {
        const url = this.context.makePath('booking', {bookingId: this.state.rowData[rowNumber].id});
        this.context.executeAction(navigateAction, {url: url});
    }
}

BookingsPage = connectToStores(BookingsPage, [
    'BookingStore'
], (context, props) => ({
    bookings : context.getStore('BookingStore').getBookings()
}));

export default BookingsPage;

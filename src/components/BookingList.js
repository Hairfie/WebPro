'use strict';

import React, { PropTypes } from 'react';
import _ from 'lodash';

import mui from 'material-ui';
let Colors = mui.Styles.Colors;

import { navigateAction } from 'fluxible-router';

import { FlatButton, Table, Paper, RaisedButton, Center, Checkbox } from '../components/UIKit';
import Link, {FlatLink} from '../components/Link';
import moment from 'moment';


class BookingList extends React.Component {
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
        let bookings = nextProps ? nextProps.bookings : this.props.bookings;

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
                clientName: {content: `${booking.firstName} ${booking.lastName}`},
                createdAt: {content: moment(booking.createdAt).format("DD/MM/YY[:]HH:mm")}
            }
        })
    }

    render() {
        const colOrder = ['status', 'dateTime', 'businessName', 'businessAddress', 'clientName', 'createdAt'];
        return (
            <div>
                <h4>RDVs</h4>
                <Table
                    rowData={this.state.rowData}
                    columnOrder={colOrder}
                    displayRowCheckbox={false}
                    showRowHover={false}
                    onCellClick={this._onCellClick.bind(this)} />
            </div>
        );
    }

    _onCellClick(rowNumber, cell) {
        const url = this.context.makePath('booking', {bookingId: this.state.rowData[rowNumber].id});
        this.context.executeAction(navigateAction, {url: url});
    }

    styleFromStatus(status) {
        switch (status) {
            case 'HONORED':
                return { backgroundColor: Colors.lightBlue600 };
            case 'CONFIRMED':
                return { backgroundColor: Colors.lightGreen600 };
            case 'NOT_CONFIRMED':
                return { backgroundColor:'orange' };
            case 'REQUEST':
                return { backgroundColor: '' };
            case 'IN_PROCESS':
                return { backgroundColor: Colors.lightGreen200 };
            case 'CANCEL_REQUEST':
                return { backgroundColor: Colors.lightRed200 };
            case 'CANCELLED':
                return { backgroundColor: Colors.red200 };
            default:
                return {};
        }
    }
}

export default BookingList;
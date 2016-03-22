'use strict';

import React, { PropTypes } from 'react';
import _ from 'lodash';

import mui from 'material-ui';
let Colors = mui.Styles.Colors;

import Layout from '../components/Layout';

import BookingActions from '../actions/BookingActions';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';

import { FlatButton, Table, Paper, RaisedButton, Center, Checkbox } from '../components/UIKit';
import Link, {FlatLink} from '../components/Link';

class BookingsPage extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            rowData: this.rowDataFromBookings(),
            statusFilters: []
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            rowData: this.rowDataFromBookings(nextProps)
        });
    }

    rowDataFromBookings(nextProps) {
        let bookings = nextProps ? nextProps.bookings : this.props.bookings;
        bookings = this.bookingsFromState(bookings);

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

    bookingsFromState = (bookings) => {
        debugger;
        if(!_.isEmpty(this.state.statusFilters)) {
            return _.filter(bookings, booking => {
                return _.include(this.state.statusFilters, booking.status);
            }, this)
        } else {
            return bookings;
        }
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
            case 'CANCELLED':
                return { backgroundColor: Colors.red200 };
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
                <div>                    
                    <h4>Filtrer</h4>
                    {_.map(["REQUEST", "CONFIRMED", "IN_PROCESS", "HONORED", "CANCEL_REQUEST", "CANCELLED"], status => {
                        return <Checkbox
                            ref={status}
                            label={status}
                            defaultChecked={_.include(this.state.statusFilters, status)}
                            onClick={this._handleStatusFilterChange.bind(this, status)}
                        />
                    })}
                    <RaisedButton label={'Filtrer'} onClick={this.loadResults}/>

                    <hr />
                </div>
                <h4>RDVs</h4>
                <Table
                    rowData={this.state.rowData}
                    columnOrder={colOrder}
                    displayRowCheckbox={false}
                    showRowHover={false}
                    onCellClick={this._onCellClick.bind(this)} />
                <br />
                <Center>
                    <RaisedButton label={'Load More'} onClick={this.loadMore.bind(this)}/>
                </Center>

            </Layout>
        );
    }

    // loadResults = () => {
    //     const { currentPage } = this.props;
    //     console.log("currentPage", currentPage);
    //     this.context.executeAction(BookingActions.getBookings, {page: currentPage + 1, statusFilters: this.state.statusFilters});
    // }

    loadMore() {
        const { currentPage } = this.props;
        console.log("currentPage", currentPage);
        this.context.executeAction(BookingActions.getBookings, {page: currentPage + 1, statusFilters: this.state.statusFilters});
    }

    toggleItemInArray(arr, item) {
        return _.indexOf(arr,item) == -1 ? _.union(arr,[item]) : _.without(arr,item);
    }

    _handleStatusFilterChange(status) {
        this.setState({statusFilters: this.toggleItemInArray(this.state.statusFilters, status)});
    }

    _onCellClick(rowNumber, cell) {
        const url = this.context.makePath('booking', {bookingId: this.state.rowData[rowNumber].id});
        this.context.executeAction(navigateAction, {url: url});
    }
}

BookingsPage = connectToStores(BookingsPage, [
    'BookingStore'
], (context, props) => ({
    bookings : context.getStore('BookingStore').getBookings(),
    currentPage: context.getStore('BookingStore').getCurrentPage()
}));

export default BookingsPage;

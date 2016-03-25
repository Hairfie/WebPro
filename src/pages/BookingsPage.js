'use strict';

import React, { PropTypes } from 'react';
import _ from 'lodash';

import mui from 'material-ui';
let Colors = mui.Styles.Colors;

import Layout from '../components/Layout';
import BookingList from '../components/BookingList'

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
            statusFilters: [],
            bookings: this.bookingsFromState(props)
        };
    }

    bookingsFromState = (props) => {
        let bookings = (props && props.bookings) ? props.bookings : this.props.bookings;

        if(bookings) {
            if(this.state && !_.isEmpty(this.state.statusFilters)) {
                return _.filter(bookings, booking => {
                    return _.include(this.state.statusFilters, booking.status);
                }, this)
            } else {
                return bookings;
            }
        } else {
            return this.state.bookings;
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            bookings: this.bookingsFromState(nextProps)
        });
    }

    render() {
//        <div>                    
//            <h4>Filtrer</h4>
//            {_.map(["REQUEST", "CONFIRMED", "IN_PROCESS", "HONORED", "CANCEL_REQUEST", "//CANCELLED"], status => {
//                return <Checkbox
//                    ref={status}
//                    label={status}
//                    defaultChecked={_.include(this.state.statusFilters, status)}
//                    onClick={this._handleStatusFilterChange.bind(this, status)}
//                />
//            })}
//            <hr />
//        </div>
        return (
            <Layout>
                <BookingList bookings={this.state.bookings} />
                <br />
                <Center>
                    <RaisedButton label={'Load More'} onClick={this.loadMore.bind(this)}/>
                </Center>
            </Layout>
        );
    }

    loadMore() {
        const currentPage = Math.floor(_.size(this.state.bookings)/10);
        this.context.executeAction(BookingActions.getBookings, {page: currentPage + 1, statusFilters: this.state.statusFilters});
    }

    toggleItemInArray(arr, item) {
        return _.indexOf(arr,item) == -1 ? _.union(arr,[item]) : _.without(arr,item);
    }

    _handleStatusFilterChange(status) {
        this.setState({statusFilters: this.toggleItemInArray(this.state.statusFilters, status)}, () => {
            this.setState({bookings: this.bookingsFromState()});
        });
    }
}

BookingsPage = connectToStores(BookingsPage, [
    'BookingStore'
], (context, props) => ({
    bookings : context.getStore('BookingStore').getBookings(),
    currentPage: context.getStore('BookingStore').getCurrentPage()
}));

export default BookingsPage;

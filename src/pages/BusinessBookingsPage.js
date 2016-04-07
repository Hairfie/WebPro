'use strict';

import React from 'react';
import _ from 'lodash';
import Layout from '../components/Layout';

import BookingActions from '../actions/BookingActions';
import { connectToStores } from 'fluxible-addons-react';

import BookingList from '../components/BookingList';
import Link, {FlatLink, RaisedLink} from '../components/Link';
import { Center, RaisedButton } from '../components/UIKit';

class BusinessBookingsPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { businessId, business, bookings, currentPage } = this.props;
        return (
            <Layout {...this.props}>
                <BookingList bookings={bookings} />
                <br />
                <Center>
                    <RaisedButton label={'Load More'} onClick={this.loadMore.bind(this)}/>
                </Center>
                <br />
                <Center>
                    <RaisedLink href={`/bookings/new?businessId=${businessId}`} label='Créer un RDV' />
                </Center>
                <br /><br />
                <RaisedLink route="business" params={{ businessId: businessId }} label='Retour' fullWidth={true} />
            </Layout>
        );
    }

    loadMore() {
        const currentPage = Math.floor(_.size(this.props.bookings)/10);
        this.context.executeAction(BookingActions.getBookingsByBusinessId, {page: currentPage + 1, businessId: this.props.businessId});
    }
}

BusinessBookingsPage = connectToStores(BusinessBookingsPage, [
    'BookingStore', 'BusinessStore'
], (context, props) => ({
    business : context.getStore('BusinessStore').getById(props.businessId),
    bookings : context.getStore('BookingStore').getBookingsByBusinessId(props.businessId)
}));

export default BusinessBookingsPage;
'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link from '../components/Link';
import { FlatButton, Table, Paper } from '../components/UIKit';
import BookingActions from '../actions/BookingActions';

class BookingPage extends React.Component {
    constructor(props) {
        super(props);
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    static defaultProps = {
        booking: {}
    }

    render() {
        const booking = this.props.booking || {};
        if(!booking || !booking.business) {
            return <Layout {...this.props} />
        }
        return (
            <Layout {...this.props}>
                <Paper>
                    <h4>Réservation</h4>
                    {this.renderProperty('ID', booking.id)}
                    {this.renderProperty('Statut', booking.status)}
                    {this.renderProperty('Demande', booking.comment)}
                </Paper>
                <br />
                <Paper>
                    <h4>Salon</h4>
                    {this.renderProperty('Nom', booking.business.name)}
                    {this.renderProperty('Adresse',`${booking.business.address.street} ${booking.business.address.zipCode} ${booking.business.address.city}`)}
                    {this.renderProperty('Téléphone', booking.business.phoneNumber)}
                </Paper>
                <br />
                <Paper>
                    <h4>Client</h4>
                    {this.renderProperty('Nom',`${booking.firstName} ${booking.lastName}`)}
                    {this.renderProperty('Téléphone', booking.phoneNumber)}
                    {this.renderProperty('Email', booking.email)}
                </Paper>
                <br />
                <Link route="bookings" >Retour</Link>
            </Layout>
        );
    }

    renderProperty(title, content) {
        return (
            <span>
                <strong>{title + ' : '}</strong>
                {content}
                <br />
            </span>
        );
    }

    save = () => {
        // const businessId = this.props.businessId;
        // const businessMemberId = this.props.businessMember.id;
        // const values = {
        //     userId      : this.refs.user.getUserId(),
        //     picture     : this.refs.picture.getImage(),
        //     gender      : this.refs.gender.getSelectedValue(),
        //     firstName   : this.refs.firstName.getValue(),
        //     lastName    : this.refs.lastName.getValue(),
        //     email       : this.refs.email.getValue(),
        //     phoneNumber : this.refs.phoneNumber.getValue(),
        //     hidden      : !this.refs.isHairdresser.isChecked()
        // };

        // if (businessMemberId) {
        //     this.context.executeAction(BusinessMemberActions.updateMember, { businessMemberId, values });
        // } else {
        //     this.context.executeAction(BusinessMemberActions.createMember, { businessId, values });
        // }
    }
}

BookingPage = connectToStores(BookingPage, [
    'BookingStore'
], (context, props) => {
    return {
        booking: props.bookingId && context.getStore('BookingStore').getById(props.bookingId)
    };
});

export default BookingPage;

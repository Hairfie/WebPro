'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link from '../components/Link';
import { FlatButton, Table, Paper, RaisedButton } from '../components/UIKit';
import BookingActions from '../actions/BookingActions';
import moment from 'moment';

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
                    {this.renderField('ID', booking.id)}
                    {this.renderField('Statut', booking.status)}
                    {this.renderField('Date et heure', moment(booking.dateTime).format("dddd D MMMM YYYY [@] HH:mm"))}
                    {this.renderField('Demande', booking.comment)}
                    <br />
                    <h4>Salon</h4>
                    {this.renderField('Nom', booking.business.name)}
                    {this.renderField('Adresse',`${booking.business.address.street} ${booking.business.address.zipCode} ${booking.business.address.city}`)}
                    {this.renderField('Téléphone', booking.business.phoneNumber)}
                    <br />
                    <h4>Client</h4>
                    {this.renderField('Nom',`${booking.firstName} ${booking.lastName}`)}
                    {this.renderField('Téléphone', booking.phoneNumber)}
                    {this.renderField('Email', booking.email)}
                </Paper>
                <br />
                <div>
                    <h4>Gérer cette réservation</h4>
                        <RaisedButton fullWidth={true} label="Confirmer la réservation" onClick={this.confirmBooking.bind(this)} {...this.props} />
                        <RaisedButton fullWidth={true} label="Cette réservation a bien été honorée" onClick={this.honorBooking.bind(this)} {...this.props} />
                        <RaisedButton fullWidth={true} label="Annuler la réservation" onClick={this.cancelBooking.bind(this)} {...this.props} />
                </div>
                <br />
                <Link route="bookings" >Retour</Link>
            </Layout>
        );
    }

    renderField(title, content) {
        return (
            <span>
                <strong>{title + ' : '}</strong>
                {content}
                <br />
            </span>
        );
    }

    confirmBooking = () => {
        const bookingId = this.props.bookingId;
        this.context.executeAction(BookingActions.confirmBooking, { bookingId });
    }

    honorBooking = () => {
        const bookingId = this.props.bookingId;
        this.context.executeAction(BookingActions.honorBooking, { bookingId });
    }

    cancelBooking = () => {
        const bookingId = this.props.bookingId;
        this.context.executeAction(BookingActions.cancelBooking, { bookingId });
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

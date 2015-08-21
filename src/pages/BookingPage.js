'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link from '../components/Link';
import { FlatButton, Table, Paper, RaisedButton, Dialog, TextField, CircularProgress, Center } from '../components/UIKit';
import BookingActions from '../actions/BookingActions';
import moment from 'moment-timezone';

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

        if(!booking || !booking.business || booking.loading) {
            return (
                <Layout {...this.props}>
                    <Center>
                        <CircularProgress mode="indeterminate" />
                    </Center>
                </Layout>
            );
        }

        return (
            <Layout {...this.props}>
                <BookingModal ref="modal" booking={booking} />
                <Paper>
                    <h4>Réservation</h4>
                    {this.renderField('ID', booking.id)}
                    {this.renderField('Statut', booking.status)}
                    {this.renderField('Date', moment(booking.dateTime).format("dddd D MMMM YYYY"))}
                    {this.renderField('Heure', moment(booking.dateTime).format("HH:mm"))}
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
                        <RaisedButton fullWidth={true} label="Modifier la réservation" onClick={this.showModal.bind(this)} {...this.props} />
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

    showModal = () => {
        this.refs.modal.show();
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
}

class BookingModal extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const {booking} = this.props;

        const customActions = [
            <FlatButton
                label="Annuler"
                secondary={true}
                onTouchTap={this._handleCancel} />,
            <FlatButton
                label="Enregistrer"
                primary={true}
                onTouchTap={this._handleSave} />
        ];

        return (
            <Dialog ref="dialog" actions={customActions}>
                <h4>Modifier la réservation</h4>
                <p>
                    <TextField ref="date" type="date" floatingLabelText="Date" defaultValue={moment(booking.dateTime).tz('Europe/Paris').format("YYYY-MM-DD")} />
                    <TextField ref="time" type="time" floatingLabelText="Horaire" defaultValue={moment(booking.dateTime).tz('Europe/Paris').format("HH:mm")} />
                </p>
            </Dialog>
        );
    }

    _handleCancel = () => {
        this.refs.dialog.dismiss();
    }

    _handleSave = () => {
        const bookingId = this.props.booking.id
        const values = {
            dateTime: moment(`${this.refs.date.getValue()} ${this.refs.time.getValue()}`, "YYYY-MM-DD HH:mm").toDate()
        };
        this.context.executeAction(BookingActions.updateBooking, { bookingId,  values });
        this.refs.dialog.dismiss();
    }

    show() {
        this.refs.dialog.show();
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

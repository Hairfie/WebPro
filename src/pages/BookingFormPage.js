'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link, {FlatLink, RaisedLink} from '../components/Link';
import { RadioButtonGroup, RadioButton, DropDownMenu, MenuItem, FlatButton, Table, Paper, RaisedButton, Dialog, TextField, CircularProgress, Center, Checkbox } from '../components/UIKit';
import BookingActions from '../actions/BookingActions';
import moment from 'moment-timezone';
import BookingStatus from '../constants/BookingStatus';
import HairLengthConstant from '../constants/HairLength';
import BusinessInfos from './Booking/BusinessInfos';

class BookingFormPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            businessId: this.props.booking ? this.props.booking.business.id : null,
            hairLength: this.props.booking ? this.props.booking.hairLength : 'SHORT'
        }
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        console.log('booking', this.props.booking);
        console.log('STATE', this.state);
        const hairLengthItems = [
           { text: 'SHORT' },
           { text: 'MID_SHORT' },
           { text: 'LONG' },
           { text: 'VERY_LONG' },
        ];
        const {booking} = this.props;
        const businessId = booking ? booking.business.id : null;
        const date = booking ? moment(booking.dateTime).tz('Europe/Paris').format("YYYY-MM-DD") : moment().tz('Europe/Paris').format("YYYY-MM-DD");
        const time = booking ? moment(booking.dateTime).tz('Europe/Paris').format("HH:mm") : moment('09:00', 'HH:mm').tz('Europe/Paris').format("HH:mm");
        const hairIndex = _.indexOf(_.map(hairLengthItems, (item) => { return item.text }), this.state.hairLength);
        const service = booking ? booking.service : null;
        const comment = booking ? booking.comment : null;
        const firstTimeCustomer = booking ? booking.firstTimeCustomer : false;
        const discount = booking ? booking.discount : null;
        const gender = booking ? booking.gender : 'FEMALE';
        const firstName = booking ? booking.firstName : null;
        const lastName = booking ? booking.lastName : null;
        const email = booking ? booking.email : null;
        const phoneNumber = booking ? booking.phoneNumber : null;
        // debugger;
        return (

            <Layout {...this.props}>
                <TextField ref="businessId" floatingLabelText="ID du salon" onChange={this.handleBusinessId} defaultValue={businessId}/>
                <br/>
                <BusinessInfos businessId={this.state.businessId}/>
                <br/>
                <Paper style={{padding: 10}}>
                    <h4>Infos RDV</h4>
                    <TextField ref="date" type="date" floatingLabelText="Date" defaultValue={date}/>
                    <br/>
                    <TextField ref="time" type="time" floatingLabelText="Horaire" defaultValue={time}/>
                    <br/>
                    Longueur de cheveux:
                    <DropDownMenu ref="hairLength" onChange={this.handleHairLength} menuItems={hairLengthItems} selectedIndex={hairIndex}/>
                    <br/>
                    <TextField ref="service" type="text" floatingLabelText="Prestation demandée" defaultValue={service}/>
                    <br/>
                    <TextField ref="comment" type="text" floatingLabelText="Demande particulière" defaultValue={comment}/>
                    <br/>
                    <Checkbox ref="firstTimeCustomer" label="Première fois dans ce salon ?" defaultChecked={firstTimeCustomer}/>
                    <br/>
                    <TextField ref="discount" type="number" floatingLabelText="Promotion (%)" defaultValue={discount} />
                </Paper>
                <br/>
                <br/>
                <br/>
                <Paper style={{padding: 10}}>
                    <h4>Infos client</h4>
                    <RadioButtonGroup ref="gender" name="gender" defaultSelected={gender} >
                        <RadioButton value="FEMALE" label="Femme" />
                        <RadioButton value="MALE" label="Homme" />
                    </RadioButtonGroup>
                    <br/>
                    <TextField ref="firstName" type="text" floatingLabelText="Prénom" defaultValue={firstName}/>
                    <br/>
                    <TextField ref="lastName" type="text" floatingLabelText="Nom" defaultValue={lastName}/>
                    <br/>
                    <TextField ref="email" type="email" floatingLabelText="Email" defaultValue={email}/>
                    <br/>
                    <TextField ref="phoneNumber" type="text" floatingLabelText="Téléphone" defaultValue={phoneNumber}/>
                    <br/>
                    <br/>
                    <br/>
                </Paper>
                <br/>
                <br/>
                <FlatButton label='Enregistrer' onClick={this.save} />
                <br/>
                <Link route="bookings" >Retour</Link>
            </Layout>
        );
    }
    handleHairLength = (event, index, menuItem) => {
        this.setState({hairLength: menuItem.text })
    }
    handleBusinessId = () => {
        const businessId = this.refs.businessId.getValue();
        this.setState({businessId: businessId})
    }
    getBookingInfo = () => {
        // debugger;
        return {
            businessId          : this.refs.businessId.getValue(),
            timeslot            : moment(`${this.refs.date.getValue()} ${this.refs.time.getValue()}`, "YYYY-MM-DD HH:mm").toDate(),
            hairLength          : this.state.hairLength,
            service             : this.refs.service.getValue(),
            comment             : this.refs.comment.getValue(),
            firstTimeCustomer   : this.refs.firstTimeCustomer.isChecked(),
            discount            : this.refs.discount.getValue(),
            gender              : this.refs.gender.getSelectedValue(),
            firstName           : this.refs.firstName.getValue(),
            lastName            : this.refs.lastName.getValue(),
            email               : this.refs.email.getValue(),
            phoneNumber         : this.refs.phoneNumber.getValue()
        };
    }
    save = () => {
        // debugger;    
        console.log('getBookingInfo', this.getBookingInfo());
        const values = this.getBookingInfo();
        if (this.props.booking) {
            const bookingId = this.props.booking.id;
            this.context.executeAction(BookingActions.updateBooking,{ bookingId, values});
        } else {
            this.context.executeAction(BookingActions.createBooking, {values});            
        }
    }
}

BookingFormPage = connectToStores(BookingFormPage, [
    'BookingStore'
], (context, props) => {

    const booking = props.bookingId && context.getStore('BookingStore').getById(props.bookingId);
    return {
        booking: booking
    };
});

export default BookingFormPage;
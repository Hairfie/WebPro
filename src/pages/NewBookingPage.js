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

class NewBookingFormPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            businessId: null,
            hairLength: 'SHORT'
        }
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        console.log('booking', this.state);
        // debugger;
        const hairLengthItems = [
           { text: 'SHORT' },
           { text: 'MID_SHORT' },
           { text: 'LONG' },
           { text: 'VERY_LONG' },
        ];
        // debugger;
        return (

            <Layout {...this.props}>
                <TextField ref="businessId" floatingLabelText="ID du salon" onChange={this.handleBusinessId}/>
                <br/>
                <BusinessInfos businessId={this.state.businessId}/>
                <br/>
                <Paper style={{padding: 10}}>
                    <h4>Infos RDV</h4>
                    <TextField ref="date" type="date" floatingLabelText="Date" defaultValue={moment().tz('Europe/Paris').format("YYYY-MM-DD")}/>
                    <br/>
                    <TextField ref="time" type="time" floatingLabelText="Horaire" defaultValue={moment('09:00', 'HH:mm').tz('Europe/Paris').format("HH:mm")}/>
                    <br/>
                    Longueur de cheveux:
                    <DropDownMenu ref="hairLength" onChange={this.handleHairLength} menuItems={hairLengthItems} />
                    <br/>
                    <TextField ref="service" type="text" floatingLabelText="Prestation demandée" />
                    <br/>
                    <TextField ref="comment" type="text" floatingLabelText="Demande particulière" />
                    <br/>
                    <Checkbox ref="firstTimeCustomer" label="Première fois dans ce salon ?" />
                    <br/>
                    <TextField ref="discount" type="number" floatingLabelText="Promotion (%)" />
                </Paper>
                <br/>
                <br/>
                <br/>
                <Paper style={{padding: 10}}>
                    <h4>Infos client</h4>
                    <RadioButtonGroup ref="gender" name="gender" defaultSelected="FEMALE" >
                        <RadioButton value="FEMALE" label="Femme" />
                        <RadioButton value="MALE" label="Homme" />
                    </RadioButtonGroup>
                    <br/>
                    <TextField ref="firstName" type="text" floatingLabelText="Prénom" />
                    <br/>
                    <TextField ref="lastName" type="text" floatingLabelText="Nom" />
                    <br/>
                    <TextField ref="email" type="email" floatingLabelText="Email" />
                    <br/>
                    <TextField ref="phoneNumber" type="text" floatingLabelText="Téléphone" />
                    <br/>
                    <br/>
                    <br/>
                </Paper>
                <br/>
                <br/>
                <FlatButton label='Enregistrer' onClick={this.save} />
                <br/>
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
        this.context.executeAction(BookingActions.createBooking, {values});
    }
}

export default NewBookingPage;
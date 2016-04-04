'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link, {FlatLink, RaisedLink} from '../components/Link';
import { DropDownMenu, MenuItem, FlatButton, Table, Paper, RaisedButton, Dialog, TextField, CircularProgress, Center, Checkbox } from '../components/UIKit';
import BookingActions from '../actions/BookingActions';
import moment from 'moment-timezone';
import BookingStatus from '../constants/BookingStatus';
import HairLengthConstant from '../constants/HairLength';

class NewBookingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            booking: {
                status: 'REQUEST'
            }
        }
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        console.log('booking', this.state);
                //Réservation

        // ID : 2db545a5-f577-4d01-8d42-af03c5fed43a
        // Statut : CONFIRMED, NOT_CONFIRMED, IN_PROCESS, REQUEST, CANCELLED
        // Date : vendredi 25 mars 2016
        // Heure : 14:00
        // Longueur des cheveux du client : Courts
        // Prestation demandée : Coupe Homme
        // Demande particulière : 
        // Nouveau client dans ce salon : OUI
        // Promotion : 
        // Demandé le : 25/03/16 à 14:08
        // Salon

        // Nom : Djelani Maachi
        // Adresse : 40 Rue Coquillière 75001 Paris
        // Téléphone : +33142335747
        // Page Hairfie : http://www.hairfie.com/fr/coiffeur/3ccdf37f-5ffb-46a8-bc34-51fac71db4c2/djelani-maachi
        // VOIR LA PAGE SUR PRO.HAIRFIE.COM
        // Client

        // Nom : Ghislain de Juvigny
        // Sexe : MALE
        // Téléphone : +33676844994
        // Email : gdjuvigny@gmail.com
                // <Menu value={this.state.value} onChange={this.handleChange}>
                    // <MenuItem value="REQUEST" primaryText="REQUEST"/>
                    // <MenuItem value="IN_PROCESS" primaryText="IN_PROCESS"/>
                    // <MenuItem value="CONFIRMED" primaryText="CONFIRMED"/>
                    // <MenuItem value="NOT_CONFIRMED" primaryText="NOT_CONFIRMED"/>
                    // <MenuItem value="CANCELLED" primaryText="CANCELLED"/>
                // </Menu>
        const statusItems = [
           { payload: '1', text: 'REQUEST' },
           { payload: '2', text: 'IN_PROCESS' },
           { payload: '3', text: 'CONFIRMED' },
           { payload: '4', text: 'NOT_CONFIRMED' },
           { payload: '5', text: 'CANCELLED' },
        ];
        const hairLengthItems = [
           { payload: '1', text: 'SHORT' },
           { payload: '2', text: 'MID_SHORT' },
           { payload: '3', text: 'LONG' },
           { payload: '4', text: 'VERY_LONG' },
        ];
        // debugger;
        return (

            <Layout {...this.props}>
                <TextField
                    ref="businessId"
                    floatingLabelText="ID du salon" />
                <br/>
                Status: 
                <DropDownMenu
                    onChange={this.handleStatus} 
                    menuItems={statusItems} />
                <br/>
                <TextField ref="date" type="date" floatingLabelText="Date" defaultValue={moment().format()} />
                <br/>
                <TextField ref="time" type="time" floatingLabelText="Horaire" />
                <br/>
                Longueur de cheveux:
                <DropDownMenu
                    onChange={this.handleStatus} 
                    menuItems={hairLengthItems} />
                <br/>
                <TextField ref="service" type="text" floatingLabelText="Prestation demandée" />
                <br/>
            </Layout>
        );
    }
    handleStatus = (event, index, menuItem) => {
        this.setState({status: menuItem.text })
    }
    handleHairLength = (event, index, menuItem) => {
        this.setState({hairLength: menuItem.text })
    }
}

export default NewBookingPage;
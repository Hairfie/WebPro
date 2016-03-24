'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link from '../components/Link';
import mui from 'material-ui';
import { TextField, DropDownMenu, Menu, MenuItem, FlatButton, RaisedButton, Checkbox, CircularProgress, Paper } from '../components/UIKit';
import BusinessClaimActions from '../actions/BusinessClaimActions';
import UserPicker from '../components/UserPicker';
import ImageField from '../components/ImageField';
import BusinessMapPage from './BusinessMapPage';
import PlaceInput from '../components/PlaceInput';
import MapForm from '../components/MapForm';

class AddBusinessPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: {},
            gps: null,
            displayMap: false,
            errors: {},
            displaySummary: false
        };
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        return (
            <Layout {...this.props}>
                {this.renderInfoForm()}
                {this.renderAddressForm()}
                {this.renderSummary()}
            </Layout>
        );

    }
    renderInfoForm() {
        if (this.state.displaySummary || this.props.businessClaim) return;
        return (
            <div>
                <mui.TextField
                    ref="name"
                    floatingLabelText="Nom du salon"
                    />
                <br/>
                <br/>
                <mui.RadioButtonGroup ref="kind" name="kind" defaultSelected='SALON'>
                    <mui.RadioButton value="SALON" label="Salon"  />
                    <mui.RadioButton value="HOME" label="À domicile" />
                </mui.RadioButtonGroup>
                <mui.TextField
                    ref="phoneNumber"
                    floatingLabelText="Téléphone"
                    />
                <br/>
                <br/>
                <h5>Pour qui ?</h5>
                <mui.Checkbox
                    ref="women"
                    label="Femmes"
                    />
                <mui.Checkbox
                    ref="men"
                    label="Hommes"
                    />
                <mui.Checkbox
                    ref="children"
                    label="Enfants"
                    />
                <br/>
                {this.renderErrors()}
                <br/>
                <mui.RaisedButton label='Suivant' secondary={true} onClick={this.save} />
            </div>
        );
    }

    renderAddressForm() {
        if (this.state.displaySummary || !this.props.businessClaim) return;
        let map = this.state.displayMap ? <MapForm ref="gps" defaultLocation={this.state.gps} /> : null;
        let submitButton = this.state.displayMap ? <mui.RaisedButton label='Suivant' secondary={true} onClick={this.save} /> : null;
        return (
            <div>
                <PlaceInput ref="place" />
                <br/>
                <mui.RaisedButton label='Utiliser cette addresse' secondary={true} onClick={this.getPlace} />
                <br/>
                <br/>
                {map}
                <br/>
                {this.renderErrors()}
                <br/>
                {submitButton}
            </div>
        );
    }

    renderSummary() {
        if (!this.state.displaySummary) return;
        const businessClaim = this.props.businessClaim;
        const kind = businessClaim.kind == 'SALON' ? 'Salon' : 'A domicile';
        const address = businessClaim.address;
        let customers = businessClaim.women ? ' Femme ' : '';
        customers += businessClaim.men ? ' Homme ' : '';
        customers += businessClaim.children ? ' Enfant ' : '';

        return (
            <div>
                <h4>Récapitulatif</h4>
                    {`Nom : ${businessClaim.name}`}
                    <br/>
                    {`Téléphone : ${businessClaim.phoneNumber}`}
                    <br/>
                    {`Type : ${kind}`}
                    <br/>
                    {`Pour : ${customers}`}
                    <br/>
                    {`Adresse : ${address.street}, ${address.zipCode}, ${address.city}, ${address.country}`}
                    <br/>
                    <br/>
                    <mui.RaisedButton label='Enregistrer le salon' secondary={true} onClick={this.submit} />
            </div>
        );
    }

    renderErrors() {
        if (_.isEmpty(this.state.errors)) return;
        return (
            <div className="error">
                {_.map(this.state.errors, function(e) {
                    return <div>{`- ${e}`}</div>
                })}
            </div>
        );
    }

    displaySummary = () => {
        this.setState({displaySummary: true});
    }

    getPlace = () => {
        this.setState({
            address: this.refs.place.getHairfieFormattedAddress(),
            gps: this.refs.place.getLocation(),
            displayMap: true
        });
    }

    validateForm = () => {
        let errors = {};
        if (!this.refs.name.getValue()) errors.name = 'Vous devez entrer un nom de salon';
        if (!this.refs.phoneNumber.getValue()) errors.phoneNumber = 'Vous devez saisir un numéro de téléphone';
        this.setState({errors: errors});
        return _.isEmpty(errors) ? true : false;

    }

    validateAddress = () => {
        const address = this.state.address;
        let errors = {};
        if (!address.street || !address.city || !address.zipCode || !address.country) 
            errors.address = 'Ceci n\'est pas une adresse acceptée. Merci de la modifier.';
        this.setState({errors: errors});
        return _.isEmpty(errors) ? true : false;

    }

    save = () => {
        const businessClaim = this.props.businessClaim ? this.props.businessClaim : null;
        const businessClaimId = businessClaim ? businessClaim.id : null;

        //Vérification des champs sur la première page
        if (!businessClaim && !this.validateForm()) return;
        //Vérification de l'adresse choisie
        if (businessClaim && !this.validateAddress()) return;

        const values = {
            name        : businessClaim ? businessClaim.name : this.refs.name.getValue(),
            kind        : businessClaim ? businessClaim.kind : this.refs.kind.getSelectedValue(),
            phoneNumber : businessClaim ? businessClaim.phoneNumber : this.refs.phoneNumber.getValue(),
            men         : businessClaim ? businessClaim.men : this.refs.men.isChecked(),
            women       : businessClaim ? businessClaim.women : this.refs.women.isChecked(),
            children    : businessClaim ? businessClaim.children : this.refs.children.isChecked(),
            address     : businessClaim ? this.state.address : null,
            gps         : businessClaim ? this.state.gps : null
        }   
        if (businessClaimId) {         
            this.context.executeAction(BusinessClaimActions.updateBusinessClaim, { businessClaimId, values });
            this.displaySummary();
        }
        else {
            this.context.executeAction(BusinessClaimActions.createBusinessClaim, { values });
        }
    }
    submit = () => {
        const businessClaim = this.props.businessClaim ? this.props.businessClaim : null;
        const businessClaimId = businessClaim ? businessClaim.id : null;
        this.context.executeAction(BusinessClaimActions.submitBusinessClaim, {businessClaimId});
    }
}

AddBusinessPage = connectToStores(AddBusinessPage, [
    'BusinessClaimStore'
], (context, props) => {
    return {
        businessClaim: props.businessClaimId && context.getStore('BusinessClaimStore').getById(props.businessClaimId)
    };
});

export default AddBusinessPage;

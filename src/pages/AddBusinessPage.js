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
            displayMap: false
        };
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {

        if (!this.props.businessClaim) {
            return (
                <Layout {...this.props}>
                    <mui.TextField
                        ref="name"
                        floatingLabelText="Nom du salon"
                        />
                    <br/>
                    <br/>
                    <mui.RadioButtonGroup ref="kind" name="kind" defaultSelected='SALON'>
                        <mui.RadioButton value="SALON" label="Salon"  />
                        <mui.RadioButton value="AT_HOME" label="À domicile" />
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
                    <mui.RaisedButton label='Suivant' secondary={true} onClick={this.save} />
                </Layout>
            );
        }
                
        let map = this.state.displayMap ? <MapForm ref="gps" defaultLocation={this.state.gps} /> : null;
        return (
            <Layout {...this.props}>
                <PlaceInput ref="place" />
                <br/>
                <mui.RaisedButton label='Utiliser cette addresse' secondary={true} onClick={this.getPlace} />
                <br/>
                {map}
                </br>
                <mui.RaisedButton label='Suivant' secondary={true} onClick={this.save} />
            </Layout>
        );
    }
    
    getPlace = () => {
        this.setState({
            address: this.refs.place.getHairfieFormattedAddress(),
            gps: this.refs.place.getLocation(),
            displayMap: true
        });
    }

    save = () => {
        const businessClaim = this.props.businessClaim ? this.props.businessClaim : null;
        const businessClaimId = businessClaim ? businessClaim.id : null;
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
        if (businessClaim) {            
            this.context.executeAction(BusinessClaimActions.updateBusinessClaim, { businessClaimId, values });
        }
        else {
            this.context.executeAction(BusinessClaimActions.createBusinessClaim, { values });
        }
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

'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper } from '../components/UIKit';
import { connectToStores } from 'fluxible-addons-react';
import Link, {FlatLink} from '../components/Link';
import BusinessActions from '../actions/BusinessActions';
import MapForm from '../components/MapForm';
import PlaceInput from '../components/PlaceInput';
import _ from 'lodash';


class AddressInputGroup extends React.Component {
    render () {
        const { address } = this.props;

        return (
            <Paper>
                <TextField ref="street" type="text" floatingLabelText="Numéro et nom de voie" value={address.street} />
                <TextField ref="city" type="text" floatingLabelText="Ville" value={address.city} />
                <TextField ref="zipCode" type="text" floatingLabelText="Code postal" value={address.zipCode} />
                <div className="clearfix" />
            </Paper>
        );
    }

    getAddress() {
        return {
            street  : this.refs.street.getValue(),
            city    : this.refs.city.getValue(),
            zipCode : this.refs.zipCode.getValue(),
            country : 'FR'
        };
    }
}

class BusinessMapPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            address: props.business.address,
            gps: props.business.gps
        };
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { business } = this.props;

        return (
            <Layout ref="layout" {...this.props}>
                <h1>Adresse & Carte</h1>
                <Paper>
                    <h5>Recherche Google</h5>
                    <PlaceInput ref="place" {...this.props} />
                    <FlatButton label="Remplacer la localisation et l'adresse par ce lieu" onClick={this.getPlace} />
                </Paper>
                <br />
                <AddressInputGroup address={this.state.address} ref="address" />
                <br />
                <MapForm ref="gps" defaultLocation={this.state.gps} />
                <FlatButton label='Sauver les modifications' onClick={this.save} />
                {' ou '}
                <FlatLink route="business" params={{ businessId: business.id }} label='Annuler' />
            </Layout>
        );
    }

    save = () => {
        const businessId = this.props.businessId;

        const values = {
            address: this.refs.address.getAddress(),
            gps: this.refs.gps.getLocation()
        };

        this.context.executeAction(BusinessActions.updateInfos, { businessId, values });
    }

    getPlace = () => {
        this.setState({
            address: this.refs.place.getHairfieFormattedAddress(),
            gps: this.refs.place.getLocation()
        });
    }
}

BusinessMapPage = connectToStores(BusinessMapPage, [
    'BusinessStore'
], (stores, props) => ({
    business : stores.BusinessStore.getById(props.businessId)
}));

export default BusinessMapPage;

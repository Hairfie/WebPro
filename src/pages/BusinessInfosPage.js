'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup } from '../components/UIKit';
import { connectToStores } from 'fluxible/addons';
import Link, {FlatLink} from '../components/Link';
import BusinessActions from '../actions/BusinessActions';
import _ from 'lodash';

class BusinessInfosPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { business } = this.props;

        return (
            <Layout ref="layout" {...this.props}>
                <h1>Infos</h1>
                <TextField
                    ref="name"
                    floatingLabelText="Nom du Salon"
                    defaultValue={business.name}
                    />
                <br />
                <TextField
                    ref="phoneNumber"
                    floatingLabelText="Numéro de téléphone"
                    defaultValue={business.phoneNumber}
                    type="tel"
                    />
                <br />
                <Checkbox
                    ref="men"
                    label="Homme"
                    defaultSwitched={business.men}
                    />
                <Checkbox
                    ref="women"
                    label="Femme"
                    defaultSwitched={business.women}
                    />
                <Checkbox
                    ref="children"
                    label="Enfant"
                    defaultSwitched={business.children}
                    />
                <br />
                <RadioButtonGroup ref="kind" name="kind" defaultSelected={business.kind} valueSelected={business && business.kind}>
                    <RadioButton value="SALON" label="Salon de coiffure"  />
                    <RadioButton value="HOME" label="Coiffeur à domicile" />
                </RadioButtonGroup>
                <br />
                <FlatButton label='Sauver les modifications' onClick={this.save} />
                {' ou '}
                <FlatLink route="business" params={{ businessId: business.id }} label='Annuler' />
            </Layout>
        );
    }

    save = () => {
        const businessId = this.props.businessId;

        const values = {
            name:           this.refs.name.getValue(),
            men:            this.refs.men.isChecked(),
            women:          this.refs.women.isChecked(),
            children:       this.refs.children.isChecked(),
            kind:           this.refs.kind.getSelectedValue(),
            phoneNumber:    this.refs.phoneNumber.getValue(),
            //address = this.refs.address.getAddress();
            //gps = this.refs.address.getGps();
            //description = this.refs.description.getDescription();
        };

        this.context.executeAction(BusinessActions.updateInfos, { businessId, values });
    }
}

BusinessInfosPage = connectToStores(BusinessInfosPage, [
    'BusinessStore'
], (stores, props) => ({
    business : stores.BusinessStore.getById(props.businessId)
}));

export default BusinessInfosPage;

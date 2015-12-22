'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link from '../components/Link';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper, Menu, Dialog, TimePicker } from '../components/UIKit';
import BusinessServiceActions from '../actions/BusinessServiceActions';

class BusinessServicePage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    static defaultProps = {
        businessService: {
        	durationMinutes: 60,
        	price: {
        		amount: 20,
        		currency: 'EUR'
        	},
        	label: "Shampoing Coupe Brushing"
        }
    }

    render() {
        const businessId = this.props.businessId || this.props.businessService.businessId;
        const businessService = this.props.businessService || {};

        return (
            <Layout {...this.props}>
                <TextField
                    ref="label"
                    floatingLabelText="Description du Service"
                    defaultValue={businessService.label}
                    />
                <br />
                <Checkbox name="gender" ref="isWomanClassicPrice" label="Shampoing Coupe Brushing Femme"/>
                <br />
                <Checkbox name="gender" ref="isManClassicPrice" label="Shampoing Coupe Brushing Homme"/>
                <br />
                <TextField
                    ref="durationMinutes"
                    floatingLabelText="Durée (en minutes)"
                    type="number"
                    defaultValue={businessService.durationMinutes}
                    />
                <br />
                <TextField
                    ref="amount"
                    floatingLabelText="Prix (en €)"
                    type="number"
                    defaultValue={businessService.price.amount}
                    />
                <br />
                <RadioButtonGroup ref="gender" name="discount" defaultSelected={businessService.gender || ""} >
                    <RadioButton value="FEMALE" label="Prix Femme" />
                    <RadioButton value="MALE" label="Prix Homme" />
                    <RadioButton value="" label="Non défini" />
                </RadioButtonGroup>
                <br />
                {this.renderActionButtons()}
            </Layout>
        );
    }

    renderActionButtons = () => {
        const businessId = this.props.businessId || this.props.businessService.businessId;
        const businessService = this.props.businessService || {};

        if(businessService.id) {
            return (
                <div>
                    <Link route="business_services" params={{ businessId }}>Annuler</Link>
                    {' ou '}
                    <FlatButton label='Sauver les modifications' onClick={this.save} />
                </div>
            );
        } else {
            return (
                <div>
                    <Link route="business_services" params={{ businessId }}>Annuler</Link>
                    {' ou '}
                    <FlatButton label='Ajouter' onClick={this.save} />
                </div>
            );
        }
    }

    save = () => {
        const businessId = this.props.businessId || this.props.businessService.businessId;
        const businessServiceId = this.props.businessService.id;

        const values = {
            label       : this.refs.label.getValue(),
            durationMinutes    : this.refs.durationMinutes.getValue(),
            price       :  {
            	amount: this.refs.amount.getValue(),
            	currency: 'EUR'
            }
        };

        values['isManClassicPrice'] = this.refs.isManClassicPrice.isChecked();
        values['isWomanClassicPrice'] = this.refs.isWomanClassicPrice.isChecked();

        values['gender'] = this.refs.gender.getSelectedValue();

        if (businessServiceId) {
            this.context.executeAction(BusinessServiceActions.updateService, { businessServiceId, values });
        } else {
            this.context.executeAction(BusinessServiceActions.createService, { businessId, values });
        }
    }

    delete = () => {
        const businessId = this.props.businessId || this.props.businessService.businessId;
        const businessServiceId = this.props.businessService.id;

        this.context.executeAction(BusinessServiceActions.deleteService, { businessServiceId, businessId });
    }
}

BusinessServicePage = connectToStores(BusinessServicePage, [
    'BusinessServiceStore'
], (context, props) => {
    return {
        businessService: props.businessServiceId && context.getStore('BusinessServiceStore').getById(props.businessServiceId)
    };
});

export default BusinessServicePage;

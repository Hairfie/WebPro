'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper, RaisedButton } from '../components/UIKit';
import { connectToStores } from 'fluxible-addons-react';
import Link, {FlatLink, RaisedLink} from '../components/Link';
import BusinessActions from '../actions/BusinessActions';
import _ from 'lodash';

class DescriptionInputGroup extends React.Component {
    render() {
        const {defaultDescription} = this.props;
        const description = defaultDescription || {};

        return (
            <div>
                <div>
                    <TextField ref="geoTitle" type="text"
                        floatingLabelText="Localisation (titre)"
                        defaultValue={description.geoTitle} />
                    <TextField ref="geoText" type="textarea"
                        floatingLabelText="Localisation (paragraphe)"
                        multiLine={true}
                        defaultValue={description.geoText} />
                </div>
                <div>
                    <TextField ref="proTitle" type="text"
                        floatingLabelText="Coiffeurs & Spécialités (titre)"
                        defaultValue={description.proTitle} />
                    <TextField ref="proText" type="textarea"
                        floatingLabelText="Coiffeurs & Spécialités (paragraphe)"
                        multiLine={true}
                        defaultValue={description.proText} />
                </div>
                <div>
                    <TextField ref="businessTitle" type="text"
                        floatingLabelText="Salon (titre)"
                        defaultValue={description.businessTitle} />
                    <TextField ref="businessText" type="textarea"
                        floatingLabelText="Salon (parapgraphe)"
                        multiLine={true}
                        defaultValue={description.businessText} />
                </div>
            </div>
        );
    }

    getDescription() {
        return {
            geoTitle  : this.refs.geoTitle.getValue(),
            geoText    : this.refs.geoText.getValue(),
            proTitle : this.refs.proTitle.getValue(),
            proText : this.refs.proText.getValue(),
            businessTitle : this.refs.businessTitle.getValue(),
            businessText : this.refs.businessText.getValue()
        };
    }
}

class BusinessInfosPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { business } = this.props;

        return (
            <Layout ref="layout" {...this.props}>
                <Paper>
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
                    defaultChecked={business.men}
                    />
                <Checkbox
                    ref="women"
                    label="Femme"
                    defaultChecked={business.women}
                    />
                <Checkbox
                    ref="children"
                    label="Enfant"
                    defaultChecked={business.children}
                    />
                <br />
                <RadioButtonGroup ref="kind" name="kind" defaultSelected={business.kind} valueSelected={business && business.kind}>
                    <RadioButton value="SALON" label="Salon de coiffure"  />
                    <RadioButton value="HOME" label="Coiffeur à domicile" />
                </RadioButtonGroup>
                <br />
                <TextField ref="labels" type="text"
                    floatingLabelText="Labels (séparés par des vigules)"
                    defaultValue={business.labels ? business.labels.join(',') : ''} />
                <br />
                <div className="clearfix" />
                <DescriptionInputGroup description={business.description} defaultDescription={business.description} ref="description"/>
                <br />
                <RaisedButton label='Sauver les modifications' onClick={this.save} fullWidth={true} primary={true} />
                <br /><br />
                <RaisedLink route="business" params={{ businessId: business.id }} label='Annuler' fullWidth={true} />
                </Paper>
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
            description:    this.refs.description.getDescription(),
            labels:         _.map(this.refs.labels.getValue().split(','), label => label.trim())
        };

        this.context.executeAction(BusinessActions.updateInfos, { businessId, values });
    }
}

BusinessInfosPage = connectToStores(BusinessInfosPage, [
    'BusinessStore'
], (context, props) => ({
    business : context.getStore('BusinessStore').getById(props.businessId)
}));

export default BusinessInfosPage;

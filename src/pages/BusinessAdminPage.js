'use strict';

import React from 'react';
import _ from 'lodash';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import { Checkbox, FlatButton, RadioButton, RadioButtonGroup, RaisedButton } from '../components/UIKit';
import Link, {FlatLink, RaisedLink} from '../components/Link';
import BusinessActions from '../actions/BusinessActions';

class BusinessAdminPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { businessId, business } = this.props;
        return (
            <Layout {...this.props}>
                <h5>
                    Gestion du compte du salon.
                </h5>
                <RadioButtonGroup ref="accountType" name="accountType" defaultSelected={business.accountType} valueSelected={business && business.accountType}>
                    <RadioButton value="FREE" label="FREE"  />
                    <RadioButton value="BASIC" label="BASIC" />
                    <RadioButton value="PREMIUM" label="PREMIUM" />
                </RadioButtonGroup>
                <br/>
                Prise de RDV:
                <RadioButtonGroup ref="isBookable" name="isBookable" label="" defaultSelected={business.isBookable} valueSelected={business && business.isBookable}>
                    <RadioButton value={true} label="Oui"  />
                    <RadioButton value={false} label="Non" />
                </RadioButtonGroup>
                <RaisedButton label='Sauver les modifications' onClick={this.save} fullWidth={true} primary={true} />
                <br /><br />
                <RaisedLink route="business" params={{ businessId: business.id }} label='Annuler' fullWidth={true} />
            </Layout>
        );
    }

    save = () => {
        const businessId = this.props.businessId;

        const values = {
            accountType : this.refs.accountType.getSelectedValue(),
            bookable  : this.refs.isBookable.getSelectedValue()
        };

        this.context.executeAction(BusinessActions.updateInfos, { businessId, values });
    }
}

BusinessAdminPage = connectToStores(BusinessAdminPage, [
    'CategoryStore',
], (context, props) => ({
    business : context.getStore('BusinessStore').getById(props.businessId)
}));

export default BusinessAdminPage;
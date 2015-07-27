'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link, {FlatLink} from '../components/Link';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper, Menu, Dialog, TimePicker } from '../components/UIKit';
import BusinessServiceActions from '../actions/BusinessServiceActions';

class Service extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { service: { id, durationMinutes, label, price } } = this.props;

        return (
            <div style={{ margin: '10px', padding: '10px' }}>
                {`${label} - ${price.amount}€ - ${durationMinutes} min`}
                <FlatButton label="Supprimer" onClick={this.delete} />
                <FlatLink route="edit_business_service" params={{ businessServiceId: id }}>
                    Modifier
                </FlatLink>
                <div style={{ clear: 'both' }}>&nbsp;</div>
            </div>
        );
    }

    delete = () => {
        const { service: { id }, businessId } = this.props;
        const businessServiceId = id;
        this.context.executeAction(BusinessServiceActions.deleteService, { businessServiceId, businessId });
    }
}

class BusinessServicesPage extends React.Component {
    render() {
        const { businessId, services} = this.props;
        return (
            <Layout {...this.props}>
                <h1>Tarifs</h1>
                <Link route="new_business_service" params={{ businessId }}>Ajouter un service</Link>
                {_.map(services, service => <Service key={service.id} {...{ service, businessId }} />)}
            </Layout>
        );
    }
}

BusinessServicesPage = connectToStores(BusinessServicesPage, [
    'BusinessServiceStore'
], (stores, props) => {

    return {
        services : stores.BusinessServiceStore.getAllByBusinessId(props.businessId)
    };
});

export default BusinessServicesPage;

'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link, {FlatLink} from '../components/Link';
import { ArrowUp, ArrowDown, FloatingActionButton, FlatButton, RaisedButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper, Menu, Dialog, TimePicker } from '../components/UIKit';
import BusinessServiceActions from '../actions/BusinessServiceActions';

class Service extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { service: { id, durationMinutes, label, price, position } } = this.props;
        return (
            <div className="business-service">
                <div className="bs-infos">
                    {`${label} - ${price.amount} € - position: ${position}`}
                </div>
                <div className="bs-buttons">
                    <FlatButton label="Supprimer" onClick={this.delete} />
                    <FlatLink route="edit_business_service" params={{ businessServiceId: id }}>
                        Modifier
                    </FlatLink>
                    <FloatingActionButton secondary={true} mini={true} onClick={this.positionChange.bind(this, 'up')}>
                        <ArrowUp />
                    </FloatingActionButton>
                    <FloatingActionButton secondary={true} mini={true} onClick={this.positionChange.bind(this, 'down')}>
                        <ArrowDown />
                    </FloatingActionButton>
                </div>
                <div style={{ clear: 'both' }}>&nbsp;</div>
            </div>
        );
    }

    delete = () => {
        const { service: { id }, businessId } = this.props;
        const businessServiceId = id;
        this.context.executeAction(BusinessServiceActions.deleteService, { businessServiceId, businessId });
    }
    positionChange = (direction) => {
        const {service: {id, position}} = this.props;
        const businessServiceId = id;
        const values = direction == 'up' ? {position: position - 1} : {position: position + 1};
        if (values.position < 1) values.position = 1;
        this.context.executeAction(BusinessServiceActions.updateService, { businessServiceId, values });
    }
}

class BusinessServicesPage extends React.Component {
    render() {
        const { businessId, services} = this.props;
        const sortedServices = _.groupBy(_.sortBy(services, 'position'), 'gender');
        return (
            <Layout {...this.props}>
                <h1>Tarifs</h1>
                <Link route="new_business_service" params={{ businessId }}>Ajouter un service</Link>
                <h4>FEMME</h4>
                {_.map(sortedServices['FEMALE'], service => {
                    return <Service key={service.id} {...{ service, businessId }} />
                })}
                <h4>HOMME</h4>
                {_.map(sortedServices['MALE'], service => {
                    return <Service key={service.id} {...{ service, businessId }} />
                })}
                <h4>TOUT LE MONDE</h4>
                {_.map(sortedServices[''], service => {
                    return <Service key={service.id} {...{ service, businessId }} />
                })}
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

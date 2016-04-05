'use strict';

import React from 'react';
import Layout from '../../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link, {FlatLink, RaisedLink} from '../../components/Link';
import { RadioButtonGroup, RadioButton, DropDownMenu, MenuItem, FlatButton, Table, Paper, RaisedButton, Dialog, TextField, CircularProgress, Center, Checkbox } from '../../components/UIKit';

class BusinessInfos extends React.Component {
    constructor(props) {
        super(props);
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        console.log('PROPS.BUSINESS', this.props.business);
        const { business } = this.props;

        if (!this.props.businessId) return <span/>;
        else if (this.props.businessId.length < 36 || !this.props.business) 
            return (
                <Paper>
                    ID de salon invalide
                </Paper>
            );
        return (
            <Paper {...this.props}>
                <div>{`Salon: ${business.name}`}</div>
                <div>{`Adresse: ${business.address.street}, ${business.address.zipCode}, ${business.address.city}`}</div>
            </Paper>
        );
    }

}

BusinessInfos = connectToStores(BusinessInfos, [
    'BusinessStore'
], (context, props) => {
    console.log('PROPS', props);
    const business = props.businessId && props.businessId.length == 36 ? context.getStore('BusinessStore').getById(props.businessId) : null;
    return {
        business: business
    };
});

export default BusinessInfos;
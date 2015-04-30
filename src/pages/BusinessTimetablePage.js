'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper } from '../components/UIKit';
import { connectToStores } from 'fluxible/addons';
import Link, {FlatLink} from '../components/Link';
import BusinessActions from '../actions/BusinessActions';
import _ from 'lodash';

class BusinessTimetablePage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        const {business} = this.props;

        return (
            <Layout {...this.props}>
                <h1>Horaires</h1>

                <FlatLink route="business" params={{ businessId: business.id }} label='Annuler' />
            </Layout>
        );
    }

    save = () => {

    }
}

BusinessTimetablePage = connectToStores(BusinessTimetablePage, [
    'BusinessStore'
], (stores, props) => {
    return {
        business : stores.BusinessStore.getById(props.businessId)
    };
});

export default BusinessTimetablePage;

import React from "react";
import Layout from '../components/Layout';

import Link from '../components/Link';

import { connectToStores } from 'fluxible/addons';

class BusinessPage extends React.Component {

  render() {
    return (
        <Layout>
            <h1>{this.props.business.name}</h1>
        </Layout>
    );
  }

}

BusinessPage = connectToStores(BusinessPage, [
    'BusinessStore'
], (stores, props) => ({
    business: stores.BusinessStore.getById(props.businessId)
}));

export default BusinessPage;

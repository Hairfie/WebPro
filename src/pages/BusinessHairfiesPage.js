import React from "react";
import Layout from '../components/Layout';

import Link from '../components/Link';

import { connectToStores } from 'fluxible-addons-react';

class BusinessHairfiesPage extends React.Component {

  render() {
    console.log(this.props);
    if (!this.props.business) return null;
    return (
        <Layout {...this.props}>
            <h1>{this.props.business.name}</h1>
            <p>Ceci est la HairfiePage</p>
        </Layout>
    );
  }

}

BusinessHairfiesPage = connectToStores(BusinessHairfiesPage, [
    'BusinessStore',
    'HairfieStore'
], (context, props) => ({
    business: context.getStore('BusinessStore').getById(props.businessId),
    hairfies: context.getStore('HairfieStore').getByBusiness(props.businessId),
    page: context.getStore('HairfieStore').getBusinessPage(props.businessId)
}));

export default BusinessHairfiesPage;

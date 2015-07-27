import React from "react";
import Layout from '../components/Layout';

import Link from '../components/Link';

import { connectToStores } from 'fluxible-addons-react';

class DashboardPage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <h1>Mes salons</h1>
            <ul>
                {this.props.businesses.map(business => (
                    <li key={business.id}>
                        <Link route="business" params={{businessId: business.id}}>
                            {business.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </Layout>
    );
  }

}

DashboardPage = connectToStores(DashboardPage, [
    'AuthStore',
    'BusinessStore',
    'UserBusinessStore'
], (context, props) => {
    const userId = context.getStore('AuthStore').getUserId();
    const businessIds = context.getStore('UserBusinessStore').getIds(userId);

    return {
        businesses: context.getStore('BusinessStore').getByIds(businessIds)
    }
});

export default DashboardPage;

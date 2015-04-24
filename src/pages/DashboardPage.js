import React from "react";
import Layout from '../components/Layout';

import { connectToStores } from 'fluxible/addons';

class DashboardPage extends React.Component {

  render() {
    return (
        <Layout>
            <h1>Mes salons</h1>
            <ul>
                {this.props.businesses.map(business => (
                    <li key={business.id}>
                        {business.name}
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
], stores => {
    const userId = stores.AuthStore.getUserId();
    const businessIds = stores.UserBusinessStore.getIds(userId);

    return {
        businesses: stores.BusinessStore.getByIds(businessIds)
    }
});

export default DashboardPage;

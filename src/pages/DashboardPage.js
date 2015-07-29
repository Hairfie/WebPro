import React, { PropTypes } from 'react';
import Layout from '../components/Layout';

import Link from '../components/Link';
import { List, ListItem} from '../components/UIKit';


import { navigateAction } from 'flux-router-component';
import { connectToStores } from 'fluxible-addons-react';

class DashboardPage extends React.Component {
    static contextTypes = {
        executeAction: PropTypes.func.isRequired
    }

    render() {
        return (
            <Layout {...this.props}>
                <h1>Mes salons</h1>
                <List desktop={true} width={320}>
                    {this.props.businesses.map(business => (
                        <ListItem primaryText={business.name} onItemTouchTap={this._onItemTouchTap.bind(this, business)} />
                    ))}
                </List>
            </Layout>
        );
    }

    _onItemTouchTap(e, business) {
        this.context.executeAction(navigateAction, {url: this.context.makePath("business", {businessId: business.id})});
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

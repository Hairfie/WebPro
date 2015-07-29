import React, { PropTypes } from 'react';
import _ from 'lodash';
import Layout from '../components/Layout';

import Link from '../components/Link';
import { List, ListItem} from '../components/UIKit';
import Image from '../components/Image';

import { navigateAction } from 'flux-router-component';
import { connectToStores } from 'fluxible-addons-react';

class DashboardPage extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired,
    }

    render() {

        return (
            <Layout {...this.props}>
                <h1>Mes salons</h1>
                <List desktop={true} width={320}>
                    {_.map(this.props.businesses, business => this.renderBusiness(business))}
                </List>
            </Layout>
        );
    }

    renderBusiness(business) {
        const options = { width: 45, height: 45, crop: 'thumb' };
        const avatar = <Image image={_.last(business.pictures)} options={options} placeholder="/assets/placeholder-55.png" />

        return (
            <ListItem
                leftAvatar={avatar}
                primaryText={business.name}
                secondaryText={
                    <p>
                      {`${business.address.street} ${business.address.zipCode} ${business.address.city}`}
                    </p>
                }
                secondaryTextLines={2}
                onClick={this._onTouchStart.bind(this, business)} />
        );
    }

    _onTouchStart(business) {
        const url = this.context.makePath("business", {businessId: business.id});
        this.context.executeAction(navigateAction, {url: url});
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

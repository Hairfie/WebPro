import React, { PropTypes } from 'react';
import { connectToStores } from 'fluxible/addons';
import { MenuItem, LeftNav } from '../UIKit.js';
import _ from 'lodash';
import { navigateAction } from 'flux-router-component';

const menuItems = [
    { route: 'dashboard', text: 'Mes salons', authRequired: true },
    { route: 'login', text: 'Login', authRequired: false },
    { type: MenuItem.Types.LINK, payload: 'http://www.hairfie.com', text: 'Site Hairfie', authRequired: false },
];

class AppLeftNav extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired
    }

    render() {
        var header = <div className="logo" onClick={this._onHeaderClick.bind(this)}>Hairfie</div>;
        let menuItemsToDisplay = this.isAuthenticated() ? menuItems : _.reject(menuItems, 'authRequired');
        menuItemsToDisplay = menuItemsToDisplay.concat(this.businessMenuItems());

        return (
            <LeftNav
                ref="leftNav"
                docked={false}
                header={header}
                menuItems={menuItemsToDisplay}
                onChange={this._onLeftNavChange.bind(this)} />
        );
    }

    businessMenuItems() {
        const business = this.context.getStore('BusinessStore').getById(this.props.businessId);
        if(!business) return [];

        return [
            { route: 'business', text: business.name, params: {businessId: business.id}, authRequired: true },
            { route: 'business_pictures', text: 'Photos', params: {businessId: business.id}, authRequired: true },
            { route: 'business_infos', text: 'Infos', params: {businessId: business.id}, authRequired: true },
            { route: 'business_members', text: 'Équipe', params: {businessId: business.id}, authRequired: true },
        ];
    }

    isAuthenticated() {
        return (this.context.getStore('AuthStore').getToken() != null);
    }

    toggle() {
        this.refs.leftNav.toggle();
    }

    _onLeftNavChange(e, key, payload) {
        this.context.executeAction(navigateAction, {url: this.context.makePath(payload.route, payload.params)});
    }

    _onHeaderClick() {
        this.context.executeAction(navigateAction, {url: this.context.makePath("home")});
        this.refs.leftNav.close();
    }
}

export default AppLeftNav;
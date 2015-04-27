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

    isAuthenticated() {
        return (this.context.getStore('AuthStore').getToken() != null);
    }

    render() {
        var header = <div className="logo" onClick={this._onHeaderClick.bind(this)}>Hairfie</div>;
        const menuItemsToDisplay = this.isAuthenticated() ? menuItems : _.reject(menuItems, 'authRequired');

        return (
            <LeftNav
                ref="leftNav"
                docked={false}
                header={header}
                menuItems={menuItemsToDisplay}
                onChange={this._onLeftNavChange.bind(this)} />
        );
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

// AppLeftNav = connectToStores(AppLeftNav, [
//     'BusinessStore'
// ], (stores, props) => ({
//     business: stores.BusinessStore.getById(props.businessId)
// }));

export default AppLeftNav;
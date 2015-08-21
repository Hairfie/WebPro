import React, { PropTypes } from 'react';
import { MenuItem, LeftNav } from '../UIKit.js';
import _ from 'lodash';
import { navigateAction } from 'fluxible-router';
import AuthActions from '../../actions/AuthActions';
import Permissions from '../../constants/Permissions';

import mui from 'material-ui';
import { Styles } from 'material-ui';
let { Colors, Spacing, Typography } = Styles;

class AppLeftNav extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired,
        getStore: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            user : {},
            isAuthenticated : false,
            isImpersonated : false,
            business : {}
        };
    }

    componentWillMount() {
        this.context.getStore('AuthStore').addChangeListener(this.onStoreChange);
        this.context.getStore('UserStore').addChangeListener(this.onStoreChange);
        this.context.getStore('BusinessStore').addChangeListener(this.onStoreChange);
        this.setState(this.getStateFromStores());
    }

    componentWillUnmount() {
        this.context.getStore('AuthStore').removeChangeListener(this.onStoreChange);
        this.context.getStore('UserStore').removeChangeListener(this.onStoreChange);
        this.context.getStore('BusinessStore').removeChangeListener(this.onStoreChange);
    }

    onStoreChange = () => {
        this.setState(this.getStateFromStores());
    }

    getStateFromStores() {
        const user =  this.context.getStore('UserStore').getById(this.context.getStore('AuthStore').getUserId()) || {};
        const isAuthenticated = (this.context.getStore('AuthStore').getToken() != null);
        const business = this.context.getStore('BusinessStore').getById(this.props.businessId);

        return {
            user : user,
            isImpersonated : this.context.getStore('AuthStore').isImpersonated(),
            isAuthenticated: isAuthenticated,
            business : business
        };
    }

    getHeaderStyles() {
        return {
            cursor: 'pointer',
            fontSize: '24px',
            color: Typography.textFullWhite,
            height: Spacing.desktopKeylineIncrement + 'px',
            fontWeight: Typography.fontWeightLight,
            backgroundColor: Colors.red400,
            //paddingLeft: Spacing.desktopGutter,
            paddingTop: '14px',
            marginBottom: '8px'
        };
    }

    render() {
        const { isAuthenticated } = this.state;

        var header = (
            <div className="logo"
                style={this.getHeaderStyles()}
                onClick={this._onHeaderClick.bind(this)}>
                <img src="/assets/logo@2x.png" style={{width: 110, height: 36, display: 'block', margin: 'auto'}}/>
            </div>
        );

        let menuItemsToDisplay = this.getBusinessMenuItems()
        menuItemsToDisplay = menuItemsToDisplay.concat(this.getAdminMenuItems());
        menuItemsToDisplay = menuItemsToDisplay.concat(this.getUserMenuItems());
        menuItemsToDisplay = menuItemsToDisplay.concat(this.getGenericMenuItems());

        return (
            <LeftNav
                ref="leftNav"
                docked={false}
                header={header}
                menuItems={menuItemsToDisplay}
                onChange={this._onLeftNavChange.bind(this)} />
        );
    }

    getBusinessMenuItems() {
        const { business, isAuthenticated } = this.state;

        if (!isAuthenticated) {
            return [];
        }

        let items = [{ route: 'dashboard', text: 'Tous mes salons'}];

        if(!business) return items;

        const nestedStyle = this.getNesteditemStyle();

        return items.concat([
            { route: 'business', text: business.name, params: {businessId: business.id} },
            { route: 'business_pictures', text: '-> Photos', params: {businessId: business.id}},
            { route: 'business_infos', text: '-> Infos', params: {businessId: business.id} },
            { route: 'business_map', text: '-> Adresse & GPS', params: {businessId: business.id} },
            { route: 'business_members', text: '-> Équipe', params: {businessId: business.id} },
            { route: 'business_timetable', text: '-> Horaires & Promos', params: {businessId: business.id} },
            { route: 'business_services', text: '-> Tarifs', params: {businessId: business.id} }
        ]);
    }

    getGenericMenuItems() {
        return [
            {
                text: 'Autres liens',
                type: MenuItem.Types.SUBHEADER
            },
            { type: MenuItem.Types.LINK, payload: 'http://www.hairfie.com', text: 'Retour au site', authRequired: false },
        ];
    }

    getUserMenuItems() {
        const { user, isImpersonated, isAuthenticated } = this.state;

        const AuthStore = this.context.getStore('AuthStore');

        if (!isAuthenticated) {
            return [{ route: 'login', text: 'Connexion'}];
        }

        var items = [{
            text: user.firstName + ' ' + user.lastName,
            type: MenuItem.Types.SUBHEADER
        }];

        items.push({
            text: 'Se déconnecter',
            route: 'logout'
        });

        return items;
    }

    getAdminMenuItems() {
        const { user, isImpersonated, isAuthenticated } = this.state;

        const AuthStore = this.context.getStore('AuthStore');

        if (!isAuthenticated) {
            return [];
        }
        let items = [{
            text: 'Admin',
            type: MenuItem.Types.SUBHEADER
        }];

        if (isImpersonated) {
            items.push({
                text: 'Rendre la main',
                route: 'repersonate_token'
            });
        }

        if (AuthStore.hasPermission(Permissions.IMPERSONATE_TOKEN)) {
            items.push({
                text: 'Prendre la main',
                route: 'impersonate_token'
            });
        }

        if (AuthStore.hasPermission(Permissions.IMPERSONATE_TOKEN)) {
            items.push({
                text: 'Rechercher un salon',
                route: 'business_search'
            });
        }

        if (AuthStore.hasPermission(Permissions.IMPERSONATE_TOKEN)) {
            items.push({
                text: 'Réservations',
                route: 'bookings'
            });
        }

        return items;
    }

    getNesteditemStyle() {
        return {
            backgroundColor: 'red'
        };
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

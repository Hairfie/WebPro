import React, { PropTypes } from 'react';
import { MenuItem, LeftNav } from '../UIKit.js';
import _ from 'lodash';
import { navigateAction } from 'flux-router-component';
import AuthActions from '../../actions/AuthActions';
import Permissions from '../../constants/Permissions';

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

    render() {
        const { isAuthenticated } = this.state;

        var header = <div className="logo" onClick={this._onHeaderClick.bind(this)}>Hairfie</div>;
        let menuItemsToDisplay = isAuthenticated ? menuItems : _.reject(menuItems, 'authRequired');
        menuItemsToDisplay = menuItemsToDisplay.concat(this.businessMenuItems());
        menuItemsToDisplay = menuItemsToDisplay.concat(this.getUserMenuItems());

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
        const { business } = this.state;
        if(!business) return [];

        return [
            { route: 'business', text: business.name, params: {businessId: business.id}, authRequired: true },
            { route: 'business_pictures', text: 'Photos', params: {businessId: business.id}, authRequired: true },
            { route: 'business_infos', text: 'Infos', params: {businessId: business.id}, authRequired: true },
            { route: 'business_map', text: 'Adresse & GPS', params: {businessId: business.id}, authRequired: true },
            { route: 'business_members', text: 'Équipe', params: {businessId: business.id}, authRequired: true },
            { route: 'business_timetable', text: 'Horaires & Promos', params: {businessId: business.id}, authRequired: true },
            { route: 'business_services', text: 'Tarifs', params: {businessId: business.id}, authRequired: true }
        ];
    }

    getUserMenuItems() {
        const { user, isImpersonated, isAuthenticated } = this.state;

        const AuthStore = this.context.getStore('AuthStore');

        if (!isAuthenticated) {
            return [];
        }


        var items = [{ text: user.firstName+' '+user.lastName, type: MenuItem.Types.SUBHEADER }];

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

        items.push({
            text: 'Se déconnecter',
            route: 'logout'
        });

        return items;
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
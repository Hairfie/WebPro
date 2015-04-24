import React, { PropTypes } from 'react';
import { MenuItem, LeftNav } from '../UIKit.js';
import { navigateAction } from 'flux-router-component';

const menuItems = [
    { route: 'dashboard', text: 'Dashboard' },
    { route: 'login', text: 'Login' },
    { type: MenuItem.Types.LINK, payload: 'http://www.hairfie.com', text: 'Site Hairfie' },
];

export default class AppLeftNav extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired
    }

    render() {
        var header = <div className="logo" onClick={this._onHeaderClick.bind(this)}>Hairfie</div>;

        return (
            <LeftNav
                ref="leftNav"
                docked={false}
                header={header}
                menuItems={menuItems}
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

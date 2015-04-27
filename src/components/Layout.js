import React from 'react';
import {AppCanvas, AppBar} from './UIKit';
import AppLeftNav from './layout/AppLeftNav';
import { connectToStores } from "fluxible/addons";

if (process.env.BROWSER) {
    require("../style/Layout.scss");
}

class Layout extends React.Component {

    render() {
        const { children } = this.props;

        return (
            <AppCanvas>
                <AppBar
                    className="mui-dark-theme"
                    title="Backoffice"
                    onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap.bind(this)}
                    zDepth={0}>
                    {this.renderUser()}
                </AppBar>

                <AppLeftNav ref="leftNav" />
                <div className="full-width-section">
                    {children}
                </div>
            </AppCanvas>
        );
    }

    renderUser() {
        if (!this.props.user) return;

        return `Bonjour ${this.props.user.firstName} !`;
    }

    _onMenuIconButtonTouchTap() {
        this.refs.leftNav.toggle();
    }
}

Layout = connectToStores(Layout, ['AuthStore', 'UserStore'], stores => ({
    user: stores.UserStore.get(stores.AuthStore.getUserId())
}));

export default Layout;

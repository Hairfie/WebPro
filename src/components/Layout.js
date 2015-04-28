import React from 'react';
import {AppCanvas, AppBar} from './UIKit';
import AppLeftNav from './layout/AppLeftNav';

if (process.env.BROWSER) {
    require("../style/Layout.scss");
    require("../style/Page.scss");
}

class Layout extends React.Component {

    render() {
        const { children } = this.props;

        return (
            <AppCanvas>
                <AppBar
                    className="mui-dark-theme"
                    title="Espace Coiffeur"
                    onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap.bind(this)}
                    zDepth={0} />

                <AppLeftNav ref="leftNav" {...this.props} />
                <div className="page-with-nav">
                    {children}
                </div>
            </AppCanvas>
        );
    }

    _onMenuIconButtonTouchTap() {
        this.refs.leftNav.toggle();
    }
}

export default Layout;

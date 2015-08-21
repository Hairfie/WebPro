import React from 'react';
import {AppCanvas, AppBar} from './UIKit';
import mui from 'material-ui';
import AppLeftNav from './layout/AppLeftNav';
import { connectToStores } from 'fluxible-addons-react';
import ApplicationStore from '../stores/ApplicationStore';

let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

if (process.env.BROWSER) {
    require("../style/Layout.scss");
    require("../style/Page.scss");
}

class Layout extends React.Component {
    render() {
        const { children, title } = this.props;

        return (
            <AppCanvas>
                <AppBar
                    title={title}
                    onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap.bind(this)}
                    zDepth={0}
                    className="appbar" />

                <AppLeftNav ref="myLeftNav" {...this.props} />
                <div className="page-with-nav">
                    {children}
                </div>
            </AppCanvas>
        );
    }

    _onLeftIconButtonTouchTap() {
        this.refs.myLeftNav.toggle();
    }
}

Layout = connectToStores(Layout, [
    'ApplicationStore'
], (context, props) => ({
    title : context.getStore('HtmlHeadStore').getTitle()
}));

export default Layout;

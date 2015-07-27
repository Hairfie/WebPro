import React from 'react';
import {AppCanvas, AppBar} from './UIKit';
import mui from 'material-ui';
import AppLeftNav from './layout/AppLeftNav';

let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

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
                    title="Espace Coiffeur"
                    onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap.bind(this)}
                    zDepth={0} />

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

export default Layout;

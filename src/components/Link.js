import React, { PropTypes } from 'react';

import { NavLink } from 'fluxible-router';
import { FlatButton, RaisedButton } from './UIKit';
import { navigateAction } from 'fluxible-router';


export class Link extends React.Component {
    render() {
        const { route, params } = this.props;

        return <NavLink routeName={route} navParams={params} {...this.props} />;
    }
}

export class FlatLink extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired
    }

    render() {
        const { route, params, label } = this.props;
        const url = this.context.makePath(route, params);

        return <FlatButton label={label} linkButton={true} onClick={this.navigateTo.bind(this, url)} {...this.props} />
    }

    navigateTo(url) {
        this.context.executeAction(navigateAction, {url: url});
    }
}

export class RaisedLink extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired
    }

    render() {
        const { route, params, label } = this.props;
        const url = this.context.makePath(route, params);

        return <RaisedButton label={label} linkButton={true} onClick={this.navigateTo.bind(this, url)} {...this.props} />
    }

    navigateTo(url) {
        this.context.executeAction(navigateAction, {url: url});
    }
}

export default Link;

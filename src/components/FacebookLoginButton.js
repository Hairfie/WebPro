'use strict';

import React from 'react';
import AuthActions from '../actions/AuthActions';
import { RaisedButton } from 'material-ui';

export default class FacebookLoginButton extends React.Component {
    static contextTypes = {
        getFacebookSdk: React.PropTypes.func.isRequired,
        executeAction: React.PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = { sdk: null };
    }
    componentDidMount() {
        this.context.getFacebookSdk().then(sdk => this.setState({ sdk }));
    }
    render() {
        const {
            onTouchTap,
            onClick,
            ...otherProps
        } = this.props;

        const waitingForSdk = !this.state.sdk;

        return <RaisedButton
            label="Se connecter via Facebook"
            onTouchTap={this.onTouchTap}
            disabled={waitingForSdk}
            {...otherProps}
            />;
    }
    onTouchTap = (e) => {
        e.preventDefault();
        this.state.sdk.login(response => this.context.executeAction(AuthActions.loginWithFacebook, { response }));
    }
}

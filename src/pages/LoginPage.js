import React from "react";
import Layout from '../components/Layout';
import AuthActions from '../actions/AuthActions';
import { TextField, FlatButton, RaisedButton, CircularProgress, Center } from '../components/UIKit';
import FacebookLoginButton from '../components/FacebookLoginButton';
import { connectToStores } from "fluxible-addons-react";

class LoginPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        const {loading} = this.props;
        let content;

        if(loading) {
            content = <Center><CircularProgress mode="indeterminate" /></Center>;
        } else {
            content = (
                <div>
                    <TextField ref="email" type="email" floatingLabelText="Adresse email" fullWidth={true} />
                    <TextField ref="password" type="password" floatingLabelText="Mot de passe" fullWidth={true} />
                    <RaisedButton onClick={this.login.bind(this)} disabled={this.props.loading} fullWidth={true} label="Se connecter" />
                    <br />
                    <br />
                    <hr />
                    <FacebookLoginButton fullWidth={true} />
                </div>
            );
        }

        return (
            <Layout {...this.props}>
                {content}
            </Layout>
        );
    }
    login() {
        this.context.executeAction(AuthActions.login, {
            email: this.refs.email.getValue(),
            password: this.refs.password.getValue()
        });
    }
}

LoginPage = connectToStores(LoginPage, ['AuthStore'], (context, props) => ({
    loading: context.getStore('AuthStore').isLoading()
}));

export default LoginPage;

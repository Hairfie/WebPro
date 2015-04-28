import React from "react";
import Layout from '../components/Layout';
import AuthActions from '../actions/AuthActions';
import { TextField, FlatButton } from '../components/UIKit';
import { connectToStores } from "fluxible/addons";

class LoginPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        return (
            <Layout {...this.props}>
                <h1>Connexion</h1>
                <TextField ref="email" type="email" floatingLabelText="Adresse email" />
                <TextField ref="password" type="password" floatingLabelText="Mot de passe" />
                <FlatButton onClick={this.login.bind(this)} disabled={this.props.loading} label="Se connecter" />
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

LoginPage = connectToStores(LoginPage, ['AuthStore'], stores => ({
    loading: stores.AuthStore.isLoading()
}));

export default LoginPage;

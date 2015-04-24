import React from "react";
import Layout from '../components/Layout';

//import { Input, FlatButton } from '../components/UIKit';
import { connectToStores } from "fluxible/addons";

class Layout { render() { return <div {...this.props} />; } }
class Input { render() { return <input {...this.props} />; } }
class FlatButton { render() { return <button {...this.props} />; } }

class LoginPage extends React.Component {
    render() {
        return (
            <Layout>
                <h1>Login page</h1>
                <Input ref="email" type="email" label="Adresse email" />
                <Input ref="password" type="password" label="Mot de passe" />
                <FlatButton onClick={this.login.bind(this)} disabled={this.loading}>
                    Se connecter
                </FlatButton>
            </Layout>
        );
    }
    login() {
        this.executeAction(AuthActions.login, {
            email: this.refs.email.getValue(),
            password: this.refs.password.getValue()
        });
    }
}

LoginPage = connectToStores(LoginPage, ['AuthStore'], stores => ({
    loading: stores.AuthStore.isLoading()
}));

export default LoginPage;

import React from "react";

import { connectToStores } from 'fluxible-addons-react';

import Link, {RaisedLink} from '../components/Link';
import {RaisedButton, Center} from '../components/UIKit';
import Layout from '../components/Layout';



class HomePage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <div>
                <h1>Hairfie Pro Web</h1>
                <p>Interface d'administration de Hairfie réservée aux coiffeurs</p>
            </div>
            {this.renderButtons()}
        </Layout>
    );
  }

  renderButtons() {
    if(this.props.isAuthenticated) {
        return (
            <Center>
                <p><RaisedLink route="dashboard" fullWidth={true} label={'Mes Salons'}/></p>
                <p><RaisedLink route="logout" fullWidth={true} label={'Se Déconnecter'}/></p>
            </Center>
        )
    } else {
        return (
            <Center>
                <p><RaisedLink route="login" fullWidth={true} label={'Connexion'}/></p>
                <p><RaisedButton disabled={true} fullWidth={true} label={'Inscription (soon)'}/></p>
            </Center>
        );
    }

  }

}

HomePage = connectToStores(HomePage, [
    'AuthStore'
], (context, props) => {
    return {
        isAuthenticated: context.getStore('AuthStore').isAuthenticated()
    }
});

export default HomePage;

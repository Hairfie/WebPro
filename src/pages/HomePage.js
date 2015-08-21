import React from "react";

import Link, {RaisedLink} from '../components/Link';
import {RaisedButton} from '../components/UIKit';
import Layout from '../components/Layout';

class HomePage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <h1>Accueil</h1>
            <p>Interface d'administration de Hairfie réservée aux coiffeurs</p>
            <p><RaisedLink route="login" fullWidth={true} label={'Connexion'}/></p>
            <p><RaisedButton disabled={true} fullWidth={true} label={'Inscription (soon)'}/></p>
        </Layout>
    );
  }

}

export default HomePage;

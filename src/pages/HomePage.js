import React from "react";

import Link from '../components/Link';
import Layout from '../components/Layout';

class HomePage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <h1>Accueil</h1>
            <p>Interface d'administration de Hairfie réservée aux coiffeurs</p>
            <p><Link route="login">Espace Coiffeur</Link></p>
        </Layout>
    );
  }

}

export default HomePage;

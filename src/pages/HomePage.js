import React from "react";

import Link, {RaisedLink} from '../components/Link';
import Layout from '../components/Layout';

class HomePage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <h1>Accueil</h1>
            <p>Interface d'administration de Hairfie réservée aux coiffeurs</p>
            <p><RaisedLink route="login" fullWidth={true} label={'Espace Coiffeur'}/></p>
        </Layout>
    );
  }

}

export default HomePage;

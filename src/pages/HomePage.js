import React from "react";

import Link from '../components/Link';
import Layout from '../components/Layout';

class HomePage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <h1>Accueil</h1>
            <p>Hey le coiffeur, viens donc <Link route="login">jouer avec nous</Link> !</p>
        </Layout>
    );
  }

}

export default HomePage;

import React from "react";

import Layout from '../components/Layout';

class LoadingPage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <div>Chargement en cours...</div>
        </Layout>
    );
  }

}

export default LoadingPage;
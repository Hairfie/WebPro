import React from "react";

import Layout from '../components/Layout';
import { CircularProgress, Center } from '../components/UIKit';

class LoadingPage extends React.Component {

  render() {
    return (
        <Layout {...this.props}>
            <Center>
                <CircularProgress mode="indeterminate" />
            </Center>
        </Layout>
    );
  }

}

export default LoadingPage;
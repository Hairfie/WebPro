import React from "react";

import Link from '../components/Link';

class HomePage extends React.Component {

  render() {
    return (
        <div>
            <h1>Accueil</h1>
            <p>Hey le coiffeur, viens donc <Link route="login">jouer avec nous</Link> !</p>
        </div>
    );
  }

}

export default HomePage;

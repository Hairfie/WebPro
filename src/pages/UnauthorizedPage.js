'use strict';

import React from 'react';

class UnauthorizedPage extends React.Component {
    render() {
        return (
            <Layout>
                <h1>Accès interdit</h1>
                <p>Vous ne disposez pas des permissions nécessaires pour accéder à cette page.</p>
            </Layout>
        );
    }
}

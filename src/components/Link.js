import React from 'react';

import { NavLink } from 'flux-router-component';

export default class Link extends React.Component {
    render() {
        const { route, params } = this.props;

        return <NavLink routeName={route} navParams={params} {...this.props} />;
    }
}

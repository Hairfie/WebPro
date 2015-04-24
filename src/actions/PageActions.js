'use strict';

import RouteActions from './RouteActions';

const PageActions = {

    login(context, route) {
        var token = context.getStore('AuthStore').getToken();

        if (!token) return Promise.revolve();

        return context.executeAction(RouteActions.navigate, { route: 'dashboard' });
    }

};

export default PageActions;

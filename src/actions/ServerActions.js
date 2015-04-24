'use strict';

import AuthActions from './AuthActions';
import RouteActions from './RouteActions';

const ServerActions = {
    render: function (context, { req }) {
        return context.executeAction(AuthActions.loginWithCookie, { cookies: req.cookies })
            .then(() => {
                return context.executeAction(RouteActions.navigate, { url: req.url });
            });
    }
};

export default ServerActions;

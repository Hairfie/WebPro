'use strict';

import AuthActions from './AuthActions';
import RouteActions from './RouteActions';

const ServerActions = {
    render: function (context, { url }) {
        return context.executeAction(AuthActions.loginWithCookie)
            .then(() => {
                return context.executeAction(RouteActions.navigate, { url });
            });
    }
};

export default ServerActions;

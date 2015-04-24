'use strict';

import AuthActions from './AuthActions';
import RouteActions from './RouteActions';

const ServerActions = {
    render: function (context, { url }) {
        // TODO: read "accessTokenId" cookie and authenticate user

        return context.executeAction(RouteActions.navigate, { url });
    }
};

export default ServerActions;

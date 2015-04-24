import Actions from "../constants/Actions";

import { navigateAction } from 'flux-router-component';

const RouteActions = {

    navigate(context, { url, route, params }) {
        var url = url || context.router.makePath(route, params);

        return context.executeAction(navigateAction, { url });
    },

    show404(context, { err }) {
        return context.dispatch(Actions.STATUS_404, { err });
    },

    show500(context, { err }, done) {
        return context.dispatch(Actions.STATUS_500, { err });
    }
};

export default RouteActions;

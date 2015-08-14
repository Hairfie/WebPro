import Actions from "../constants/Actions";

import { navigateAction } from 'fluxible-router';

function navigate(context, options) {
    const url = options.url || context.router.makePath(options.route, options.params);

    return context.executeAction(navigateAction, { url });
}

const RouteActions = {

    navigate: navigate,

    show401(context, { err }) {
        context.dispatch(Actions.ERROR_401, { err });

        return context.executeAction(navigate, { route: 'login' });
    },

    show403(context, { err }) {
        context.dispatch(Actions.ERROR_403, { err });
    },

    show404(context, { err }) {
        context.dispatch(Actions.ERROR_404, { err });
    },

    show500(context, { err }) {
        context.dispatch(Actions.ERROR_500, { err });
    }

};

export default RouteActions;

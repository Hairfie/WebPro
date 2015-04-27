import Actions from "../constants/Actions";

import { navigateAction } from 'flux-router-component';

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

    show404(context, { err }) {
        context.dispatch(Actions.ERROR_404, { err });
    },

    show500(context, { err }) {
        context.dispatch(Actions.ERROR_500, { err });
    }

};

export default RouteActions;

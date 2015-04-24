import Actions from "../constants/Actions";

import { navigateAction } from 'flux-router-component';

const RouteActions = {

    navigate(context, options) {
        const url = options.url || context.router.makePath(options.route, options.params);

        return context.executeAction(navigateAction, { url });
    },

    show401(context, { err }) {
        context.dispatch(Actions.ERROR_401, { err });

        return this.navigate(context, { route: 'login' });
    },

    show404(context, { err }) {
        context.dispatch(Actions.ERROR_404, { err });
    },

    show500(context, { err }) {
        context.dispatch(Actions.ERROR_500, { err });
    }

};

export default RouteActions;

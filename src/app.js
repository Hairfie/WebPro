import Fluxible from 'fluxible';
import routrPlugin from 'fluxible-plugin-routr';
import RouteActions from './actions/RouteActions';
import routes from './routes';
import hairfieApiPlugin from 'fluxible-plugin-hairfie-api';
import cookiePlugin from 'fluxible-plugin-cookie';
import facebookPlugin from 'fluxible-plugin-facebook';
import googleMapsPlugin from 'fluxible-plugin-google-maps';

import Application from './Application';

import RouteStore from './stores/RouteStore';
import HtmlHeadStore from './stores/HtmlHeadStore';
import AuthStore from './stores/AuthStore';
import BusinessStore from './stores/BusinessStore';
import BusinessMemberStore from './stores/BusinessMemberStore';
import UserStore from './stores/UserStore';
import UserBusinessStore from './stores/UserBusinessStore';
import UploadStore from './stores/UploadStore';

import config from './config';

const app = new Fluxible({
    component: Application,
    componentActionHandler(context, { err }) {
        // This action handler is called for any action executed in the component's
        // context. It's the right place to intercept action errors and display an
        // error page.

        if (err) {
            const { status, statusCode } = err;

            if (status === 404 || statusCode === 404) {
                return context.executeAction(RouteActions.show404, { err });
            } else if (status === 401) {
                return context.executeAction(RouteActions.show401, { err });
            } else if (status === 403) {
                return context.executeAction(RouteActions.show403, { err });
            } else {
                console.log(err.stack || err);
                return context.executeAction(RouteActions.show500, { err });
            }
        }
    }
});

app.plug(routrPlugin({
    routes: routes
}));

app.plug(facebookPlugin({
    appId: config.facebookAppId
}));

app.plug(cookiePlugin());

app.plug(hairfieApiPlugin({
    apiUrl: config.hairfieApiUrl
}));

app.plug(googleMapsPlugin());

app.plug({
    name: 'HairfieWebPro',
    plugContext(options, context) {
        return {
            plugStoreContext(storeContext) {
                storeContext.executeAction = context.executeAction.bind(context);
            }
        };
    }
});

app.registerStore(RouteStore);
app.registerStore(HtmlHeadStore);
app.registerStore(AuthStore);
app.registerStore(BusinessStore);
app.registerStore(BusinessMemberStore);
app.registerStore(UserStore);
app.registerStore(UserBusinessStore);
app.registerStore(UploadStore);

export default app;

import Fluxible from 'fluxible';
import routrPlugin from 'fluxible-plugin-routr';
import RouteActions from './actions/RouteActions';
import routes from './routes';
import hairfieApiPlugin from './plugins/hairfie-api';

import Application from './Application';

import RouteStore from './stores/RouteStore';
import HtmlHeadStore from './stores/HtmlHeadStore';
import AuthStore from './stores/AuthStore';
import BusinessStore from './stores/BusinessStore';
import UserStore from './stores/UserStore';
import UserBusinessStore from './stores/UserBusinessStore';

import config from './config';

const app = new Fluxible({

  component: Application,

  componentActionHandler(context, { err }, done) {

    // This action handler is called for any action executed in the component's
    // context. It's the right place to intercept action errors and display an
    // error page.

    if (err) {
      const { status, statusCode } = err;

      if (status && status === 404 || statusCode && statusCode === 404) {
        context.executeAction(RouteActions.show404, { err }, done);
      }
      else {
        console.log(err.stack || err);
        context.executeAction(RouteActions.show500, { err }, done);
      }

      return;
    }

    done();
  }

});

app.plug(routrPlugin({
    routes: routes
}));

app.plug(hairfieApiPlugin({
    apiUrl: config.hairfieApiUrl
}));

app.registerStore(RouteStore);
app.registerStore(HtmlHeadStore);
app.registerStore(AuthStore);
app.registerStore(BusinessStore);
app.registerStore(UserStore);
app.registerStore(UserBusinessStore);

export default app;

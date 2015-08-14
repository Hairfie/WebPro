import React, { PropTypes } from 'react';
import { isEqual } from 'lodash';
import { provideContext, connectToStores } from 'fluxible-addons-react';
import { handleHistory, handleRoute } from 'fluxible-router';

import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import LoadingPage from './pages/LoadingPage';

import Layout from './components/Layout';

import mui from 'material-ui';

let ThemeManager = new mui.Styles.ThemeManager();
let Colors = mui.Styles.Colors;

const debug = require("debug")("hairfie");

if (process.env.BROWSER) {
    require('./style/Application.scss');
}

// TODO: remove me as soon as react v1.0.0
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

@provideContext({
    getFacebookSdk      : React.PropTypes.func.isRequired,
    getGoogleMapsScript : React.PropTypes.func.isRequired
})

@handleHistory
@handleRoute

@connectToStores(["HtmlHeadStore"], (context) =>
  ({ documentTitle: context.getStore("HtmlHeadStore").getTitle() })
)

class Application extends React.Component {
    static propTypes = {
        isNavigateComplete: PropTypes.bool,
        currentRoute: PropTypes.object,
        currentNavigateError: PropTypes.shape({
            statusCode: PropTypes.number.isRequired,
            message: PropTypes.string.isRequired
        }),
        documentTitle: PropTypes.string
    }

    componentDidUpdate(prevProps) {
        const { documentTitle, currentRoute } = this.props;

        if (prevProps.documentTitle !== documentTitle) {
          document.title = documentTitle;
        }
    }

    static childContextTypes = {
        muiTheme            : React.PropTypes.object,
        makePath            : React.PropTypes.func.isRequired,
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme(),
            makePath: this.props.makePath
        };
    }

    componentWillMount() {
        ThemeManager.setPalette({
            accent1Color: Colors.deepOrange500,
            primary1Color: Colors.red400
        });
    }

    render() {
        const { currentRoute, currentNavigateError, isNavigateComplete } = this.props;
        let Handler = currentRoute && currentRoute.get("handler");

        let content;

        if (currentNavigateError && currentNavigateError.statusCode === 404) {
            content = <NotFoundPage />;
        }
        else if (currentNavigateError) {
            content = <ErrorPage err={currentNavigateError} />;
        }
        else if (!Handler) {
            content = <NotFoundPage />;
        }
        else if (!isNavigateComplete) {
            content = <LoadingPage />;
        }
        else {
            const params = currentRoute.get("params").toJS();
            content = <Handler {...params} />;
        }
        return content;
    }
}

export default Application;

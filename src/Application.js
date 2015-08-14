import React, { PropTypes } from 'react';
import { isEqual } from 'lodash';
import { provideContext, connectToStores } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';

import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BusinessPage from './pages/BusinessPage';
import BusinessPicturesPage from './pages/BusinessPicturesPage';
import BusinessInfosPage from './pages/BusinessInfosPage';
import BusinessTimetablePage from './pages/BusinessTimetablePage';
import BusinessServicesPage from './pages/BusinessServicesPage';
import BusinessServicePage from './pages/BusinessServicePage';
import BusinessMapPage from './pages/BusinessMapPage';
import BusinessMembersPage from './pages/BusinessMembersPage';
import BusinessMemberPage from './pages/BusinessMemberPage';
import ImpersonateTokenPage from './pages/ImpersonateTokenPage';
import BusinessSearchPage from './pages/BusinessSearchPage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';

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

function pageHandler(page) {
    switch (page) {
        case 'home':
            return HomePage;
        case 'login':
            return LoginPage;
        case 'impersonate_token':
            return ImpersonateTokenPage;
        case 'business_search':
            return BusinessSearchPage;
        case 'dashboard':
            return DashboardPage;
        case 'business':
            return BusinessPage;
        case 'business_pictures':
            return BusinessPicturesPage;
        case 'business_infos':
            return BusinessInfosPage;
        case 'business_map':
            return BusinessMapPage;
        case 'business_members':
            return BusinessMembersPage;
        case 'new_business_member':
        case 'edit_business_member':
            return BusinessMemberPage;
        case 'business_timetable':
            return BusinessTimetablePage;
        case 'business_services':
            return BusinessServicesPage;
        case 'new_business_service':
        case 'edit_business_service':
            return BusinessServicePage;
        case 'bookings':
            return BookingsPage;
        case 'booking':
            return BookingPage;
        case 'unauthorized':
            return UnauthorizedPage;
        case 'error':
            return ErrorPage;
        default:
            return NotFoundPage;
    }
}

@provideContext({
    makePath            : PropTypes.func.isRequired,
    getFacebookSdk      : React.PropTypes.func.isRequired,
    getGoogleMapsScript : React.PropTypes.func.isRequired
})

@handleHistory

@connectToStores(["HtmlHeadStore"], (context) =>
  ({ documentTitle: context.getStore("HtmlHeadStore").getTitle() })
)

class Application extends React.Component {
    // static contextTypes = {
    //     makePath            : PropTypes.func.isRequired,
    //     getStore            : React.PropTypes.func.isRequired,
    //     getFacebookSdk      : React.PropTypes.func.isRequired,
    //     getGoogleMapsScript : React.PropTypes.func.isRequired
    // }

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
        muiTheme: React.PropTypes.object
    }

    getChildContext() {
        return {
          muiTheme: ThemeManager.getCurrentTheme()
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
        //const { loading, page, route } = this.props;

        if (false) return (
            <Layout {...this.props}>
                <div>Chargement en cours...</div>
            </Layout>
        );

        const Handler = pageHandler(page);
        return <Handler {...(currentRoute || {}).params} />;
    }
}

// Application.childContextTypes = {
//     muiTheme: React.PropTypes.object
// };

// Application = connectToStores(Application, ['RouteStore', 'HtmlHeadStore'], (context, props) => ({
//     documentTitle: context.getStore("HtmlHeadStore").getTitle()
// }));

export default Application;

import React, { PropTypes } from "react";
import { isEqual } from "lodash";
import { provideContext, connectToStores } from "fluxible/addons";
import { RouterMixin } from "flux-router-component";

import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BusinessPage from './pages/BusinessPage';
import BusinessPicturesPage from './pages/BusinessPicturesPage';
import BusinessMembersPage from './pages/BusinessMembersPage';
import BusinessMemberPage from './pages/BusinessMemberPage';

const debug = require("debug")("hairfie");

if (process.env.BROWSER) {
    require("./style/Application.scss");
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
        case 'dashboard':
            return DashboardPage;
        case 'business':
            return BusinessPage;
        case 'business_pictures':
            return BusinessPicturesPage;
        case 'business_members':
            return BusinessMembersPage;
        case 'new_business_member':
        case 'edit_business_member':
            return BusinessMemberPage;
        case 'error':
            return ErrorPage;
        default:
            return NotFoundPage;
    }
}

// Can't create class as we use the RouterMixin
let Application = React.createClass({
    mixins: [RouterMixin],

    // we synchronize the state's route with props's route because the RouterMixin
    // supports state only
    getInitialState() {
        return { route: this.props.route };
    },
    componentWillReceiveProps({ route }) {
        if (!isEqual(this.state.route, route)) {
            this.setState({ route });
        }
    },
    render() {
        const { loading, page, route } = this.props;

        if (loading) return <div>Chargement en cours...</div>;

        const Handler = pageHandler(page);

        return <Handler {...(route || {}).params} />;
    }
});

Application = connectToStores(Application, ['RouteStore', 'HtmlHeadStore'], (stores) => ({
    loading: stores.RouteStore.isLoading(),
    page: stores.RouteStore.getCurrentPage(),
    route: stores.RouteStore.getCurrentRoute()
}));

// wrap application in the fluxible context
Application = provideContext(Application, {
    makePath: React.PropTypes.func.isRequired
});

export default Application;

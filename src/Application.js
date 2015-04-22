import React, { PropTypes } from "react";
import { isEqual } from "lodash";
import { provideContext, connectToStores } from "fluxible/addons";

import { RouterMixin } from "flux-router-component";

import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const debug = require("debug")("hairfie");

if (process.env.BROWSER) {
    require("./style/Application.scss");
}

function pageHandler(page) {
    switch (page) {
        case 'home':
            return HomePage;
        case 'login':
            return LoginPage;
        case 'dashboard':
            return DashboardPage;
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
        const { page, route } = this.props;
        const Handler = pageHandler(page);

        return <Handler {...(route || {}).params} />;
    }
});

Application = connectToStores(Application, ['RouteStore', 'HtmlHeadStore'], (stores) => ({
    page: stores.RouteStore.getCurrentPage(),
    route: stores.RouteStore.getCurrentRoute()
}));

// wrap application in the fluxible context
Application = provideContext(Application, {
    makePath: React.PropTypes.func.isRequired
});

export default Application;

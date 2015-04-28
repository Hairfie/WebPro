// Express middleware to render the app server-side and expose its state
// to the client

import React from 'react';
import serialize from 'serialize-javascript';

import app from '../app';
import HtmlDocument from './HtmlDocument';

import ServerActions from '../actions/ServerActions';
import RouteActions from '../actions/RouteActions';

let webpackStats;

if (process.env.NODE_ENV === 'production') {
    webpackStats = require('./webpack-stats.json');
}

function renderApp(req, res, context, next) {

    if (process.env.NODE_ENV === 'development') {
        webpackStats = require('./webpack-stats.json');

        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        delete require.cache[require.resolve('./webpack-stats.json')];
    }

    // dehydrate the app and expose its state
    const state = 'window.App=' + serialize(app.dehydrate(context)) + ';';

    const Application = app.getComponent();

    try {
        // Render the Application to string
        const markup = React.renderToString(
            <Application context={ context.getComponentContext() } />
        );

        // The application component is rendered to static markup
        // and sent as response.
        const html = React.renderToStaticMarkup(
            <HtmlDocument
                context={ context.getComponentContext() }
                lang="fr"
                state={state}
                markup={markup}
                script={webpackStats.script}
                css={webpackStats.css}
                />
        );
        const doctype = '<!DOCTYPE html>';
        res.send(doctype + html);
    }
    catch (e) {
        next(e);
    }
}

function render(req, res, next) {

    const context = app.createContext({
        req: req,
    });

    context.executeAction(ServerActions.render, { req: req }, (err) => {

        // If the action return an errors, execute another action to make
        // the RouteStore register the error and show the relative page.
        // This is basically the server-side counterpart of
        // componentActionHandler in ../app.js

        if (err) {
            if (err.status === 404 || err.statusCode === 404) {
                res.status(404);
                context.executeAction(RouteActions.show404, { err }, () => {
                    renderApp(req, res, context, next);
                });
            } else if (err.status === 401) {
                context.executeAction(RouteActions.show401, { err }, () => {
                    var url = context.getActionContext().getStore('RouteStore').getCurrentRoute().url;
                    res.redirect(302, url);
                });
            } else if (err.status === 403) {
                context.executeAction(RouteActions.show403, { err }, () => {
                    renderApp(req, res, context, next);
                });
            } else {
                res.status(500);
                context.executeAction(RouteActions.show500, { err }, () => {
                    console.log(err.stack || err);
                    renderApp(req, res, context, next);
                });
            }

            return;
        }

        renderApp(req, res, context, next);

    });
}

export default render;

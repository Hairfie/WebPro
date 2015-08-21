import React, { PropTypes } from "react";

import { trackingId } from "../config";
import ga from "./ga";
import { provideContext } from "fluxible-addons-react";

class HtmlDocument extends React.Component {
    static defaultProps = {
        script: [],
        css: []
    }

    static contextTypes = {
        getStore: PropTypes.func.isRequired
    }

    render() {
        const { state, markup, script, css, lang } = this.props;
        const htmlHead = this.context.getStore("HtmlHeadStore");

        return (
                <html lang={lang}>
                <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

                <title>{ htmlHead.getHtmlHeadTitle() }</title>

                { css.map((href, k) =>
                        <link key={k} rel="stylesheet" type="text/css" href={href} />)
                }

                { trackingId &&
                    <script dangerouslySetInnerHTML={{__html: ga.replace("{trackingId}", trackingId)}} />
                }

                </head>

                    <body>
                    <div id="root" dangerouslySetInnerHTML={{__html: markup}} />

                    <script dangerouslySetInnerHTML={{__html: state}} />

                    { script.map((src, k) => <script key={k} src={src} />) }

                </body>
                    </html>
                    );
    }
}

HtmlDocument = provideContext(HtmlDocument);

export default HtmlDocument;

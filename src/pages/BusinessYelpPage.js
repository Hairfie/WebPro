'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper, RaisedButton } from '../components/UIKit';
import { connectToStores } from 'fluxible-addons-react';
import Link, {FlatLink, RaisedLink} from '../components/Link';
import BusinessActions from '../actions/BusinessActions';
import _ from 'lodash';


class BusinessYelpPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { business } = this.props;

        return (
            <Layout ref="layout" {...this.props}>
                <h1>Yelp</h1>
                {this.renderYelp()}
                <TextField
                    ref="yelpId"
                    floatingLabelText="Nouveau Yelp ID"
                    />
                <RadioButtonGroup ref="displayYelp" name="displayYelp" defaultSelected={business.displayYelp} valueSelected={business && business.displayYelp}>
                    <RadioButton value={true} label="Afficher les reviews Yelp"  />
                    <RadioButton value={false} label="Ne pas afficher" />
                </RadioButtonGroup>
                <br />
                <RaisedButton label='Sauver les modifications' onClick={this.save} fullWidth={true} primary={true} />
                <br /><br />
                <RaisedLink route="business" params={{ businessId: business.id }} label='Annuler' fullWidth={true} />
            </Layout>
        );
    }

    renderYelp() {
        const { yelpObject } = this.props;
        if(_.isEmpty(yelpObject)) return (<p>Not found on Yelp</p>);
        const yelpId = this.props.yelpId || yelpObject.id;

        let multipleNode;
        let yelpNode;

        if(yelpObject.multipleIds) {
            multipleNode = (
                <div>
                    <h3>Ce salon correspond à plusieurs pages sur Yelp :</h3>
                    <ul>
                        {_.map(yelpObject.multipleIds, (yelpId) => {
                            return (
                                <li>
                                    <a href={`http://www.yelp.fr/biz/${yelpId}`} target="_blank">{`Yelp Id : ${yelpId}`}</a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )
        }

        if(!_.isUndefined(yelpObject.review_count)) {
            yelpNode = (
                <div>
                    <h3>Données Yelp utilisées en ce moment :</h3>
                    <ul>
                        <li>{`yelpId : ${yelpId}`}</li>
                        <li>{`Note : ${yelpObject.rating}/5`}</li>
                        <li>{`Nombre de reviews : ${yelpObject.review_count}`}</li>
                        <li><img src={yelpObject.rating_img_url} /> </li>
                        <li><a href={yelpObject.url} target="_blank">Lien vers la page Yelp</a></li>
                    </ul>
                </div>
            );
        }

        return (
            <div>
                {multipleNode}
                {yelpNode}
            </div>
        )
    }

    save = () => {
        const businessId = this.props.businessId;

        const values = {
            yelpId:           this.refs.yelpId.getValue(),
            displayYelp:      this.refs.displayYelp.getSelectedValue()
        };

        this.context.executeAction(BusinessActions.updateYelp, { businessId, values });
    }
}

BusinessYelpPage = connectToStores(BusinessYelpPage, [
    'BusinessStore'
], (context, props) => {
    const business = context.getStore('BusinessStore').getById(props.businessId);

    return {
        business : business,
        yelpObject: business.yelpObject || {}
    }
});

export default BusinessYelpPage;
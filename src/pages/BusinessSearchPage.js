'use strict';

import React, {PropTypes} from 'react';
import _ from 'lodash';

import AuthActions from '../actions/AuthActions';
import SearchActions from '../actions/SearchActions';
import { navigateAction } from 'fluxible-router';

import { connectToStores } from 'fluxible-addons-react';

import Layout from '../components/Layout';

import { RaisedButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper, List, ListItem } from '../components/UIKit';
import Image from '../components/Image';
import PlaceInput from '../components/PlaceInput';
import Link, {FlatLink, RaisedLink} from '../components/Link';


class BusinessSearchPage extends React.Component {
    static contextTypes = {
        makePath: PropTypes.func.isRequired,
        executeAction: PropTypes.func.isRequired,
    }

    render() {

        return (
            <Layout>
                <div>
                    <br />
                    <PlaceInput ref="place" {...this.props} fullWidth={true} />
                    <TextField ref="q" type="text" fullWidth={true}
                        placeholder="Nom du salon" />
                    <RaisedButton label="Recherche" fullWidth={true} onClick={this.search}/>
                    {this.renderResults()}
                </div>
            </Layout>
        );
    }

    renderResults() {
        const { searchResults } = this.props;

        if(!searchResults) {
            return;
        } else {
            return (
                <div>
                    <h5>{`${searchResults.hitsPerPage} salons / ${searchResults.nbHits}`}</h5>
                    <List>
                        {_.map(searchResults.hits, business => this.renderBusiness(business))}
                    </List>
                </div>
            );
        }


    }

    renderBusiness(business) {
        const options = { width: 45, height: 45, crop: 'thumb' };
        const avatar = <Image image={_.last(business.pictures)} options={options} placeholder="/assets/placeholder-45.png" />

        return (
            <ListItem
                key={business.id}
                leftAvatar={avatar}
                primaryText={business.name}
                secondaryText={
                    <p>
                      {`${business.address.street} ${business.address.zipCode} ${business.address.city}`}
                    </p>
                }
                secondaryTextLines={2}
                onClick={this._onTouchStart.bind(this, business)} />
        );
    }

    _onTouchStart(business) {
        const url = this.context.makePath("business", {businessId: business.id});
        this.context.executeAction(navigateAction, {url: url});
    }

    search = () => {
    	const query = {
    		address: this.refs.place.getFormattedAddress(),
    		q: this.refs.q.getValue()
    	}
    	this.context.executeAction(SearchActions.searchBusiness, {query: query})
    }
}

BusinessSearchPage = connectToStores(BusinessSearchPage, [
    'BusinessStore'
], (context, props) => ({
    searchResults : context.getStore('BusinessStore').getBusinessSearchResults()
}));

export default BusinessSearchPage;
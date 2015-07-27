'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper } from '../components/UIKit';
import AuthActions from '../actions/AuthActions';
import SearchActions from '../actions/SearchActions';
import PlaceInput from '../components/PlaceInput';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';

class BusinessSearchPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { searchResults } = this.props;

        return (
            <Layout>
                <Paper>
                    <h5>Recherche de salon !</h5>
                    <PlaceInput ref="place" {...this.props} />
                    <TextField ref="q" type="text"
                        floatingLabelText="Nom du salon" />
                    <FlatButton label="Recherche" onClick={this.search}/>
                </Paper>
                <Paper>
                    <h5>Salons trouvés :</h5>
                    {_.map(searchResults, business => this.renderBusiness(business))}
                </Paper>
            </Layout>
        );
    }

    renderBusiness(business) {
        return (<li>{business.name}</li>);
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
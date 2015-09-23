'use strict';

import React from 'react';
import _ from 'lodash';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import { Checkbox, FlatButton } from '../components/UIKit';
import Link from '../components/Link';
import BusinessActions from '../actions/BusinessActions';

class BusinessCategoriesPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { categories, businessId, business } = this.props;
        return (
            <Layout {...this.props}>
                <h1>Spécialités & Catégories</h1>
                <h5>
                    Vous pouvez cocher les catégories que vous désirez et ainsi permettre
                    au utilisateur de vous trouver plus facilement via la recherche.
                </h5>
                {_.map(categories, categorie => <Checkbox label={categorie.name} ref={categorie.name} defaultChecked={_.isEmpty(_.intersection([categorie.id], business.addedCategories)) ? false : true} />)}
                <FlatButton label='Sauver les modifications' onClick={this.save} />
                {' ou '}
                <Link route="business" params={{ businessId: businessId }}>
                    <FlatButton label='Annuler' />
                </Link>
            </Layout>
        );
    }

    save = () => {
        const { categories, businessId } = this.props;

        const values = {
            addedCategories: _.compact(_.map(categories, function(categorie) {
                if (this.refs[categorie.name].isChecked())
                    return categorie.id;
            }.bind(this)))
        };

        this.context.executeAction(BusinessActions.updateInfos, { businessId, values });
    }
}

BusinessCategoriesPage = connectToStores(BusinessCategoriesPage, [
    'CategoryStore'
], (context, props) => ({
    categories: context.getStore('CategoryStore').getAllCategories(),
    business : context.getStore('BusinessStore').getById(props.businessId)
}));

export default BusinessCategoriesPage;
'use strict';

import React from 'react';
import _ from 'lodash';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import { Checkbox, FlatButton } from '../components/UIKit';
import Link from '../components/Link';
import BusinessActions from '../actions/BusinessActions';

class BusinessSelectionsPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { selections, businessId, business } = this.props;
        return (
            <Layout {...this.props}>
                <h1>Sélections</h1>
                <h5>
                    En cochant une sélection, le salon sera ajouté à cette sélection éditoriale.
                </h5>
                {_.map(selections, selection => <Checkbox label={selection.name} ref={selection.slug} defaultChecked={_.isEmpty(_.intersection([selection.id], business.selections)) ? false : true} />)}
                <FlatButton label='Sauver les modifications' onClick={this.save} />
                {' ou '}
                <Link route="business" params={{ businessId: businessId }}>
                    <FlatButton label='Annuler' />
                </Link>
            </Layout>
        );
    }

    save = () => {
        const { selections, businessId } = this.props;

        const values = {
            selections: _.compact(_.map(selections, function(selection) {
                if (this.refs[selection.slug].isChecked())
                    return selection.id;
            }.bind(this)))
        };

        this.context.executeAction(BusinessActions.updateInfos, { businessId, values });
    }
}

BusinessSelectionsPage = connectToStores(BusinessSelectionsPage, [
    'SelectionStore', 'BusinessStore'
], (context, props) => ({
    selections: context.getStore('SelectionStore').getAll(),
    business : context.getStore('BusinessStore').getById(props.businessId)
}));

export default BusinessSelectionsPage;
import React, { PropTypes } from "react";
import Layout from '../components/Layout';

import Link from '../components/Link';
import HairfieActions from '../actions/HairfieActions';

import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import moment from 'moment';
import Picture from '../components/Image';
moment.locale('fr');

const PAGE_SIZE = 12;

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }

class BusinessHairfiesPage extends React.Component {
    static contextTypes = {
        executeAction: PropTypes.func.isRequired
    }

    render() {
        const {business, hairfies} = this.props;
        console.log(this.props);
        if (!business) return null;
        return (
            <Layout {...this.props}>
                {this.renderTitle()}
                <div className="hairfies">
                    {_.map(this.props.hairfies, hairfie => {
                        var hairdresser = <p></p>;
                        if (hairfie.hairdresser) {
                            hairdresser = <p>Coiffé par <span>{displayName(hairfie.hairdresser)}</span></p>;
                        }

                        var price = <div></div>;
                        if (hairfie.price) {
                            price = <div className="pricetag">{hairfie.price.amount}€</div>;
                        }
                        return (
                            <div key={hairfie.id} className="single-hairfie">
                                <Link route="business_hairfie" params={{businessId: business.id, hairfieId: hairfie.id}}>
                                    <figure style={{width: 250, height: 250}}>
                                        <Picture image={_.last(hairfie.pictures)} alt="" />
                                        <figcaption>
                                            {hairdresser}
                                            <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                            {price}
                                        </figcaption>
                                    </figure>
                                </Link>
                            </div>
                        );
                    }, this)}
                </div>
                {this.renderMoreButton()}
            </Layout>
        );
    }

    ComponentWillReceiveProps() {}

    renderMoreButton() {
        if (this.props.page * PAGE_SIZE > this.props.hairfies.length) return null;

        return <a role="button" onClick={this.loadMore.bind(this)} className="btn btn-red">Voir plus de Hairfies</a>;
    }

    loadMore = (e) => {
        if (e) e.preventDefault();
        this.context.executeAction(HairfieActions.loadBusinessHairfies, {
            businessId: this.props.business.id,
            page: (this.props.page || 0) + 1,
            pageSize: PAGE_SIZE
        });
    }

    renderTitle() {
        if (_.isEmpty(this.props.hairfies))
            return <h3>{this.props.business.name} n'a pas d'Hairfie.</h3>
        return <h3>{this.props.business.name} a les Hairfies suivant:</h3>;
    }

}

BusinessHairfiesPage = connectToStores(BusinessHairfiesPage, [
    'BusinessStore',
    'HairfieStore'
], (context, props) => ({
    business: context.getStore('BusinessStore').getById(props.businessId),
    hairfies: context.getStore('HairfieStore').getByBusiness(props.businessId),
    page: context.getStore('HairfieStore').getBusinessPage(props.businessId)
}));

export default BusinessHairfiesPage;

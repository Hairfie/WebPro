import React, { PropTypes } from "react";
import Layout from '../components/Layout';

import Link from '../components/Link';
import HairfieActions from '../actions/HairfieActions';

import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import { FlatButton, CircularProgress } from '../components/UIKit';
import moment from 'moment';
import Picture from '../components/Image';
moment.locale('fr');

const PAGE_SIZE = 12;

function displayName(u) { const n = u || {}; return n.firstName+' '+(n.lastName || '').substr(0, 1); }

class BusinessHairfiesPage extends React.Component {
    static contextTypes = {
        executeAction: PropTypes.func.isRequired
    }

    render() {
        console.log(this.props);
        const {business, hairfies, page} = this.props;
        if (page < 0) return this.renderLoader();
        return (
            <Layout {...this.props}>
                {this.renderTitle()}
                <div className="hairfies">
                    {_.map(this.props.hairfies, hairfie => {
                        let hairdresser = <p style={{marginTop: '30%'}}></p>;
                        if (hairfie.hairdresser) {
                            hairdresser = <p style={{marginTop: '30%'}}>Coiffé par <span>{displayName(hairfie.hairdresser)}</span></p>;
                        }

                        let price = <div></div>;
                        if (hairfie.price) {
                            price = <div className="pricetag">{hairfie.price.amount}€</div>;
                        }
                        return (
                            <div key={hairfie.id} className="single-hairfie" style={{width: '33%', minWidth: '250px'}}>
                                <Link route="business_hairfie" params={{businessId: business.id, hairfieId: hairfie.id}}>
                                    <figure>
                                        <Picture image={_.last(hairfie.pictures)} alt="" />
                                        <figcaption>
                                            {hairdresser}
                                            <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                            {price}
                                            {hairfie.pictures.length > 1 ? <Picture image={_.first(hairfie.pictures)} alt="" style={{position: 'absolute', width:'40%', bottom: '0px', right: '0px'}}/> : null}
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

        return <FlatButton style={{color:'darkred'}} onClick={this.loadMore.bind(this)}>Voir plus de Hairfies</FlatButton>;
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
    renderLoader() {
        return (
            <Layout {...this.props}>
                <CircularProgress mode="indeterminate" style={{position: 'fixed', top: '45%', 'left': '45%'}} />
            </Layout>
        );
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

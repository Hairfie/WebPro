import React, { PropTypes } from "react";
import Layout from '../components/Layout';

import Link from '../components/Link';
import HairfieActions from '../actions/HairfieActions';

import { TextField, DropDownMenu, Menu, MenuItem, RaisedButton } from '../components/UIKit';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import moment from 'moment';
import Picture from '../components/Image';
moment.locale('fr');

const PAGE_SIZE = 12;

function displayName(u) { var u = u || {}; return u.firstName+' '+(u.lastName || '').substr(0, 1); }

class HairfiePage extends React.Component {
    static contextTypes = {
        executeAction: PropTypes.func.isRequired
    }

    render() {
        const { hairfie, business, tags } = this.props;
        console.log(this.props);
        if (!business || !hairfie) return (
            <Layout {...this.props}>

            </Layout>
        );

        const businessMembers = _.map(business.activeHairdressers, hairdresser => {
            return {
                payload: hairdresser.id, text: hairdresser.firstName + ' ' + hairdresser.lastName
            };
        });

        var hairdresser = <p></p>;
        if (hairfie.businessMember) {
            hairdresser = <p>Coiffé par <span>{displayName(hairfie.businessMember)}</span></p>;
        }

        var price = <div></div>;
        if (hairfie.price) {
            price = <div className="pricetag">{hairfie.price.amount}€</div>;
        }

        return (
            <Layout {...this.props}>
                <div className="hairfies">
                    <div key={hairfie.id} className="single-hairfie Grid">
                        <figure className="Grid-cell">
                            <Picture image={_.last(hairfie.pictures)} alt="" />
                            <figcaption>
                                {hairdresser}
                                <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                {price}
                            </figcaption>
                        </figure>
                        <div className="Grid-cell">
                            <TextField
                            ref="price"
                            floatingLabelText="Prix de la coupe"
                            defaultValue={hairfie.price ? hairfie.price.amount + '€' : ''}
                            />
                            <TextField
                            ref="description"
                            floatingLabelText="Description"
                            defaultValue={hairfie.description || ''}
                            />
                            <select ref="hairdresser">
                                <option value="">Sélectionnez un coiffeur</option>
                                {_.map(business.activeHairdressers, hairdresser => {
                                    return <option value={hairdresser.id}>{hairdresser.firstName + ' ' + hairdresser.lastName}</option>
                                })}
                            </select>
                            <RaisedButton style={{marginTop: '45px'}} backgroundColor='skyblue' label="Valider les modifications"/>
                            <RaisedButton style={{marginTop: '45px'}} backgroundColor='tomato' label="Supprimer le Hairfie" onClick={this.removeHairfie}/>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
    removeHairfie = (e) => {
        e.preventDefault();

        this.context.executeAction(HairfieActions.deleteHairfie, this.props.hairfie.id);
    }
}

HairfiePage = connectToStores(HairfiePage, [
    'BusinessStore',
    'HairfieStore',
    'TagStore'
], (context, props) => ({
    business: context.getStore('BusinessStore').getById(props.businessId),
    hairfie: context.getStore('HairfieStore').getById(props.hairfieId),
    tag: context.getStore('TagStore').getAll()
}));

export default HairfiePage;
import React, { PropTypes } from "react";
import Layout from '../components/Layout';

import Link from '../components/Link';
import HairfieActions from '../actions/HairfieActions';

import { TextField, DropDownMenu, Menu, MenuItem, RaisedButton, Checkbox } from '../components/UIKit';
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
                <div className="hairfies" style={{width: '100%', overflow: 'auto'}}>
                    {_.map(hairfie.pictures, picture => {
                        return (
                            <div className="single-hairfie" style={{maxWidth: '300px'}}>
                                <figure>
                                    <Picture image={picture} alt="" />
                                    <figcaption>
                                        {hairdresser}
                                        <p><span>Le {moment(hairfie.createdAt).format('L')}</span></p>
                                        {price}
                                    </figcaption>
                                </figure>
                            </div>
                        );
                    })}
                </div>
                <div className="Grid">
                    <div className="Grid-cell">
                        <TextField
                        ref="price"
                        floatingLabelText="Prix de la coupe"
                        defaultValue={hairfie.price ? hairfie.price.amount + '€' : ''}
                        />
                    </div>
                    <div className="Grid-cell">
                        <TextField
                        ref="description"
                        floatingLabelText="Description"
                        defaultValue={hairfie.description || ''}
                        />
                    </div>
                </div>
                <select ref="hairdresser">
                    <option value="">Sélectionnez un coiffeur</option>
                    {_.map(business.activeHairdressers, hairdresser => {
                        return <option value={hairdresser.id}>{hairdresser.firstName + ' ' + hairdresser.lastName}</option>
                    })}
                </select>
                <div style={{marginTop: '45px', width: '100%', overflow: 'auto'}}>
                    {_.map(tags, tag => <Checkbox style={{float: 'left', width: '25%', minWidth: '75px', marginLeft: '15px'}} label={tag.name} ref={tag.name} defaultChecked={_.isEmpty(_.intersection([tag.id], _.map(hairfie.tags, 'id'))) ? false : true} />)}
                </div>
                <div className="Grid">
                    <RaisedButton className="Grid-cell" style={{marginTop: '45px'}} backgroundColor='skyblue' label="Valider les modifications" onClick={this.updateHairfie}/>
                    <RaisedButton className="Grid-cell" style={{marginTop: '45px', marginLeft: '20px'}} backgroundColor='tomato' label="Supprimer le Hairfie" onClick={this.removeHairfie}/>
                </div>
            </Layout>
        );
    }
    removeHairfie = (e) => {
        e.preventDefault();

        this.context.executeAction(HairfieActions.deleteHairfie, this.props.hairfie.id);
    }

    updateHairfie = (e) => {
        e.preventDefault();

        const update = {
            description: this.refs.description.getValue(),
            businessMemberId: this.refs.hairdresser.getDOMNode().value,
            tags: _.compact(_.map(this.props.tags, function(tag) {
                if (this.refs[tag.name].isChecked())
                    return tag.id;
            }.bind(this)))
        };

        if ( parseFloat(this.refs.price.getValue())) {
            update['price'] = {
                amount: parseFloat(this.refs.price.getValue()),
                currency: 'EUR'
            };
        }

        this.context.executeAction(HairfieActions.updateHairfie, {
            id: this.props.hairfie.id,
            hairfie: update
        });
    }
}

HairfiePage = connectToStores(HairfiePage, [
    'BusinessStore',
    'HairfieStore',
    'TagStore'
], (context, props) => ({
    business: context.getStore('BusinessStore').getById(props.businessId),
    hairfie: context.getStore('HairfieStore').getById(props.hairfieId),
    tags: context.getStore('TagStore').getAll()
}));

export default HairfiePage;
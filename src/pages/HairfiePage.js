import React, { PropTypes } from "react";
import _ from 'lodash';
import moment from 'moment';
moment.locale('fr');

import HairfieActions from '../actions/HairfieActions';
import { connectToStores } from 'fluxible-addons-react';

import Layout from '../components/Layout';
import Link from '../components/Link';
import { TextField, DropDownMenu, Menu, MenuItem, RaisedButton, Checkbox, CircularProgress, Paper } from '../components/UIKit';
import Picture from '../components/Image';
import ImageField from '../components/ImageField';

const PAGE_SIZE = 12;

function displayName(u) { const n = u || {}; return n.firstName+' '+(n.lastName || '').substr(0, 1); }

class HairfiePage extends React.Component {
    static contextTypes = {
        executeAction: PropTypes.func.isRequired
    }

    render() {
        const { business, tags, tagCategories } = this.props;
        const hairfie = this.props.hairfie || {};

        if (!hairfie || !tags) return this.renderLoader();

        const businessMembers = _.map(business.activeHairdressers, hairdresser => {
            return {
                payload: hairdresser.id, text: hairdresser.firstName + ' ' + hairdresser.lastName
            };
        });

        const firstPicture = hairfie.pictures && hairfie.pictures.length > 0 ? _.first(hairfie.pictures) : null;
        const lastPicture = hairfie.pictures && hairfie.pictures.length > 1 ? _.last(hairfie.pictures) : null;


        return (
            <Layout {...this.props}>
                <div className="hairfies" style={{width: '100%', overflow: 'auto'}}>
                    <div className="single-hairfie" style={{maxWidth: '300px'}}>
                        1ère Photo (ou Avant) :
                        <ImageField
                            ref="picture-0"
                            container="hairfies"
                            defaultImage={firstPicture} />
                    </div>
                    <div className="single-hairfie" style={{maxWidth: '300px'}}>
                        2nde Photo (ou Après) :
                        <ImageField
                            ref="picture-1"
                            container="hairfies"
                            defaultImage={lastPicture} />
                    </div>
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
                        ref="email"
                        floatingLabelText="Email du client"
                        defaultValue={hairfie.customerEmail || ''}
                        />
                    </div>
                </div>
                <select ref="hairdresser" defaultValue={hairfie.hairdresser && hairfie.hairdresser.id}>
                    <option value="">Sélectionnez un coiffeur</option>
                    {_.map(business.activeHairdressers, hairdresser => {
                            return <option value={hairdresser.id}>{hairdresser.firstName + ' ' + hairdresser.lastName}</option>
                    })}
                </select>
                <div style={{marginTop: '45px', width: '100%', overflow: 'auto'}}>
                    {_.map(tagCategories, category => {
                        return (
                            <div style={{width: '100%', overflow: 'auto'}}>
                                <h4>{category.name}</h4>
                                {_.map(_.where(tags, {category: {id: category.id}}), tag => <Checkbox
                                    style={{float: 'left', width: '25%', minWidth: '200px', marginLeft: '15px'}}
                                    label={tag.name} ref={tag.name}
                                    defaultChecked={_.isEmpty(_.intersection([tag.id], _.map(hairfie.tags, 'id'))) ? false : true} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="Grid">
                    <Link route="business_hairfies" params={{businessId: business.id}}>
                        <RaisedButton className="Grid-cell" style={{marginTop: '45px'}} backgroundColor='lightgreen' label="Retour"/>
                    </Link>
                    <RaisedButton className="Grid-cell" style={{marginTop: '45px', marginLeft: '20px'}} backgroundColor='skyblue' label="Sauver les modifications" onClick={this.createOrUpdate}/>
                    <RaisedButton className="Grid-cell" style={{marginTop: '45px', marginLeft: '20px'}} backgroundColor='tomato' label="Supprimer le Hairfie" onClick={this.removeHairfie}/>
                </div>
            </Layout>
        );
    }

    renderLoader() {
        return (
            <Layout {...this.props}>
                <CircularProgress mode="indeterminate" style={{position: 'fixed', top: '45%', 'left': '45%'}} />
            </Layout>
        );
    }

    removeHairfie = (e) => {
        e.preventDefault();

        this.context.executeAction(HairfieActions.deleteHairfie, {
            id: this.props.hairfie.id,
            businessId: this.props.business.id
        });
    }

    createOrUpdate = (e) => {
        e.preventDefault();



        const hairfie = {
            customerEmail: this.refs.email.getValue(),
            businessMemberId: this.refs.hairdresser.getDOMNode().value,
            pictures: _.map([0, 1], (index) => {
                const picture = this.refs["picture-"+index];
                if(picture) return picture.getImage();
            }),
            tags: _.compact(_.map(this.props.tags, function(tag) {
                if (this.refs[tag.name].isChecked())
                    return tag.id;
            }.bind(this)))
        };

        if ( parseFloat(this.refs.price.getValue())) {
            hairfie['price'] = {
                amount: parseFloat(this.refs.price.getValue()),
                currency: 'EUR'
            };
        }

        if(this.props.hairfie && this.props.hairfie.id) {
            this.context.executeAction(HairfieActions.updateHairfie, {
                id: this.props.hairfie.id,
                hairfie: hairfie,
                businessId: this.props.business.id
            });
        } else {
            this.context.executeAction(HairfieActions.createHairfie, {
                hairfie: hairfie,
                businessId: this.props.business.id
            }); 
        }
    }
}

HairfiePage = connectToStores(HairfiePage, [
    'BusinessStore',
    'HairfieStore',
    'TagStore'
], (context, props) => ({
    business: context.getStore('BusinessStore').getById(props.businessId),
    hairfie: props.hairfieId && context.getStore('HairfieStore').getById(props.hairfieId),
    tags: context.getStore('TagStore').getAll(),
    tagCategories: context.getStore('TagStore').getTagCategories()
}));

export default HairfiePage;
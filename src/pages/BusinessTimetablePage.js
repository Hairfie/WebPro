'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper, Menu, Dialog, TimePicker } from '../components/UIKit';
import { connectToStores } from 'fluxible/addons';
import Link, {FlatLink} from '../components/Link';
import BusinessActions from '../actions/BusinessActions';
import _ from 'lodash';
import moment from 'moment';

let enMoment = moment();
let frMoment = moment();
enMoment.locale('en');
frMoment.locale('fr');

class BusinessTimetablePage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            timetable: props.business.timetable
        };
    }

    menuItems (timetable) {
        const labelMenuItems = _.map(_.range(7), (i) => {
            const weekdayShort = enMoment.isoWeekday(i).format('ddd').toUpperCase();

            return {
                text: frMoment.isoWeekday(i).format('dddd'),
                data: _.map(timetable[weekdayShort], (t) => {
                        return `${t.startTime} à ${t.endTime}`;
                    }).join(', '),
                weekdayShort: weekdayShort
            }
        });

        return labelMenuItems;
    }

    render() {
        const {business} = this.props;

        return (
            <Layout {...this.props}>
                <DaySelectModal ref="modal" handleNewTimeslot={this._handleNewTimeslot}/>
                <h1>Horaires</h1>
                <br />
                <FlatButton label='Ajouter un horaire' onTouchTap={this.showModal} />
                <br />
                <Table items={this.menuItems(this.state.timetable)} onItemTap={this._onMenuItemTap} />
                <hr />
                <FlatLink route="business" params={{ businessId: business.id }} label='Annuler' secondary={true} />
                <FlatButton
                    label="Enregistrer les modifications"
                    primary={true}
                    onTouchTap={this.save} />
            </Layout>
        );
    }

    showModal = () => {
        this.refs.modal.show();
    }

    _onMenuItemTap = (payload) => {
        const newTimetable = this.state.timetable;
        delete newTimetable[payload.item.weekdayShort];
        this.setState({
            timetable: newTimetable
        });
    }

    _handleNewTimeslot = (payload) => {
        const merged = _.merge(payload.newTimetable, this.state.timetable, (a, b) => {
            if (_.isArray(a)) {
                return a.concat(b);
            }
        });
        this.setState({
            timetable: merged
        });
    }

    save = () => {
        const businessId = this.props.businessId;

        const values = {
            timetable: this.state.timetable
        };

        this.context.executeAction(BusinessActions.updateInfos, { businessId, values });
    }
}

class Table extends React.Component {
    render() {
        return (
            <table>
                {_.map(this.props.items, this.renderItem)}
            </table>
        );
    }

    renderItem = (item) => {
        return (
            <tr key={item.weekdayShort}>
                <td>{item.text} :</td>
                <td>{item.data}</td>
                <td>
                    <FlatButton
                        label="Supprimer"
                        secondary={true}
                        onTouchTap={this._handleItemTap.bind(this, item)} />
                </td>
            </tr>
        );
    }

    _handleItemTap(item) {
        this.props.onItemTap({
            item  : item,
        });
    }
}

class DaySelectModal extends React.Component {
    render() {
        const customActions = [
            <FlatButton
                label="Annuler"
                secondary={true}
                onTouchTap={this._handleCancel} />,
            <FlatButton
                label="Ajouter"
                primary={true}
                onTouchTap={this._handleSave} />
        ];

        return (
            <Dialog ref="dialog" actions={customActions}>
                <dl>
                  <dt>A partir de :</dt>
                  <dd><TimePicker ref="startTime" defaultValue="10:00" /></dd>
                  <dt>Jusque :</dt>
                  <dd><TimePicker ref="endTime" defaultValue="19:00" /></dd>
                  {this.renderDaysCheckboxes()}
                </dl>
            </Dialog>
        );
    }

    show() {
        this.refs.dialog.show();
    }

    renderDaysCheckboxes() {
        return _.map(_.range(7), (i) => {
            const label = frMoment.isoWeekday(i).format('ddd');
            const value = enMoment.isoWeekday(i).format('ddd').toUpperCase();
            return <Checkbox
                        key={i}
                        name={value}
                        value={value}
                        ref={value}
                        label={label} />
        });
    }

    _handleCancel = () => {
        this.refs.dialog.dismiss();
    }

    _getSelectedWeekdays = () => {
        return _.filter(_.map(_.range(7), (i) => {
            return enMoment.isoWeekday(i).format('ddd').toUpperCase();
        }), function (day) {
            return this.refs[day].isChecked();
        }, this);
    }

    _handleSave = () => {
        const startTime = this.refs.startTime.getValue();
        const endTime = this.refs.endTime.getValue();
        const newTimetable = _.reduce(this._getSelectedWeekdays(), (result, day) => {
            result[day] = [{
                startTime: startTime,
                endTime: endTime
            }]
            return result;
        }, {});

        this.props.handleNewTimeslot({
            newTimetable  : newTimetable,
        });

        this.refs.dialog.dismiss();
    }
}

BusinessTimetablePage = connectToStores(BusinessTimetablePage, [
    'BusinessStore'
], (stores, props) => {
    return {
        business : stores.BusinessStore.getById(props.businessId)
    };
});

export default BusinessTimetablePage;

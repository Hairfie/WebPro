'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link from '../components/Link';
import mui from 'material-ui';
import { TextField, DropDownMenu, Menu, MenuItem, FlatButton, RaisedButton, Checkbox, CircularProgress, Paper } from '../components/UIKit';
import BusinessClaimActions from '../actions/BusinessClaimActions';
import UserPicker from '../components/UserPicker';
import ImageField from '../components/ImageField';

class AddBusinessPage extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { user: (this.props.businessMember || {}).user };
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        console.log('BUSINESSCLAIM', this.props.businessClaim);
        if (!businessClaim) {
            return (
                <Layout {...this.props}>
                    <mui.TextField
                        ref="name"
                        floatingLabelText="Nom du salon"
                        />
                    <br/>
                    <br/>
                    <mui.RadioButtonGroup ref="kind" name="kind" defaultSelected='SALON'>
                        <mui.RadioButton value="SALON" label="Salon"  />
                        <mui.RadioButton value="AT_HOME" label="À domicile" />
                    </mui.RadioButtonGroup>
                    <mui.TextField
                        ref="phoneNumber"
                        floatingLabelText="Téléphone"
                        />
                    <br/>
                    <br/>
                    <h5>Pour qui ?</h5>
                    <mui.Checkbox
                        ref="women"
                        label="Femmes"
                        />
                    <mui.Checkbox
                        ref="men"
                        label="Hommes"
                        />
                    <mui.Checkbox
                        ref="children"
                        label="Enfants"
                        />
                    <br/>
                    <mui.RaisedButton label='Suivant' secondary={true} onClick={this.save} />
                </Layout>
            );
        }
        return (
            <Layout {...this.props}>
                HELLO
            </Layout>
        );
    }
    save = () => {
        const values = {
            name        : this.refs.name.getValue(),
            kind        : this.refs.kind.getSelectedValue(),
            phoneNumber : this.refs.phoneNumber.getValue(),
            men         : this.refs.men.isChecked(),
            women       : this.refs.women.isChecked(),
            children    : this.refs.children.isChecked()
        }
        console.log(values);
        this.context.executeAction(BusinessClaimActions.createBusinessClaim, { values });
    }
//     static defaultProps = {
//         businessMember: {}
//     }

//     save = () => {
//         const businessId = this.props.businessId;
//         const businessMemberId = this.props.businessMember.id;
//         const values = {
//             userId          : this.refs.user.getUserId(),
//             picture         : this.refs.picture.getImage(),
//             gender          : this.refs.gender.getSelectedValue(),
//             firstName       : this.refs.firstName.getValue(),
//             lastName        : this.refs.lastName.getValue(),
//             email           : this.refs.email.getValue(),
//             phoneNumber     : this.refs.phoneNumber.getValue(),
//             isOwner         : this.refs.isOwner.isChecked(),
//             willBeNotified  : this.refs.willBeNotified.isChecked(),
//             hidden          : !this.refs.isHairdresser.isChecked()
//         };

//         if (businessMemberId) {
//             this.context.executeAction(BusinessMemberActions.updateMember, { businessMemberId, values });
//         } else {
//             this.context.executeAction(BusinessMemberActions.createMember, { businessId, values });
//         }
//     }
}

AddBusinessPage = connectToStores(AddBusinessPage, [
    'BusinessClaimStore'
], (context, props) => {
    return {
        businessClaim: props.businessClaimId && context.getStore('BusinessClaimStore').getById(props.businessClaimId)
    };
});

export default AddBusinessPage;

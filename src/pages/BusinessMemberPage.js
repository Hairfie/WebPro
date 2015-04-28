'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible/addons';
import _ from 'lodash';
import Link from '../components/Link';
import mui from 'material-ui';
import BusinessMemberActions from '../actions/BusinessMemberActions';
import UserPicker from '../components/UserPicker';

class BusinessMemberPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: (this.props.businessMember || {}).user };
    }
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    static defaultProps = {
        businessMember: {}
    }
    render() {
        const businessId = this.props.businessId || this.props.businessMember.businessId;
        const businessMember = this.props.businessMember || {};
        const user = this.state.user;

        return (
            <Layout {...this.props}>
                <UserPicker
                    ref="user"
                    floatingLabelText="Utilisateur"
                    defaultUser={businessMember.user}
                    onChange={this.onUserChange}
                    />
                <br />
                <mui.RadioButtonGroup ref="gender" name="gender" defaultSelected={businessMember.gender} valueSelected={user && user.gender}>
                    <mui.RadioButton value="MALE" label="Monsieur"  />
                    <mui.RadioButton value="FEMALE" label="Madame" />
                </mui.RadioButtonGroup>
                <br />
                <mui.TextField
                    ref="firstName"
                    floatingLabelText="Prénom"
                    defaultValue={businessMember.firstName}
                    value={user && user.firstName}
                    disabled={!!user}
                    />
                <br />
                <mui.TextField
                    ref="lastName"
                    floatingLabelText="Nom"
                    defaultValue={businessMember.lastName}
                    value={user && user.lastName}
                    disabled={!!user}
                    />
                <br />
                <mui.TextField
                    ref="email"
                    type="email"
                    floatingLabelText="Email"
                    defaultValue={businessMember.email}
                    />
                <br />
                <mui.TextField
                    ref="phoneNumber"
                    floatingLabelText="Téléphone"
                    defaultValue={businessMember.phoneNumber}
                    />
                <br />
                <mui.Checkbox
                    ref="isHairdresser"
                    label="Afficher en tant que coiffeur"
                    defaultSwitched={!businessMember.hidden}
                    />
                <br />
                <mui.FlatButton label={businessMember.id ? 'Sauver les modifications' : 'Ajouter à l\'équipe'} onClick={this.save} />
                {' ou '}
                <Link route="business_members" params={{ businessId }}>Annuler</Link>
            </Layout>
        );
    }
    onUserChange = () => {
        this.setState({ user: this.refs.user.getUser() });
    }
    save = () => {
        const businessId = this.props.businessId;
        const businessMemberId = this.props.businessMember.id;
        const values = {
            userId: this.refs.user.getUserId(),
            gender: this.refs.gender.getSelectedValue(),
            firstName: this.refs.firstName.getValue(),
            lastName: this.refs.lastName.getValue(),
            email: this.refs.email.getValue(),
            phoneNumber: this.refs.phoneNumber.getValue(),
            hidden: !this.refs.isHairdresser.isChecked()
        };

        if (businessMemberId) {
            this.context.executeAction(BusinessMemberActions.updateMember, { businessMemberId, values });
        } else {
            this.context.executeAction(BusinessMemberActions.createMember, { businessId, values });
        }
    }
}

BusinessMemberPage = connectToStores(BusinessMemberPage, [
    'BusinessMemberStore'
], (stores, props) => {
    return {
        businessMember: props.businessMemberId && stores.BusinessMemberStore.getById(props.businessMemberId)
    };
});

export default BusinessMemberPage;

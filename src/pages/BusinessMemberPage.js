'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible/addons';
import _ from 'lodash';
import Link from '../components/Link';
import mui from 'material-ui';
import BusinessMemberActions from '../Actions/BusinessMemberActions';

class BusinessMemberPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    static defaultProps = {
        businessMember: {}
    }
    render() {
        const businessId = this.props.businessId || this.props.businessMember.businessId;
        const { businessMember: { id, firstName, lastName, email, phoneNumber, hidden } } = this.props;

        return (
            <Layout>
                <mui.TextField ref="firstName" floatingLabelText="Prénom" defaultValue={firstName} />
                <mui.TextField ref="lastName" floatingLabelText="Nom" defaultValue={lastName} />
                <mui.TextField ref="email" type="email" floatingLabelText="Email" defaultValue={email} />
                <mui.TextField ref="phoneNumber" floatingLabelText="Téléphone" defaultValue={phoneNumber} />
                <mui.Checkbox ref="isHairdresser" label="Afficher en tant que coiffeur" defaultChecked={!hidden} />
                <mui.FlatButton label={id ? 'Sauver les modifications' : 'Ajouter à l\'équipe'} onClick={this.save} />
                ou&nbsp;
                <Link route="business_members" params={{ businessId }}>Annuler</Link>
            </Layout>
        );
    }
    save = () => {
        const businessMemberId = this.props.businessMember.id;
        const values = {
            firstName: this.refs.firstName.getValue(),
            lastName: this.refs.lastName.getValue(),
            email: this.refs.email.getValue(),
            phoneNumber: this.refs.phoneNumber.getValue(),
            hidden: !this.refs.isHairdresser.isChecked()
        };

        if (businessMemberId) {
            this.context.executeAction(BusinessMemberActions.updateMember, { businessMemberId, values });
        } else {
            this.context.executeAction(BusinessMemberActions.createMember, { values });
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

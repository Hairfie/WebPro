'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { connectToStores } from 'fluxible-addons-react';
import _ from 'lodash';
import Link from '../components/Link';
import mui from 'material-ui';
import { TextField, DropDownMenu, Menu, MenuItem, FlatButton, RaisedButton, Checkbox, CircularProgress, Paper } from '../components/UIKit';
import BusinessMemberActions from '../actions/BusinessMemberActions';
import UserPicker from '../components/UserPicker';
import ImageField from '../components/ImageField';
import Picture from '../components/Image';

class BusinessMemberPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            user: (this.props.businessMember || {}).user,
            displayRequiredMessage: false
        };
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
                {this.renderUserPickerBloc()}      
                <ImageField
                    ref="picture"
                    container="business-members"
                    defaultImage={businessMember.picture}
                    />
                <br />
                <mui.RadioButtonGroup ref="gender" name="gender" defaultSelected={businessMember.gender} valueSelected={user && user.gender}>
                    <mui.RadioButton value="MALE" label="Monsieur"  />
                    <mui.RadioButton value="FEMALE" label="Madame" />
                </mui.RadioButtonGroup>
                <br />
                <mui.TextField
                    ref="firstName"
                    floatingLabelText="Prénom*"
                    defaultValue={businessMember.firstName}
                    />
                <br />
                <mui.TextField
                    ref="lastName"
                    floatingLabelText="Nom*"
                    defaultValue={businessMember.lastName}
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
                <mui.TextField
                    ref="jobTitle"
                    floatingLabelText="Titre"
                    defaultValue={businessMember.title}
                    />
                <br />
                <mui.Checkbox
                    ref="isHairdresser"
                    label="Afficher en tant que coiffeur"
                    defaultChecked={!businessMember.hidden}
                    />
                <mui.Checkbox
                    ref="isOwner"
                    label="Est un gérant du salon"
                    defaultChecked={businessMember.isOwner}
                    />
                <mui.Checkbox
                    ref="willBeNotified"
                    label="Activer les SMS & Emails de rappel"
                    defaultChecked={businessMember.willBeNotified}
                    />
                <br />
                {this.displayRequiredMessage()}
                <mui.FlatButton label={businessMember.id ? 'Sauver les modifications' : 'Ajouter à l\'équipe'} onClick={this.save} />
                {' ou '}
                <Link route="business_members" params={{ businessId }}>Annuler</Link>
            </Layout>
        );
    }
    renderUserPickerBloc() {
        const businessMember = this.props.businessMember || {};
        return (
            <Paper style={{maxWidth: 400, padding: 10 }}>
                <UserPicker
                    ref="user"
                    floatingLabelText="Utilisateur"
                    defaultUser={businessMember.user}
                    onChange={this.onUserChange}
                    />
                {this.renderUserInfos()}
            </Paper>
        );
    }
    renderUserInfos() {
        const user = this.props.linkedUser;
        if (_.isEmpty(user)) return null;
        var pictureUrl = user.picture ? user.picture.url : null;
        return (
            <div>
                <h4>Infos utilisateur</h4>
                <div className="user-infos">
                    <Picture image={user.picture} />
                    <div className="text-bloc">
                        {`Prénom : ${user.firstName}`}
                        {`Nom : ${user.lastName}`}
                        {user.email ? `Email : ${user.email}` : null}
                        {user.phoneNumber ? `Téléphone : ${user.phoneNumber}`: null}
                        <a href={pictureUrl} target="_blank">Accès photo</a>
                    </div>
                </div>
                <FlatButton label='Utiliser ces données' secondary={true} onClick={this.transferUserData} />
                {this.renderDetachUserButton()}
            </div>
        );
    }
    renderDetachUserButton() {
        if(!this.props.businessMember) return;
        return (
            <FlatButton label="Détacher l'utilisateur" secondary={true} onClick={this.detachUser} />
        );
    }
    detachUser = () => {
        const values = {userId: null};
        const businessMemberId = this.props.businessMember.id;
        this.context.executeAction(BusinessMemberActions.updateMember, { businessMemberId, values });
    }
    transferUserData = () => {
        const user = this.state.user;
        this.setState({user: this.refs.user.getUser()});
        this.refs.firstName.setValue(user.firstName);
        this.refs.lastName.setValue(user.lastName);
        this.refs.email.setValue(user.email);
        this.refs.phoneNumber.setValue(user.phoneNumber);
    }
    displayRequiredMessage = () => {
        if (!this.state.displayRequiredMessage) return;
        return (
            <div className="error">
                Vous devez enregistrer un nom et un prénom.
            </div>
        );
    }
    onUserChange = () => {
        this.setState({ user: this.refs.user.getUser() });
    }
    save = () => {
        const businessId = this.props.businessId;
        const businessMemberId = this.props.businessMember.id;
        const values = {
            userId          : this.refs.user.getUserId(),
            picture         : this.refs.picture.getImage(),
            gender          : this.refs.gender.getSelectedValue(),
            firstName       : this.refs.firstName.getValue(),
            lastName        : this.refs.lastName.getValue(),
            email           : this.refs.email.getValue(),
            phoneNumber     : this.refs.phoneNumber.getValue(),
            isOwner         : this.refs.isOwner.isChecked(),
            willBeNotified  : this.refs.willBeNotified.isChecked(),
            hidden          : !this.refs.isHairdresser.isChecked(),
            title           : this.refs.jobTitle.getValue()

        };
        if (this.refs.firstName.getValue() == '' || this.refs.lastName.getValue() == '') {
            this.setState({displayRequiredMessage: true});
        }
        else if (businessMemberId) {
            this.context.executeAction(BusinessMemberActions.updateMember, { businessMemberId, values });
        } else {
            this.context.executeAction(BusinessMemberActions.createMember, { businessId, values });
            this.setState({displayRequiredMessage: false});
        }
    }
}

BusinessMemberPage = connectToStores(BusinessMemberPage, [
    'BusinessMemberStore',
    'UserStore'
], (context, props) => {
    const businessMember = props.businessMemberId && context.getStore('BusinessMemberStore').getById(props.businessMemberId);
    const linkedUser = businessMember && context.getStore('UserStore').getById(businessMember.userId);
    return {
        businessMember: businessMember,
        linkedUser: linkedUser
    };
});

export default BusinessMemberPage;

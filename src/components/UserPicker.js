'use strict';

import React from 'react';
import _ from 'lodash';
import mui from 'material-ui';
import { Dialog, TextField } from '../components/UIKit';
import Image from './Image';

const MIN_CHARS = 2;

class Suggestions extends React.Component {
    static contextTypes = {
        getStore: React.PropTypes.func.isRequired
    }
    componentWillMount() {
        this.context.getStore('UserStore').addChangeListener(this.onStoreChange);
        this.setState(this.getStateFromStores(this.props));
    }
    componentWillUnmount() {
        this.context.getStore('UserStore').removeChangeListener(this.onStoreChange);
    }
    componentWillReceiveProps(nextProps) {
        this.setState(this.getStateFromStores(this.props));
    }
    getStateFromStores({ q }) {
        const users = (q || '').length < MIN_CHARS ? [] : this.context.getStore('UserStore').getSuggestions(q);
        const loading = !users;
        return { loading, users };
    }
    onStoreChange = () => {
        this.setState(this.getStateFromStores(this.props));
    }
    render() {
        const { loading, users } = this.state;

        if (loading) return <p>Chargement...</p>;

        return (
            <div>
                {_.map(users, user => this.renderUser(user))}
            </div>
        );
    }
    renderUser(user) {
        let image;
        if (user.picture) {
            image = <Image image={user.picture} options={{ width: 50, height: 50, crop: 'thumb' }} />;
        }

        return (
            <div key={user.id} style={{ margin: '10px', position: 'relative' }} onClick={this.select.bind(this, user)}>
                <div style={{ width: '50px', height: '50px', background: '#eee', marginRight: '10px', float: 'left', display: 'block' }}>
                    {image}
                </div>
                {user.firstName+' '+user.lastName}
                <div style={{ clear: 'both' }} />
            </div>
        );
    }
    select = (user) => {
        this.props.onSelect(user);
    }
}

class Picker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <TextField ref="input" type="search" placeholder="Nom à chercher..."  onChange={this.onInputChange} />
                <Suggestions key={'q'+this.state.q} q={this.state.q} onSelect={this.props.onSelect} />
            </div>
        );
    }
    componentDidMount() {
        this.reset();
        this.focus();
    }
    reset() {
        this.refs.input.clearValue();
        this.onInputChange();
    }
    focus() {
        this.refs.input.focus();
    }
    onInputChange = () => {
        this.setState({ q: this.refs.input.getValue() });
    }
}

class Modal extends React.Component {
    render() {
        return (
            <Dialog ref="dialog" onShow={this.onDialogShow} {...this.props}>
                <Picker onSelect={this.onPickerSelect} />
            </Dialog>
        );
    }
    show() {
        this.refs.dialog.show();
    }
    onPickerSelect = (user) => {
        this.refs.dialog.dismiss();
        this.props.onSelect(user);
    }
}

class UserPicker extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    static defaultProps = {
        onChange: _.noop
    }
    render() {
        const {
            onChange,
            onFocus,
            onTouchTap,
            ...otherProps
        } = this.props;

        const user = this.getUser();

        return (
            <div>
                <TextField ref="input" value={this.formatInputValue(user)} onFocus={this.onInputFocus} onTouchTap={this.onInputTouchTap} {...otherProps} />
                <Modal ref="dialog" onSelect={this.onDialogSelect} />
            </div>
        );
    }
    getUser() {
        if (_.isUndefined(this.state.user)) {
            return this.props.defaultUser;
        }

        return this.state.user;
    }
    getUserId() {
        const user = this.getUser();
        return user ? user.id : null;
    }
    setUser(user) {
        this.setState({ user: user });
        this.refs.input.setValue(this.formatInputValue(user));
    }
    formatInputValue(user) {
        return user ? user.firstName+' '+user.lastName : '';
    }
    onInputFocus = (e) => {
        e.preventDefault();
        e.target.blur();
    }
    onInputTouchTap = (e) => {
        e.preventDefault();
        this.refs.dialog.show();
    }
    onDialogSelect = (user) => {
        this.setState({ user }, () => this.props.onChange());
    }
}

export default UserPicker;

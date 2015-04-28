'use strict';

import React from 'react';
import UserPicker from '../components/UserPicker';
import Layout from '../components/Layout';
import AuthActions from '../actions/AuthActions';

class ImpersonateTokenPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        return (
            <Layout>
                <UserPicker ref="user" onChange={this.onUserChange} />
            </Layout>
        );
    }
    onUserChange = () => {
        const user = this.refs.user.getUser();
        this.context.executeAction(AuthActions.impersonateToken, { user });
    }
}

export default ImpersonateTokenPage;

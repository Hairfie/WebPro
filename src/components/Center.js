'use strict';

import React from 'react';

export default class Center extends React.Component {
    render() {
        const { children} = this.props;
        return (
            <div style={{'textAlign': 'center'}}>
                { children }
            </div>
        );
    }
}

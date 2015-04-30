import React from 'react';
import mui from 'material-ui';

export default class TimePicker extends React.Component {
    render() {
        return <mui.TextField ref="input" {...this.props} type="time" defaultValue={this.props.defaultValue} />;
    }
    getValue = () => {
        return this.refs.input.getValue();
    }
}
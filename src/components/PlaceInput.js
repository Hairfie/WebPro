'use strict';

import React from 'react';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper } from '../components/UIKit';
import _ from 'lodash';
import GetGoogleMapsSDK from '../services/getGoogleMapScript';

const componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  country: 'long_name',
  postal_code: 'short_name'
};


export default class PlaceInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            autocomplete: null
        };
    }
    static propTypes = {
        types: React.PropTypes.array,
        onPlaceChanged: React.PropTypes.func
    }
    static defaultProps = {
        types: ['geocode'],
        onPlaceChanged: function () {}
    }

    render() {
        return (
            <div className="mui-text-field">
                <input
                    ref="input"
                    type="search"
                    className="mui-text-field-input"
                    onChange={this.onInputChange} />
                <hr className="mui-text-field-underline" />
                <hr className="mui-text-field-focus-underline" />
            </div>
        );
    }

    componentDidMount() {
        GetGoogleMapsSDK
            .loadMaps()
            .then(function (google) {
                var input = this.refs.input.getDOMNode();
                var options = {};
                options.types = this.props.types;

                var autocomplete = new google.maps.places.Autocomplete(input, options);

                google.maps.event.addListener(autocomplete, 'place_changed', this.handlePlaceChanged);
                this.setState({
                    autocomplete: autocomplete
                });
            }.bind(this));
    }

    handlePlaceChanged = () => {
        var place = this.state.autocomplete.getPlace();
        this.props.onPlaceChanged(place);
    }

    getValue = () => {
        return this.refs.input.getValue();
    }

    getFormattedAddress = () => {
        var place = this.state.autocomplete.getPlace();
        if(!place) return this.refs.input.getDOMNode().value;
        return place.formatted_address;
    }

    getPlace = () => {
        return this.state.autocomplete.getPlace();
    }

    getLocation = () => {
    }

    getHairfieFormattedAddress = () => {
    }
}
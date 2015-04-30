'use strict';

import React from 'react';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper } from '../components/UIKit';
import _ from 'lodash';

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

    static contextTypes = {
        getGoogleMapsScript: React.PropTypes.func.isRequired
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
        this.context.getGoogleMapsScript()
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
        const { geometry: {location} } = this.state.autocomplete.getPlace();
        return {
            lat: location.lat(),
            lng: location.lng()
        }
    }

    getHairfieFormattedAddress = () => {
        const { address_components } = this.state.autocomplete.getPlace();
        const parsedPlace = parsePlace(address_components);

        return {
            street  : `${(parsedPlace.street_number || {}).long_name} ${(parsedPlace.route || {}).long_name}`,
            city    : (parsedPlace.locality || {}).long_name,
            zipCode : (parsedPlace.postal_code || {}).long_name,
            country : (parsedPlace.country || {}).short_name
        }
    }
}

function parsePlace(address_components){
    return _.reduce(address_components, function(result, component) {
        result[component.types[0]] = {
            long_name: component.long_name,
            short_name: component.short_name
        };
        return result;
    }, {});
 };
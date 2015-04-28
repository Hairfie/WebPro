'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { FlatButton, TextField, Checkbox, RadioButton, RadioButtonGroup, Paper } from '../components/UIKit';
import { connectToStores } from 'fluxible/addons';
import Link, {FlatLink} from '../components/Link';
import BusinessActions from '../actions/BusinessActions';
import _ from 'lodash';
import GetGoogleMaps from '../plugins/getGoogleMap';

const DEFAULT_LOCATION = {lat: 48.867439, lng: 2.343644};

class AddressInputGroup extends React.Component {
    render () {
        const { address } = this.props;

        return (
            <Paper>
                <h4>Adresse</h4>
                <br />
                <TextField ref="street" type="text" floatingLabelText="Numéro et nom de voie" defaultValue={address.street} />
                <TextField ref="city" type="text" floatingLabelText="Ville" defaultValue={address.city} />
                <TextField ref="zipCode" type="text" floatingLabelText="Code postal" defaultValue={address.zipCode} />
                <div className="clearfix" />
            </Paper>
        );
    }

    getAddress() {
        return {
            street  : this.refs.street.getValue(),
            city    : this.refs.city.getValue(),
            zipCode : this.refs.zipCode.getValue(),
            country : 'FR'
        };
    }
}

class BusinessMapPage extends React.Component {
    constructor(props) {
        super(props);
        const { business: {gps} } = this.props;

        this.state = {
            location        : gps || DEFAULT_LOCATION,
            map             : null,
            marker          : null,
            markerHasMoved  : false
        };
    }

    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    render() {
        const { business } = this.props;

        this.updateMap();

        return (
            <Layout ref="layout" {...this.props}>
                <h1>Adresse & Carte</h1>
                <AddressInputGroup address={business.address} ref="address" />
                <br />
                <div ref="map" style={{width: '100%', minHeight: '200px'}}/>
                <FlatButton label='Sauver les modifications' onClick={this.save} />
                {' ou '}
                <FlatLink route="business" params={{ businessId: business.id }} label='Annuler' />
            </Layout>
        );
    }

    componentDidMount() {
        createMap(this.refs.map.getDOMNode())
            .then(function (map) {
                this.setState({map: map});
                return createMarker(map, this.onMarkerMoved);
            }.bind(this))
            .then(function (marker) {
                this.setState({marker: marker});
            }.bind(this));
    }

    updateMap() {
        if (this.state.map && !this.state.markerHasMoved) {
            this.state.map.panTo(this.state.location);
        }
        if (this.state.marker) {
            this.state.marker.setPosition(this.state.location);
        }
    }

    onMarkerMoved = (marker) => {

        this.setState({
            markerHasMoved: true,
            location      : {
                lat: this.state.marker.position.lat(),
                lng: this.state.marker.position.lng()
            }
        });
        debugger;
        this.props.onChange();
    }

    save = () => {
        const businessId = this.props.businessId;

        const values = {
            address: this.refs.address.getAddress()
            //gps = this.refs.address.getGps();
        };

        this.context.executeAction(BusinessActions.updateInfos, { businessId, values });
    }
}

function createMap(el) {
    var options = {};
    options.zoom = 16;
    return GetGoogleMaps()
        .then(function (google) {
            return new google.maps.Map(el, options);
        });
}

function createMarker(map, onMoved) {
    var options = {};
    options.map = map;
    options.position = map.getCenter();
    options.draggable = true;

    return GetGoogleMaps()
        .then(function (google) {
            var marker = new google.maps.Marker(options);
            google.maps.event.addListener(marker, 'dragend', onMoved);
            return marker;
        });
}

BusinessMapPage = connectToStores(BusinessMapPage, [
    'BusinessStore'
], (stores, props) => ({
    business : stores.BusinessStore.getById(props.businessId)
}));

export default BusinessMapPage;

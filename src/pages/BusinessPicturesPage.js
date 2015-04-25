'use strict';

import React from 'react';
import Layout from '../components/Layout';
import { Image, FlatButton } from '../components/UIKit';
import { connectToStores } from 'fluxible/addons';
import BusinessActions from '../actions/BusinessActions';

class Picture extends React.Component {
    render() {
        return (
            <Image image={this.props.picture} options={{
                width: 200,
                height: 200,
                crop: 'thumb'
            }} />
        );
    }
}

class Uploading extends React.Component {
    render() {
        return (
            <p>Upload en cours...</p>
        );
    }
}

class BusinessPicturesPage extends React.Component {
    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }
    render() {
        const pictures = this.props.business.pictures || [];
        const uploadIds = this.props.uploadIds || [];

        return (
            <Layout>
                <h1>Photos</h1>
                {pictures.map(picture => <Picture key={picture.id} picture={picture} />)}
                {uploadIds.map(uploadId => <Uploading key={uploadId} />)}
                <FlatButton label="Ajouter une photo" onClick={this.addPicture} />
                <input ref="file" type="file" style={{display: 'none'}} onChange={this.upload} />
            </Layout>
        );
    }
    addPicture = (e) => {
        e.preventDefault();
        React.findDOMNode(this.refs.file).click();
    }
    upload = (e) => {
        e.preventDefault();
        this.context.executeAction(BusinessActions.addPicture, {
            business: this.props.business,
            file    : e.target.files[0]
        });
    }
}

BusinessPicturesPage = connectToStores(BusinessPicturesPage, [
    'BusinessStore'
], (stores, props) => ({
    business : stores.BusinessStore.getById(props.businessId),
    uploadIds: stores.BusinessStore.getPictureUploadIds(props.businessId)
}));

export default BusinessPicturesPage;

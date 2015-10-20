'use strict';

import React from 'react';
import _ from 'lodash';
import UploadActions from '../actions/UploadActions';
import Uuid from 'uuid';
import Image from './Image';
import { FlatButton, RaisedButton } from './UIKit';

class UploadProgress extends React.Component {
    static defaultProps = {
        onEnd: _.noop
    }

    static contextTypes = {
        getStore: React.PropTypes.func.isRequired
    }

    constructor(props) {
        super(_.merge({}, props, {
            onEnd: _.once(props.onEnd)
        }));

        this.state = {
            finished: false,
            percent : 0
        };
    }

    componentWillMount() {
        this.context.getStore('UploadStore').addChangeListener(this.onStoreChange);
        this.setState(this.getStateFromStores());
    }

    componentWillUnmount() {
        this.context.getStore('UploadStore').removeChangeListener(this.onStoreChange);
    }

    getStateFromStores() {
        const { finished, percent } = this.context.getStore('UploadStore').getById(this.props.uploadId) || {};

        return {
            finished: finished || false,
            percent : percent || 0
        };
    }

    onStoreChange = () => {
        this.setState(this.getStateFromStores(), () => {
            if (this.state.finished) {
                const upload = this.context.getStore('UploadStore').getById(this.props.uploadId);
                this.props.onEnd(upload);
            }
        });
    }

    render() {
        const { percent } = this.state;

        if (percent == 100) {
            return <p>On tient le bon bout, encore quelques instants...</p>;
        }

        return  <p>{'Envoi en cours ('+percent+'%)...'}</p>;
    }
}

class ImageField extends React.Component {
    static defaultProps = {
        onChange: _.noop
    }

    static contextTypes = {
        executeAction: React.PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            image: this.props.defaultImage,
            uploadId: null
        };
    }

    render() {
        var styles = {
            imageField: {
                padding: '10px'
            },
            thumb: {
                width: '50px',
                height: '50px',
                background: '#fafafa',
                float: 'left',
                marginRight: '10px'
            }
        };

        return (
            <div style={styles.imageField}>
                <div style={styles.thumb}>
                    {this.renderThumb()}
                </div>
                <div className="infos">
                    {this.renderInfos()}
                </div>
                <div style={{ clear: 'both' }}>&nbsp;</div>
                <input ref="input" type="file" accept="image/gif, image/jpeg, image/jpg, image/png" style={{ display: 'none' }} onChange={this.upload.bind(this)} />
            </div>
        );
    }

    renderThumb() {
        const { image } = this.state;
        const options = { width: 50, height: 50, crop: 'thumb' };

        if (image) {
            return <Image {...{image, options}} />;
        }
    }

    renderInfos() {
        if (this.state.uploadId) {
            return <UploadProgress ref="upload" uploadId={this.state.uploadId} onEnd={this.onUploadEnd.bind(this)} />;
        } else if (this.state.image) {
            return <a href="#" onClick={this.chooseFile}>Remplacer la photo</a>;
        } else {
            return <a href="#" onClick={this.chooseFile}>Sélectionner une photo</a>;
        }
    }

    getImage() {
        return this.state.image;
    }

    setImage(image) {
        this.setState({ image }, () => this.props.onChange());
    }

    clearImage() {
        this.setImage(null);
    }

    chooseFile = (e) => {
        e.preventDefault();
        React.findDOMNode(this.refs.input).value = null;

        React.findDOMNode(this.refs.input).click();
    }

    upload = (e) => {
        const uploadId = Uuid.v4();
        const { container } = this.props;
        const file = e.target.files[0];
        this.context.executeAction(UploadActions.uploadImage, { uploadId, container, file });
        this.clearImage();

        this.setState({ uploadId });
    }

    onUploadEnd = (upload) => {
        this.setState({ uploadId: null });

        if (upload.image) {
            this.setImage(upload.image);
        }
    }
}

export default ImageField;

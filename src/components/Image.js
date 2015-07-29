'use strict';

import React from 'react';
import cloudinary from 'cloudinary/lib/utils';
import _ from 'lodash';

export default class Image extends React.Component {
    static propTypes = {
        options: React.PropTypes.object
    }
    static defaultProps = {
        options: {}
    }
    render() {
        return <img src={this.getSrc()} {...this.props} />;
    }
    getSrc() {
        if (!this.props.image) return this.props.placeholder;

        var options = _.assign({
            type: this.props.image.cloudinary.type,
            cloud_name: this.props.image.cloudinary.cloudName
        }, this.props.options, {
            transformation: _.flatten(
                this.props.image.cloudinary.transformation,
                this.props.options.transformation
            )
        });

        return cloudinary.url(this.props.image.cloudinary.publicId, options);
    }
}

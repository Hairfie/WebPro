'use strict';

import BaseStore from './BaseStore';
import Actions from '../constants/Actions';

const EMPTY_UPLOAD = {
    finished: false,
    success: false,
    failure: false,
    percent: 0,
    error: null,
    image: null
};

export default class AuthStore extends BaseStore {

    static storeName = 'UploadStore';

    static EMPTY_UPLOAD = {
        finished: false,
        success: false,
        failure: false,
        percent: 0,
        error: null,
        image: null
    };

    static handlers = {
        [Actions.UPLOAD_START]: 'onUploadStart',
        [Actions.UPLOAD_PROGRESS]: 'onUploadProgress',
        [Actions.UPLOAD_SUCCESS]: 'onUploadSuccess',
        [Actions.UPLOAD_FAILURE]: 'onUploadFailure'
    }

    constructor(dispatcher) {
        super(dispatcher);

        this.uploads = {};
    }

    onUploadStart({ uploadId }) {
        this.uploads[uploadId] = _.cloneDeep(EMPTY_UPLOAD);

        this.emitChange();
    }

    onUploadProgress({ uploadId, percent }) {
        this.uploads[uploadId] = _.assign(this.uploads[uploadId] || _.cloneDeep(EMPTY_UPLOAD), { percent });


        this.emitChange();
    }

    onUploadSuccess({ uploadId, image }) {
        this.uploads[uploadId] = _.assign(this.uploads[uploadId] || _.cloneDeep(EMPTY_UPLOAD), {
            percent: 100,
            finished: true,
            success: true,
            image
        });

        this.emitChange();
    }

    onUploadFailure({ uploadId, error }) {
        console.log("onUploadFailure uploadId", uploadId)
        this.uploads[uploadId] = _.assign(this.uploads[uploadId] || _.cloneDeep(EMPTY_UPLOAD), {
            finished: true,
            failure: true,
            error
        });

        this.emitChange();
    }

    getById(id) {
        if(this.uploads[id]) console.log("finished :", this.uploads[id].finished);

        return this.uploads[id];
    }

}

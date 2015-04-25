'use strict';

import Actions from '../constants/Actions';

const UploadActions {
    uploadImage(context, { uploadId, container, file }) {
        context.dispatch(Actions.UPLOAD_START, { uploadId });

        const onProgress = ({ percent }) => {
            context.dispatch(Actions.UPLOAD_PROGRESS, { uploadId, percent });
        };

        return context.hairfieApi
            .upload(container, file, { token, onProgress })
            .then(image => {
                context.dispatch(Actions.UPLOAD_SUCCESS, { uploadId, image });
            }, error => {
                context.dispatch(Actions.UPLOAD_FAILURE, { uploadId, error });
            });
    }
};

'use strict';

import Actions from '../constants/Actions';

const TagActions = {
    loadAll(context) {
        return context.hairfieApi
            .get('/tags')
            .then(function (tags) {
                context.dispatch(Actions.RECEIVE_TAGS, tags);
            });
    }
};

export default TagActions;
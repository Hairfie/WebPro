'use strict';

import Actions from '../constants/Actions';

const CategoryActions = {
    loadAll: function (context) {
        return context.hairfieApi
            .get('/categories')
            .then(
                categories =>context.dispatch(Actions.RECEIVE_CATEGORIES, categories)
            );
    }
};

export default CategoryActions;
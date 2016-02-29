'use strict';

import Actions from '../constants/Actions';

const SelectionAction = {
    loadAll: function (context) {
        return context.hairfieApi
            .get('/selections')
            .then(
                selections =>context.dispatch(Actions.RECEIVE_SELECTIONS, selections)
            );
    }
};

export default SelectionAction;
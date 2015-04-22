import actionUtils from "fluxible-action-utils/async";

import { navigateAction } from "flux-router-component";

// Actions to be executed before to render a request server-side,
function renderAction(context, { locale, url }, done) {

  actionUtils.executeMultiple(context, {
    navigate: {
      action: navigateAction,
      isCritical: true,
      params: { url }
    }
  }, (actionErrors) => {
    let err = null;

    if (actionErrors) {
      err = actionErrors.navigate || actionErrors.loadIntlMessages;
    }

    done(err);
  });

}

export default renderAction;

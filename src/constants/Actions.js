import keyMirror from "react/lib/keyMirror";

const Actions = keyMirror({

    CHANGE_ROUTE_START: null,
    CHANGE_ROUTE_SUCCESS: null,
    CHANGE_ROUTE_FAILURE: null,

    ERROR_404: null,
    ERROR_500: null,

    LOGIN_START: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILURE: null,
    LOGOUT: null,

    RECEIVE_USER: null,

    RECEIVE_USER_BUSINESSES: null,

    UPLOAD_START: null,
    UPLOAD_PROGRESS: null,
    UPLOAD_SUCCESS: null,
    UPLOAD_FAILURE: null

});

export default Actions;

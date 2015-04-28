import keyMirror from "react/lib/keyMirror";

const Actions = keyMirror({

    CHANGE_ROUTE_START: null,
    CHANGE_ROUTE_SUCCESS: null,
    CHANGE_ROUTE_FAILURE: null,

    ERROR_404: null,
    ERROR_401: null,
    ERROR_500: null,

    LOGIN_START: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILURE: null,
    LOGOUT: null,

    RECEIVE_USER: null,

    RECEIVE_USER_BUSINESSES: null,

    RECEIVE_BUSINESS: null,

    RECEIVE_BUSINESS_MEMBER: null,
    RECEIVE_BUSINESS_MEMBERS: null,

    RECEIVE_USER_SUGGESTIONS: null,

    UPLOAD_BUSINESS_PICTURE_START: null,
    UPLOAD_BUSINESS_PICTURE_END: null,

    UPDATE_BUSINESS_INFOS_START: null,
    UPDATE_BUSINESS_INFOS_END: null
});

export default Actions;

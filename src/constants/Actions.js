import keyMirror from "react/lib/keyMirror";

const Actions = keyMirror({

    CHANGE_ROUTE_START: null,
    CHANGE_ROUTE_SUCCESS: null,
    CHANGE_ROUTE_FAILURE: null,

    // fluxible-router actions
    NAVIGATE_START: null,
    NAVIGATE_SUCCESS: null,
    NAVIGATE_FAILURE: null,

    ERROR_404: null,
    ERROR_401: null,
    ERROR_403: null,
    ERROR_500: null,

    INFO: null,

    LOGIN_START: null,
    LOGIN_SUCCESS: null,
    LOGIN_FAILURE: null,
    LOGOUT: null,

    RECEIVE_USER: null,

    RECEIVE_USER_BUSINESSES: null,

    RECEIVE_BUSINESS: null,

    RECEIVE_BUSINESS_MEMBER: null,
    RECEIVE_BUSINESS_MEMBERS: null,

    RECEIVE_BUSINESS_SERVICE: null,
    RECEIVE_BUSINESS_SERVICES: null,
    DELETE_BUSINESS_SERVICE: null,

    RECEIVE_USER_SUGGESTIONS: null,

    UPLOAD_BUSINESS_PICTURE_START: null,
    UPLOAD_BUSINESS_PICTURE_END: null,

    UPDATE_BUSINESS_INFOS_START: null,
    UPDATE_BUSINESS_INFOS_END: null,

    REORDER_BUSINESS_PICTURE_START: null,

    UPLOAD_START: null,
    UPLOAD_PROGRESS: null,
    UPLOAD_SUCCESS: null,
    UPLOAD_FAILURE: null,

    RECEIVE_ADDRESS_PLACE: null,
    RECEIVE_BUSINESS_SEARCH_RESULT: null,

    RECEIVE_BOOKINGS: null,
    RECEIVE_BOOKING: null,
    UPDATE_BOOKING_START: null,

    DELETE_BOOKING_SUCCESS: null,

    RECEIVE_HAIRFIE: null,
    RECEIVE_BUSINESS_HAIRFIE: null,

    DELETE_HAIRFIE: null,

    RECEIVE_CATEGORIES: null,
    RECEIVE_TAGS: null,
    RECEIVE_TAG_CATEGORIES: null,

    RECEIVE_SELECTIONS: null,

    RECEIVE_BUSINESS_CLAIM: null
});

export default Actions;

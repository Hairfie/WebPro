import PageActions from './actions/PageActions';

export default {
    home: {
        path: '/',
        method: 'get',

    },
    login: {
        path: '/login',
        method: 'get',
        action: PageActions.login
    },
    dashboard: {
        path: '/dashboard',
        method: 'get',
        action: PageActions.dashboard
    },
    business: {
        path: '/businesses/:businessId',
        method: 'get',
        action: PageActions.business
    },
    business_pictures: {
        path: '/businesses/:businessId/pictures',
        method: 'get',
        action: PageActions.business
    }
};

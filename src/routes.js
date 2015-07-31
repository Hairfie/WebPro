import PageActions from './actions/PageActions';

export default {
    home: {
        path: '/',
        method: 'get',
        title: 'Espace Pro Hairfie'
    },
    login: {
        path: '/login',
        method: 'get',
        title: 'Connexion',
        action: PageActions.login
    },
    logout: {
        path: '/logout',
        method: 'get',
        title: 'Déconnexion',
        action: PageActions.logout
    },
    impersonate_token: {
        path: '/impersonate-token',
        method: 'get',
        title: 'Prendre la main',
        action: PageActions.impersonateToken
    },
    business_search: {
        path: '/search',
        title: 'Recherche de salons',
        method: 'get'
    },
    repersonate_token: {
        path: '/repersonate_token',
        method: 'get',
        action: PageActions.repersonateToken
    },
    dashboard: {
        path: '/dashboard',
        method: 'get',
        title: 'Mes Salons',
        action: PageActions.dashboard
    },
    business: {
        path: '/businesses/:businessId',
        method: 'get',
        title: 'Mon Salon',
        action: PageActions.business
    },
    business_pictures: {
        path: '/businesses/:businessId/pictures',
        method: 'get',
        title: 'Les photos de mon salon',
        action: PageActions.business
    },
    business_infos: {
        path: '/businesses/:businessId/infos',
        method: 'get',
        title: 'Les infos de mon salons',
        action: PageActions.business
    },
    business_map: {
        path: '/businesses/:businessId/map',
        method: 'get',
        action: PageActions.business
    },
    business_members: {
        path: '/businesses/:businessId/members',
        method: 'get',
        action: PageActions.businessMembers
    },
    new_business_member: {
        path: '/businesses/:businessId/members/new',
        method: 'get'
    },
    edit_business_member: {
        path: '/business-members/:businessMemberId',
        method: 'get',
        action: PageActions.businessMember
    },
    business_timetable: {
        path: '/businesses/:businessId/timetable',
        method: 'get',
        action: PageActions.business
    },
    business_services: {
        path: '/businesses/:businessId/services',
        method: 'get',
        action: PageActions.businessServices
    },
    new_business_service: {
        path: '/businesses/:businessId/services/new',
        method: 'get'
    },
    edit_business_service: {
        path: '/business-services/:businessServiceId',
        method: 'get',
        action: PageActions.businessService
    },
    bookings: {
        path: '/bookings',
        method: 'get',
        title: 'Réservations',
        action: PageActions.bookings
    },
    booking: {
        path: '/bookings/:bookingId',
        method: 'get',
        title: 'Réservation'
    }
};

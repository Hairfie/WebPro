import PageActions from './actions/PageActions';

import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BusinessPage from './pages/BusinessPage';
import BusinessPicturesPage from './pages/BusinessPicturesPage';
import BusinessInfosPage from './pages/BusinessInfosPage';
import BusinessAdminPage from './pages/BusinessAdminPage';
import BusinessTimetablePage from './pages/BusinessTimetablePage';
import BusinessServicesPage from './pages/BusinessServicesPage';
import BusinessServicePage from './pages/BusinessServicePage';
import BusinessMapPage from './pages/BusinessMapPage';
import BusinessMembersPage from './pages/BusinessMembersPage';
import BusinessMemberPage from './pages/BusinessMemberPage';
import ImpersonateTokenPage from './pages/ImpersonateTokenPage';
import BusinessSearchPage from './pages/BusinessSearchPage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import BusinessCategoriesPage from './pages/BusinessCategoriesPage';

export default {
    home: {
        path: '/',
        method: 'get',
        handler: HomePage,
        title: 'Espace Pro Hairfie'
    },
    login: {
        path: '/login',
        method: 'get',
        handler: LoginPage,
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
        handler: ImpersonateTokenPage,
        title: 'Prendre la main',
        action: PageActions.impersonateToken
    },
    business_search: {
        path: '/search',
        title: 'Recherche de salons',
        method: 'get',
        handler: BusinessSearchPage
    },
    repersonate_token: {
        path: '/repersonate_token',
        method: 'get',
        action: PageActions.repersonateToken
    },
    dashboard: {
        path: '/dashboard',
        method: 'get',
        handler: DashboardPage,
        title: 'Mes Salons',
        action: PageActions.dashboard
    },
    business: {
        path: '/businesses/:businessId',
        method: 'get',
        handler: BusinessPage,
        title: 'Mon Salon',
        action: PageActions.business
    },
    business_pictures: {
        path: '/businesses/:businessId/pictures',
        method: 'get',
        handler: BusinessPicturesPage,
        title: 'Les photos de mon salon',
        action: PageActions.business
    },
    business_infos: {
        path: '/businesses/:businessId/infos',
        method: 'get',
        handler: BusinessInfosPage,
        title: 'Les infos de mon salons',
        action: PageActions.business
    },
    business_admin: {
        path: '/businesses/:businessId/admin',
        method: 'get',
        handler: BusinessAdminPage,
        title: 'Gestion admin du salon',
        action: PageActions.business
    },
    business_map: {
        path: '/businesses/:businessId/map',
        method: 'get',
        handler: BusinessMapPage,
        action: PageActions.business
    },
    business_members: {
        path: '/businesses/:businessId/members',
        method: 'get',
        handler: BusinessMembersPage,
        action: PageActions.businessMembers
    },
    new_business_member: {
        path: '/businesses/:businessId/members/new',
        method: 'get',
        handler: BusinessMemberPage
    },
    edit_business_member: {
        path: '/business-members/:businessMemberId',
        method: 'get',
        handler: BusinessMemberPage,
        action: PageActions.businessMember
    },
    business_timetable: {
        path: '/businesses/:businessId/timetable',
        method: 'get',
        handler: BusinessTimetablePage,
        action: PageActions.business
    },
    business_services: {
        path: '/businesses/:businessId/services',
        method: 'get',
        handler: BusinessServicesPage,
        action: PageActions.businessServices
    },
    business_category: {
        path: '/businesses/:businessId/categories',
        method: 'get',
        handler: BusinessCategoriesPage,
        title: 'Spécialités & Catégories'
    },
    new_business_service: {
        path: '/businesses/:businessId/services/new',
        method: 'get',
        handler: BusinessServicePage
    },
    edit_business_service: {
        path: '/business-services/:businessServiceId',
        method: 'get',
        action: PageActions.businessService,
        handler: BusinessServicePage
    },
    bookings: {
        path: '/bookings',
        method: 'get',
        handler: BookingsPage,
        title: 'Réservations',
        action: PageActions.bookings
    },
    booking: {
        path: '/bookings/:bookingId',
        method: 'get',
        handler: BookingPage,
        title: 'Réservation'
    }
};

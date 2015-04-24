'use strict';

import testStore from './testStore';

import { expect } from 'chai';

import { CHANGE_ROUTE_START
       , CHANGE_ROUTE_SUCCESS
       , CHANGE_ROUTE_FAILURE
       , ERROR_404
       , ERROR_500
       } from '../../src/constants/Actions';

describe('RouteStore', () => {
    const fooRoute = { name: 'foo', url: '/foo' };
    const barRoute = { name: 'bar', url: '/bar' };

    var RouteStore, dispatch;

    beforeEach(() => {
        var test = testStore('RouteStore');
        RouteStore = test.store;
        dispatch = test.dispatch;
    });

    describe('isLoading', () => {
        it('returns FALSE after initialization', () => {
            expect(RouteStore.isLoading()).to.be.false;
            expect(RouteStore.emitChange.callCount).to.be.equal(0);
        });
        it('returns TRUE after change route start', () => {
            dispatch(CHANGE_ROUTE_START, fooRoute);

            expect(RouteStore.isLoading()).to.be.true;
            expect(RouteStore.emitChange.callCount).to.be.equal(1);
        });
        it('returns FALSE after change route success', () => {
            dispatch(CHANGE_ROUTE_START, fooRoute);
            dispatch(CHANGE_ROUTE_SUCCESS, fooRoute);

            expect(RouteStore.isLoading()).to.be.false;
            expect(RouteStore.emitChange.callCount).to.be.equal(2);
        });
        it('returns FALSE after change route failure', () => {
            dispatch(CHANGE_ROUTE_START, fooRoute);
            dispatch(CHANGE_ROUTE_FAILURE, fooRoute);

            expect(RouteStore.isLoading()).to.be.false;
            expect(RouteStore.emitChange.callCount).to.be.equal(2);
        });
        [CHANGE_ROUTE_SUCCESS, CHANGE_ROUTE_FAILURE].map(action => {
            it(`returns TRUE after ${action} of a previous change route start`, () => {
                dispatch(CHANGE_ROUTE_START, fooRoute);
                dispatch(CHANGE_ROUTE_START, barRoute);
                dispatch(action, fooRoute);

                expect(RouteStore.isLoading()).to.be.true;
                expect(RouteStore.emitChange.callCount).to.be.equal(2);
            });
        });
    });

    describe('getCurrentRoute', () => {
        it('returns NULL after initialization', () => {
            expect(RouteStore.getCurrentRoute()).to.be.null;
        });
        it('returns route after change route start', () => {
            dispatch(CHANGE_ROUTE_START, fooRoute);

            expect(RouteStore.getCurrentRoute()).to.be.equal(fooRoute);
        });
        [ERROR_404, ERROR_500].map(action => {
            it(`returns NULL after ${action}`, () => {
                dispatch(CHANGE_ROUTE_START, fooRoute);
                dispatch(action);

                expect(RouteStore.getCurrentRoute()).to.be.null;
            });
        });
    });

    describe('getCurrentPage', () => {
        it('returns NULL after initialization', () => {
            expect(RouteStore.getCurrentPage()).to.be.null;
        });
        it('returns route\'s page after change route start', () => {
            dispatch(CHANGE_ROUTE_START, fooRoute);

            expect(RouteStore.getCurrentPage()).to.be.equal('foo');
            expect(RouteStore.emitChange.callCount).to.be.equal(1);
        });
        it('returns NULL after ERROR_404', () => {
            dispatch(CHANGE_ROUTE_START, fooRoute);
            dispatch(ERROR_404);

            expect(RouteStore.getCurrentPage()).to.be.null;
            expect(RouteStore.emitChange.callCount).to.be.equal(2);
        });
        it('returns "error" after ERROR_500', () => {
            dispatch(CHANGE_ROUTE_START, fooRoute);
            dispatch(ERROR_500);

            expect(RouteStore.getCurrentPage()).to.be.equal('error');
            expect(RouteStore.emitChange.callCount).to.be.equal(2);
        });
    });
});

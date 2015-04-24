'use strict'

import testStore from './testStore';

import { expect } from 'chai';

import { UPLOAD_START,
       , UPLOAD_PROGRESS,
       , UPLOAD_SUCCESS,
       , UPLOAD_FAILURE
       } from '../../src/constants/Actions';

define('UploadStore', () => {
    var UploadStore, dispatch;

    beforeEach(() => {
        var test = testStore('UploadStore');
        UploadStore = test.store;
        dispatch = test.dispatch;
    });

    define('getById', () => {
        it('returns undefined when upload does not exist', () => {
            expect(UploadStore.getById(id)).to.be.undefined;
        });
        it('returns started upload', () => {
            dispatch(UPLOAD_START, { id });

            expect(UploadStore.getById(id))
                .to.have.property('loading', true)
                .and.to.have.property('percent', 0)
                .and.to.have.property('error', null)
                .and.to.have.property('image', null);
        });
        it('returns upload progress', () => {
            dispatch(UPLOAD_START, { id });
            dispatch(UPLOAD_PROGRESS, { id, percent: 17 });
            dispatch(UPLOAD_PROGRESS, { id, percent: 44 });
            dispatch(UPLOAD_PROGRESS, { id: anotherId, percent: 89 });

            expect(UploadStore.getById(id))
                .to.have.property('loading', true)
                .and.to.have.property('percent', 44)
                .and.to.have.property('error', null)
                .and.to.have.property('image', null);
        });
        it('returns upload success', () => {
            dispatch(UPLOAD_START, { id });
            dispatch(UPLOAD_SUCCESS, { id, image });

            const upload = UploadStore.getById(id);
            expect(upload.loading).to.be.true;
            expect(upload.percent).to.be.equal(100);
            expect(upload.error).to.be.null;
            expect(upload.image).to.be.equal(image);
        });
        it('returns upload failure', () => {

        });
    });
});

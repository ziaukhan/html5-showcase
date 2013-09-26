
'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Html5 Showcase App', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });


    it('should automatically redirect to /main when location hash/fragment is empty', function() {
        expect(browser().location().url()).toBe("/");
    });



});

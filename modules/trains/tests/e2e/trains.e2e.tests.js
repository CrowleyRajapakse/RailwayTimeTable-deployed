'use strict';

describe('Trains E2E Tests:', function () {
  describe('Test Trains page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/trains');
      expect(element.all(by.repeater('train in trains')).count()).toEqual(0);
    });
  });
});

(function () {
  'use strict';

  angular
    .module('trains')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Trains',
      state: 'trains',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'trains', {
      title: 'List Trains',
      state: 'trains.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'trains', {
      title: 'Create Train',
      state: 'trains.create',
      roles: ['user']
    });
  }
}());

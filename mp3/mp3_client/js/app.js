// var demoApp = angular.module('demoApp', ['demoControllers']);

var taskManagerApp = angular.module('taskManagerApp', ['ngRoute', 'taskManagerControllers', 'demoServices', '720kb.datepicker']);

taskManagerApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UsersController'
  }).
  when('/users/:id', {
    templateUrl: 'partials/userDetails.html',
    controller: 'UsersController'
  }).
  when('/addUsers', {
    templateUrl: 'partials/addUsers.html',
    controller: 'UsersController'
  }).
  when('/tasks', {
    templateUrl: 'partials/tasks.html',
    controller: 'TasksController'
  }).
  when('/tasks/:id', {
    templateUrl: 'partials/taskDetails.html',
    controller: 'TasksController'
  }).
  when('/addTasks', {
    templateUrl: 'partials/addTasks.html',
    controller: 'TasksController'
  }).
  when('/editTasks/:id', {
    templateUrl: 'partials/editTasks.html',
    controller: 'TasksController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);
var imdb = angular.module('imdb', ['ngRoute']);

imdb.run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded', function () {
        $(document).foundation();
    });
});

imdb.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: './partials/list.html',
		controller: 'listController'
	})
	.when('/gallery', {
		templateUrl: './partials/gallery.html',
		controller: 'galleryController'
	})
	.when('/movie/:rank', {
		templateUrl: './partials/details.html',
		controller: 'detailsController'
	});
});
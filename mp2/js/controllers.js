imdb.controller('listController', ['$scope', '$http', '$filter', '$location', function($scope, $http, $filter, $location) {
  $http.get('./data/imdb250.json').success(function(data) {
    $scope.movies = data;
  });

  $scope.optionList = [
    { name: 'Title', val: 'title' },
    { name: 'Rank', val: 'rank'}
  ];

  $scope.getDetails = function(rank) {
    $location.path('/movie/' + rank);
  };
}]);

imdb.controller('galleryController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $http.get('./data/imdb250.json').success(function(data) {
    $scope.movies = data;
    $scope.currGenre = "";
  });

  $scope.genres = ['All', 'Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'];

  $scope.getDetails = function(rank) {
    $location.path('/movie/' + rank);
  };

  $scope.setGenre = function(genre) {
    console.log(genre);
    if (genre === "All") {
      $scope.currGenre = "";
    } else {
      $scope.currGenre = genre;
    }
  }
}]);

imdb.controller('detailsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  $http.get('./data/imdb250.json').success(function(data) {
    $scope.movies = data;
    $scope.currRank = $routeParams.rank;
    $scope.currMovie = data.filter(function(movie) {
      return movie.rank == $scope.currRank;
    })[0];
  });

  $scope.prev = function() {
    return (($scope.currMovie.rank - 2 + 250) % 250) + 1;
  };

  $scope.next = function() {
    return ($scope.currMovie.rank % 250) + 1;
  };
}]);
var taskManagerControllers = angular.module('taskManagerControllers', []);

taskManagerControllers.controller('UsersController', ['$scope', '$http', '$window', '$routeParams', 'CommonData', function($scope, $http, $window, $routeParams, CommonData) {
  $http.get($window.sessionStorage.baseurl + '/users').success(function(data) {
    $scope.users = data.data;
  });

  if ($routeParams.id) {
    $http.get($window.sessionStorage.baseurl + '/users/' + $routeParams.id).success(function(data) {
      $scope.detailsUser = data.data;

      if ($scope.detailsUser.pendingTasks.length > 0) {
        var pendingTasks = $scope.detailsUser.pendingTasks;

        for (var i = 0; i < pendingTasks.length; i++) {
          pendingTasks[i] = '"' + pendingTasks[i] + '"';
        }

        $http.get($window.sessionStorage.baseurl + '/tasks?where={_id:{$in:[' + pendingTasks + ']}}').success(function(data) {
          $scope.pendingTasks = data.data;
        });
      }
    });
  }

  $scope.deleteUser = function(userId) {
    $http.delete($window.sessionStorage.baseurl + '/users/' + userId).success(function(data) {
      $http.get($window.sessionStorage.baseurl + '/users').success(function(data) {
        $scope.users = data.data;
      });
    });
  };

  $scope.addUser = function() {
    if ($scope.name === undefined || $scope.email === undefined) {
      if ($scope.name === undefined && $scope.email === undefined)
        $scope.status = "A name and email is required.";
      else
        $scope.status = $scope.name === undefined ? "A name is required." : "An email is required.";
    } else {
      $http.post($window.sessionStorage.baseurl + '/users', { name: $scope.name, email: $scope.email }).success(function(data) {
        $scope.status = "User successfully added.";
      }).error(function(data) {
        $scope.status = "This email already exists.";
      });
    }

    $('#user-status').fadeIn();
    setTimeout(function() { $('#user-status').fadeOut(); }, 4000);
  };

  $scope.getCompletedTasks = function() {
    var userId = '"' + $scope.detailsUser._id + '"';
    $http.get($window.sessionStorage.baseurl + '/tasks?where={"assignedUser":' + userId + ',"completed":"true"}').success(function(data) {
      $scope.completedTasks = data.data;
    });
  };

  $scope.completeTask = function(task) {
    task.completed = true;
    $scope.detailsUser.pendingTasks.splice($scope.detailsUser.pendingTasks.indexOf(task._id));
    $http.put($window.sessionStorage.baseurl + '/tasks/' + task._id, task).success(function(data) {
      $http.put($window.sessionStorage.baseurl + '/users/' + $scope.detailsUser._id, $scope.detailsUser).success(function(data) {
        $http.get($window.sessionStorage.baseurl + '/users/' + $routeParams.id).success(function(data) {
          $scope.detailsUser = data.data;

          if ($scope.detailsUser.pendingTasks.length > 0) {
            var pendingTasks = $scope.detailsUser.pendingTasks;
            console.log("pendingTasks: " + pendingTasks);
            $http.get($window.sessionStorage.baseurl + '/tasks?where={_id:{$in:[' + pendingTasks + ']}}').success(function(data) {
              $scope.pendingTasks = data.data;
            });
          }
        });

        $scope.getCompletedTasks();
      });
    });
  };

}]);

taskManagerControllers.controller('TasksController', ['$scope', '$http', '$window', '$routeParams','CommonData' , function($scope, $http, $window, $routeParams, CommonData) {
  $http.get($window.sessionStorage.baseurl + '/tasks?limit=10').success(function(data) {
    $scope.tasks = data.data;
    $scope.limit = 10;
    $scope.skip = 0;
    $scope.predicate = "";
    $scope.order = 1;
    $scope.taskType = "false";
    $scope.taskUrl = constructUrl($scope.limit, $scope.skip, $scope.predicate, $scope.order, $scope.taskType);
    $http.get(constructUrl(0, $scope.skip, $scope.predicate, $scope.order, $scope.taskType) + '&count=true').success(function(data) {
      $scope.count = data.data;
    });
  });

  $http.get($window.sessionStorage.baseurl + '/users').success(function(data) {
    $scope.users = data.data;
  });

  if ($routeParams.id) {
    $http.get($window.sessionStorage.baseurl + '/tasks/' + $routeParams.id).success(function(data) {
      $scope.detailsTask = data.data;

      if ($scope.detailsTask.assignedUser) {
        $http.get($window.sessionStorage.baseurl + '/users/' + $scope.detailsTask.assignedUser).success(function(user) {
          $scope.assignedUser = user.data;
        });
      } else {
        $scope.assignedUser = "";
      }
    });
  }

  $scope.sortByOptions = [
    { key: "Name", value: "name" },
    { key: "Username", value: "assignedUserName" },
    { key: "Date Created", value: "dateCreated" },
    { key: "Deadline", value: "deadline" }
  ];

  $scope.deleteTask = function(taskId) {
    $http.delete($window.sessionStorage.baseurl + '/tasks/' + taskId).success(function(data) {
      $http.get(constructUrl(0, $scope.skip, $scope.predicate, $scope.order, $scope.taskType) + '&count=true').success(function(data) {
        $scope.count = data.data;
        $scope.taskUrl = constructUrl($scope.limit, $scope.skip, $scope.predicate, $scope.order, $scope.taskType);
        $http.get($scope.taskUrl).success(function(data) {
          $scope.tasks = data.data;
        });
      });
    });
  };

  $scope.nextTasks = function() {
    if ($scope.skip + $scope.limit < $scope.count) {
      $scope.skip += $scope.limit;
      $scope.taskUrl = constructUrl($scope.limit, $scope.skip, $scope.predicate, $scope.order, $scope.taskType);
    }

    $http.get($scope.taskUrl).success(function(data) {
      $scope.tasks = data.data;
    });
  };

  $scope.prevTasks = function() {
    if ($scope.skip >= $scope.limit) {
      $scope.skip -= $scope.limit;
      $scope.taskUrl = constructUrl($scope.limit, $scope.skip, $scope.predicate, $scope.order, $scope.taskType);
    }

    $http.get($scope.taskUrl).success(function(data) {
      $scope.tasks = data.data;
    });
  };

  $scope.changeFilter = function() {
    $scope.skip = 0;
    $scope.taskUrl = constructUrl($scope.limit, $scope.skip, $scope.predicate, $scope.order, $scope.taskType);
    console.log($scope.taskUrl);
    $http.get($scope.taskUrl).success(function(data) {
      $scope.tasks = data.data;
      $http.get(constructUrl(0, $scope.skip, $scope.predicate, $scope.order, $scope.taskType) + '&count=true').success(function(data) {
        $scope.count = data.data;
      });
    });
  };

  $scope.addTask = function() {
    if ($scope.name === undefined || $scope.deadline === undefined) {
      if ($scope.name === undefined && $scope.deadline === undefined)
        $scope.status = "A name and deadline is required.";
      else
        $scope.status = $scope.name === undefined ? "A name is required." : "A deadline is required.";
    } else {
      $http.post($window.sessionStorage.baseurl + '/tasks', { 
        name: $scope.name, 
        description: $scope.description, 
        deadline: $scope.deadline, 
        assignedUser: $scope.assigned._id, 
        assignedUserName: $scope.assigned.name })
      .success(function(data) {
        
        $scope.assigned.pendingTasks.push(data.data._id);
        $http.put($window.sessionStorage.baseurl + '/users/' + $scope.assigned._id, $scope.assigned)
        .success(function(data) {
          $scope.status = "Task successfully added.";
        })
        .error(function(data) {
          $scope.status = "User was not updated.";
        })
      }).error(function(data) {
        $scope.status = "This task already exists.";
      });
    }

    $('#user-status').fadeIn();
    setTimeout(function() { $('#user-status').fadeOut(); }, 4000);
  };

  $scope.editTask = function() {
    console.log("$scope.assignedUser: ")
    console.log($scope.assignedUser)

    if ($scope.assignedUser !== undefined) {
      if ($scope.assignedUser._id !== $scope.detailsTask.assignedUser) {
        if ($scope.detailsTask.completed === false) {
          if ($scope.assignedUser.pendingTasks)
            $scope.assignedUser.pendingTasks.push($scope.detailsTask._id);
          else
            $scope.assignedUser.pendingTasks = [$scope.detailsTask._id];

          $http.put($window.sessionStorage.baseurl + '/users/' + $scope.assignedUser._id, $scope.assignedUser).success(function(data) {
            if ($scope.detailsTask.assignedUserName !== "unassigned") {
              $scope.detailsUser.pendingTasks.splice($scope.detailsUser.pendingTasks.indexOf($scope.detailsTask.assignedUser));
              $http.put($window.sessionStorage.baseurl + '/users/' + $scope.detailsUser._id, $scope.detailsUser);
            }
          });
        }

        $scope.detailsTask.assignedUser = $scope.assignedUser._id;
        $scope.detailsTask.assignedUserName = $scope.assignedUser.name;
      }
    } else {
      $scope.detailsTask.assignedUser = "";
      $scope.detailsTask.assignedUserName = "unassigned";
    }
    console.log('$scope.detailsTask.name: ' + $scope.detailsTask.name);
    console.log('$scope.detailsTask: ');
    console.log($scope.detailsTask);
    $http.put($window.sessionStorage.baseurl + '/tasks/' + $scope.detailsTask._id, $scope.detailsTask).success(function(data) {
      $scope.status = "Task was successfully updated."
    })
    .error(function(data) {
      $scope.status = "Failed to update task."
    });

    $('#user-status').fadeIn();
    setTimeout(function() { $('#user-status').fadeOut(); }, 4000);
  };

  function constructUrl(limit, skip, predicate, order, taskType) {
    var url = $window.sessionStorage.baseurl + '/tasks?';
    if (limit)
      url += 'limit=' + limit;
    if (skip)
      url += '&skip=' + skip;
    if (predicate !== "")
      url += '&sort={"' + predicate + '":"' + order + '"}';
    if (taskType !== "")
      url += '&where={"completed":"' + taskType + '"}';

    return url;
  }
}]);


taskManagerControllers.controller('SettingsController', ['$scope', '$http' , '$window' , function($scope, $http, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";
  };

}]);



angular.module('userService', [])

.factory('User', function($http) {
  // create a new object
  var userFactory = {};

  // get a single user
  userFactory.get = function(id) {
    return $http.get('/api/users/' + id);
  };

  // get all users
  userFactory.all = function() {
    return $http.get('/api/users/');
  };

  // get all users by company_id
  userFactory.allByCompany = function (company_id) {
    return $http.get('/api/users', {
      params: {
        company_id: company_id
      }
    })
  };

  // create a user
  userFactory.create = function(userData) {
    return $http.post('/api/users', userData);
  };

  // update a user
  userFactory.update = function(id, userData) {
    return $http.put('/api/users/' + id, userData);
  };

  // delete a user
  userFactory.delete = function(id) {
    return $http.delete('/api/users/' + id);
  };

  // get current user
  userFactory.getCurrent = function () {
    return $http.get('/api/me');
  };

  // return our entire userFactory object
  return userFactory;
});

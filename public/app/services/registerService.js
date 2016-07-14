angular.module('registerService', [])

.factory('Register', function ($http, $q) {
  var registerFactory = {};

  registerFactory.company = function (companyData) {
    return $http.post('/register/company', companyData);
  };

  registerFactory.user = function (userData) {
    console.log(userData);
    return $http.post('/register/user', userData);
  };
  return registerFactory;
});

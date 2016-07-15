angular.module('companyService', [])

.factory('Company', function ($http) {
  // create factory object
  var companyFactory = {};

  companyFactory.get = function (id) {
    return $http.get('/api/companies/' + id);
  };

  companyFactory.all = function () {
    return $http.get('/api/companies/');
  };

  companyFactory.create = function () {
    return $http.post('/api/companies');
  };

  companyFactory.update = function (id, companyData) {
    return $http.put('/api/companies/' + id, companyData);
  };

  companyFactory.updateLocation = function (id, companyData) {
    return $http.put('/api/companies/' + id + '/locations', companyData);
  };

  companyFactory.delete = function (id) {
    return $http.delete('/api/companies/' + id);
  };

  companyFactory.deleteLocation = function (id, index) {
    return $http({
      url: '/api/companies/' + id + '/locations',
      method: "DELETE",
      params: {
        index: index
      }
    });
  };
  return companyFactory;
});

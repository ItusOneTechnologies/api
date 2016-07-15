angular.module('jobsiteService', [])

.factory('Jobsite', function ($http) {
  var jobsiteFactory = {};

  jobsiteFactory.get = function (id) {
    return $http.get('/api/jobsites/' + id);
  };

  jobsiteFactory.allByCompany = function (company_id) {
    return $http({
      url: '/api/jobsites',
      method: "GET",
      params: {
        company_id: company_id
      }
    });
  }

  jobsiteFactory.create = function (jobsiteData) {
    return $http.post('api/jobsites/', jobsiteData);
  };

  jobsiteFactory.update = function (id, jobsiteData) {
    console.log(id);
    console.log(jobsiteData);
    return $http.put('/api/jobsites/' + id, jobsiteData);
  };

  jobsiteFactory.delete = function (id) {
    return $http.delete('/api/jobsites' + id);
  };

  return jobsiteFactory;
});

angular.module('reportService', [])

  .factory('Report', function ($http) {
    var reportFactory = {};

    reportFactory.get = function (jobsite_id) {
      return $http({
        url: '/api/reports',
        method: "GET",
        params: {
          jobsite_id: jobsite_id
        }
      });
    };

    reportFactory.getWithType = function (jobsite_id, type) {
      return $http({
        url: '/api/reports',
        method: "GET",
        params: {
          jobsite_id: jobsite_id,
                type: type
        }
      });
    };

    return reportFactory;
  });

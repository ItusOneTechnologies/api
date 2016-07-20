angular.module('reportService', [])

  .factory('Report', function ($http, $q) {
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

    reportFactory.getReports = function (routeParams) {
      return $q.when(reportFactory.get(routeParams));
    };

    reportFactory.getBar = function (reports) {
      var data = {
          labels: reports.data_legend,
          datasets: [
            {
              label: reports.name,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
              hoverBorderColor: "rgba(255, 99, 132, 1)",
              data: reports.data_set
            }
          ]
        };
      return data;
    };

    reportFactory.getLine = function (reports) {
      var dataset = [];
      for (var i in reports.data_set) {
        dataset[i] = {
          label: reports.data_set[i].label,
          backgroundColor: "rgba(172, 194, 132, 0.1)",
          borderColor: "#ACC26D",
          pointBackgroundColor: "#fff",
          pointBorderColor: "#9DB86D",
          data: reports.data_set[i].data
        }
      }
      var data = {
        labels: reports.data_legend,
        datasets: dataset
      }
      return data;
    };

    return reportFactory;
  });

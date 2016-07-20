angular.module('reportCtrl', [
  'reportService',
  'jobsiteService',
  'userService'
])

  .controller('reportController', function (Report, Jobsite, $routeParams, reports, $scope) {
    var vm = this;
    vm.bar = {};
    vm.processing = true;
    vm.reports = reports.data.report;
    console.log(vm.reports);

    // watch for the document to load the element id
    $scope.$watch(function () {
      return document.getElementById('_' + vm.bar_selector);
    }, function (canvas, nullValue) {
      // once the canvas is loaded with this id
      if (canvas) {
        console.log(canvas.getContext('2d'));
        vm.bar.context = canvas.getContext('2d');
        // create a chart
        new Chart(vm.bar.context, {
          type: 'bar',
          data: vm.bar.data,
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    });

    Jobsite.get($routeParams.jobsite_id)
      .success(function (data) {
        if (data.success) {
          vm.jobsite = data.jobsite;
        } else {
          console.log(data);
        }
      });

    for (var i in vm.reports) {
      if (vm.reports[i].type == 'bar') {
        vm.bar.data = {
          labels: vm.reports[i].data_legend,
          datasets: [
            {
              label: vm.reports[i].name,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
              hoverBorderColor: "rgba(255, 99, 132, 1)",
              data: vm.reports[i].data_set
            }
          ]
        };
        vm.bar_selector = vm.reports[i]._id;
        console.log('bar selector in finally: ' + vm.bar_selector);
      }
    }
  });

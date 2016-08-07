angular.module('reportCtrl', [
  'reportService',
  'jobsiteService',
  'userService'
])

  .controller('allReportsController', function (Report, Jobsite, $routeParams) {
    var vm = this;

    Jobsite.allByCompany($routeParams.company_id)
      .success(function (data) {
        if (data.success)
          console.log(data);
        else
          console.log(data);
      });

  })
  .controller('reportController', function (Report, Jobsite, $routeParams, reports, $scope) {
    var vm = this;
    vm.bar = {};
    vm.line = {};
    vm.processing = true;
    vm.reports = reports.data.report;
    console.log(vm.reports);

    // watch for the document to load the element id
    $scope.$watch(function () {
      // watch for one of the instances of this.
      // this will will need to be changed in the future for resiliency to no
      // bar graph being present
      return document.getElementById('_' + vm.bar_selector);
    }, function (canvas, nullValue) {
      // once the canvas is loaded with this id
      if (canvas) {
        console.log(canvas.getContext('2d'));
        vm.bar.context = canvas.getContext('2d');
        vm.line.context = document.getElementById('_' + vm.line_selector).getContext('2d');

        // create a chart
        new Chart(vm.bar.context, {
          type: 'bar',
          data: vm.bar.data,
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
        new Chart(vm.line.context, {
          type: 'line',
          data: vm.line.data,
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
        vm.bar.data = Report.getBar(vm.reports[i]);
        console.log(vm.bar.data);
        vm.bar_selector = vm.reports[i]._id;
      } else if (vm.reports[i].type == 'line') {
        vm.line.data = Report.getLine(vm.reports[i]);
        console.log(vm.line.data);
        vm.line_selector = vm.reports[i]._id;
      }
    }
  });

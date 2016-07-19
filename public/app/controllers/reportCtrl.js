angular.module('reportCtrl', [
  'reportService',
  'jobsiteService',
  'userService'
])

  .controller('reportController', function (Report, User, Jobsite, $routeParams) {
    var vm = this;
    vm.processing = true;
    console.log('in the report controller');

    // get all report documents, sent to client as an Array
    Report.get($routeParams.jobsite_id)
      .success(function (data) {
        if (data.success) {
          vm.processing = false;
          vm.reports = data.report;
          console.log(vm.reports);
        } else {
          vm.message = data.message;
          console.log(data.error);
        }
      });
  });

angular.module('reportCtrl', [
  'reportService',
  'jobsiteService',
  'userService'
])

  .controller('reportController', function (Report, User, Jobsite, $routeParams) {
    var vm = this;
    vm.processing = true;
    console.log('in the report controller');

    User.getCurrent()
      .success(function (data) {
        console.log(data);
        if (data.success) {
          vm.company_id = data.user.company_id;
        } else {
          vm.message = data.message;
          console.log(data.error);
        }
      })
      .finally(function () {
        console.log(vm.company_id);
        Jobsite.get($routeParams.jobsite_id)
          .success(function (data) {
            console.log(data);
            if (data.success) {
              vm.jobsite = data.jobsite;
              console.log(vm.jobsite);
            } else {
              vm.message = data.message;
              console.log(data.error);
            }
          })
          Report.get($routeParams.jobsite_id)
            .success(function (data) {
              if (data.success) {
                vm.reports = data.report;
                console.log(vm.reports);
              } else {
                vm.message = data.message;
                console.log(data.error);
              }
            });
      });
  });

angular.module('jobsiteCtrl', [
  'jobsiteService',
  'userService'
])

  .controller('jobsiteController', function (Jobsite, User) {
    var vm = this;
    vm.processing = true;

    User.getCurrent()
      .success(function (user) {
        vm.user = user;
      })
      .finally(function () {
        Jobsite.allByCompany(vm.user.company_id)
          .success(function (jobsites) {
            vm.processing = false;
            vm.jobsites = jobsites;
          });
      });
  })
  .controller('jobsiteCreateController', function (Jobsite, User) {
    var vm = this;

    vm.type = 'create';
    User.getCurrent()
      .success(function (user) {
        vm.user = user;
      });

    vm.saveJobsite = function () {
      vm.processing = true;

      vm.message = '';
      vm.jobsiteData.company_id = vm.user.company_id;
      Jobsite.create(vm.jobsiteData)
        .success(function (data) {
          console.log(vm.jobsiteData);
          vm.processing = false;

          // clear the form
          vm.jobsiteData = {};
          vm.message = data.message;
        });
    }
  });

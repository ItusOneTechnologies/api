angular.module('jobsiteCtrl', [
  'jobsiteService',
  'userService'
])

  .controller('jobsiteController', function (Jobsite, User) {
    var vm = this;
    vm.processing = true;
    vm.message = '';

    User.getCurrent()
      .success(function (user) {
        vm.user = user.user;
      })
      .finally(function () {
        Jobsite.allByCompany(vm.user.company_id)
          .success(function (jobsites) {
            vm.processing = false;
            vm.jobsites = jobsites.jobsite;
          });
      });

    vm.find = function (arr, id) {
      for (var i in arr) {
        if (arr[i]._id == id) {
          return i;
        }
      }
      return -1;
    };

    vm.deleteJobsite = function(id) {
      Jobsite.delete(id)
        .success(function (err, data) {
          if (data.error) {
            vm.message.message = data.message;
            vm.message.error = data.error;
          } else {
            vm.message = data.message;
          }
          var index = vm.find(vm.jobsites, id);
          if (index) {
            vm.jobsites.splice(index, 1);
          } else {
            vm.message = 'This object does not exist.';
          }
        });
    }
  })
  .controller('jobsiteCreateController', function (Jobsite, User) {
    var vm = this;
    // initialize empty object for jobsiteData
    vm.jobsiteData = {};

    vm.type = 'create';
    User.getCurrent()
      .success(function (user) {
        vm.user = user.user;
      });

    vm.saveJobsite = function () {
      vm.processing = true;

      vm.message = '';
      vm.jobsite.company_id = vm.user.company_id;
      console.log(vm.jobsite);
      Jobsite.create(vm.jobsite)
        .success(function (data) {
          vm.processing = false;

          // clear the form
          vm.jobsite = {};
          vm.message = data.message;
        });
    }
  })
  .controller('jobsiteEditController', function ($routeParams, Jobsite) {
    var vm = this;
    vm.processing = true;
    vm.type = 'edit';

    Jobsite.get($routeParams.jobsite_id)
      .success(function (jobsite) {
        vm.processing = false;
        vm.jobsite = jobsite.jobsite;
      })

    vm.saveJobsite = function () {
      vm.processing = true;
      vm.message = '';

      Jobsite.update(vm.jobsite._id, vm.jobsite)
        .success(function (data) {
          vm.processing = false;
          vm.message = data.message;
        });
    };
  })

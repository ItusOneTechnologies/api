angular.module('companyCtrl', [
  'companyService',
  'userService'
])

  .controller('companyController', function (Company, User) {
    var vm = this;

    // set a processing variable to show loading
    vm.processing = true;

    User.getCurrent()
      .success(function (user) {
        vm.user = user;
      })
      .finally(function () {
        Company.get(vm.user.company_id)
          .success(function (company) {
            vm.companies = company;
          });
      });
  })
  .controller('companyCreateController', function (Company) {
    var vm = this;
    vm.type = 'create';

    vm.saveCompany = function () {
      vm.processing = true;

      // clear the message
      vm.message = '';

      // use the create function in the companyService
      Company.create(vm.companyData)
        .success(function (data) {
          vm.processing = false;

          // clear the form
          vm.companyData = {};
          vm.message = data.message;
        });
    }
  })
  .controller('companyEditController', function ($routeParams, Company) {
    var vm = this;
    vm.type = 'edit';

    Company.get($routeParams.company_id)
      .success(function (data) {
        vm.companyData = data;
      });

    vm.saveCompany = function () {
      vm.processing = true;
      vm.message = '';

      Company.update($routeParams.company_id, vm.companyData)
        .success(function (data) {
          vm.processing = false;

          vm.message = data.message;
        });
    };
  });

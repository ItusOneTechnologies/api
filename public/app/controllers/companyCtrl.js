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

    vm.deleteLocation = function (index) {
      vm.processing = true;
      Company.deleteLocation(vm.companies._id, index)
        .success(function (data) {
          vm.message = data.message;
        });
    };
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
    };
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
  })
  .controller('locationCreateController', function (Company, User) {
    var vm = this;

    // get the current user for company_id purposes
    User.getCurrent()
      .success(function (user) {
        vm.user = user;
      })
      .finally(function () {
        // after finished getting user,
        // get the company to get the company_id and current index
        Company.get(vm.user.company_id)
          .success(function (company) {
            vm.company = company;
          });
      });


    vm.saveLocation = function () {
      vm.processing = true;
      vm.message = '';

      if (vm.locationData) {
        // get the length of the current location array
        // that will be the index for the new location object
        vm.locationData.index = vm.company.location.length;
        Company.updateLocation(vm.company._id, vm.locationData)
          .success(function (data) {
            vm.proccessing = false;
            vm.message = data.message;
            vm.locationData = {};
          });
      } else {
        vm.message = 'Please enter information into the fields';
        vm.locationData = {};
      }
    };
  });

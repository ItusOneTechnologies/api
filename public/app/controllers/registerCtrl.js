angular.module('registerCtrl', ['registerService',])

  .controller('registerController', function (Register, $location, $rootScope) {
    var vm = this;

    vm.registerCompany = function () {
      vm.processing = true;

      vm.message = '';

      // use the co
      Register.company(vm.companyData)
        .success(function (data) {
          vm.processing = false;
          vm.message = data.message;
          $rootScope.company_id = data.company_id;
          // when finished creating company, redirect to register user
          $location.path('/register/user');
        });
    };
    vm.registerUser = function () {
      vm.processing = true;

      Register.user(vm.userData)
        .success(function (data) {
          vm.processing = false;
          vm.message = data.message;
        });
    };
  })

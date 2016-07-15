angular.module('registerCtrl', [
  'registerService',
  'authService'
])

  .controller('registerController', function (Register, Auth, $location, $rootScope) {
    var vm = this;

    vm.registerCompany = function () {
      vm.processing = true;

      vm.message = '';

      vm.companyData.index = 0; // this will always be the first company created
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
          if (!data.success) {
            vm.userData.password = '';
          } else if (data.success) {
            // if the user is Successfully created, get an auth token
            console.log('authorizing');
            Auth.login(vm.userData.username, vm.userData.password)
              .success(function (data) {
                vm.processing = false;
                // if a user is successfully authed redirect to users page
                if (data.success) {
                  $location.path('/users');
                } else {
                  vm.error = data.message;
                }
              });
          }
          vm.message = data.message;
        });
    };
  })

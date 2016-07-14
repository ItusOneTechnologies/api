angular.module('userCtrl', ['userService'])

  .controller('userController', function (User) {
      var vm = this;

      // set a processing variable to show loading things
      vm.processing = true;

      // grab all the users at page load
      User.all()
        .success(function (data) {
          // bind the users that come back to vm.users
          vm.users = data;
        });

      // grab current user at page load
      User.getCurrent()
        .success(function (data) {
          vm.processing = false;
          // bind the user to vm.user
          vm.user = data;
        });

      vm.deleteUser = function (id) {
        vm.processing = true;

        // accepts the user id as a parameter
        User.delete(id)
          .success(function (data) {
            // get all users to update the table
            // you can also set up your api
            // to return the list of users with the delete call
            User.all()
              .success(function (data) {
                vm.processing = false;
                vm.users = data;
              });
          });
      };

      vm.getCurrent = function () {
        vm.processing = true;

        User.getCurrent()
          .success(function (data) {
            vm.processing = false;
            vm.user = data;
          });
      };
    })

    .controller('userCreateController', function (User) {
      var vm = this;

      // variable to hide/show elelments of the views
      // differentiates between create or edit pages
      vm.type = 'create';

      // function to create a user
      vm.saveUser = function () {
        vm.processing = true;

        // clear the message
        vm.message = '';

        // user the create function in the userService
        User.create(vm.userData)
          .success(function (data) {
            vm.processing = false;

            // clear the form
            vm.userData = {};
            vm.message = data.message;
          });
      }
    })

    // controller applied to user edit page
    .controller('userEditController', function ($routeParams, User) {
      var vm = this;

      // variable to hide/show elements of the views
      // differentiates between create or edit pages
      vm.type = 'edit';

      // get the suer data for the users you want to edit
      // $routeParams is the way we grab data from the URl
      User.get($routeParams.user_id)
        .success(function (data) {
          vm.userData = data;
        });

      vm.saveUser = function () {
        vm.processing = true;
        vm.message = '';

        // call the userService funciton to update
        User.update($routeParams.user_id, vm.userData)
          .success(function (data) {
            vm.processing = false;

            vm.userData = {}
            vm.message = data.message;
          });
      };
    });

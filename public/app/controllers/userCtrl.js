angular.module('userCtrl', ['userService'])

  .controller('userController', function (User, $q) {
      var vm = this;

      // set a processing variable to show loading things
      vm.processing = true;

      // get current user by logged in user
      User.getCurrent()
        .success(function (user) {
          console.log(user);
          vm.user = user.user;
        })
        // when that is successful and finished, get the users based on the
        // company_id of the user
        .finally(function () {
          User.allByCompany(vm.user.company_id)
            .success(function (users) {
              if (users.success){
                vm.users = users.user;
                vm.processing = false;
              } else {
                vm.message = users.message;
              }
            });
        });

      vm.find = function (users, id) {
        for (var i in users) {
          if (users[i]._id == id) {
            return i
          }
        }
        return -1;
      }
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

                var index = vm.find(vm.users, id);
                if (index) {
                  vm.users.splice(index, 1);
                } else {
                  vm.message = 'This object does not exist.';
                }
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

    .controller('userCreateController', function ($rootScope, User) {
      var vm = this;
      vm.userData = {};

      // variable to hide/show elelments of the views
      // differentiates between create or edit pages
      vm.type = 'create';

      User.getCurrent()
        .success(function (user) {
          vm.userData.company_id = user.user.company_id;
        });

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
            vm.userData.name = '';
            vm.userData.username = '';
            vm.userData.password = '';
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
          if (data.success) {
            vm.userData = data.user;
          } else {
            console.log(data);
            vm.message = data.message;
          }
        });

      vm.saveUser = function () {
        vm.processing = true;
        vm.message = '';

        // call the userService funciton to update
        User.update($routeParams.user_id, vm.userData)
          .success(function (data) {
            vm.processing = false;

            vm.message = data.message;
          });
      };
    });

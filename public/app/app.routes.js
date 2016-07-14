angular.module('app.routes', ['ngRoute'])

.config(function ($routeProvider, $locationProvider) {
  $routeProvider

    // home page route
    .when('/', {
      templateUrl: 'app/views/pages/home.html'
    })

    // login page
    .when('/login', {
       templateUrl: 'app/views/pages/login.html',
        controller: 'mainController',
      controllerAs: 'login'
    })

    // show all users
    .when('/users', {
      templateUrl: 'app/views/pages/users/all.html',
      controller: 'userController',
      controllerAs: 'user'
    })

    // form to create a new user
    // or edit a current one
    .when('/users/create', {
      templateUrl: 'app/views/pages/users/single.html',
      controller: 'userCreateController',
      controllerAs: 'user'
    })

    //page to edit users
    .when('/users/:user_id', {
      templateUrl: 'app/views/pages/users/single.html',
      controller: 'userEditController',
      controllerAs: 'user'
    })

    // page for current users
    .when('/current', {
      templateUrl: 'app/views/pages/users/current.html',
      controller: 'userController',
      controllerAs: 'current'
    })

    // page for all companies
    .when('/companies', {
      templateUrl: 'app/views/pages/companies/all.html',
      controller: 'companyController',
      controllerAs: 'company'
    })

    // page for individual company
    .when('/company', {
      templateUrl: 'app/views/pages/companies/all.html',
      controller: 'companyController',
      controllerAs: 'company'
    })

    // edit company
    .when('/companies/:company_id', {
      templateUrl: 'app/views/pages/companies/single.html',
      controller: 'companyEditController',
      controllerAs: 'company'
    })

    // create company
    .when('/companies/create', {
      templateUrl: 'app/views/pages/companies/single.html',
      controller: 'companyCreateController',
      controllerAs: 'company'
    })

    // register screen
    .when('/register/company', {
      templateUrl: 'app/views/pages/register/company.html',
      controller: 'registerController',
      controllerAs: 'register'
    })

    // register company representative
    .when('/register/user', {
      templateUrl: 'app/views/pages/register/user.html',
      controller: 'registerController',
      controllerAs: 'register'
    });

  // clean URLs
  $locationProvider.html5Mode(true);
});

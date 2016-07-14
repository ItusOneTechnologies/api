angular.module('userApp', [
  'ngAnimate',
  'app.routes',
  'authService',
  'mainCtrl',
  'userCtrl',
  'companyCtrl',
  'registerCtrl',
  'jobsiteCtrl',
  'userService',
  'companyService',
  'registerService',
  'jobsiteService'
])
// application configuration to integrate into requests
.config(function ($httpProvider) {
  // attach our AuthInterceptor to the http requests
  $httpProvider.interceptors.push('AuthInterceptor');
});

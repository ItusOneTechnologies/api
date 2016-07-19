angular.module('reportCtrl', [
  'reportService',
  'jobsiteService',
  'userService'
])

  .controller('reportController', function (Report, User, Jobsite, $routeParams) {
    var vm = this;
    vm.bar = {};
    vm.processing = true;

    addEventListener('load', load, false);

    // get all report documents, sent to client as an Array
    Report.get($routeParams.jobsite_id)
      .success(function (data) {
        if (data.success) {
          // vm.processing = false;
          vm.reports = data.report;
          console.log(vm.reports);
        } else {
          vm.message = data.message;
          console.log(data.error);
        }
      })
      .finally(function () {
        console.log('made it finally');
        for (var i in vm.reports) {
          if (vm.reports[i].type == 'bar') {
            vm.bar.data = {
              labels: vm.reports[i].data_legend,
              datasets: [
                {
                  label: vm.reports[i].name,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                  hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
                  hoverBorderColor: "rgba(255, 99, 132, 1)",
                  data: vm.reports[i].data_set
                }
              ]
            };
            vm.bar_selector = vm.reports[i]._id;
            console.log('bar selector in finally: ' + vm.bar_selector);
          }
        }
      });

    function load() {
      console.log('loaded...');
      vm.processing = false;
      vm.bar.context = document.getElementById('_' + vm.bar_selector).getContext('2d');
      console.log(vm.bar.context);
      var bar = new Chart(vm.bar.context, {
        type: 'bar',
        data: vm.bar.data,
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      console.log(vm.bar);
    };
  });

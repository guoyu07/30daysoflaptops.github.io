var app = angular.module("myApp", ["firebase"]);

app.controller("SampleCtrl", ["$scope", "$firebase",
  function($scope, $firebase) {
    var ref = new Firebase("https://30daysoflaptops.firebaseio.com/");

    $scope.pledges = $firebase(ref).$asArray();

    $scope.groupedPledges = [];

    groupPledges = function() {
      var grouped = _.groupBy($scope.pledges, function(pledge) {
        return moment(pledge.pledgedAt).format("MMM Do YY");
      });
      $scope.groupedPledges =  _.toArray(grouped).reverse();
    };

    $scope.$watchCollection('pledges', groupPledges);

    $scope.addPledge = function(email, company, laptops) {
      pledge = {
        email: email,
        company: company,
        laptops: laptops,
        pledgedAt: Firebase.ServerValue.TIMESTAMP
      };
      $scope.pledges.$add(pledge).then(function() {
        $scope.email = null;
        $scope.company = null;
        $scope.laptopsPledged = null;
      });
    };

    $scope.totalLaptops = function() {
      var count = 0;
      angular.forEach($scope.pledges, function(pledge) {
        count += pledge.laptops;
      });
      return count;
    };
  }
]);

//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('indexController',['$scope','MyFactory',function($scope,MyFactory){
$scope.message = "Hello Raju";

$scope.postData = function(){
    alert($scope.username);
}

$scope.schools = [
    {"schoolCode":"000017",
"schoolName":"IB school1"},
{"schoolCode":"000020",
"schoolName":"IB school2"},
{"schoolCode":"000025",
"schoolName":"IB school3"},
];

$scope.welcomeMessage = MyFactory.sayHello('Raju');

}]);
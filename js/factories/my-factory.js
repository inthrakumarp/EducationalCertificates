
app.factory("MyFactory",["$rootScope",function($rootScope){
return {
    sayHello : function(name){
        return "Hello" + name;
    }
}

}]);
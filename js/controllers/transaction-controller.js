//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('transactionController', ['$scope', '$rootScope', '$filter', 'Service_schoolCandDetails', function ($scope, $rootScope, $filter, Service_schoolCandDetails) {

        var valUUID = "";
        var valTrans = "";
        $scope.loader = true;
        $scope.noRecord = false;
        $rootScope.CandResultContract.listEvents(function (error, result) {
                //console.log(result[1].length);
                if (result == '' || typeof result == 'undefined' || result[1].length == 0) {
                        $scope.noRecord = true;
                        $scope.loader = false;
                        $scope.$digest();
                        return;
                }
                $scope.loader = true;
                var myEl = angular.element(document.querySelector('#transId'));
                angular.forEach(result[1], function (value, key) {
                        valUUID = web3.toAscii(value);
                        valUUID = valUUID.replace(/\0/g, '');
                        //console.log("result data : ", valUUID);
                        $rootScope.CandResultContract.getTransDetailsByUUID(valUUID, function (errorTrans, resultTrans) {
                                if (!errorTrans) {

                                        //console.log(resultTrans);

                                        if (resultTrans[3] == true)
                                                var providerApproval = "<td style='color:green !important;'>" + resultTrans[3] + "</td>";
                                        else
                                                var providerApproval = "<td style='color:red !important;'>" + resultTrans[3] + "</td>";

                                        if (resultTrans[2] == true)
                                                var SchoolApproval = "<td style='color:green !important;'>" + resultTrans[2] + "</td>";
                                        else
                                                var SchoolApproval = "<td style='color:red !important;'>" + resultTrans[2] + "</td>";

                                        valUUID = web3.toAscii(value);
                                        valUUID = valUUID.replace(/\0/g, '');

                                        var transcContent = "<tr><td>" + valUUID + "</td><td>" + resultTrans[1] + "</td><td>" + resultTrans[0] + "</td>" + providerApproval + SchoolApproval + "</tr>";
                                        myEl.append(transcContent);
                                        $scope.loader = false;
                                        $scope.$digest();
                                        return false

                                }
                                else {
                                        //console.error(errorTrans);
                                        $scope.loader = false;
                                }
                        });


                })

        });

}]);
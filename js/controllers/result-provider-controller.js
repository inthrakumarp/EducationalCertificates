//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('resultProviderController', ['$scope', '$rootScope', '$filter', '$http', 'Service_schoolCandDetails', function ($scope, $rootScope, $filter, $http, Service_schoolCandDetails) {

        $scope.ShowCanDetails = false;
        $scope.hideSubmit = true;
        $scope.successMessage = "";
        $scope.Warnigs = "";
        $scope.loaderSubmit = false;
        $scope.loader = false;
        $scope.returnHashString = "";
        // $scope.dblSendBtn1 = false;
        $scope.schoolCandDetails = Service_schoolCandDetails.schoolCandDetails;

        //console.log($rootScope.CandResultContract);
        $scope.fn_changeCand = function (schoolCode) {

                $scope.ShowCanDetails = false;
                $scope.Warnigs = "";
                $scope.successMessage = "";
                $scope.returnHashString = "";
                $scope.SchoolcandDetails = ($filter('filter')($scope.schoolCandDetails, { schoolCode: schoolCode }));

                $scope.session = $scope.SchoolcandDetails[0].sessionMonth + ' ' + $scope.SchoolcandDetails[0].sessionYear;
                $scope.schoolAddress = $scope.SchoolcandDetails[0].schoolAddress;
                //debugger;
                $scope.allCandDetails = $scope.SchoolcandDetails[0].candidates;

                //console.log($scope.candDetails[0].candidates);
        };

        $scope.fn_getCand = function (candVal) {
                if (typeof $scope.candVal != 'undefined') {
                        $scope.CandDetails = ($filter('filter')($scope.allCandDetails, { candCode: $scope.candVal }));
                        $scope.loader = true;
                        var vm = this;
                        var res;
                        $scope.Warnigs = "";
                        $scope.successMessage = "";
                        $scope.returnHashString = "";
                        $scope.ShowCanDetails = false;
                        $scope.hideSubmit = true;
                        var UUID = 'C' + $scope.SchoolcandDetails[0].sessionYear + $scope.SchoolcandDetails[0].schoolCode + $scope.CandDetails[0].candCode;
                        $rootScope.CandResultContract.getResultByUUID(UUID, function (error, result) {
                                if (!error) {
                                        vm.res = web3.toAscii(result);
                                        vm.res = vm.res.replace(/\0/g, '');
                                        //console.log("result data : ", vm.res);
                                        if (vm.res != '' && typeof vm.res != 'undefined') {
                                                $scope.Warnigs = "Already sent to blockchain.";
                                                $scope.hideSubmit = true;
                                                $scope.ShowCanDetails = true;
                                                $scope.loader = false;
                                                $scope.$digest();
                                        }
                                        else {
                                                $scope.Warnigs = "";
                                                $scope.hideSubmit = false;
                                                $scope.ShowCanDetails = true;
                                                $scope.loader = false;
                                                $scope.$digest();
                                        }
                                }
                                else {
                                        console.error(error);
                                }
                        });

                }
                else {
                        $scope.ShowCanDetails = false;
                }
        };


        $scope.fn_submit = function () {
                if (typeof $scope.schoolVal != 'undefined' || typeof $scope.candVal != 'undefined') {
                        var UUID = 'C' + $scope.SchoolcandDetails[0].sessionYear + $scope.SchoolcandDetails[0].schoolCode + $scope.CandDetails[0].candCode;

                        $scope.loaderSubmit = true;

                        $scope.results = $scope.CandDetails[0];
                        $scope.results.session = $scope.session;
                        $scope.results.schoolAddress = $scope.schoolAddress;
                        $scope.results.schoolName = $scope.SchoolcandDetails[0].schoolCode + '-' + $scope.SchoolcandDetails[0].schoolName;

                        $scope.results = angular.toJson($scope.results);
                        //console.log($scope.results);

                        var encryptedResult = CryptoJS.AES.encrypt($scope.results,
                                $rootScope.base64Key,
                                { iv: $rootScope.iv }
                        );

                        $scope.ciphertextResult = encryptedResult.ciphertext.toString(CryptoJS.enc.Base64);
                        console.log($scope.ciphertextResult);
                        $rootScope.CandResultContract.createResult(UUID, $scope.CandDetails[0].candAddress, $scope.SchoolcandDetails[0].schoolAddress, $scope.ciphertextResult, true, false, true
                                , function (error, result) {
                                        if (!error) {
                                                $scope.successMessage = 'Candidate result details have been sent to Block chain successfully!';
                                                //console.log(result);
                                                $scope.hideSubmit = true;
                                                $scope.loaderSubmit = false;
                                                $scope.returnHashString = 'Transaction Hash : ' + result;
                                                $scope.$digest();

                                        }
                                        else
                                                //console.error(error);
                                                $scope.Warnigs = error;
                                        $scope.loaderSubmit = false;
                                        $scope.$digest();
                                        return false;
                                });


                }

        };

}]);
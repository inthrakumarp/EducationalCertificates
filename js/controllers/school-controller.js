//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('schoolController', ['$scope', '$rootScope', '$filter', '$http', 'Service_schoolCandDetails', function ($scope, $rootScope, $filter, $http, Service_schoolCandDetails) {

        $scope.ShowCanDetails = false;
        $scope.hideSubmit = true;
        $scope.successMessage = "";
        $scope.returnHashString = "";
        $scope.Warnigs = "";
        $scope.loaderSubmit = false;
        $scope.loader = false;
        $scope.schoolCandDetails = Service_schoolCandDetails.schoolCandDetails;

        $scope.SchoolcandDetails = ($filter('filter')($scope.schoolCandDetails, { schoolAddress: $rootScope.LoginschoolAddress }));


        $scope.schoolName = $scope.SchoolcandDetails[0].schoolCode + '-' + $scope.SchoolcandDetails[0].schoolName;
        $scope.session = $scope.SchoolcandDetails[0].sessionMonth + ' ' + $scope.SchoolcandDetails[0].sessionYear;
        $scope.allCandDetails = $scope.SchoolcandDetails[0].candidates;


        $scope.fn_getCand = function (candVal) {
                if (typeof $scope.candVal != 'undefined') {
                        $scope.CandDetails = ($filter('filter')($scope.allCandDetails, { candCode: $scope.candVal }));
                        //
                        var vm = this;
                        var res;
                        $scope.Warnigs = "";
                        $scope.successMessage = "";
                        $scope.returnHashString = "";
                        $scope.ShowCanDetails = false;
                        $scope.hideSubmit = true;
                        $scope.loader = true;
                        var UUID = 'C' + $scope.SchoolcandDetails[0].sessionYear + $scope.SchoolcandDetails[0].schoolCode + $scope.CandDetails[0].candCode;
                        $rootScope.CandResultContract.getResultByUUID(UUID, function (error, result) {
                                if (!error) {
                                        vm.res = web3.toAscii(result);
                                        vm.res = vm.res.replace(/\0/g, '');
                                        //console.log("result data : ", vm.res);

                                        var cipherParams = CryptoJS.lib.CipherParams.create({
                                                ciphertext: CryptoJS.enc.Base64.parse(vm.res)
                                        });
                                        var decryptedResult = CryptoJS.AES.decrypt(
                                                cipherParams,
                                                $rootScope.base64Key,
                                                { iv: $rootScope.iv }
                                        );
                                        $scope.descrString = decryptedResult.toString(CryptoJS.enc.Utf8);

                                        console.log($scope.descrString);

                                        if (vm.res != '' && typeof vm.res != 'undefined') {
                                                $scope.Warnigs = "";

                                                $scope.$apply();
                                                $rootScope.CandResultContract.checkOwnershipOfResult(UUID, $scope.CandDetails[0].candAddress, function (error, result) {
                                                        if (!error) {
                                                                console.log(result);
                                                                if (result) {
                                                                        $scope.Warnigs = "";
                                                                        $scope.hideSubmit = true;
                                                                        $scope.loader = false;
                                                                        $scope.Warnigs = "Already result has been sent to candidate.";
                                                                        $scope.ShowCanDetails = true;
                                                                        $scope.$digest();
                                                                }
                                                                else {
                                                                        $scope.Warnigs = "";
                                                                        $scope.hideSubmit = false;
                                                                        $scope.loader = false;
                                                                        $scope.ShowCanDetails = true;
                                                                        $scope.$digest();

                                                                }
                                                        }
                                                        else {
                                                                console.error(error);
                                                        }
                                                });

                                        }
                                        else {
                                                $scope.Warnigs = "Candiate results not available in blockchain.";
                                                $scope.hideSubmit = true;
                                                $scope.ShowCanDetails = false;
                                                $scope.loader = false;
                                                $scope.$digest();
                                        }
                                }
                                else {
                                        console.error(error);
                                }
                        });



                        //

                }
                else {
                        $scope.ShowCanDetails = false;
                }
        };
        $scope.fn_submit = function () {
                if (typeof $scope.schoolVal != 'undefined' || typeof $scope.candVal != 'undefined') {
                        var UUID = 'C' + $scope.SchoolcandDetails[0].sessionYear + $scope.SchoolcandDetails[0].schoolCode + $scope.CandDetails[0].candCode;

                        $scope.loaderSubmit = true;
                        $rootScope.CandResultContract.transferResultOwnership(UUID, $scope.CandDetails[0].candAddress
                                , function (error, result) {
                                        if (!error) {
                                                $scope.successMessage = 'Result details have been sent to candidate successfully!';
                                                $scope.returnHashString = 'Transaction Hash : ' + result;
                                                console.log(result);
                                                $scope.hideSubmit = true;
                                                $scope.loaderSubmit = false;
                                                $scope.$digest();

                                        }
                                        else
                                                console.error(error);
                                        $scope.Warnigs = error;
                                        $scope.loaderSubmit = false;
                                        $scope.$digest();
                                        return false;
                                });




                }

        };

}]);
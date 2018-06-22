//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('schoolController', ['$scope', '$rootScope', '$filter', '$http', 'Service_schoolCandDetails', '$interval', '$sessionStorage', function ($scope, $rootScope, $filter, $http, Service_schoolCandDetails, $interval, $sessionStorage) {

        $scope.ShowCanDetails = false;
        $scope.hideSubmit = false;
        $scope.successMessage = "";
        $scope.Warnigs = "";
        $scope.loaderSubmit = false;
        $scope.loader = false;
        $scope.loaderStatus = false;
        $scope.loaderStatusMsg = false;
        $scope.returnHashString = "";
        $scope.statusMsg = "";
        $scope.schoolCandDetails = Service_schoolCandDetails.schoolCandDetails;

        console.log($sessionStorage.TransHashList);

        $scope.SchoolcandDetails = ($filter('filter')($scope.schoolCandDetails, { schoolAddress: $rootScope.LoginschoolAddress }));


        $scope.schoolName = $scope.SchoolcandDetails[0].schoolCode + '-' + $scope.SchoolcandDetails[0].schoolName;
        $scope.session = $scope.SchoolcandDetails[0].sessionMonth + ' ' + $scope.SchoolcandDetails[0].sessionYear;
        $scope.allCandDetails = $scope.SchoolcandDetails[0].candidates;


        $scope.fn_getCand = function (candVal) {
                $scope.ShowCanDetails = false;
                $scope.hideSubmit = false;
                $scope.successMessage = "";
                $scope.Warnigs = "";
                $scope.loaderSubmit = false;
                $scope.loader = true;
                $scope.loaderStatus = false;
                $scope.loaderStatusMsg = false;
                $scope.returnHashString = "";
                $scope.statusMsg = "";
                if (typeof $scope.candVal != 'undefined') {
                        $scope.CandDetails = ($filter('filter')($scope.allCandDetails, { candCode: $scope.candVal }));
                        //
                        var vm = this;
                        var res;

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
                                                                        $scope.hideSubmit = false;
                                                                        $scope.loader = false;
                                                                        $scope.Warnigs = "Already result has been sent to candidate.";
                                                                        $scope.ShowCanDetails = true;
                                                                        $scope.$digest();
                                                                }
                                                                else {
                                                                        $scope.Warnigs = "";
                                                                        $scope.hideSubmit = true;
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
                                                $scope.hideSubmit = false;
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

        $scope.getTransactionStatus = function (transHashString) {

                web3.eth.getTransactionReceipt(transHashString, function (error, result) {
                        if (result != null && result != "") {
                                if (!error) {
                                        console.log(result);
                                        if (result.status == "0x1") {
                                                console.log("success");
                                                $scope.successMessage = 'Result details have been sent to candidate successfully!';
                                                $scope.statusMsg = "completed";
                                                $scope.loaderSubmit = false;
                                                $scope.loaderStatusMsg = true;
                                                $scope.loaderStatus = false;
                                                $interval.cancel($scope.chkStatus);
                                                $scope.$digest();
                                        }
                                        else {
                                                $scope.statusMsg = "failure";
                                                $scope.Warnigs = 'There is some problem in sending result to candidate';
                                                $scope.loaderStatusMsg = true;
                                                $scope.loaderStatus = false;
                                                $scope.$digest();
                                        }
                                }
                                else {
                                        $scope.Warnigs = error;
                                        $scope.loaderSubmit = false;
                                        $scope.loaderStatus = false;
                                        $scope.loaderStatusMsg = false;
                                        $scope.$digest();
                                        return false;
                                }
                        } else {
                                $scope.loaderSubmit = false;
                                $scope.loaderStatus = true;
                                $scope.loaderStatusMsg = true;
                                $scope.statusMsg = "processing";
                                $scope.successMessage = 'Result details sending to candidate intiated!';
                                $scope.$digest();
                        }
                });


        };

        $scope.fn_submit = function () {
                if (typeof $scope.schoolVal != 'undefined' || typeof $scope.candVal != 'undefined') {
                        var UUID = 'C' + $scope.SchoolcandDetails[0].sessionYear + $scope.SchoolcandDetails[0].schoolCode + $scope.CandDetails[0].candCode;

                        $scope.loaderSubmit = true;
                        $scope.Warnigs = "";
                        $scope.hideSubmit = false;

                        $rootScope.CandResultContract.transferResultOwnership(UUID, $scope.CandDetails[0].candAddress
                                , function (error, result) {
                                        if (!error) {
                                                $scope.loaderStatus = true;
                                                $scope.loaderStatusMsg = true;
                                                $scope.loaderSubmit = false;
                                                $scope.statusMsg = "processing";
                                                $scope.successMessage = 'Result details sending to candidate intiated!';
                                                $scope.returnHashString = 'Transaction Hash : ' + result;
                                                $scope.transHashString = result;
                                                //$sessionStorage.TransHashList.push(result); 
                                                $sessionStorage.TransHashList.push({ "UUID": UUID, "TransHash": result });
                                                $scope.chkStatus = $interval($scope.getTransactionStatus, 5000, 0, true, $scope.transHashString);
                                                $scope.$digest();

                                        }
                                        else {
                                                $scope.Warnigs = error;
                                                $scope.loaderStatus = false;
                                                $scope.loaderSubmit = false;
                                                $scope.hideSubmit = true;
                                                $scope.$digest();
                                        }
                                });




                }

        };

}]);
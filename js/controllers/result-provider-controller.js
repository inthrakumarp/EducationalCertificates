//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('resultProviderController', ['$scope', '$rootScope', '$filter', '$http', 'Service_schoolCandDetails', '$interval', '$sessionStorage', function ($scope, $rootScope, $filter, $http, Service_schoolCandDetails, $interval, $sessionStorage) {

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

        $sessionStorage.TransHashList = [{}];

        //console.log($sessionStorage.textMsg);

        $scope.schoolCandDetails = Service_schoolCandDetails.schoolCandDetails;

        $scope.fn_changeCand = function (schoolCode) {

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

                $scope.SchoolcandDetails = ($filter('filter')($scope.schoolCandDetails, { schoolCode: schoolCode }));

                $scope.session = $scope.SchoolcandDetails[0].sessionMonth + ' ' + $scope.SchoolcandDetails[0].sessionYear;
                $scope.schoolAddress = $scope.SchoolcandDetails[0].schoolAddress;
                //debugger;
                $scope.allCandDetails = $scope.SchoolcandDetails[0].candidates;

                //console.log($scope.candDetails[0].candidates);
        };

        $scope.fn_getCand = function (candVal) {
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

                if (typeof $scope.candVal != 'undefined') {
                        $scope.loader = true;
                        $scope.CandDetails = ($filter('filter')($scope.allCandDetails, { candCode: $scope.candVal }));
                        $scope.ShowCanDetails = true;
                        $scope.loader = false;
                        var vm = this;
                        var res;

                        var UUID = 'C' + $scope.SchoolcandDetails[0].sessionYear + $scope.SchoolcandDetails[0].schoolCode + $scope.CandDetails[0].candCode;
                        $rootScope.CandResultContract.getResultByUUID(UUID, function (error, result) {
                                if (!error) {
                                        $scope.loader = false;
                                        vm.res = web3.toAscii(result);
                                        vm.res = vm.res.replace(/\0/g, '');
                                        if (vm.res != '' && typeof vm.res != 'undefined') {
                                                $scope.Warnigs = "Already sent to blockchain.";
                                                $scope.hideSubmit = false;
                                                $scope.$digest();
                                        }
                                        else {
                                                $scope.Warnigs = "";
                                                $scope.hideSubmit = true;
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

        $scope.getTransactionStatus = function (transHashString) {

                web3.eth.getTransactionReceipt(transHashString, function (error, result) {
                        if (result != null && result != "") {
                                if (!error) {
                                        console.log(result);
                                        if (result.status == "0x1") {
                                                console.log("success");
                                                $scope.loaderStatus = false;
                                                $scope.successMessage = 'Candidate result details have been sent to Block chain successfully!';
                                                $scope.statusMsg = "completed";
                                                $scope.loaderStatusMsg = true;
                                                $interval.cancel($scope.chkStatus);
                                                $scope.$digest();
                                        }
                                        else {
                                                $scope.loaderStatus = false;        
                                                $scope.statusMsg = "failure";
                                                $scope.Warnigs = 'There is some problem in sending result to Block chain';
                                                $scope.loaderStatusMsg = true;
                                                $scope.$digest();
                                        }
                                }
                                else {
                                        $scope.Warnigs = error;
                                        $scope.loaderStatus = false;
                                        $scope.loaderStatusMsg = false;
                                        $scope.$digest();
                                }
                        } else {
                                $scope.loaderStatus = true;
                                $scope.loaderStatusMsg = true;
                                $scope.statusMsg = "processing";
                                $scope.successMessage = 'Candidate result details sending to Block chain intiated!';
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
                                                $scope.loaderStatus = true;
                                                $scope.loaderStatusMsg = true;
                                                $scope.loaderSubmit = false;
                                                $scope.statusMsg = "processing";
                                                $scope.successMessage = 'Candidate result details sending to Block chain intiated!';
                                                $scope.returnHashString = 'Transaction Hash : ' + result;
                                                $scope.transHashString = result;
                                                $sessionStorage.TransHashList.push({"UUID":UUID,"TransHash":result});
                                                //$sessionStorage.TransHashList.push(result);                                                
                                                $scope.chkStatus = $interval($scope.getTransactionStatus, 2000, 0, true, $scope.transHashString);
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
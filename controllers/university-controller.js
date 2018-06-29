//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('universityController', ['$scope', '$rootScope', '$filter', 'Service_schoolCandDetails', 'service_universities', '$sessionStorage', '$window', '$mdDialog', function ($scope, $rootScope, $filter, Service_schoolCandDetails, service_universities, $sessionStorage, $window, $mdDialog) {

    $scope.ShowCanDetails = false;
    $scope.Warnigs = "";
    $scope.Candloader = true;
    $scope.showUUID = false;
    $scope.loader = false;
    $scope.transViewlink = false;

    $scope.fn_clear = function () {
        $scope.Warnigs = "";
    };

    $scope.customFullscreen = false;
    $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'transactionHistoryView.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen,
            scope: $scope,
            preserveScope: true
        })
    };


    function DialogController($scope, $mdDialog) {

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

    };



    console.log($sessionStorage.TransHashList);

    $scope.universityDetails = service_universities.universityDetails;


    $scope.getUniversityDetails = ($filter('filter')($scope.universityDetails, { universityAddress: $rootScope.LoginUniversityAddress }));
    $scope.universityCode = $scope.getUniversityDetails[0].universityCode;
    $scope.universityName = $scope.getUniversityDetails[0].universityName;


    var CandRes;
    $scope.UUIDArray = [];
    $rootScope.CandResultContract.listInsCandEvents(1, $scope.universityCode
        , function (error, result) {
            if (!error) {

                angular.forEach(result[1], function (CandValue, Candkey) {

                    $rootScope.CandResultContract.getResultByUUID(CandValue, function (error, result) {
                if (!error) {
                    var res;
                    res = web3.toAscii(result);
                    res = res.replace(/\0/g, '');
                    //console.log("result data : ", vm.res);
                    var cipherParams = CryptoJS.lib.CipherParams.create({
                        ciphertext: CryptoJS.enc.Base64.parse(res)
                    });
                    var decryptedResult = CryptoJS.AES.decrypt(
                        cipherParams,
                        $rootScope.base64Key,
                        { iv: $rootScope.iv }
                    );
                    $scope.descrString = decryptedResult.toString(CryptoJS.enc.Utf8);

                        $scope.CandDetails = JSON.parse($scope.descrString);
                        console.log($scope.CandDetails.candName);
                        CandRes = web3.toAscii(CandValue);
                    CandRes = CandRes.replace(/\0/g, '');
                    //console.log(CandRes);
                    $scope.UUIDArray.push({UUID:CandRes,candName:$scope.CandDetails.candName});
                    console.log($scope.UUIDArray);
                        $scope.$digest();

                    
                   
                }
            });

                   
                });
                $scope.Candloader = false;
                $scope.showUUID = true;
                $scope.$digest();
            }

        });





    $scope.fn_getCandDetails = function (UUID) {
        $scope.ShowCanDetails = false;
        $scope.Warnigs = "";
        var vm = this;
        var res;
        if (typeof UUID != 'undefined' || typeof UUID != 'undefined') {
            if (typeof $sessionStorage.TransHashList != 'undefined') {
                $scope.getTransactionDetails = ($filter('filter')($sessionStorage.TransHashList, { UUID: UUID }));
                console.log($scope.getTransactionDetails);
                if ($scope.getTransactionDetails.length > 1) {
                    $scope.transViewlink = true;

                    web3.eth.getTransactionReceipt($scope.getTransactionDetails[0].TransHash, function (error, result) {
                        if (!error) {
                            //console.log(result);
                            $scope.ProvidertransactionDetails = result;
                            web3.eth.getBlock(result.blockNumber, function (error, result) {
                                if (!error) {
                                    //console.log(result)
                                    $scope.ProviderBlockDetails = result;
                                    var date1 = new Date(result.timestamp * 1000);
                                    $scope.ProviderBlockDetailsTimeStamp = date1.toUTCString();
                                }
                            });
                            //console.log(web3.eth.getBlock(2303652).timestamp)
                        }
                    });

                    web3.eth.getTransactionReceipt($scope.getTransactionDetails[1].TransHash, function (error, result) {
                        if (!error) {
                            //console.log(result);
                            $scope.SchooltransactionDetails = result;
                            web3.eth.getBlock(result.blockNumber, function (error, result) {
                                if (!error) {
                                    //console.log(result)
                                    $scope.SchoolBlockDetails = result;
                                    var date1 = new Date(result.timestamp * 1000);
                                    $scope.SchoolBlockDetailsTimeStamp = date1.toUTCString();
                                }
                            });
                            //console.log(web3.eth.getBlock(2303652).timestamp)
                        }
                    });
                }
                else
                    $scope.transViewlink = false;
            }
            else
                $scope.transViewlink = false;
            $scope.loader = true;

            /*var encryptedUUID = CryptoJS.AES.encrypt(UUID,
                $rootScope.base64Key,
                { iv: $rootScope.iv }
            );

            $scope.ciphertext = encryptedUUID.ciphertext.toString(CryptoJS.enc.Base64);

            if ($scope.ciphertext != $scope.txtTokenVal) {
                $scope.Warnigs = "Invalid combination of UUID and Token";
                $scope.ShowCanDetails = false;
                $scope.loader = false;
                return false;
            }*/
            //console.log(UUID);
            //$scope.getTransDetails = ($filter('filter')($sessionStorage.TransHashList, { "UUID": UUID }));


            $rootScope.CandResultContract.getResultByUUID(UUID, function (error, result) {
                if (!error) {
                    //console.log(result);
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

                    if (vm.res != '' && typeof vm.res != 'undefined') {
                        $scope.hideSubmit = true;
                        $scope.ShowCanDetails = true;
                        $scope.loader = false;

                        $scope.CandDetails = JSON.parse($scope.descrString);
                        //console.log($scope.CandDetails.candCode);
                        $scope.$digest();

                    }
                    else {
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
        }
    }
}]);
//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('candidateController', ['$scope', '$rootScope', '$filter', 'Service_schoolCandDetails', 'service_universities', function ($scope, $rootScope, $filter, Service_schoolCandDetails, service_universities) {

    $scope.ShowCanDetails = false;
    $scope.UUID = "";
    $scope.hasString = "";
    $scope.hideToken = true;
    $scope.Checkloader = false;
    $scope.schoolCandDetails = Service_schoolCandDetails.schoolCandDetails;
    $scope.universityDetails = service_universities.universityDetails;
    $scope.ShowUniversityDetails = false;
    $scope.Candfound = false;

    $scope.fn_getUnivercity = function (universityCode) {
        if (typeof $scope.universityVal != 'undefined' && $scope.universityVal != '') {
            $scope.Warnigs = "";
            $scope.successMessage = "";
            $scope.returnHashString = "";
            $scope.getUniversityDetails = ($filter('filter')($scope.universityDetails, { universityCode: universityCode }));
            $scope.ShowUniversityDetails = true;
            $scope.Checkloader = true;

            var UniRes;            
            $rootScope.CandResultContract.listInsCandEvents(0, UUID
                , function (error, result) {
                    if (!error) {   
                        $scope.Warnigs = "";
                        $scope.endLoop = false;
                        angular.forEach(result[0], function (Univalue, Unikey) {
                            if(!$scope.endLoop){
                            UniRes = web3.toAscii(Univalue);
                            UniRes = UniRes.replace(/\0/g, '');
                            //console.log(UniRes);
                            if (universityCode == UniRes) {
                                $scope.hideSubmit = false;
                                $scope.Checkloader = false;
                                $scope.Warnigs = 'Result already shared to this university';
                                $scope.$digest();
                                $scope.endLoop = true;
                            }
                            else
                            {
                               $scope.Checkloader = false; 
                               $scope.hideSubmit = true;
                               $scope.endLoop = true;
                               $scope.$digest();
                            }
                           }
                        });

                    }
                    else {
                        console.error(error);
                        $scope.Warnigs = error;
                        $scope.Checkloader = false;
                        $scope.$digest();
                        return false;
                    }
                });


        }
        else
            $scope.ShowUniversityDetails = false;
    };

    angular.forEach($scope.schoolCandDetails, function (value, key) {

        if ($scope.Candfound == false) {
            $scope.getCandDetails = ($filter('filter')(value.candidates, { candAddress: $rootScope.LogincandidateAddress }));
            if ($scope.getCandDetails.length > 0) {
                $scope.schoolName = value.schoolCode + '-' + value.schoolName;
                $scope.session = value.sessionMonth + ' ' + value.sessionYear;
                $scope.sessionYear = value.sessionYear;
                $scope.schoolCode = value.schoolCode;
                $scope.Candfound = true;
            }
        }
    })
    $scope.candidateName = $scope.getCandDetails[0].candCode + '-' + $scope.getCandDetails[0].candName;
    $scope.CandDetails = ($filter('filter')($scope.getCandDetails, { candCode: $scope.getCandDetails[0].candCode }));
    var vm = this;
    var res;
    $scope.Warnigs = "";
    $scope.successMessage = "";
    $scope.returnHashString = "";
    $scope.hideSubmit = true;
    $scope.loader = true;
    var UUID = 'C' + $scope.sessionYear + $scope.schoolCode + $scope.CandDetails[0].candCode;
    $rootScope.CandResultContract.checkOwnershipOfResult(UUID, $scope.CandDetails[0].candAddress, function (error, result) {

        if (result) {
            $scope.Warnigs = "";
            $scope.hideSubmit = false;
            $scope.ShowCanDetails = true;

            //start code for verify token
            var encrypted = CryptoJS.AES.encrypt(
                UUID,
                $rootScope.base64Key,
                { iv: $rootScope.iv }
            );
            $scope.ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            $rootScope.CandResultContract.verifyToken($scope.ciphertext, UUID
                , function (error, result) {
                    console.log(result);
                    if (!error) {
                        if (result) {
                            //$scope.successMessage = 'Token already created.';
                            $scope.hasString = $scope.ciphertext;
                            $scope.UUID = UUID;
                            $scope.hideToken = false;
                            $scope.hideSubmit = true;
                            $scope.$digest();
                        }

                    }
                });
            //end code for verify token
            $scope.loader = false;
            $scope.$digest();
        }
        else {
            $scope.Warnigs = "Result is not yet available.";
            $scope.hideSubmit = true;
            $scope.ShowCanDetails = false;
            $scope.loader = false;
            $scope.$digest();
        }
    });


    $scope.fn_submit = function () {
        $scope.loaderSubmit = true;
        if (typeof $scope.schoolCode != 'undefined' || typeof $scope.CandDetails[0].candCode != 'undefined') {
            var UUID = 'C' + $scope.sessionYear + $scope.schoolCode + $scope.CandDetails[0].candCode;

            /*var encrypted = CryptoJS.AES.encrypt(
                UUID,
                $rootScope.base64Key,
                { iv: $rootScope.iv }
            );
            console.log('encrypted = ' + encrypted);
            $scope.UUID = UUID;
            
            $scope.hideSubmit = true;
            $scope.Tokenloader = true;

            $scope.ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            $scope.hasString = $scope.ciphertext;

            console.log('ciphertext = ' + $scope.ciphertext);

            var cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse($scope.ciphertext)
            });
            var decrypted = CryptoJS.AES.decrypt(
                cipherParams,
                $rootScope.base64Key,
                { iv: $rootScope.iv }
            );
            $scope.descrString = decrypted.toString(CryptoJS.enc.Utf8);
            console.log('decrypted=' + $scope.descrString);
            console.log($scope.ciphertext + '-' + UUID);*/
            console.log($scope.universityVal + '-' + UUID);

            $rootScope.CandResultContract.addInsCandEvent($scope.universityVal, UUID
                , function (error, result) {
                    if (!error) {
                        $scope.successMessage = 'Result shared to university successfully!';
                        $scope.returnHashString = 'Transaction Hash : ' + result;
                        console.log(result);
                        $scope.hideSubmit = true;
                        $scope.loaderSubmit = false;
                        $scope.Tokenloader = false;
                        $scope.hideToken = false;
                        $scope.$digest();

                    }
                    else {
                        console.error(error);
                        $scope.Warnigs = error;
                        $scope.loaderSubmit = false;
                        $scope.Tokenloader = false;
                        $scope.$digest();
                        return false;
                    }
                });




        }

    };

}]);
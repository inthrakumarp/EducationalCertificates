//app.controller('controller name',[dependencies, call back function]);
//scope is a object used to join both view and controller
app.controller('universityController', ['$scope', '$rootScope', '$filter', 'Service_schoolCandDetails', 'service_universities', function ($scope, $rootScope, $filter, Service_schoolCandDetails, service_universities) {

    $scope.ShowCanDetails = false;
    $scope.Warnigs = "";
    $scope.Candloader = true;
    $scope.showUUID = false;

    $scope.fn_clear = function () {
        $scope.Warnigs = "";
    }

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
                    CandRes = web3.toAscii(CandValue);
                    CandRes = CandRes.replace(/\0/g, '');
                    console.log(CandRes);
                    $scope.UUIDArray.push(CandRes);
                    $scope.Candloader = false;
                    $scope.showUUID = true;
                    $scope.$digest();
                });

            }

        });


    //console.log(web3.eth);
    /*web3.eth.getTransactionList('0xbed184cbdbd29fef45d677b5417a861702645fce', function (error, result){if (!error) {
       console.log(result)}
        });*/

    web3.eth.getBlock(0, function (error, result) {
        if (!error) {
            //console.log(result)
            /*var date1 = new Date(result.timestamp*1000);
            console.log(date1);
             console.log(date1.toUTCString())*/
        }
        else console.log(error)
    });

    web3.eth.getTransaction('0xf8acc10427cedfb9a6744aa281b898c7f24c598111df5fc2b14b98f3aa4ced1a', function (error, result) {
        if (!error) {
console.log(result);
            web3.eth.getBlock(result.blockNumber, function (error, result) {
                if (!error) {
                    console.log(result)
                    var date1 = new Date(result.timestamp * 1000);
                    console.log(date1);
                    console.log(date1.toUTCString())
                }
            });
            //console.log(web3.eth.getBlock(2303652).timestamp)
        }
    });



    //web3.eth.blockNumber(function (error, result){if (!error) {console.log(result)}}); 

    web3.eth.filter({ fromBlock: 2303771, toBlock: 2332151, address: '0xbed184cbdbd29fef45d677b5417a861702645fce' }, function (error, result) {
        if (!error) {
            // console.log(result)
        }
    });
    /*filter.get(function(error, result) {
      if(!error){
        var info = web3.eth.getBlock(result , function(error, result){
           if(!error){
             var trans = web3.eth.getTransaction(result.transactions[1], function(error,result){
               if(!error){
                 var str = web3.toAscii(result.input);
                 console.log(str);
               }else{
                  console.log(error);
               }
             });
           }else{
              console.log(error);
           }
         });
     }else{
        console.log(error);
      }
    })*/

    $scope.fn_getCandDetails = function (UUID) {
        $scope.ShowCanDetails = false;
        $scope.Warnigs = "";
        var vm = this;
        var res;
        if (typeof UUID != 'undefined' || typeof UUID != 'undefined') {
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

            $rootScope.CandResultContract.getResultByUUID(UUID, function (error, result) {
                if (!error) {
                    console.log(result);
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
                        console.log($scope.CandDetails.candCode);
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
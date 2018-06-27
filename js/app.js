var app = angular.module('MainModule', ['angularjs-crypto','ngStorage','ngMaterial', 'ngMessages']);


app.run(function (cfCryptoHttpInterceptor, $rootScope) {
	$rootScope.base64Key = CryptoJS.enc.Hex.parse('0123456789abcdef0123456789abcdef')
	$rootScope.iv = CryptoJS.enc.Hex.parse('abcdef9876543210abcdef9876543210');
})


app.run(function ($rootScope) {
	//debugger;
	$rootScope.providerAddress = '0x53CA3306454097269B1f8b0d2dA2782a830278E1';
	$rootScope.showProviderScreen = false;
	$rootScope.School01Address = '0x709493Ed486951032e23638fDb77895aF90bE556';
	$rootScope.School02Address = '0xe9fFaEe9774994FBcD382154369ab190d13E5BFe';
	$rootScope.showSchoolScreen = false;
	$rootScope.Cand001Address = '0x41B4e88f9eECEA63812c74C81ba8Df85351CF8A4';
	$rootScope.Cand002Address = '0x07Bb1A5A92ADc3E7820a94F017c850bB0f027cba';
	$rootScope.Cand003Address = '0x3F112695a0AbFcfCdAad9a2C09d4ebb7AF4E2257';
	$rootScope.Cand004Address = '0xA62dc2303BD74eBDBa79B37FBd7184b8EE4Ce43a';
	$rootScope.Cand005Address = '0xA62dc2303BD74eBDBa79B37FBd7184b8EE4Ce43a';
	$rootScope.Cand006Address = '0xA62dc2303BD74eBDBa79B37FBd7184b8EE4Ce43a';
	$rootScope.showCandScreen = false;
	$rootScope.UniversityAddress01 = '0xe9fFaEe9774994FBcD382154369ab190d03E5BFe';
	$rootScope.UniversityAddress02 = '0xA62dc2303BD74eBDBa79B37FBd7184b8EE4Ce43a';
	$rootScope.LoginUniversityAddress = false;
	$rootScope.showTransactionScreen = false;
	$rootScope.whohaslogged = "";


	if (typeof web3 !== 'undefined') {
		web3 = new Web3(web3.currentProvider);
		web3.eth.defaultAccount = web3.eth.accounts[0];
		if (typeof web3.eth.defaultAccount !== 'undefined') {
			if (web3.eth.defaultAccount.toUpperCase() == $rootScope.providerAddress.toUpperCase()) {
				$rootScope.showProviderScreen = true;
				$rootScope.whohaslogged = "Results provider";
			}
			else if (web3.eth.defaultAccount.toUpperCase() == $rootScope.School01Address.toUpperCase() || web3.eth.defaultAccount.toUpperCase() == $rootScope.School02Address.toUpperCase()) {
				$rootScope.showSchoolScreen = true;
				$rootScope.LoginschoolAddress = web3.eth.defaultAccount;
				$rootScope.whohaslogged = "School";
			}
			else if (web3.eth.defaultAccount.toUpperCase() == $rootScope.Cand001Address.toUpperCase() || web3.eth.defaultAccount.toUpperCase() == $rootScope.Cand002Address.toUpperCase() || web3.eth.defaultAccount.toUpperCase() == $rootScope.Cand003Address.toUpperCase() || web3.eth.defaultAccount.toUpperCase() == $rootScope.Cand004Address.toUpperCase()) {
				$rootScope.showCandidateScreen = true;
				$rootScope.LogincandidateAddress = web3.eth.defaultAccount;
				$rootScope.whohaslogged = "Candidate";
			}
			else if (web3.eth.defaultAccount.toUpperCase() == $rootScope.UniversityAddress01.toUpperCase() || web3.eth.defaultAccount.toUpperCase() == $rootScope.UniversityAddress02.toUpperCase()) {
				$rootScope.showUniversityScreen = true;
				$rootScope.LoginUniversityAddress = web3.eth.defaultAccount;
				$rootScope.whohaslogged = "University";
			}
			else {
				$rootScope.showTransactionScreen = true;
				$rootScope.whohaslogged = "Transaction";
			}

			var candidateContractABI = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_UUID",
				"type": "bytes32"
			}
		],
		"name": "addEvent",
		"outputs": [
			{
				"name": "eventId",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "InsUUID",
				"type": "bytes32"
			},
			{
				"name": "CandUUID",
				"type": "bytes32"
			}
		],
		"name": "addInsCandEvent",
		"outputs": [
			{
				"name": "eventInsId",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "memberAddress",
				"type": "address"
			},
			{
				"name": "role",
				"type": "bytes32"
			}
		],
		"name": "addMember",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "membertoken",
				"type": "string"
			},
			{
				"name": "UUIDs",
				"type": "bytes32"
			}
		],
		"name": "addToken",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "UUID",
				"type": "bytes32"
			},
			{
				"name": "candAddress",
				"type": "address"
			},
			{
				"name": "schoolAddress",
				"type": "address"
			},
			{
				"name": "result",
				"type": "bytes"
			},
			{
				"name": "initialized",
				"type": "bool"
			},
			{
				"name": "schoolApproval",
				"type": "bool"
			},
			{
				"name": "providerApproval",
				"type": "bool"
			}
		],
		"name": "createResult",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_senderAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_eventId",
				"type": "uint256"
			}
		],
		"name": "EventInsAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_senderAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_eventId",
				"type": "uint256"
			}
		],
		"name": "EventAdded",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "memberAddress",
				"type": "address"
			}
		],
		"name": "getMember",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "msgHash",
				"type": "bytes32"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "recoverAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "UUID",
				"type": "bytes32"
			},
			{
				"name": "to",
				"type": "address"
			}
		],
		"name": "transferResultOwnership",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "memberToken",
				"type": "string"
			},
			{
				"name": "UUIDs",
				"type": "bytes32"
			}
		],
		"name": "verifyToken",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "UUID",
				"type": "bytes32"
			},
			{
				"name": "ownerAddress",
				"type": "address"
			}
		],
		"name": "checkOwnershipOfResult",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "UUID",
				"type": "bytes32"
			}
		],
		"name": "getResultByUUID",
		"outputs": [
			{
				"name": "res",
				"type": "bytes"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "UUID",
				"type": "bytes32"
			}
		],
		"name": "getTransDetailsByUUID",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "bool"
			},
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "listEvents",
		"outputs": [
			{
				"name": "eventIds",
				"type": "uint256[]"
			},
			{
				"name": "eventUUIDs",
				"type": "bytes32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "ins",
				"type": "uint256"
			},
			{
				"name": "_UUID",
				"type": "bytes32"
			}
		],
		"name": "listInsCandEvents",
		"outputs": [
			{
				"name": "InsUUIDs",
				"type": "bytes32[]"
			},
			{
				"name": "CandUUIDs",
				"type": "bytes32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]);
			// old contract replaced on 24-MAY-18
			// $rootScope.CandResultContract = candidateContractABI.at("0xbed184cbdbd29fef45d677b5417a861702645fce");
			// $rootScope.CandResultContract = candidateContractABI.at("0x452ff37f684003e542bd3d42fd22804fd9d30426");
			$rootScope.CandResultContract = candidateContractABI.at("0x16a33907f8eab1fe2a933ae74d43104f458b9385");
		}
		else {
			$rootScope.errorMessage = 'Authentication failed..!';
			$rootScope.whohaslogged = "";
		}

	} else {
		// set the provider you want from Web3.providers
		web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8080/"));
	}


});

app.factory('Service_schoolCandDetails', function () {

	return {
		schoolCandDetails: [{
			"schoolCode": "S000001",
			"schoolName": "Global International school",
			"schoolAddress": "0x709493Ed486951032e23638fDb77895aF90bE556",
			"sessionMonth": "MAY",
			"sessionYear": "2018",
			"candidates": [{
				"candCode": "C101", "candAddress": "0x41B4e88f9eECEA63812c74C81ba8Df85351CF8A4", "candName": "Raju M", "resultCode": "D", "totalPoints": 75, "resultDescription": "DIPLOMA AWARDED",
				"subjects": [{ "subjectName": "Biology", "subjectLvl": "HL", "subjectGrade": "7" }, { "subjectName": "Chemistry", "subjectLvl": "SL", "subjectGrade": "8" }, { "subjectName": "Physics", "subjectLvl": "SL", "subjectGrade": "5" }]
			},
			{ "candCode": "C102", "candAddress": "0x07Bb1A5A92ADc3E7820a94F017c850bB0f027cba", "candName": "Ramesh", "resultCode": "C", "totalPoints": 60, "resultDescription": "COURSE AWARDED", "subjects": [{ "subjectName": "Zoology", "subjectLvl": "HL", "subjectGrade": "A" }, { "subjectName": "Chemistry", "subjectLvl": "SL", "subjectGrade": "5" }, { "subjectName": "Physics", "subjectLvl": "SL", "subjectGrade": "4" }, { "subjectName": "Computer", "subjectLvl": "SL", "subjectGrade": "7" }] }]
		},
		{
			"schoolCode": "S000002",
			"schoolName": "St.Mary's convent",
			"schoolAddress": "0xe9fFaEe9774994FBcD382154369ab190d03E5BFe",
			"sessionMonth": "MAY",
			"sessionYear": "2018",
			"candidates": [{
				"candCode": "C103", "candAddress": "0x3F112695a0AbFcfCdAad9a2C09d4ebb7AF4E2257", "candName": "Inthra kumar", "resultCode": "D", "totalPoints": 50, "resultDescription": "DIPLOMA AWARDED",
				"subjects": [{ "subjectName": "Biology", "subjectLvl": "HL", "subjectGrade": "7" }, { "subjectName": "Chemistry", "subjectLvl": "SL", "subjectGrade": "5" }, { "subjectName": "Physics", "subjectLvl": "SL", "subjectGrade": "4" }]
			},
			{ "candCode": "C104", "candAddress": "0xA62dc2303BD74eBDBa79B37FBd7184b8EE4Ce43a", "candName": "Ezhilarasan", "resultCode": "D", "totalPoints": 60, "resultDescription": "DIPLOMA AWARDED", "subjects": [{ "subjectName": "Biology", "subjectLvl": "HL", "subjectGrade": "7" }, { "subjectName": "Chemistry", "subjectLvl": "SL", "subjectGrade": "5" }, { "subjectName": "Physics", "subjectLvl": "SL", "subjectGrade": "4" }] }
				,
			{
				"candCode": "C105", "candAddress": "0xA62dc2303BD74eBDBa79B37FBd7184b8EE4Ce43a", "candName": "Karthikeyan P", "resultCode": "D", "totalPoints": 70, "resultDescription": "COURSE AWARDED",
				"subjects": [{ "subjectName": "Biology", "subjectLvl": "HL", "subjectGrade": "7" }, { "subjectName": "Chemistry", "subjectLvl": "SL", "subjectGrade": "6" }, { "subjectName": "Physics", "subjectLvl": "SL", "subjectGrade": "7" }]
			},
			{
				"candCode": "C106", "candAddress": "0xA62dc2303BD74eBDBa79B37FBd7184b8EE4Ce43a", "candName": "Murali", "resultCode": "D", "totalPoints": 75, "resultDescription": "COURSE AWARDED",
				"subjects": [{ "subjectName": "Biology", "subjectLvl": "HL", "subjectGrade": "7" }, { "subjectName": "Chemistry", "subjectLvl": "SL", "subjectGrade": "8" }, { "subjectName": "Physics", "subjectLvl": "SL", "subjectGrade": "8" }]
			}]
		}
		]

	};
});

app.factory('service_universities', function () {

	return {
		universityDetails: [{
			"universityCode": "u000001",
			"universityName": "University name1",
			"universityAddress": "0xe9ffaee9774994fbcd382154369ab190d03e5bfe"
		},
		{
			"universityCode": "u000002",
			"universityName": "University name2",
			"universityAddress": "0xA62dc2303BD74eBDBa79B37FBd7184b8EE4Ce43a"
		},
		{
			"universityCode": "u000003",
			"universityName": "University name3",
			"universityAddress": "0x709493Ed486951032e23638fDb77895aF90bE556"
		}]
	}
});




/*app.service('TransactionHash', ['$rootScope', function ($rootScope, $http) {

	if (angular.isUndefined($rootScope.transHashList)) {
		$rootScope.transHashList = [];
	}


	return {
		getHash: getHash,
		setHash: setHash
	};

	function getHash() {
		return $rootScope.transHashList;
	}

	function setHash(value) {
		$rootScope.transHashList.push(value);
	}
}]);*/


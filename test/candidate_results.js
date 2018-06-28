var CandidateResults = artifacts.require("./CandidateResults.sol");

const ecies = require("eth-ecies");

contract('CandidateResults', function(accounts){
    var providerAddress = accounts[0];
    var schoolAddress = accounts[1];
    var candidateAddress = accounts[2];
    var universityAddress = accounts[3];

    it("Should create candidate results", function(){
        var candidate_results;

        return CandidateResults.deployed().then(function(instance){
            candidate_results = instance;

            var result = '{"sessionNumber": 001, "school": "000040", "session": "MAY 2017", "resultCode": "D", "totalPoints": 50, "resultDescription": "DIPLOMA AWARDED"}';
            //var result = 'diploma awarded';
             const publicKey = 'e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003';
             let userPublicKey = new Buffer(publicKey, 'hex');
             let bufferData = new Buffer(result);

             let encryptedResult = ecies.encrypt(userPublicKey, bufferData);
             encryptedResult = encryptedResult.toString('base64')
             console.log("encryptedResult ? ", encryptedResult);
            return candidate_results.createResult('cand1', candidateAddress, schoolAddress, encryptedResult, true, false, true);
            
        }).then(function(result){
            //var res = web3.toAscii(result);
            //res = res.replace(/\0/g, '');
            var result = '{"sessionNumber": 002, "school": "000050", "session": "MAY 2017", "resultCode": "D", "totalPoints": 50, "resultDescription": "DIPLOMA AWARDED"}';
            //var result = 'diploma awarded';
             const publicKey = 'e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003';
             let userPublicKey = new Buffer(publicKey, 'hex');
             let bufferData = new Buffer(result);

             let encryptedResult = ecies.encrypt(userPublicKey, bufferData);
             encryptedResult = encryptedResult.toString('base64')
            console.log("result created ? ", result.tx);
            return candidate_results.createResult('Cand2018000011103', candidateAddress, schoolAddress, encryptedResult, true, false, true);
            
        }).then(function(result){
            //var res = web3.toAscii(result);
            //res = res.replace(/\0/g, '');
            console.log("result created ? ", result.tx);

            return candidate_results.getResultByUUID.call('cand1');
        }).then(function(result){
             var res = web3.toAscii(result);
             res = res.replace(/\0/g, '');
             console.log("result : ", res);
             const privateKey = '55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690';
                
                let userPrivateKey = new Buffer(privateKey, 'hex');
                let bufferEncryptedData = new Buffer(res, 'base64');

                let decryptedResult = ecies.decrypt(userPrivateKey, bufferEncryptedData);

                console.log("decryptedResult ?", decryptedResult.toString('utf8'))
             return candidate_results.checkOwnershipOfResult.call('cand1', providerAddress);
         }).then(function(result){
             console.log("is Provider owner ? ", result);
          
             //candidate_results.addResult('cand1', 'Diploma awarded');
             return candidate_results.transferResultOwnership('cand1', schoolAddress, {from: providerAddress});
            // return candidate_results.checkOwnershipOfResult.call('cand1', schoolAddress);
         }).then(function(result){
            //var res = web3.toAscii(result);
            //res = res.replace(/\0/g, '');
            console.log("result created ? ", result.tx);
           // return candidate_results.checkOwnershipOfResult.call('cand1', providerAddress);
           return candidate_results.getTransDetailsByUUID.call('cand1');
         }).then(function(result){
              console.log("getTransDetailsByUUID : ", result);
         }).then(function(result){
             console.log("is Provider owner ? ", result);

             return candidate_results.checkOwnershipOfResult.call('cand1', schoolAddress);
         }).then(function(result){
             console.log("is School owner ? ", result);

             candidate_results.addMember(providerAddress, 'Provider');

             return candidate_results.getMember.call(providerAddress);
         }).then(function(result){
             var res = web3.toAscii(result);
             res = res.replace(/\0/g, '');
             console.log("result : ", res);

            
            let addr = providerAddress;
            let mesg = 'I really did make this message';

            var hexMesg = ''
            for(var i=0;i<mesg.length;i++) {
            hexMesg += ''+mesg.charCodeAt(i).toString(16)
        }
           // let privateKey = "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"
            let signature = web3.eth.sign(addr, '0x' + hexMesg)
            console.log(signature);

            signature = signature.substr(2); //remove 0x
            const r = '0x' + signature.slice(0, 64);
            const s = '0x' + signature.slice(64, 128);
            const v = '0x' + signature.slice(128, 130);
            const v_decimal = web3.toDecimal(v);

            console.log(v_decimal);
            let message = 'I really did make this message';
            
            var messageHex = web3.sha3(message)
            let signature1 = web3.eth.sign(schoolAddress, messageHex);
            console.log("signature1 : ", signature1);

            signature1 = signature1.slice(2)
            let r1 = `0x${signature1.slice(0, 64)}`
            let s1 = `0x${signature1.slice(64, 128)}`
            let v1 = web3.toDecimal(signature1.slice(128, 130)) + 26
                    
            console.log('        r:', r1)
            console.log('        s:', s1)
            console.log('        v:', v1)
            console.log();
            console.log(web3.toDecimal(v1));
            let messageHash =  web3.sha3(web3.sha3('Hello World'));
            return candidate_results.recoverAddress.call(messageHash, v1, r1, s1);

        }).then(function(result){
                console.log("signed message ? ", result);

                var result = '{"sessionNumber": 001, "school": "000040", "session": "MAY 2017", "resultCode": "D", "totalPoints": 50, "resultDescription": "DIPLOMA AWARDED"}';
                var h = web3.sha3(result)
                var sig = web3.eth.sign(providerAddress, h).slice(2)
                console.log("sig ? ", sig);
                sig = web3.eth.sign(schoolAddress, h).slice(2)
                console.log("sig ? ", sig);
                var r2 = `0x${sig.slice(0, 64)}`
                var s2 = `0x${sig.slice(64, 128)}`
                var v2 = web3.toDecimal(sig.slice(128, 130)) + 27
                console.log("v2 ? ", v2);

              return candidate_results.addInsCandEvent('Univ345', 'Cand456');
         }).then(function(result){
             
                console.log("signed message1 ? ", result);

                const publicKey = 'e0d262b939cd0267cfbe3f004e2863d41d1f631ce33701a8920ba73925189f5d15be92cea3c58987aa47ca70216182ba6bd89026fc15edfe2092a66f59a14003';
                const privateKey = '55bb4cb6407303de8e4c5a635021d3db12cb537305eeb6401612ce14b35d6690';
                const data = '{"sessionNumber": 001, "school": "000040", "session": "MAY 2017", "resultCode": "D", "totalPoints": 50, "resultDescription": "DIPLOMA AWARDED"}';

                let userPublicKey = new Buffer(publicKey, 'hex');
                let bufferData = new Buffer(data);

                let encryptedData = ecies.encrypt(userPublicKey, bufferData);
                encryptedData = encryptedData.toString('base64')
               console.log("encryptedData ? ", encryptedData);

                let userPrivateKey = new Buffer(privateKey, 'hex');
                let bufferEncryptedData = new Buffer(encryptedData, 'base64');

                let decryptedData = ecies.decrypt(userPrivateKey, bufferEncryptedData);

                console.log("DecryptedData ?", decryptedData.toString('utf8'))
                  return candidate_results.addInsCandEvent('Univ123', 'Cand123');
                  
        }).then(function(result){
             
             console.log("even id", result);
            // return candidate_results.verifyToken.call('tewstsd1', 'cand1');
            return candidate_results.listInsCandEvents.call(1,'Univ123');
        }).then(function(result){
             console.log("university cand: ", result);
             console.log("university cand 0: ", result[0]);
             console.log("university cand 1: ", result[1]);
             console.log("university  storage: 0 ", web3.toAscii(result[1][0]));
             //console.log(" cand storage:0 ", web3.toAscii(result[1][1]));
             return candidate_results.listEvents.call();
              //return candidate_results.getTransDetailsByUUID.call('cand1');
         }).then(function(result){
             //var res = web3.toAscii(result[1]);
             //res = res.replace(/\0/g, '');
              //console.log("UUID array : ",);
              //console.log("UUID array : ",res1);
             console.log("UUID array : ",web3.toAscii(result[1][0]));
             console.log("UUID array 1 : ",web3.toAscii(result[1][1]));
             //console.log("UUID array 1 : ",web3.toAscii(result[1][2]));
             //console.log("UUID array : ", web3.toAscii(result[1][0]));
             return candidate_results.getTransDetailsByUUID.call('cand1');
         }).then(function(result){
              console.log("getTransDetailsByUUID : ", result);
              return candidate_results.transferResultOwnership('cand1', candidateAddress, {from: schoolAddress});
              //return candidate_results.checkOwnershipOfResult.call('cand1', candidateAddress);
         }).then(function(result){
             console.log("is cand owner ? ", result);
             return candidate_results.checkOwnershipOfResult.call('cand1', schoolAddress);  
         }).then(function(result){
             console.log("is school owner ? ", result);
             return candidate_results.checkOwnershipOfResult.call('cand1', candidateAddress);  
         }).then(function(result){
             console.log("is cand owner ? ", result);
            // return candidate_results.checkOwnershipOfResult.call('cand1', schoolAddress);  
         })
    })
})

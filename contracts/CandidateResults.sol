pragma solidity ^0.4.4;


contract CandidateResults {

    struct CandidateResult {
        address candidateAddress;
        address schoolAddress;
        bytes result;
        bool initialized;
        bool approvedBySchool;
        bool approvedByProvider;
    }
    mapping(bytes32 => CandidateResult) resultsStore;
      

   
struct Event {
        bytes32 UUID;
    }
struct EventInsCand {
        bytes32 InsUUID;
        bytes32 CandUUID;
    }

    uint totalEvents;

    uint totalInsEvents;

    uint noOfItems;

    mapping(uint => Event) EventList;
    mapping(uint => EventInsCand) EventInsCandList;

    event EventAdded(address indexed _senderAddress, uint _eventId);
    event EventInsAdded(address indexed _senderAddress, uint _eventId);

    function addEvent(bytes32 _UUID) returns(uint eventId) {
        eventId = totalEvents++;
        EventList[eventId] = Event(_UUID);
        EventAdded(msg.sender, eventId);
    }
    function addInsCandEvent(bytes32 InsUUID,bytes32 CandUUID) public returns(uint eventInsId){
        eventInsId = totalInsEvents++;
        EventInsCandList[eventInsId] = EventInsCand(InsUUID,CandUUID);
        EventInsAdded(msg.sender, eventInsId);
    }
    function getTransDetailsByUUID(bytes32 UUID) constant returns (address,address,bool,bool) {
        
   return (resultsStore[UUID].candidateAddress, resultsStore[UUID].schoolAddress, resultsStore[UUID].approvedBySchool,resultsStore[UUID].approvedByProvider);
    }
    
    function listEvents() constant returns(uint[] eventIds, bytes32[] eventUUIDs) {
        uint maxIters = totalEvents;
        eventIds = new uint[](maxIters);
        eventUUIDs = new bytes32[](maxIters);

        for(uint i=0;i<maxIters;i++) {
            uint eventId =  i;
            Event memory e = EventList[eventId];
            eventIds[i] = eventId;
            eventUUIDs[i] = e.UUID;
        }
    }

    function listInsCandEvents(uint ins, bytes32 _UUID) constant returns(bytes32[] InsUUIDs,bytes32[] CandUUIDs) {
        uint maxIters = totalInsEvents;
         noOfItems = 0;
      
        for(uint j=0;j<maxIters;j++) {
            
            EventInsCand memory g = EventInsCandList[j];
            if(ins == 1 )
            {
                   if (g.InsUUID == _UUID)
                   {
                     noOfItems++;
                   }
            }
            else
            {   
                if (g.CandUUID == _UUID)
                   {
                       noOfItems++;
                   }
            }
            
        }
        CandUUIDs = new bytes32[](noOfItems);
        InsUUIDs = new bytes32[](noOfItems);
        uint k = 0;

        for(uint i=0;i<maxIters;i++) {
            uint eventInsId =  i;
            EventInsCand memory f = EventInsCandList[eventInsId];
            if(ins == 1 )
            {
                   if (f.InsUUID == _UUID)
                   { 
                     InsUUIDs[k] = f.InsUUID;
                     CandUUIDs[k] = f.CandUUID;
                      k++;
                   }
            }
            else
            {   
                if (f.CandUUID == _UUID)
                   {
                        InsUUIDs[k] = f.InsUUID;
                        CandUUIDs[k] = f.CandUUID;
                        k++;
                   }
            }
            
        }
    }
 
    
    
    struct Identity {
        bytes32 role;
    }

    mapping(address => Identity)  membersStore;
    struct Token {
        string universityToken;
    }
    
     mapping(bytes32 => Token)  tokenStore;
    mapping(address => mapping(bytes32 => bool))  ownershipStore;

    address owner;

    function CandidateResults() public {
        owner = msg.sender;
    }
   
  
    function createResult(bytes32 UUID, address candAddress, address schoolAddress, bytes result, bool initialized, bool schoolApproval, bool providerApproval) public returns (bool) {
        if (resultsStore[UUID].initialized) {
            return false;
        }
        
        addEvent(UUID);
        resultsStore[UUID] = CandidateResult(candAddress, schoolAddress, result, initialized, schoolApproval, providerApproval);
        // When the results provider adds the results to blockchain, the ownership of the results will be to school directly.
         ownershipStore[schoolAddress][UUID] = true;

       return true;
    }
    
    function transferResultOwnership(bytes32 UUID, address to) public returns (bool) {
        if(!resultsStore[UUID].initialized) {
            return false;
        }

        if(!ownershipStore[msg.sender][UUID]) {
            return false;
        }

        // When the results is added itself, the approvedByProvider will be set to true. transferResultOwnership function will be called only when the school approves the result
        resultsStore[UUID].approvedBySchool = true;
        ownershipStore[msg.sender][UUID] = false;
        ownershipStore[to][UUID] = true;
        return true;
    }

    function getResultByUUID(bytes32 UUID) public constant returns (bytes res) {
        return(resultsStore[UUID].result);
    }
   

    function checkOwnershipOfResult(bytes32 UUID, address ownerAddress) public constant returns (bool) {
        var res = ownershipStore[ownerAddress][UUID];

        return (res);
    }

    function addMember(address memberAddress, bytes32 role) public returns (bool) {
        membersStore[memberAddress].role = role;

        return true;
    }
    function addToken(string membertoken, bytes32 UUIDs) public returns (bool) {
        tokenStore[UUIDs].universityToken = membertoken;

        return true;
    }
    function verifyToken(string memberToken, bytes32 UUIDs) constant returns (bool) {
        return sha3(tokenStore[UUIDs].universityToken) == sha3(memberToken);
    }

    function getMember(address memberAddress) public returns (bytes32) {
        return membersStore[memberAddress].role;
    }

    function recoverAddress(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) returns (address) {
         bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = sha3(prefix, msgHash);
        address addr = ecrecover(prefixedHash, v, r, s);

        return addr;
    }

}
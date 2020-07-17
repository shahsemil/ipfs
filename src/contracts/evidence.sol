pragma experimental ABIEncoderV2;
pragma solidity  0.5.0; 
 
 contract evidence{
     //smart contract code 
     string evidenceHash;
     int uniqueId;
     uint256 pointer=0;
     int[] _uniqueId;
     //read function
     function set(string memory _evidenceHash) public {
         evidenceHash = _evidenceHash;
         pointer=pointer+1;
     }
     //write function
     function get() public view returns(string memory){
         return evidenceHash;
     }
 }

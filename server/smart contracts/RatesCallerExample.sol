// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/* AB Contract
    External Interface for Simple Storage Contract
*/


interface SimpleStorageInterface {
    function number() external returns (uint256 number);
    function getNumber() external returns (uint256 number);
    function getPrivateNumber() external returns (uint256 number);
    function otherPublicNumber() external returns (uint256 number);
    function otherPrivateNumber() external returns (uint256 number);
    // For testing purposes, only owner can set a new number but anyone can increment / decrement
    function setNumber(uint256 num) external;
    function increment() external;
    function getArray() external view returns (uint256[] memory);
    function getArray2() external view returns (uint256[] memory);
    function getElementArray2(uint256 i) external view returns (uint256);
}

interface PotContractInterface {
    function dsr() external returns (uint256 number);

}

contract CallerContract {
    // StorageInterface store;
    SimpleStorageInterface store;
    PotContractInterface potContract;
    
    uint256[] public myRates = [5, 5, 5];
    uint256[] public temp = [0, 0, 0];
    

    constructor() {
        // store = SimpleStorageInterface(0x28170846a0D8002f65DB3eD8be9b507cCB9Af7f2);
        store = SimpleStorageInterface(0xd9145CCE52D386f254917e481eB44e9943F39138);
        potContract = PotContractInterface(0x9588a660241aeA569B3965e2f00631f2C5eDaE33);
    }
    function getDsr() public returns (uint256 number) {
       return potContract.dsr();
    }
    
    
    function getPublicVarFromInterface() public returns (uint256 number) {
       return store.number();
    }
    function getPrivateNumberFromInterface() public returns (uint256 number) {
      return store.getPrivateNumber();
    }
    function setNumberFromInterface(uint256 externalNum) public {
        store.setNumber(externalNum);
    }
    function increment() public {
        store.increment();
        
    }
    function getArray() public view returns (uint256[] memory) {
        return store.getArray();
    }
    function getArray2() public view returns (uint256[] memory) {
        return store.getArray2();
    }
    function getElementArray2(uint256 i) public view returns (uint256) {
        return store.getElementArray2(i);
    }
    
    
    function noStateRates() public returns (uint256[] memory) {
        temp[0] = store.number();
        temp[1] = store.otherPublicNumber();
        temp[2] = store.getPrivateNumber();
        

        return temp;
    }
    

    function updateRates0() public returns (uint256[] memory) {
        myRates[0] = store.number();
        myRates[1] = store.otherPublicNumber();
        myRates[2] = store.getPrivateNumber();
        return myRates;
    }
    
        
    function updateRates1() public returns (uint256[] memory) {
        myRates[1]++;
        return myRates;
    }
        
    function updateRates2() public returns (uint256[] memory) {
        myRates[2] = 42;
        return myRates;
    }
    
    function getRates() public returns (uint256[] memory) {
        updateRates0();
        updateRates2();
        
        return myRates;
    }
    
    
    
}

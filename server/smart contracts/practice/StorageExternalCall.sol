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

contract CallerContract {
    // StorageInterface store;
    SimpleStorageInterface store;
    // uint256 number;
    address owner;

    constructor() {
        // owner = msg.sender;
        store = SimpleStorageInterface(0x58b9bDaA6E3464f703550722109877D600DE24EC);
    }
    function getPublicVarFromInterface() external returns (uint256 number) {
      return store.number();
    }
    function getPrivateNumberNumberFromInterface() external returns (uint256 number) {
      return store.getPrivateNumber();
    }
    function setNumberFromInterface(uint256 externalNum) external {
        store.setNumber(externalNum);
    }
    function increment() external {
        store.increment();
        
    }
    function getArray() external view returns (uint256[] memory) {
        return store.getArray();
    }
    function getArray2() external view returns (uint256[] memory) {
        return store.getArray2();
    }
    function getElementArray2(uint256 i) external view returns (uint256) {
        return store.getElementArray2(i);
    }
    
    
}

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/* AB Contract
    External Interface for Getting Interest Rates on different DeFi platforms
*/


interface PotContractInterface {
    function dsr() external returns (uint256 number);

}
interface CompoundContractInterface {
    function borrowRatePerBlock() external returns (uint256 number);

}

contract CallerContract {
    PotContractInterface potContract;
    CompoundContractInterface compoundContract;
    uint256[] public ratesArray = [0, 0, 0];
    uint256 dsrtemp;

    constructor() {
        potContract = PotContractInterface(0x9588a660241aeA569B3965e2f00631f2C5eDaE33); // Dai Pot Ropsten Test Contract
        compoundContract = CompoundContractInterface(0xbc689667C13FB2a04f09272753760E38a95B998C);  // Compound Finance Ropsten Contract
    }
    
    function getDsr() public returns (uint256 number) {
       return potContract.dsr();
    }
    function getCompound() public returns (uint256 number) {
       return compoundContract.borrowRatePerBlock();
    }
    
    function setRatesArray() public returns (uint256[] memory) {
        dsrtemp = potContract.dsr();
        
        // Attempting to do DSR per block to APY Math within contract.. Use getRates() otherwise
        dsrtemp = dsrtemp / ( 10 ** 27); // dsr per second
        dsrtemp = dsrtemp ** (60 * 60 * 24 * 365); // dsr per year
        
        ratesArray[0] = compoundContract.borrowRatePerBlock();
        ratesArray[1] = dsrtemp;
        ratesArray[2] = 1337; // Placeholder to know function has worked
        
        return ratesArray;
    }
    
    function getRates() public returns (uint256[3] memory) {
        return [compoundContract.borrowRatePerBlock(), potContract.dsr(), 1];
    }
    
}

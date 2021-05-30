pragma solidity >=0.7.0 <0.9.0;

contract InterestRates {
    uint256 compoundDaiInterestRate;
    uint256 dsrInterestRate;
    uint256 otherInterestRate;
    uint256 allRates[3];

    function getCompoundDaiInterestRate() public view returns (uint256) {
      //Some logic to query Compound Dai Interest rate from Ropsten contract 0x5d3a536e4d6dbd6114cc1ead35777bab948e3643
      return compoundDaiInterestRate;
    }

    function getDaiDsrRate() public view returns (uint256) {
      //Some logic to query Dai DSR Interest rate from Ropsten contract 0x31F42841c2db5173425b5223809CF3A38FEde360
      return dsrInterestRate;
    }

    function getOtherInterestRate() public view returns (uint256) {
      // Some logic to query Dai DSR Interest rate from Ropsten contract
      return otherInterestRate;
    }

    function getAllRates() public view returns (uint256) {
      // getAllRates() is meant to be used to be used to get current interest rates of different platforms to update a graph

      allRates[0] = getCompoundDaiInterestRate()
      allRates[1] = getDaiDsrRate()
      allRates[2] = getOtherInterestRate()

      // Return either an Array or Map of multiple values from above if possible
      return allRates

    }
}

const EUSDContract = artifacts.require("EUSDContract");

module.exports = function (deployer) {
  deployer.deploy(EUSDContract);
};
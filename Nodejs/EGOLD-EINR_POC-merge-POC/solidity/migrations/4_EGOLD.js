const EGOLDContract = artifacts.require("EGOLDContract");

module.exports = function (deployer) {
  deployer.deploy(EGOLDContract);
};
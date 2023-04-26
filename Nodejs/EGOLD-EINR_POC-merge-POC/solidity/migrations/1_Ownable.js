const OwnableContract = artifacts.require("OwnableContract");

module.exports = function (deployer) {
  deployer.deploy(OwnableContract);
};
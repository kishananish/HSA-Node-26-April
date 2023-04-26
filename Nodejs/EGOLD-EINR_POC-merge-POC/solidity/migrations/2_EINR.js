const EINRContract = artifacts.require("EINRContract");

module.exports = function (deployer) {
  deployer.deploy(EINRContract);
};
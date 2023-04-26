const Web3 = require('web3');

const EINRArtifact = require('../../client/src/contracts/EINRContract.json')
const EUSDArtifact = require('../../client/src/contracts/EUSDContract.json')
const EGOLDArtifact = require('../../client/src/contracts/EGOLDContract.json')
const InventoryArtifact = require('../../client/src/contracts/Inventory.json')




const web3Func = async () => {
    let web3, networkID,
        EINRAddress, EINRContract,
        EUSDAddress, EUSDContract,
        EGOLDAddress, EGOLDContract,
        InventoryAddress, InventoryContract;

    try {
        web3 = new Web3(`${process.env.MONGODB == "EGOLD" ? process.env.GIVEN_PROVIDER_SERVER : process.env.GIVEN_PROVIDER_LOCALHOST}`);
        // web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        // web3 = new Web3("https://rpc-mumbai.maticvigil.com");
        
        networkID = await web3.eth.net.getId();
        if (EINRArtifact && EUSDArtifact && EGOLDArtifact && InventoryArtifact) {
            let { abi } = EINRArtifact;
            try {
                EINRAddress = EINRArtifact.networks[networkID].address;
                EINRContract = new web3.eth.Contract(abi, EINRAddress);
            } catch (error) {
                console.log(error);
            }

            ({ abi } = EUSDArtifact);
            try {
                EUSDAddress = EUSDArtifact.networks[networkID].address;
                EUSDContract = new web3.eth.Contract(abi, EUSDAddress);
            } catch (error) {
                console.log(error);
            }

            ({ abi } = EGOLDArtifact);
            try {
                EGOLDAddress = EGOLDArtifact.networks[networkID].address;
                EGOLDContract = new web3.eth.Contract(abi, EGOLDAddress);
            } catch (error) {
                console.log(error);
            }

            ({ abi } = InventoryArtifact);
            try {
                InventoryAddress = InventoryArtifact.networks[networkID].address;
                InventoryContract = new web3.eth.Contract(abi, InventoryAddress);
            } catch (error) {
                console.log(error);
            }

            return {
                web3, networkID,
                EINRAddress, EINRContract,
                EUSDAddress, EUSDContract,
                EGOLDAddress, EGOLDContract,
                InventoryAddress, InventoryContract
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {web3Func};
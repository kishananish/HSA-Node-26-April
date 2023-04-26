import Web3 from 'web3';
import MetaContext from './MetaContext';

import React, { useCallback, useReducer, useEffect } from 'react'
import { reducer, initialState } from "./state";

function MetaProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, initialState);

    const init = useCallback(
        async (OwnableArtifact, EINRArtifact, EUSDArtifact, EGOLDArtifact, InventoryArtifact) => {
            if (OwnableArtifact && EINRArtifact && EUSDArtifact && EGOLDArtifact && InventoryArtifact) {
                const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
                let accounts = null;
                    if (localStorage.getItem('Address')) {
                        accounts = await web3.eth.requestAccounts();
                    }
                const networkID = await web3.eth.net.getId();
                let { abi } = OwnableArtifact;
                let OwnableAddress, OwnableContract;
                    try {
                    OwnableAddress = OwnableArtifact.networks[networkID].address;
                    OwnableContract = new web3.eth.Contract(abi, OwnableAddress);
                } catch (error) {
                    console.log(error);
                }

                ({ abi } = EINRArtifact);
                let EINRAddress, EINRContract;
                try {
                    EINRAddress = EINRArtifact.networks[networkID].address;
                    EINRContract = new web3.eth.Contract(abi, EINRAddress);
                } catch (error) {
                    console.log(error);
                }

                ({ abi } = EUSDArtifact);
                let EUSDAddress, EUSDContract;
                try {
                    EUSDAddress = EUSDArtifact.networks[networkID].address;
                    EUSDContract = new web3.eth.Contract(abi, EUSDAddress);
                } catch (error) {
                    console.log(error);
                }

                ({ abi } = EGOLDArtifact);
                let EGOLDAddress, EGOLDContract;
                try {
                    EGOLDAddress = EGOLDArtifact.networks[networkID].address;
                    EGOLDContract = new web3.eth.Contract(abi, EGOLDAddress);
                } catch (error) {
                    console.log(error);
                }

                ({ abi } = InventoryArtifact);
                let InventoryAddress, InventoryContract;
                try {
                    InventoryAddress = InventoryArtifact.networks[networkID].address;
                    InventoryContract = new web3.eth.Contract(abi, InventoryAddress);
                } catch (error) {
                    console.log(error);
                }

                dispatch({
                    type: 'init',
                    data: {
                        OwnableArtifact, EINRArtifact, EUSDArtifact, EGOLDArtifact, InventoryArtifact,
                        OwnableContract, EINRContract, EUSDContract, EGOLDContract, InventoryContract,
                        OwnableAddress, EINRAddress, EUSDAddress, EGOLDAddress, InventoryAddress,
                        web3, networkID, accounts
                    }
                })

            }
        }, [])

    useEffect(() => {
        const tryInit = async () => {
            try {
                const OwnableArtifact = require('../contracts/OwnableContract.json');
                const EINRArtifact = require('../contracts/EINRContract.json');
                const EUSDArtifact = require('../contracts/EUSDContract.json');
                const EGOLDArtifact = require('../contracts/EGOLDContract.json');
                const InventoryArtifact = require('../contracts/Inventory.json');
                init(OwnableArtifact, EINRArtifact, EUSDArtifact, EGOLDArtifact, InventoryArtifact);
            } catch (error) {
                console.log(error);
            }
        }
        tryInit();
    }, [init])

    useEffect(() => {
        const events = ["chainChanged", "accountsChanged"];
        const handleChange = () => {
            init(state.OwnableArtifact ,state.EINRArtifact, state.EUSDArtifact, state.EGOLDArtifact, state.InventoryArtifact);
            const accounts = null;
            localStorage.removeItem('Address');
            dispatch({
                type: 'logout',
                data: { accounts }
            })
        };

        events.forEach(e => { window.ethereum.on(e, handleChange) });
        return () => {
            events.forEach(e => window.ethereum.removeListener(e, handleChange));
        };
    }, [init, state.OwnableArtifact ,state.EINRArtifact, state.EUSDArtifact, state.EGOLDArtifact, state.InventoryArtifact]);

    const logIn = async () => {
        try {
            const accounts = await state.web3.eth.requestAccounts();
            localStorage.setItem('Address', accounts[0]);
            dispatch({
                type: 'login',
                data: { accounts }
            })
        } catch (error) {
            console.log(error);
        }

    }

    const logOut = async () => {
        try {
            const accounts = null;
            localStorage.removeItem('Address');
            dispatch({
                type: 'logout',
                data: { accounts }
            })
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <MetaContext.Provider value={{ state, dispatch, logIn, logOut }}>
            {children}
        </MetaContext.Provider>


    )
}

export default MetaProvider;
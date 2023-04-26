import Web3 from 'web3';
import Tx from './Tx';
import useMeta from '../MetamaskLogin/useMeta';

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

export default function Inventory({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { InventoryContract, accounts } } = useMeta();
    const [inventory, setInventory] = useState("");
    const [eGOLDRatio, seteGOLDRatio] = useState("");

    const [_inventory, set_Inventory] = useState("");
    const [_eGOLDRatio, set_eGOLDRatio] = useState("");

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                getDataHandler();
            })
        } else {
            setInventory(null);
            seteGOLDRatio(null);
        }
    }, [accounts])

    const getDataHandler = async () => {

        await InventoryContract.methods.inventory().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setInventory(e);
            })
            .catch(err => console.log(err));

        await InventoryContract.methods.eGOLDratio().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                seteGOLDRatio(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));
    }



    const setInventoryHandler = (e) => {
        const regex = /^[0-9]*$/; // regular expression to allow only whole numbers
        if (regex.test(e.target.value)) {
        set_Inventory(e.target.value);
        }
    }

    const addInventory = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (_inventory === "") {
            alert("Quantity should not be zero.");
            return;
        }
        setBackdrop(true);
        await InventoryContract.methods.addInventory(_inventory)
            .send({
                from: accounts[0]
            })
            .then(e => {
                // console.log(e);
                setReceipt(e)
                setTx(true);
            })
            .catch(err => {
                setBackdrop(false);
                console.log(err)
            });
        getDataHandler();
        set_Inventory("");
    }

    const removeInventory = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (_inventory === "") {
            alert("Quantity should not be zero.");
            return;
        }
        setBackdrop(true);
        await InventoryContract.methods.removeInventory(_inventory)
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
                setReceipt(e)
                setTx(true);
            })
            .catch(err => {
                setBackdrop(false);
                console.log(err)
            });
        getDataHandler();
        set_Inventory("");
    }

    // const seteRatioHandler = (e) => {
    //     set_eGOLDRatio(e.target.value);
    // }

    // const eRatio = async () => {
    //     if (!accounts) {
    //         alert("Please Connect Wallet.");
    //         return;
    //     }
    //     if (_eGOLDRatio === "") {
    //         alert("Quantity should not be zero.");
    //         return;
    //     }
    //     setBackdrop(true);
    //     await InventoryContract.methods.setRatio(Web3.utils.toWei(_eGOLDRatio, "ether"))
    //         .send({
    //             from: accounts[0]
    //         })
    //         .then(e => {
    //             //console.log(e);
    //             setReceipt(e)
    //             setTx(true);
    //         })
    //         .catch(err => {
    //             setBackdrop(false);
    //             console.log(err)
    //         });
    //     getDataHandler();
    //     set_eGOLDRatio("");
    // }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "100px" }}>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <div>
                <h1>Data</h1>
                <Table striped bordered hover >
                    <tbody>
                        <tr>
                            <th>1</th>
                            <th>Inventory </th>
                            <td>{inventory ? `${inventory} grams` : "--"}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>2</th>
                            <th>EGOLD Per grams </th>
                            <td>{eGOLDRatio ? `${eGOLDRatio} EGOLD` : "--"}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <div style={{
                padding: "1rem",
                display: "flex",
                width: "max-content",
                gap: "50px"
            }}>

                <div >
                    <div>
                        <h4>Inventory</h4>
                    </div>
                    <div style={{
                        padding: "0.5rem",
                        display: "flex",
                        gap: "100px",
                        width: "100%"
                    }}>
                        <input onChange={setInventoryHandler} value={_inventory} type='number' min={1} placeholder='GOLD qty. (grams)' />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button onClick={addInventory} variant="primary" size="sz" style={{ width: "50%" }}>
                            Add
                        </Button>
                        <Button onClick={removeInventory} variant="primary" size="sz" style={{ width: "50%" }}>
                            Remove
                        </Button>
                    </div>

                </div>

                {/* <div>
                    <div>
                        <h4>Set eGOLD Ratio</h4>
                    </div>
                    <div style={{
                        padding: "0.5rem",
                        display: "flex",
                        gap: "100px"
                    }}>
                        <input onChange={seteRatioHandler} value={_eGOLDRatio} type='number' min={1} placeholder='EGOLD Tokens in 1 grams' />
                    </div>
                    <div className="d-grid gap-2">
                        <Button onClick={eRatio} variant="primary" size="sz" >
                            Set
                        </Button>
                    </div>

                </div> */}
            </div>

        </div>
    )
}

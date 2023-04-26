import Web3 from 'web3';
import Tx from './Tx';
import useMeta from '../MetamaskLogin/useMeta';
import StripePayment from './StripePayment';

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import RazorPay from './RazorPay';
import GoldPriceChart from './GoldPriceChart';

export default function EGOLD({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { EGOLDContract, accounts } } = useMeta();
    const [totalSupply, setTotalSupply] = useState("");
    const [availableSupply, setAvailableSupply] = useState("");
    const [INRperEGOLD, setINRperEGOLD] = useState("");
    const [USDperEGOLD, setUSDperEGOLD] = useState("");
    const [myBalance, setMyBalance] = useState("");

    const [buy, setBuy] = useState("0");
    const [_Tx, set_Tx] = useState(false);
    const [success, setSuccess] = useState(false);
    const [RID, setRID] = useState("");

    const [funcName, setFuncName] = useState(null);

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                await EGOLDContract.methods.totalSupply().call({ from: accounts[0] })
                    .then(e => {
                        //console.log(e);
                        setTotalSupply(Web3.utils.fromWei(e, "ether"));
                    })
                    .catch(err => console.log(err));

                getDataHandler();
            })
        } else {
            setTotalSupply(null);
            setAvailableSupply(null);
            setUSDperEGOLD(null);
            setINRperEGOLD(null);
            setMyBalance(null);
        }
    }, [accounts])

    const getDataHandler = async () => {
        await EGOLDContract.methods.availableSupply().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setAvailableSupply(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));

        await EGOLDContract.methods.EGoldPriceINR().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setINRperEGOLD(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));

        await EGOLDContract.methods.EGoldPriceUSD().call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setUSDperEGOLD(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));

        await EGOLDContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setMyBalance(Web3.utils.fromWei(e, "ether"));
            })
            .catch(err => console.log(err));
    }

    const setBuyHandler = (e) => {
        const regex = /^[0-9]*$/; // regular expression to allow only whole numbers
        if (regex.test(e.target.value)) {
            setBuy(e.target.value);
        }
    }

    const __EINR = async () => {
        setBackdrop(true);
        await EGOLDContract.methods.buyEGoldEINR(Web3.utils.toWei(buy, "ether"))
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
                setReceipt(e)
                setTx(true);
            })
            .catch(async (err) => {
                setBackdrop(false);
                console.log(err)
            });
        getDataHandler();
        setBuy("0");
        setFuncName("");
    }

    const __EUSD = async () => {
        setBackdrop(true);
        await EGOLDContract.methods.buyEGoldEUSD(Web3.utils.toWei(buy, "ether"))
            .send({
                from: accounts[0]
            })
            .then(e => {
                //console.log(e);
                setReceipt(e)
                setTx(true);
            })
            .catch(async (err) => {
                setBackdrop(false);
                console.log(err)
            });
        getDataHandler();
        setBuy("0");
        setFuncName("");
    }

    useEffect(() => {
        if (success) {
            setBackdrop(true);
            setTx(true);
            setBuy("0");
            setTimeout(async () => {
                getDataHandler();
                setSuccess(false);
            }, 6000)
            // setTimeout(async () => {
            //     funcName.includes("INR") ?
            //         await EGOLDContract.methods.buyEGoldINR(Web3.utils.toWei(buy, "ether"), RID)
            //             .send({
            //                 from: accounts[0]
            //             })
            //             .then(e => {
            //                 //console.log(e);
            //                 setReceipt(e)
            //                 setRID("");
            //                 setTx(true);
            //             })
            //             .catch(async (err) => {
            //                 setBackdrop(false);
            //                 console.log(err)
            //                 console.log("INR")
            //             })

            //         :

            //         await EGOLDContract.methods.buyEGoldUSD(Web3.utils.toWei(buy, "ether"), RID)
            //             .send({
            //                 from: accounts[0]
            //             })
            //             .then(e => {
            //                 //console.log(e);
            //                 setReceipt(e)
            //                 setRID("");
            //                 setTx(true);
            //             })
            //             .catch(async (err) => {
            //                 setBackdrop(false);
            //                 console.log(err)
            //                 console.log("USD")
            //             })

            //     getDataHandler();
            //     setBuy("0");
            //     setSuccess(false);
            //     setFuncName("");
            // })
        }
    }, [success])

    const __cash = () => {
        set_Tx(true);
    }
    const buyGOLD = (e) => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (availableSupply < buy) {
            alert("Insufficient EGOLD supply.");
            return;
        }
        if (buy === "0") {
            alert("Enter valid quantity of EGOLD.");
            return;
        }

        switch (e) {
            case "EINR":
                __EINR();
                break;

            case "INR":
                __cash();
                break;

            case "EUSD":
                __EUSD();
                break;

            case "USD":
                __cash();
                break;

            default:
                alert("Please select Payment Method.")
        }
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <div>
                <h1>Data</h1>
                <Table striped bordered hover >
                    <tbody>
                        <tr>
                            <th>1</th>
                            <th>Total Supply</th>
                            <td>{totalSupply ? `${totalSupply} EGOLD` : '--'}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>2</th>
                            <th>Available Supply</th>
                            <td>{availableSupply ? `${availableSupply} EGOLD` : '--'}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>3</th>
                            <th>INR or EINR Per EGOLD </th>
                            <td>{INRperEGOLD ? `${INRperEGOLD} INR or EINR` : '--'}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>4</th>
                            <th>USD or EUSD Per EGOLD </th>
                            <td>{USDperEGOLD ? `${USDperEGOLD} USD or EUSD` : '--'}</td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>5</th>
                            <th>My Balance</th>
                            <td>{myBalance ? `${myBalance} EGOLD` : '--'}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                padding: "1rem",
                // display: "flex",
                // width: "fit",
                gap: "10px"
            }}>
                <div>
                    <div>
                        <h4>Buy EGOLD</h4>
                    </div>
                    <div style={{
                        padding: "0.5rem",
                        display: "flex",
                        justifyContent: "center",
                        gap: "75px",
                    }}>
                        {funcName && <label><h5>{`Total Cost : ${funcName.includes("INR") ? INRperEGOLD * buy : USDperEGOLD * buy} ${funcName}`} </h5></label>}
                    </div>
                    <div style={{
                        padding: "0.5rem",
                        display: "flex",
                        gap: "60px"
                    }}>
                        <label><h5>Enter EGold Qty.</h5></label>
                        <input onChange={setBuyHandler} value={buy} type='number' min={1} placeholder='EGOLD Qty.' />
                    </div>
                    <div style={{
                        padding: "0.5rem",
                        display: "flex",
                        gap: "25px"
                    }}>
                        <label><h5>Payment Method :</h5></label>
                        <Form>
                            <div key='inline-radio' className="mb-3">
                                <Form.Check
                                    inline
                                    label={<strong>EINR</strong>}
                                    name="BuyEGOLD"
                                    type='radio'
                                    id='1'
                                    onChange={() => { setFuncName('EINR') }}
                                />
                                <Form.Check
                                    inline
                                    label={<strong>INR</strong>}
                                    name="BuyEGOLD"
                                    type='radio'
                                    id='2'
                                    onChange={() => { setFuncName('INR') }}
                                />
                                <Form.Check
                                    inline
                                    label={<strong>EUSD</strong>}
                                    name="BuyEGOLD"
                                    type='radio'
                                    id='3'
                                    onChange={() => { setFuncName('EUSD') }}
                                />
                                <Form.Check
                                    inline
                                    label={<strong>USD</strong>}
                                    name="BuyEGOLD"
                                    type='radio'
                                    id='4'
                                    onChange={() => { setFuncName('USD') }}
                                />
                            </div>
                        </Form>
                    </div>
                    <div className="d-grid gap-2">
                        <Button variant="primary" size="sz" onClick={() => { buyGOLD(funcName) }}>
                            Buy
                        </Button>
                    </div>
                </div>
                <div style={{width: "60%"}}>
                <GoldPriceChart />

                </div>
            </div>

            {funcName && funcName.includes("INR") ?
                (_Tx && <RazorPay
                    _Tx={_Tx}
                    set_Tx={set_Tx}
                    setReceipt={setReceipt}
                    success={success}
                    setSuccess={setSuccess}
                    setRID={setRID}
                    totalPrice={(INRperEGOLD * buy)}
                    account={accounts[0]}
                    from={`${funcName}`}
                    to={`EGOLD`}
                />)
                :
                (_Tx && <StripePayment
                    set_Tx={set_Tx}
                    setReceipt={setReceipt}
                    success={success}
                    setSuccess={setSuccess}
                    setRID={setRID}
                    totalPrice={(USDperEGOLD * buy)}
                    account={accounts[0]}
                    from={`${funcName}`}
                    to={`EGOLD`}
                />)
            }
        </div>
    )
}

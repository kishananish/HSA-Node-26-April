import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Table from 'react-bootstrap/Table';
import Tx from './Tx';
import Button from 'react-bootstrap/Button';
import useMeta from '../MetamaskLogin/useMeta';
import StripePayment from './StripePayment';
// require('dotenv').config()

export default function EUSD({ backdrop, setBackdrop, tx, setTx, receipt, setReceipt }) {
    const { state: { EUSDContract, EUSDAddress, accounts, web3 } } = useMeta();


    const [myBalance, setMyBalance] = useState("");

    const [mint, setMint] = useState("0");

    const [_Tx, set_Tx] = useState(false);
    const [success, setSuccess] = useState(false);
    const [RID, setRID] = useState("");

    useEffect(() => {
        if (accounts) {
            setTimeout(async () => {
                getDataHandler();
            }, 100)
        } else {
            setMyBalance(null);
        }
    }, [accounts])
    
    useEffect(() => {
        if (success) {
            setBackdrop(true);
            setTx(true);
            setMint("0");
            setTimeout(async () => {
                getDataHandler();
                setSuccess(false);
            }, 6000)
        }
    }, [success])
    const getDataHandler = async () => {
        await EUSDContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] })
            .then(e => {
                //console.log(e);
                setMyBalance(Web3.utils.fromWei(e, "ether"));
                // setMyBalance(e);
            })
            .catch(err => console.log(err));
    }

    const setMintHandler = (e) => {
        const regex = /^[0-9]*$/; // regular expression to allow only whole numbers
        if (regex.test(e.target.value)) {
            setMint(e.target.value);
        }
    }

    const mintEUSD = async () => {
        if (!accounts) {
            alert("Please Connect Wallet.");
            return;
        }
        if (mint === "0") {
            alert("Mint amount should be greater than 0");
            return;
        }
        set_Tx(true);
    }

    return (
        <div>
            {backdrop && <Tx backdrop={backdrop} setBackdrop={setBackdrop} tx={tx} setTx={setTx} receipt={receipt} setReceipt={setReceipt} />}
            <h1>Data</h1>
            <Table striped bordered hover >
                <tbody>
                    <tr>
                        <th>1</th>
                        <th>My Balance</th>
                        <td>{myBalance ? `${myBalance} EUSD` : '--'}</td>
                    </tr>
                </tbody>
            </Table>
            <div style={{
                padding: "1rem",
                display: "flex",
                gap: "7px"
            }}>
                <label><h5>EUSD</h5></label>
                <input onChange={setMintHandler} value={mint} type='number' min={1} placeholder='Enter EUSD Amount' />
                <Button onClick={mintEUSD} variant="primary" size="sz" >
                    Mint
                </Button>
            </div>

            {_Tx && <StripePayment
                _Tx={_Tx}
                set_Tx={set_Tx}
                setReceipt={setReceipt}
                success={success}
                setSuccess={setSuccess}
                setRID={setRID}
                totalPrice={mint}
                account={accounts[0]}
                from='USD'
                to='EUSD'
            />}
        </div>
    )
}

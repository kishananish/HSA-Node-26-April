import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import axios from "axios"
import React, { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import classes from './Tx.module.css';

export default function PaymentForm({ _Tx, set_Tx, setReceipt, success, setSuccess, setRID, totalPrice, account, from, to, shippingBool, setShippingBool, shipping, setShipping }) {
    const stripe = useStripe()
    const elements = useElements()
    const [payBackdrop, setPayBackdrop] = useState(false);

    let cardElement;
    useEffect(() => {
        if (elements) {
            cardElement = elements.getElement(CardElement);
        }
    }, [elements])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setPayBackdrop(true);

        try {
            // console.log(account, " address", totalPrice, " amount", from, " from", to, " to", shipping, " shipping")

            const response = await axios.post(`${process.env.REACT_APP_SERVER}/payments/stripe`, {
                address: account,
                amount: totalPrice,
                from: from,
                to: to,
                shipping: shipping
            })
            // console.log(shipping)
            // console.log(response, "response")

            let payload;
            if (response.data.success) {
                payload = await stripe.confirmCardPayment(response.data.secret, {
                    payment_method: {
                        card: cardElement,
                    },
                });
                if (payload.error) {
                    // console.log(payload.error)
                    class PayloadError extends Error {
                        constructor(message, data) {
                            super(message);
                            this.name = "CustomError";
                            this.data = data;
                        }
                        getCustomData() {
                            return this.data;
                        }
                    }
                    throw new PayloadError("Payload Error.", { error: `${payload.error.message}` });
                }
            }

            // console.log(payload, "payload")


            if (payload.paymentIntent.status == "succeeded") {
                // console.log(payload.paymentIntent.id, "payload pi")
                const response = await axios.post(`${process.env.REACT_APP_SERVER}/crypto/${to}`, {
                    transactionId: payload.paymentIntent.id,
                    address: account,
                    amount: payload.paymentIntent.amount / 100,
                    from: from
                })
                // console.log(response)

                if (response.data.status) {
                    setReceipt(response.data.receipt);
                    setSuccess(true);
                }
            }

        } catch (error) {
            console.log("Error", error)
            alert(`Transaction Failed. ${error.data.error}`)
            setPayBackdrop(false);
        }

        setTimeout(() => {
            set_Tx(false);
        }, 3000)
    }

    return (
        <>
            {
                !success ?
                    <>
                        {payBackdrop && <div style={{
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100vh",
                            zIndex: "110",
                            background: "rgba(0, 0, 0, 0.75)",
                        }} />}

                        <Card className={classes.modal}>
                            <Card.Header><strong>Payment Details</strong></Card.Header>
                            <Card.Body >

                                <Card.Title>Card Details</Card.Title>
                                <CardElement />

                                <Button style={{ margin: '0.5rem' }} variant="primary" onClick={handleSubmit}>Pay</Button>
                                <Button style={{ margin: '0.5em' }} variant="primary"
                                    onClick={() => {
                                        set_Tx(false);
                                        setShippingBool(false);
                                        setShipping({
                                            name: "",
                                            address: {
                                                line1: "",
                                                postal_code: "",
                                                city: "",
                                                country: "",
                                            }
                                        });
                                    }}>Close</Button>
                            </Card.Body>
                        </Card >
                        {/* } */}
                    </>
                    :
                    <Card className={classes.modal}>
                        <Card.Header><strong>Payment Successful</strong></Card.Header>
                        <Card.Body >
                            <Card.Title><strong>Thank You!!!</strong></Card.Title>
                            {/* <Card.Text>Complete Your Metamask Transaction....</Card.Text> */}
                            <Card.Text>Your Transaction Initiated....</Card.Text>
                        </Card.Body>
                    </Card >
            }
        </>
    )
}
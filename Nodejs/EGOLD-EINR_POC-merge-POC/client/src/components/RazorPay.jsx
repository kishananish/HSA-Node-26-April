import React, { useEffect, useState } from 'react'
import classes from './Tx.module.css';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios"

export default function RazorPay({ set_Tx, setReceipt, success, setSuccess, setRID, totalPrice, account, from, to }) {
    const [payBackdrop, setPayBackdrop] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        email: "",
        contact: ""
    });

    const handleShippingChange = (event) => {
        const { name, value } = event.target;
        const keys = name.split('.');
        if (keys.length === 1) {
            setShippingDetails((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        } else if (keys.length === 2) {
            setShippingDetails((prevFormData) => ({
                ...prevFormData,
                [keys[0]]: {
                    ...prevFormData[keys[0]],
                    [keys[1]]: value,
                },
            }));
        }
    };

    const handleSubmit = async (e) => {
        setPayBackdrop(true);
        try {

            let response = await axios.post(`${process.env.REACT_APP_SERVER}/payments/razorPay`, {
                address: account,
                amount: totalPrice,
                from: from,
                to: to,
                shipping: shippingDetails
            });
            // console.log(response, "response")
            const { data } = response;
            const options = {
                key: 'rzp_test_mUTZOW7Dv34UnQ',
                amount: data.order.amount,
                currency: from,
                name: 'EGOLD-Platform',
                description: `${from}-${to} {${account}}`,
                order_id: data.order.id,
                handler: async function (response) {
                    // console.log(response);
                    response = await axios.post(`${process.env.REACT_APP_SERVER}/crypto/${to}`, {
                        transactionId: response.razorpay_payment_id,
                        address: account,
                        from: from,
                    })
                    if (response.data.status) {
                        setReceipt(response.data.receipt);
                        setSuccess(true);
                        // setPayBackdrop(false);
                    }
                },
                prefill: {
                    name: shippingDetails.name,
                    email: shippingDetails.email,
                    contact: shippingDetails.contact
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
            // console.log(rzp1)

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
        <div>
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
                <Card.Header><strong>Billing Details</strong></Card.Header>
                <Card.Body >
                    <Form >
                        <Form.Group controlId="name">
                            <Form.Label><strong>Full Name</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={shippingDetails.name}
                                onChange={handleShippingChange}
                            /></Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label><strong>Email</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                value={shippingDetails.Email}
                                onChange={handleShippingChange}
                            /></Form.Group>
                        <Form.Group controlId="contact">
                            <Form.Label><strong>Contact Detail</strong></Form.Label>
                            <Form.Control
                                type="text"
                                name="contact"
                                value={shippingDetails.contact}
                                onChange={handleShippingChange}
                            /></Form.Group>
                        <Button style={{ margin: '0.5rem' }} variant="primary" onClick={() => {handleSubmit()}}>Next</Button>
                        <Button style={{ margin: '0.5em' }} variant="primary" onClick={() => { set_Tx(false); }}>Close</Button>
                    </Form>

                </Card.Body>
            </Card>

        </div>
    )
}

import React, { useEffect, useState } from 'react'

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentForm from "./PaymentForm"
import classes from './Tx.module.css';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const PUBLIC_KEY = "pk_test_51MPOvKSH9teV89VTVMCvOqd85C91CTFEZQCsFTMTJP1vcM2PqckaIVhFklz7ZJaGN7YWLnpc4SnjxVWDCkC4UUBt00liMm5opF"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

export default function StripePayment({ set_Tx, setReceipt, success, setSuccess, setRID, totalPrice, account, from, to }) {
    const [shippingBool, setShippingBool] = useState(false);
    const [shippingDetails, setShippingDetails] = useState({
        name: "",
        address: {
            line1: "",
            postal_code: "",
            city: "",
            country: "",
        }
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

    return (
        <>
            < div className={classes.backdrop} />
            {!shippingBool ?
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
                            <Form.Group controlId="address.line1">
                                <Form.Label><strong>Address Line1</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address.line1"
                                    value={shippingDetails.address.line1}
                                    onChange={handleShippingChange}
                                /></Form.Group>
                            <Form.Group controlId="address.city">
                                <Form.Label><strong>City</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address.city"
                                    value={shippingDetails.address.city}
                                    onChange={handleShippingChange}
                                /></Form.Group>
                            <Form.Group controlId="address.postal_code">
                                <Form.Label><strong>Postal Code</strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address.postal_code"
                                    value={shippingDetails.address.postal_code}
                                    onChange={handleShippingChange}
                                /></Form.Group>
                            <Form.Group controlId="address.country">
                                <Form.Label><strong>Country</strong></Form.Label>
                                <Form.Select
                                    type="text"
                                    name="address.country"
                                    value={shippingDetails.address.country}
                                    onChange={handleShippingChange}
                                > <option value="">Select Country</option>
                                    <option value="US">United States</option>
                                </Form.Select></Form.Group>
                            <Button style={{ margin: '0.5rem' }} variant="primary" onClick={() => setShippingBool(true)}>Next</Button>
                            <Button style={{ margin: '0.5em' }} variant="primary" onClick={() => { set_Tx(false); }}>Close</Button>
                        </Form>

                    </Card.Body>
                </Card>
                :
                < Elements stripe={stripeTestPromise} >
                    <PaymentForm
                        set_Tx={set_Tx}
                        setReceipt={setReceipt}
                        success={success}
                        setRID={setRID}
                        setSuccess={setSuccess}
                        totalPrice={totalPrice}
                        account={account}
                        from={from}
                        to={to}
                        shippingBool={shippingBool}
                        setShippingBool={setShippingBool}
                        shipping={shippingDetails}
                        setShipping={setShippingDetails}
                    /></Elements >}
        </>
    )
}

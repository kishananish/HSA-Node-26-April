import React, { useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RegistrationSchema } from "./Schema";
import { yupResolver } from "@hookform/resolvers/yup";

const Registration = () => {
  const navigate = useNavigate();
  const checkEmail = JSON.parse(localStorage.getItem("userDetail"));
  const [proImg, setProImg] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(RegistrationSchema),
  });

  const onSubmit = (data) => {
    const userDetails = { ...data, proImg };
    if (checkEmail?.email === data.email) {
      alert("Email allready exist");
    } else {
      localStorage.setItem("userDetail", JSON.stringify(userDetails));
      alert("Registered successfully");
      navigate("/login");
    }
  };
  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      const file = URL.createObjectURL(e.target.files[0]);
      setProImg(file);
    }
  };
  console.log(proImg, "e.target.files");
  return (
    <div>
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={6} lg={6} xs={6}>
            <div className="border border-2 border-primary"></div>
            <Card className="shadow px-4">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <h2 className="fw-bold mb-2 text-center text-uppercase ">
                    Kanban
                  </h2>
                  <div className="mb-3">
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                      <Form.Group className="mb-3" controlId="Name">
                        <Form.Label className="text-center">Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Name"
                          {...register("name")}
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-center">
                          Username
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Username"
                          {...register("username")}
                          isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Email address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          {...register("email")}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="text-center">
                          Contact Number
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter number"
                          {...register("number")}
                        />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          {...register("password")}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      ></Form.Group>
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Profile Image</Form.Label>
                        {proImg && (
                          <img
                            className="preview"
                            src={proImg}
                            alt=""
                            width="40px"
                            height="30px"
                          />
                        )}
                        <Form.Control
                          type="file"
                          name="myImage"
                          accept="image/*"
                          onChange={handleImage}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3"></Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Register
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Already have an account??{" "}
                        <Link
                          to={{ pathname: "/login" }}
                          className="text-primary fw-bold"
                        >
                          Login
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Registration;

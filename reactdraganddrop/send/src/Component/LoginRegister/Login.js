import React, { useEffect, useState } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/Auth";
import { authGoogle, provider } from "../../AuthContext/Config";
import { signInWithPopup } from "firebase/auth";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "./Schema";

const Login = () => {
  let navigate = useNavigate();
  const [googleValue, setGoogleValue] = useState("");
  const userAuth = useAuth();

  const checkUser = JSON.parse(localStorage.getItem("userDetail"));

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = (data) => {
    if (
      (checkUser?.email === data.email || checkUser?.username === data.email) &&
      checkUser?.password === data.password &&
      validateCaptcha(data.captcha) === true
    ) {
      alert("Logged in successfully");
      userAuth.login(true);
      reset();
      navigate("/dashboard");
    } else {
      HandleError(
        checkUser === null
          ? { email: ["Email or username does not exist."] }
          : checkUser?.email !== data.email && checkUser?.username !== data.email
            ? { email: ["Email or username is incorrect."] }
            : checkUser?.password !== data.password
              ? { password: ["Inccorect password."] }
              : validateCaptcha(data.captcha) === false && {
                captcha: ["Inccorect captcha"],
              }
      );
    }
  };
  const HandleError = (err) => {
    Object.keys(err).forEach((key) => {
      setError(key, { type: "manual", message: err[key][0] });
    });
  };

  const loginWithGoogle = () => {
    signInWithPopup(authGoogle, provider).then((data) => {
      setGoogleValue(data.user.email);
      let googleUser = {
        email: data.user.email,
        name: data.user.displayName,
      };
      localStorage.setItem("googleUser", JSON.stringify(googleUser));
      userAuth.login(true);
      navigate("/dashboard");
    });
  };

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
                    Login
                  </h2>
                  <div className="mb-3">
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Email/Username
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="enter email or username"
                          {...register("email")}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email?.message}
                        </Form.Control.Feedback>
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

                      <div className="col mt-3">
                        <LoadCanvasTemplate />
                      </div>
                      <div className="col mt-3">
                        <Form.Control
                          placeholder="enter captcha"
                          id="user_captcha_input"
                          name="user_captcha_input"
                          type="text"
                          {...register("captcha")}
                          isInvalid={!!errors.captcha}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.captcha?.message}
                        </Form.Control.Feedback>
                      </div>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      ></Form.Group>
                      <div className="d-grid" style={{ paddingBottom: "10px" }}>
                        <Button variant="primary" type="submit">
                          Login
                        </Button>
                      </div>

                      <div className="d-grid">
                        <Button onClick={loginWithGoogle}>Google Login</Button>
                      </div>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        Don't have an account??{" "}
                        <Link
                          to={{ pathname: "/" }}
                          className="text-primary fw-bold"
                        >
                          Registers
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
export default Login;

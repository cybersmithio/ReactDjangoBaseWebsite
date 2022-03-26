import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  checkPasswordComplexity,
  checkEmailAddressFormat,
} from "../../utilities";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { REGISTRATION_ENDPOINT } from "../../constants/urls";

function RegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [passwordGood, setPasswordGood] = useState(false);
  const [passwordTyped, setPasswordTyped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (password || confirmPassword) {
      setPasswordTyped(true);
    }
    if (checkPasswordComplexity(password, confirmPassword).length === 0) {
      setPasswordGood(true);
    } else {
      setPasswordGood(false);
    }
    if (name && email && passwordGood) {
      if (checkEmailAddressFormat(email)) {
        setSubmitButtonEnabled(true);
      } else {
        setSubmitButtonEnabled(false);
      }
    } else {
      setSubmitButtonEnabled(false);
    }

    if (loading) {
      const req_config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      axios
        .post(
          REGISTRATION_ENDPOINT,
          {
            email: email,
            password: password,
            name: name,
          },
          req_config
        )
        .then((response) => {
          setResults(true);
          setLoading(false);
          setSuccess(true);
        })
        .catch((error) => {
          setResults(true);
          setLoading(false);
          setSuccess(false);
        });
    }
  }, [
    loading,
    results,
    success,
    name,
    email,
    password,
    confirmPassword,
    passwordGood,
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(false);
    setSuccess(false);
  };

  if (loading) {
    return <div>Loading</div>;
  } else {
    if (results) {
      if (success) {
        return (
          <div>
            <h1>Verify Email</h1>
            <p>A verification email has been sent to {email}</p>
            <p>Please click on the link in the email to verify your account.</p>
          </div>
        );
      } else {
        return <div>Unable to complete registration</div>;
      }
    } else {
      return (
        <Container>
          <Row>
            <Col>
              <h1>Register</h1>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="name"
                    placeholder="Enter Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Enter Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                {passwordTyped ? (
                  passwordGood ? (
                    <div>Password complexity is good</div>
                  ) : (
                    <Alert
                      variant="danger"
                      style={{ backgroundColor: "yellow" }}
                    >
                      {checkPasswordComplexity(password, confirmPassword).map(
                        (e) => {
                          if (e) {
                            return <li key={e}>{e}</li>;
                          }
                        }
                      )}
                    </Alert>
                  )
                ) : (
                  <div></div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={!submitButtonEnabled}
                >
                  Register
                </Button>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Link to="login">Sign In</Link> if you have an account already!
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default RegistrationPage;

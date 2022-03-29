import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { FORGOT_PASSWORD_ENDPOINT } from "../../constants/urls";

function ForgotPasswordPage() {
  const [formEmail, setFormEmail] = useState();
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (formEmail) {
      setSubmitButtonEnabled(true);
    } else {
      setSubmitButtonEnabled(false);
    }
  }, [formEmail]);

  useEffect(() => {
    if (loading) {
      const req_config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      axios
        .post(
          FORGOT_PASSWORD_ENDPOINT,
          {
            email: formEmail,
          },
          req_config
        )
        .then((response) => {
          setError(false);
          setLoading(false);
          setResetSuccess(true);
        })
        .catch((error) => {
          setError(true);
          setLoading(false);
        });
    }
  }, [formEmail, loading, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setResetSuccess(false);
  };

  if (resetSuccess) {
    return (
      <Container>
        <Row>
          <Col>
            <p>
              If your email is found, we will send you a link to reset your
              password.
            </p>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Forgot Password?</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  defaultValue={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                disabled={!submitButtonEnabled}
              >
                Reset Password
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to="/login">Login</Link> if you have an account already!
          </Col>
          <Col>
            Are you a new member? <Link to="/register/">Register</Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ForgotPasswordPage;

import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { RESET_PASSWORD_ENDPOINT } from "../../constants/urls";
import axios from "axios";
import { Link } from "react-router-dom";

function ResetPasswordPage({ match }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  var resetSecret = "";
  try {
    resetSecret = match.params.resetSecret;
  } catch {
    resetSecret = "";
  }

  useEffect(() => {
    if (password === confirmPassword && password) {
      setSubmitButtonEnabled(true);
    } else {
      setSubmitButtonEnabled(false);
    }
  }, [password, confirmPassword]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setResetSuccess(false);
  };

  useEffect(() => {
    if (loading) {
      const req_config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      axios
        .post(
          RESET_PASSWORD_ENDPOINT,
          {
            password: password,
            reset_secret: resetSecret,
          },
          req_config
        )
        .then((response) => {
          setLoading(false);
          setResetSuccess(true);
        })
        .catch((error) => {
          setLoading(false);
          setResetSuccess(false);
        });
    }
  }, [loading, password]);

  if (resetSuccess) {
    return (
      <Container>
        <Row>
          <Col>
            <p>Your password has been reset</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to="/login">Log in</Link> if you have an account already!
          </Col>
        </Row>
      </Container>
    );
  } else {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Reset Password</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
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
      </Container>
    );
  }
}

export default ResetPasswordPage;

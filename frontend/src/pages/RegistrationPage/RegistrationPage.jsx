import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkPasswordComplexity } from "../../utilities";
import Alert from "react-bootstrap/Alert";

function RegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [passwordGood, setPasswordGood] = useState(false);
  const [passwordTyped, setPasswordTyped] = useState(false);

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
      setSubmitButtonEnabled(true);
    } else {
      setSubmitButtonEnabled(false);
    }
  }, [name, email, password, confirmPassword, passwordGood]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Register</h1>
          <Form>
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
                <Alert variant="danger" style={{ backgroundColor: "yellow" }}>
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

export default RegistrationPage;

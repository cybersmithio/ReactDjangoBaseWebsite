import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useUserDetails } from "../../context/UserContext";
import axios from "axios";
import { LOGIN_ENDPOINT } from "../../constants/urls";
import Alert from "react-bootstrap/Alert";

function LoginPage({ history }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitButtonEnabled, setSubmitButtonEnabled] = useState(false);
  const [userDetails, updateUserDetails] = useUserDetails();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (password && email) {
      setSubmitButtonEnabled(true);
    } else {
      setSubmitButtonEnabled(false);
    }
  }, [email, password, submitButtonEnabled]);

  useEffect(() => {
    if (loading) {
      const req_config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      axios
        .post(
          LOGIN_ENDPOINT,
          {
            email: email,
            password: password,
          },
          req_config
        )
        .then((response) => {
          updateUserDetails(response.data.access, response.data.refresh);
          setLoading(false);
          setError(false);
          history.push("/");
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
        });
    }
  }, [loading, email, password, updateUserDetails]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <h1>Log In</h1>
          {error ? (
            <Alert variant="danger" style={{ backgroundColor: "red" }}>
              Error Logging In
            </Alert>
          ) : (
            <div />
          )}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              disabled={!submitButtonEnabled}
            >
              Log In
            </Button>
          </Form>
          <Row className="py-3">
            <Col>
              Are you a new member? <Link to="/register/">Register</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;

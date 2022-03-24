import React from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

function LoginPage() {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <h1>Sign In</h1>
          <Form>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary">
              Sign In
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

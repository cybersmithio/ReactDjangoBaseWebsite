import React from "react";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function RegistrationPage() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Register</h1>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="name" placeholder="Enter Full Name" />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter Email" />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Enter Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm password" />
            </Form.Group>
            <Button type="submit" variant="primary" disabled="True">
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

import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useUserDetails } from "../../context/UserContext";

function ProfilePage({ history }) {
  const [userDetails] = useUserDetails();
  if (!userDetails.accessToken) {
    history.push("/login");
  }

  const [formName, setFormName] = useState(userDetails.name);

  return (
    <Container>
      <Row>
        <Col>
          <h1>User Profile</h1>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Full Name"
                defaultValue={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Update Password</Form.Label>
              <Form.Control type="password" placeholder="Update password" />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm password" />
            </Form.Group>
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;

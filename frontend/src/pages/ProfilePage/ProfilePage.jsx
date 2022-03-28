import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useUserDetails } from "../../context/UserContext";
import { PROFILE_UPDATE_ENDPOINT } from "../../constants/urls";
import axios from "axios";
import Alert from "react-bootstrap/Alert";

function ProfilePage({ history }) {
  const [userDetails, updateUserDetails] = useUserDetails();
  if (!userDetails.accessToken) {
    history.push("/login");
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [formName, setFormName] = useState(userDetails.name);

  useEffect(() => {
    if (loading) {
      const req_config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userDetails.accessToken}`,
        },
      };
      axios
        .put(
          PROFILE_UPDATE_ENDPOINT,
          {
            name: formName,
          },
          req_config
        )
        .then((response) => {
          updateUserDetails(response.data["access"], response.data["refresh"]);
          localStorage.setItem(
            "userDetails",
            JSON.stringify({
              access: response.data["access"],
              refresh: response.data["refresh"],
            })
          );
          setLoading(false);
          setError(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
        });
    }
  }, [loading]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>User Profile</h1>
          {error ? (
            <Alert variant="danger" style={{ backgroundColor: "red" }}>
              Unable to update profile. Try again later.
            </Alert>
          ) : (
            <div />
          )}

          <Form onSubmit={submitHandler}>
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

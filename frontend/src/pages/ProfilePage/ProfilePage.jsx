import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useUserDetails } from "../../context/UserContext";
import { PROFILE_UPDATE_ENDPOINT } from "../../constants/urls";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { checkPasswordComplexity } from "../../utilities";

function ProfilePage({ history }) {
  const [userDetails, updateUserDetails] = useUserDetails();
  if (!userDetails.accessToken) {
    history.push("/login");
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [passwordGood, setPasswordGood] = useState(false);
  const [passwordTyped, setPasswordTyped] = useState(false);

  const [formName, setFormName] = useState(userDetails.name);
  const [formPassword, setFormPassword] = useState("");
  const [formConfirmPassword, setFormConfirmPassword] = useState("");

  useEffect(() => {
    if (formPassword || formConfirmPassword) {
      setPasswordTyped(true);
    }

    if (passwordTyped) {
      if (
        checkPasswordComplexity(formPassword, formConfirmPassword).length === 0
      ) {
        setPasswordGood(true);
      } else {
        setPasswordGood(false);
      }
    } else {
      setPasswordGood(true);
    }
  }, [formPassword, formConfirmPassword]);

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
            password: formPassword,
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

  if (loading) {
    return <div>Loading</div>;
  } else {
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
                <Form.Control
                  type="password"
                  placeholder="Update password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={formConfirmPassword}
                  onChange={(e) => setFormConfirmPassword(e.target.value)}
                />
              </Form.Group>

              {passwordTyped ? (
                passwordGood ? (
                  <div>Password complexity is good</div>
                ) : (
                  <Alert variant="danger" style={{ backgroundColor: "yellow" }}>
                    {checkPasswordComplexity(
                      formPassword,
                      formConfirmPassword
                    ).map((e) => {
                      if (e) {
                        return <li key={e}>{e}</li>;
                      }
                    })}
                  </Alert>
                )
              ) : (
                <div />
              )}

              <Button type="submit" variant="primary" disabled={!passwordGood}>
                Update
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ProfilePage;

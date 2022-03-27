import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { VERIFY_EMAIL_ENDPOINT } from "../../constants/urls";

function VerificationPage({ match }) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (loading) {
      const req_config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      axios
        .post(
          VERIFY_EMAIL_ENDPOINT,
          {
            verification_secret: match.params.verifySecret,
          },
          req_config
        )
        .then((response) => {
          setLoading(false);
          setSuccess(true);
        })
        .catch((error) => {
          setLoading(false);
          setSuccess(false);
        });
    }
  }, [match.params.verifySecret, loading, success]);

  if (loading) {
    return <div>Loading</div>;
  } else {
    if (success) {
      return (
        <Container>
          <Row>
            <Col>
              <h1>Email verified</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              Thank you for verifying your email. You can now{" "}
              <Link to="/login">log in</Link>.
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container>
          <Row>
            <Col>
              <h1>Unable to verify email</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              The verification link did not work. Please
              <Link to="/register">register</Link> again or
              <Link to="/login">log in</Link>.
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default VerificationPage;

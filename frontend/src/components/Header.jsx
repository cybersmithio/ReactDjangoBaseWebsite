import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useUserDetails } from "../context/UserContext";

function Header() {
  const [userDetails] = useUserDetails();

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>React Django Base Web Site</Navbar.Brand>
          </LinkContainer>
          <Nav className="mr-auto">
            {userDetails.accessToken ? (
              <LinkContainer to="/profile">
                <Nav.Link>
                  <i className="fas fa-user"></i>
                  {userDetails.name}
                </Nav.Link>
              </LinkContainer>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>
                  <i className="fas fa-user"></i>Login
                </Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;

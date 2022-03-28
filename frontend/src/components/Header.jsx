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
          {userDetails.accessToken ? (
            <Nav className="mr-auto">
              <LinkContainer to="/profile">
                <Nav.Link>
                  <i className="fas fa-user"></i>
                  {userDetails.name}
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/logout">
                <Nav.Link>
                  <i className="fas fa-sign-out-alt"></i>Logout
                </Nav.Link>
              </LinkContainer>
            </Nav>
          ) : (
            <Nav className="mr-auto">
              <LinkContainer to="/login">
                <Nav.Link>
                  <i className="fas fa-user"></i>Login
                </Nav.Link>
              </LinkContainer>
            </Nav>
          )}
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;

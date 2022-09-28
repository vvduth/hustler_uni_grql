import React from "react";
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import pukedukelogo from "../assets/pukedukelogo.png";
import useAuthStore from "../store/authStore";
import axios from "axios";

export const URL = `http://localhost:5000`;
const Navigation = () => {
  const { userProfile, removeUser } = useAuthStore() as any;
  const logoutHandler = async (e: any) => {
    e.preventDefault();
    
    const headers = {
      "Content-Type": "application/json",
    }
    const data = {
      _id: userProfile._id
    }
    
    await axios.delete(`${URL}/logout`, {headers, data });
    removeUser();
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img
              src={pukedukelogo}
              alt="app logo"
              style={{ width: 80, height: 50 }}
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!userProfile ? (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            ) : (
              <LinkContainer to="/">
                <Nav.Link> Hello {userProfile.name}</Nav.Link>
              </LinkContainer>
            )}

            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>

            <NavDropdown
              title={
                <>
                  {/* <img src={user.picture} style={{ width: 30, height: 30, marginRight: 10, objectFit: "cover", borderRadius: "50%" }} />
                                        {user.name} */}
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>

              {userProfile ? (
                <NavDropdown.Item>
                  <Button variant="danger" onClick={logoutHandler}>
                    Logout
                  </Button>
                </NavDropdown.Item>
              ) : (
                <NavDropdown.Item>
                  <Button variant="green" onClick={logoutHandler}>
                    Login
                  </Button>
                </NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

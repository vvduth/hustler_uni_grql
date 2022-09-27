import React, { useContext, useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import useAuthStore from "../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const {userProfile , addUser} = useAuthStore()

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/login`,
        { email, password },
        config
      );
      console.log(response.data) ; 
      addUser(response.data) ; 
      navigate("/chat", { replace: true });
    } catch (e) {
      console.log("Can not login, ", e);
    }
  };
  return (
    <Container>
      <Row>
        <Col md={5} className="login__bg"></Col>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {/* {error && <p className="alert alert-danger">{error.data}</p>} */}
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {/* {isLoading ? <Spinner animation="grow" /> : "Login"} */}
              Login
            </Button>
            <div className="py-4">
              <p className="text-center">
                Don't have an account ? <Link to="/signup">Signup</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

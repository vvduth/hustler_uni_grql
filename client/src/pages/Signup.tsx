import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { BACKEND } from "../url";
import useAuthStore from "../store/authStore";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const {addUser} = useAuthStore() ; 
  
  const navigate = useNavigate();
  //image upload states
  

  const handleSignup = async (e:any) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.post(
        `${BACKEND}/api/users`,
        { email,name, password },
        config
      );
      console.log(response.data) ; 
      addUser(response.data) ; 
      navigate("/chat", { replace: true });
    } catch (e) {
      console.log("Can not register", e);
    }
  };
  return (
    <Container>
      <Row>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h1 className="text-center">Create account</h1>
            <div className="signup-profile-pic__container">
              <img
                src={"https://source.unsplash.com/1600x900/?logo"}
                alt="logo"
                className="signup-profile-pic"
              />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
             
            </div>
            {/* {error && <p className="alert alert-danger">{error.data}</p>} */}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
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
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {/* {upladingImg || isLoading ? "Signing you up..." : "Signup"} */}
              Sign up bro
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account ? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="signup__bg"></Col>
      </Row>
    </Container>
  );
};

export default Signup;

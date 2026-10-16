import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import { Button, Container, Form, FormGroup } from 'react-bootstrap';

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login, email, password } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    await login();
  }

  return (
    <Container style={{ width: '30%' }}>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e)} value={password} required />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form >
      <p>Not registered? <Button variant='outline-info' onClick={() => setIsLogin(false)}>Register</Button></p>
    </Container>
  );
}

export default Login;

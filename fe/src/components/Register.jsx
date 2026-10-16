import React, { useContext } from 'react'
import { GeneralContext } from '../context/GeneralContext';
import { Button, Container, Form } from 'react-bootstrap';

const Register = ({ setIsLogin }) => {

  const { setUsername, setEmail, setPassword, setType, register, username, password, email, type } = useContext(GeneralContext);


  const handleRegister = async (e) => {
    e.preventDefault();
    await register()
  }
  return (
    <Container style={{ width: '30%' }}>
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} value={username} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e)} value={password} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicType">
          <Form.Label>User type</Form.Label>
          <Form.Select onChange={(e) => setType(e.target.value)} value={type ? type : null} required>
            <option disabled>Select Type</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form >
      <p>Already registered? <Button variant='outline-info' onClick={() => setIsLogin(true)}>Login</Button></p>
    </Container >
  )
}
export default Register;
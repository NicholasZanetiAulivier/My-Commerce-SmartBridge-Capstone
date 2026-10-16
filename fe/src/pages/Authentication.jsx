import React, { useState } from 'react';
import '../styles/Authentication.css'
import Login from '../components/Login';
import Register from '../components/Register';
import { Container } from 'react-bootstrap';

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Container fluid className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: "100vh" }}>
      {isLogin ?

        <Login setIsLogin={setIsLogin} />

        :

        <Register setIsLogin={setIsLogin} />
      }

    </Container>
  )
}

export default Authentication
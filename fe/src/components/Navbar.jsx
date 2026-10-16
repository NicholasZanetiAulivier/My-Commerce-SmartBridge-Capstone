import React, { useContext, useState } from 'react'
import '../styles/Navbar.css'
import { useNavigate } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'
import { Badge, Button, Container, Form, Navbar } from 'react-bootstrap'

const NavigationBar = () => {


  const navigate = useNavigate();

  const type = localStorage.getItem('type');
  const username = localStorage.getItem('username');

  const { cartCount, logout } = useContext(GeneralContext);

  const [search, setSearch] = useState('');

  async function handleSearch(e) {

  }

  return (

    <Navbar expand="lg" className={'px-2' + (type === 'admin' ? ' bg-dark' : '')} >
      <Container fluid>
        <Navbar.Brand className='fw-bolder text-white' onClick={() => navigate('/')} style={{ cursor: 'pointer' }}> ShopEz-X {username ? ": " + username : null}</Navbar.Brand>
        <div>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            {type === 'admin' ?
              null :
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="mx-2"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="success" className='mx-2' onClick={handleSearch}>Search</Button>
              </Form>
            }
            {type ?
              (
                type === 'user' ?
                  <>
                    <Button variant='outline-light' className='mx-2' onClick={() => navigate('/cart')}>Cart {cartCount > 0 ? <Badge>{cartCount}</Badge> : null}</Button>
                    <Button variant='outline-light' className='mx-2' onClick={() => navigate('/profile')}>Profile</Button>
                  </> :
                  <Button variant='outline-light' className='mx-2' onClick={logout}>Logout</Button>
              ) :
              <Button variant='outline-light' className='mx-2' onClick={() => navigate('/auth')}>Login</Button>
            }
          </Navbar.Collapse>
        </div>
      </Container>
    </Navbar>
  )
}

export default NavigationBar
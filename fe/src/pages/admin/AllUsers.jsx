import React, { useEffect, useState } from 'react'
import '../../styles/AllUsers.css'
import { createTokenHeader, fetchApi } from '../../utils/fetchUtils';
import { Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import WestIcon from '@mui/icons-material/West';

const AllUsers = () => {

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const navigator = useNavigate();


  useEffect(() => {
    fetchUsers();
    fetchOrders();
  }, [])

  async function fetchUsers() {
    let body = await fetchApi('/user', 'GET', null, createTokenHeader()).then(res => {
      if (res.ok) return res.json();
      else throw new Error();
    }).catch(e => { throw e });
    setUsers(body.users);
  }

  async function fetchOrders() {
    let body = await fetchApi('/order/all', 'GET', null, createTokenHeader()).then(res => {
      if (res.ok) return res.json();
      else throw new Error();
    }).catch(e => { throw e });
    setOrders(body.data)
  }

  return (

    <Container className='pt-5'>
      <span><Button onClick={() => navigator(-1)}><WestIcon /></Button><h2 className='p-2'>All Users</h2></span>
      <Container fluid>
        {
          users.map(e => {
            return (
              <Card className='d-flex flex-row justify-content-around p-2'>
                <div>
                  <h5>User Id</h5>
                  <p>{e._id}</p>
                </div>
                <div>
                  <h5>User Name </h5>
                  <p>{e.username}</p>
                </div>
                <div>
                  <h5>Email Address </h5>
                  <p>{e.email}</p>
                </div>
                <div>
                  <h5>Orders </h5>
                  <p>{orders.filter(order => order.userId === e._id).length}</p>
                </div>
              </Card>
            )
          })
        }
      </Container>
    </Container>
  )
}

export default AllUsers
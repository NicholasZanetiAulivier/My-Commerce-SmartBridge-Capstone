import React, { useContext, useEffect, useState } from 'react'
import '../../styles/Profile.css'
import { GeneralContext } from '../../context/GeneralContext'
import axios from 'axios';
import { createTokenHeader, fetchApi } from '../../utils/fetchUtils';
import { Button, Card, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const navigate = useNavigate();
  const { logout } = useContext(GeneralContext);

  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [])
  async function fetchOrders() {
    const body = await fetchApi("/order", 'GET', null, createTokenHeader()).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res.text);
        navigate('/');
      }
    }).catch(e => navigate('/'));
    console.log(body);
    setOrders(body.data);
  }

  function showModal(order) {
    setCurrentOrder(order);
    setShow(true);
  }

  function handleClose() {
    setShow(false);
    setCurrentOrder(null);
  }
  async function handleCancel() {
    await fetchApi("/order/cancel/" + currentOrder.orderDetails.id, 'PATCH', null, createTokenHeader()).then(res => {
      if (res.ok)
        navigate(0);
      else console.log(res.text);
    }).catch(e => navigate('/'));
    setShow(false);
  }

  async function handleCompleted() {
    await fetchApi("/order/completed/" + currentOrder.orderDetails.id, 'PATCH', null, createTokenHeader()).then(res => {
      if (res.ok)
        navigate(0);
      else console.log(res.text);
    }).catch(e => navigate('/'));
    setShow(false);

  }
  return (
    <div className="profilePage">

      <div className="profileCard">

        <span>
          <h5>Username: </h5>
          <p>{username}</p>
        </span>
        <span>
          <h5>Email: </h5>
          <p>{email}</p>
        </span>
        <span>
          <h5>Orders: </h5>
          <p>{orders.length}</p>
        </span>
        <button className='btn btn-danger' onClick={logout}>Logout</button>

      </div>

      <Container>
        <table className='table table-striped align-content-center'>
          <thead>
            <tr>
              <th>Order date</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {
              orders.map(o => (
                <tr>
                  <th>{o.orderDate}</th>
                  <th>Rp. {o.products.reduce((a, b) => a + b.netPrice * (1 - b.discount), 0)}</th>
                  <th>{o.status}</th>
                  <th>{o.paymentMethod}</th>
                  <th><Button onClick={() => showModal(o)}>Details</Button></th>
                </tr>
              ))
            }
          </tbody>
        </table>
      </Container>

      <Modal show={show} onHide={handleClose} animation={false}>
        {
          currentOrder ? <>
            <Modal.Body>
              {currentOrder.products.map((p) => {
                return (
                  <div>
                    <h4>{p.productId}</h4>
                    <h5 className="text-muted">{p.qty} X Rp. {p.unitPrice}</h5>
                    {p.discount > 0 ? <h5 className="text-muted">-{p.discount * 100}%</h5> : null}
                    <h5 className="text-muted">Rp. {p.netPrice}</h5>
                  </div>
                )
              })}
              <h6>Name: {currentOrder.orderDetails.name}</h6>
              <h6>Email: {currentOrder.orderDetails.email}</h6>
              <h6>Phone Number: {currentOrder.orderDetails.mobile}</h6>
              <h6>Address: {currentOrder.orderDetails.address}</h6>
              <h6>Post Code: {currentOrder.orderDetails.postCode}</h6>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              {
                currentOrder.status === 'pending' ?
                  <Button variant="danger" onClick={handleCancel}>
                    Cancel
                  </Button> : (
                    currentOrder.status !== 'completed' || currentOrder.status !== 'canceled' ?
                      <Button variant="success" onClick={handleCompleted}>
                        Completed
                      </Button> :
                      null
                  )
              }
            </Modal.Footer>
          </> :
            null
        }
      </Modal>
    </div>
  )
}

export default Profile
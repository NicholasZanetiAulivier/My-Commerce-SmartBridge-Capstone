import React, { useEffect, useState } from 'react'
import '../../styles/AllOrders.css'
import { Button, Container, Modal } from 'react-bootstrap';
import { createTokenHeader, fetchApi } from '../../utils/fetchUtils';
import { useNavigate } from 'react-router-dom';
import WestIcon from '@mui/icons-material/West';

const AllOrders = () => {

  const navigate = useNavigate();


  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [])
  async function fetchOrders() {
    const body = await fetchApi("/order/all", 'GET', null, createTokenHeader()).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res.text);
        navigate('/');
      }
    }).catch(e => navigate('/'));
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
  async function handleInDelivery() {
    await fetchApi("/order/status/" + currentOrder.orderDetails.id, 'PATCH', { status: 'in delivery' }, createTokenHeader()).then(res => {
      if (res.ok)
        navigate(0);
      else console.log(res.text);
    }).catch(e => navigate('/'));
    setShow(false);
  }

  async function handleDelivered() {
    await fetchApi("/order/status/" + currentOrder.orderDetails.id, 'PATCH', { status: 'delivered' }, createTokenHeader()).then(res => {
      if (res.ok)
        navigate(0);
      else console.log(res.text);
    }).catch(e => navigate('/'));
    setShow(false);
  }

  return (
    <Container className='py-4'>
      <span><Button onClick={() => navigate(-1)}><WestIcon /></Button> All Orders</span>
      <Container>
        <table className='table table-striped align-content-center'>
          <thead>
            <tr>
              <th>User ID</th>
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
                  <th>{o.userId}</th>
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
                  <Button variant="warning" onClick={handleInDelivery}>
                    In Delivery
                  </Button> : (
                    currentOrder.status === 'in delivery' ?
                      <Button variant="warning" onClick={handleDelivered}>
                        Delivered
                      </Button> : null
                  )
              }
            </Modal.Footer>
          </> :
            null
        }
      </Modal>
    </Container>
  )
}
export default AllOrders;
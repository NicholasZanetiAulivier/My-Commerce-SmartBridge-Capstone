import React, { useEffect, useState, useContext } from 'react';
import '../../styles/Cart.css';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../../context/GeneralContext';
import { createTokenHeader, fetchApi, imgString } from '../../utils/fetchUtils';
import { Button, Container, Form, Image } from 'react-bootstrap';
import ENV from '../../config/env';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const Cart = () => {

  const navigate = useNavigate();
  const { email } = useContext(GeneralContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const { fetchCartCount } = useContext(GeneralContext);


  // Checkout form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [currentEmail, setEmail] = useState(email);
  const [address, setAddress] = useState('');
  const [postCode, setPostCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');


  useEffect(() => {
    if (localStorage.getItem("type") !== 'user' || localStorage.getItem("token") == null) {
      navigate('/');
    }
    fetchCart();
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [cartItems])


  async function fetchCart() {
    try {
      const results = await fetchApi('/cart', 'GET', null, createTokenHeader()).then(res => {
        if (res.ok) return res.json();
        else throw new Error("Failed to fetch cart data");
      }
      );
      let cartContents = []
      for (const item of results.cart) {
        const data = await fetchApi('/product/' + item.productId).then(res => res.json());
        data['qty'] = item.qty;
        if (data.active)
          cartContents.push(data);
      }
      setCartItems(cartContents);
      setLoading(false);

    } catch (e) {
      console.error(e);
    }
  }

  async function updateAmount(id, count) {
    if (count === 0) {
      await fetchApi('/cart/' + id, 'DELETE', null, createTokenHeader());
    } else {
      await fetchApi('/cart/set-quantity/' + id, 'PUT', { qty: count }, createTokenHeader());
    }
    fetchCart();
  }

  const calculateTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.price * item.discount)) * item.qty, 0);
    setTotalPrice(total);
    setTotalDiscount(Math.floor(discount));
  };

  async function handleCreateOrder(e) {
    e.preventDefault();

    const body = {
      name,
      mobile,
      email: currentEmail,
      address,
      postCode,
      paymentMethod,
    };

    await fetchApi('/order', 'POST', body, createTokenHeader()).then(async res => {
      if (res.ok) {
        fetchCartCount();
        navigate('/');
      } else {
        console.log(await res.json());
        navigate('/');
      }
    });
  }

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '20vh' }}>Loading cart...</p>;

  return (
    <Container fluid className='d-flex gap-2'>
      <div className='col-10 d-flex flex-column gap-5'>
        <div className='fw-bold h1 mt-5 mx-5 px-5'>
          Items in cart
        </div>
        {
          cartItems && cartItems.length >= 0 ?
            cartItems.map((i) => {
              return (
                <Container className='d-flex' key={i.id}>
                  <Image className='object-fit-cover' src={i.mainImg ? imgString(i.id) : ENV.PLACEHOLD_IMG} style={{ height: '20vh', maxWidth: "20%" }} />
                  <Container fluid>
                    <h2 className='fw-bold'>{i.title}</h2>
                    <h4 className='text-muted'>{i.description}</h4>
                    <h4 className='fw-bold'>Quantity: {i.qty}
                      <Button onClick={() => { updateAmount(i.id, Math.max(i.qty + 1, 0)) }} variant='outline-info' className='border-0 rounded-5'><AddCircleIcon /></Button>
                      <Button onClick={() => { updateAmount(i.id, Math.max(i.qty - 1, 0)) }} variant='outline-danger' className='border-0 rounded-5'><RemoveCircleIcon /></Button>
                    </h4>
                    <h4>Price: <span className='text-success'>Rp. {i.price}</span> {i.discount > 0 ? <span className='text-danger'>-{i.discount * 100}%</span> : null}</h4>
                  </Container>
                </Container>
              )
            }) :
            <p className='text-muted'>Empty</p>
        }
      </div>
      <div className='col-2 py-3'>
        <h2 className="fw-bold">Order Now</h2>
        <p>Price: <span className='text-success'>Rp.{totalPrice - totalDiscount} ({totalPrice} - {totalDiscount})</span></p>
        <Container>
          <Form onSubmit={handleCreateOrder}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} value={name} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} value={currentEmail} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" placeholder="Enter Phone Number" onChange={(e) => setMobile(e.target.value)} value={mobile} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Enter Address" onChange={(e) => setAddress(e.target.value)} value={address} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>PostCode</Form.Label>
              <Form.Control type="text" placeholder="Enter Post Code" onChange={(e) => setPostCode(e.target.value)} value={postCode} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicType">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} required>
                <option disabled>Select Type</option>
                <option value="card">Card</option>
                <option value="credit">Credit</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Order
            </Button>
          </Form >
        </Container>
      </div>
    </Container>
  );
};

export default Cart;

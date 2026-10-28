import React, { useEffect, useState, useContext } from 'react';
import '../../styles/Cart.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../../context/GeneralContext';
import { createTokenHeader, fetchApi } from '../../utils/fetchUtils';
import { Button, Container, Image } from 'react-bootstrap';
import ENV from '../../config/env';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Cart = () => {
  const { cartCount, setCartCount } = useContext(GeneralContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState(0);

  // Checkout form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);


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
        cartContents.push(data);
      }
      setCartItems(cartContents);
      setCartCount(results.count);
      setLoading(false);

    } catch (e) {
      console.error(e);
    }
  }

  const calculateTotalPrice = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discount = cartItems.reduce((sum, item) => sum + ((item.price * item.discount)) * item.qty, 0);
    setTotalPrice(total);
    setTotalDiscount(Math.floor(discount));
    setDeliveryCharges(total > 1000 || cartItems.length === 0 ? 0 : 50);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);



  const userId = localStorage.getItem('userId');

  if (loading) return <p style={{ textAlign: 'center', marginTop: '20vh' }}>Loading cart...</p>;

  return (
    <Container fluid className='d-flex gap-2'>
      <div className='col-10 d-flex flex-column gap-5'>
        <div className='fw-bold h1 mt-5 mx-5 px-5'>
          Items in cart
        </div>
        {
          cartItems.map((i) => {
            return (
              <Container className='d-flex' key={i.productId}>
                <Image src={i.mainImg ? i.mainImg : ENV.PLACEHOLD_IMG} style={{ height: '20vh' }} />
                <Container fluid>
                  <h2 className='fw-bold'>{i.title}</h2>
                  <h4 className='text-muted'>{i.description}</h4>
                  <h4 className='fw-bold'>Quantity: {i.qty}<Button variant='outline-info' className='border-0 rounded-5'><AddCircleIcon /></Button></h4>
                </Container>
              </Container>
            )
          })
        }
      </div>
      <div className='col-2'></div>
    </Container>
  );
};

export default Cart;

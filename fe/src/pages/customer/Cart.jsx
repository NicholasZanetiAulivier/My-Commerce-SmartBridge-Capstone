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
    // <div className="cartPage">
    //   <div className="cartContents">
    //     {cartItems.length === 0 && <p style={{ textAlign: 'center', marginTop: '20vh' }}>Cart is empty...</p>}

    //     {cartItems.map((item) => (
    //       <div className="cartItem" key={item.id}>
    //         <img src={item.mainImg} alt={item.title} />
    //         <div className="cartItem-data">
    //           <h4>{item.title}</h4>
    //           <p>{item.description}</p>
    //           <div className="cartItem-inputs">
    //             <span>
    //               <p>
    //                 <b>Size: </b> {item.size}
    //               </p>
    //             </span>
    //             <span>
    //               <p>
    //                 <b>Quantity: </b> {item.qty}
    //               </p>
    //             </span>
    //           </div>
    //           <span>
    //             <h5>
    //               <b>Price: </b> &#8377; {parseInt(item.price - (item.price * item.discount)) * item.qty}
    //             </h5>
    //           </span>
    //           <button className="btn" onClick={() => { }}>
    //             Remove
    //           </button>
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   <div className="cartPriceBody">
    //     <h4>Price Details</h4>
    //     <span>
    //       <b>Total MRP: </b> <p>&#8377; {totalPrice}</p>
    //     </span>
    //     <span>
    //       <b>Discount on MRP: </b> <p style={{ color: 'rgb(7, 156, 106)' }}> - &#8377; {totalDiscount}</p>
    //     </span>
    //     <span>
    //       <b>Delivery Charges: </b> <p style={{ color: 'red' }}> + &#8377; {deliveryCharges}</p>
    //     </span>
    //     <hr />
    //     <h5>
    //       <b>Final Price: </b> &#8377; {totalPrice - totalDiscount + deliveryCharges}
    //     </h5>
    //     <button data-bs-toggle="modal" data-bs-target="#staticBackdrop">
    //       Place order
    //     </button>
    //   </div>

    //   {/* Checkout Modal */}
    //   <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    //     <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    //       <div className="modal-content">
    //         <div className="modal-header">
    //           <h5 className="modal-title" id="staticBackdropLabel">
    //             Checkout
    //           </h5>
    //           <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //         </div>
    //         <div className="modal-body">
    //           {/* Checkout Form */}
    //           <div className="checkout-address">
    //             <h4>Checkout details</h4>
    //             <div className="form-floating mb-3">
    //               <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
    //               <label>Name</label>
    //             </div>

    //             <section>
    //               <div className="form-floating mb-3 span-child-2">
    //                 <input type="text" className="form-control" value={mobile} onChange={(e) => setMobile(e.target.value)} />
    //                 <label>Mobile</label>
    //               </div>
    //               <div className="form-floating mb-3 span-child-1">
    //                 <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
    //                 <label>Email</label>
    //               </div>
    //             </section>

    //             <section>
    //               <div className="form-floating mb-3 span-child-1">
    //                 <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
    //                 <label>Address</label>
    //               </div>
    //               <div className="form-floating mb-3 span-child-2">
    //                 <input type="text" className="form-control" value={pincode} onChange={(e) => setPincode(e.target.value)} />
    //                 <label>Pincode</label>
    //               </div>
    //             </section>
    //           </div>

    //           <div className="checkout-payment-method">
    //             <h4>Payment method</h4>
    //             <div className="form-floating mb-3">
    //               <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
    //                 <option value="">choose payment method</option>
    //                 <option value="netbanking">netbanking</option>
    //                 <option value="card">card payments</option>
    //                 <option value="upi">upi</option>
    //                 <option value="cod">cash on delivery</option>
    //               </select>
    //               <label>Choose Payment method</label>
    //             </div>
    //           </div>
    //         </div>
    //         <div className="modal-footer">
    //           <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
    //             cancel
    //           </button>
    //           <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => { }}>
    //             Order
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Cart;

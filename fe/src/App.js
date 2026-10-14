import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar'
import Home from './pages/Home';
import Authentication from './pages/Authentication';

import Cart from './pages/customer/Cart';
import Profile from './pages/customer/Profile';
import CategoryProducts from './pages/customer/CategoryProducts';
import IndividualProduct from './pages/customer/IndividualProduct';

import Admin from './pages/admin/Admin';
import AllProducts from './pages/admin/AllProducts';
import AllUsers from './pages/admin/AllUsers';
import AllOrders from './pages/admin/AllOrders';
import NewProduct from './pages/admin/NewProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import GeneralContextProvider from './context/GeneralContext';
import { useState, useEffect } from 'react';
import { createTokenHeader, fetchApi } from './utils/fetchUtils';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    const results = await fetchApi('/cart', 'GET', null, createTokenHeader()).then(res => {
      console.log(res);
      if (res.ok)
        return res.json();
      else
        throw new Error(res.text());
    }).catch((e) => ({ cart: [] }));
    setCartItems(results.cart);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <GeneralContextProvider>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path='/auth' element={<Authentication />} />
          <Route exact path='' element={<Home />} />
          <Route path='/cart' element={<Cart cartItems={cartItems} setCartItems={setCartItems} fetchCart={fetchCart} />} />
          <Route path='/product/:id' element={<IndividualProduct />} />
          <Route path='/category/:category' element={<CategoryProducts />} />
          <Route path='/profile' element={<Profile />} />

          <Route path='/admin' element={<Admin />} />
          <Route path='/all-products' element={<AllProducts />} />
          <Route path='/all-users' element={<AllUsers />} />
          <Route path='/all-orders' element={<AllOrders />} />
          <Route path='/new-product' element={<NewProduct />} />
          <Route path='/update-product/:id' element={<UpdateProduct />} />
        </Routes>
      </div>
    </GeneralContextProvider>
  );
}

export default App;

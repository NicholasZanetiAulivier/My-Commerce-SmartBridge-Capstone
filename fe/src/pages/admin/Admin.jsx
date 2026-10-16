import React, { useEffect, useState } from 'react'
import '../../styles/Admin.css'
import { useNavigate } from 'react-router-dom'
import { createTokenHeader, fetchApi } from '../../utils/fetchUtils';

const Admin = () => {

  const navigate = useNavigate();

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    if (localStorage.getItem('type') === 'admin') {
      navigate('/admin')
    }
  }, [localStorage])


  useEffect(() => {
    fetchCountData();
  }, [])

  async function fetchCountData() {
    try {
      let body = await fetchApi('/user', 'GET', null, createTokenHeader()).then(res => {
        if (res.ok) return res.json();
        else throw new Error();
      }).catch(e => { throw e });
      setUserCount(body.count);

      body = await fetchApi('/product', 'GET', null, createTokenHeader()).then(res => {
        if (res.ok) return res.json();
        else throw new Error();
      }).catch(e => { throw e });
      setProductCount(body.count);

      body = await fetchApi('/order', 'GET', null, createTokenHeader()).then(res => {
        if (res.ok) return res.json();
        else throw new Error();
      }).catch(e => { throw e });
      setOrdersCount(body.count);
    } catch (e) {
      navigate('/');
    }

  }




  return (
    <div className="admin-page">

      <div>
        <div className="admin-home-card">
          <h5>Total users</h5>
          <p>{userCount}</p>
          <button onClick={() => navigate('/all-users')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>All Products</h5>
          <p>{productCount}</p>
          <button onClick={() => navigate('/all-products')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>All Orders</h5>
          <p>{ordersCount}</p>
          <button onClick={() => navigate('/all-orders')}>View all</button>
        </div>
      </div>

      <div>
        <div className="admin-home-card">
          <h5>Add Product</h5>
          <p>(new)</p>
          <button onClick={() => navigate('/new-product')}>Add now</button>
        </div>
      </div>

    </div>
  )
}

export default Admin
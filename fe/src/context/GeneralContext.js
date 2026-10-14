import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createTokenHeader, fetchApi } from '../utils/fetchUtils';

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setUsertype] = useState('');

  const [productSearch, setProductSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        let headers = createTokenHeader();
        const response = await fetchApi('/cart', 'GET', null, headers).then(res => res.json());
        setCartCount(response.count);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    }
  }

  const handleSearch = () => {
    navigate('#products-body');
  }

  const login = async () => {
    if (!email || !password) {
      alert("Email and password are required!");
      return;
    }

    try {
      const loginInputs = {
        email: email.trim(),
        password: password
      };

      const res = await fetchApi('/user/login', 'POST', loginInputs);

      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('type', res.data.type);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      if (res.data.type === 'user') {
        navigate('/');
      } else if (res.data.type === 'admin') {
        navigate('/admin');
      }
      localStorage.set('logout', false);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed!!");
    }
  };

  const inputs = { username, email, type, password };
  const register = async () => {
    try {
      const res = await fetchApi('/user/register', 'POST', inputs);

      localStorage.setItem('userId', res.data.id);
      localStorage.setItem('type', res.data.type);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);

      if (res.data.type === 'user') {
        navigate('/');
      } else if (res.data.type === 'admin') {
        navigate('/admin');
      }
      localStorage.set('logout', false);
    } catch (err) {
      alert("Registration failed!!");
      console.error(err.response?.data || err.message);
    }
  }

  const refresh = async () => {
    if (localStorage.get('logout')) return;
    const res = await fetchApi('/user/refresh', 'POST');

    localStorage.setItem('token', res.data.accessToken);
  }

  const logout = () => {
    localStorage.clear();
    localStorage.setItem('logout', true);
    navigate('/');
  }

  return (
    <GeneralContext.Provider
      value={{
        login, register, logout,
        username, setUsername,
        email, setEmail,
        password, setPassword,
        usertype: type, setUsertype,
        productSearch, setProductSearch,
        handleSearch,
        cartCount,
        setCartCount,
        fetchCartCount
      }}>
      {children}
    </GeneralContext.Provider>
  )
}

export default GeneralContextProvider;

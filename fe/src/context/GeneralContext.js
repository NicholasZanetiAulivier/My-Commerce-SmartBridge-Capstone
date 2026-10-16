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
  const [type, setType] = useState('');

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
    if (userId && localStorage.getItem('type') === 'user') {
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

      const body = await fetchApi('/user/login', 'POST', loginInputs).then(res => {
        if (res.ok) return res.json();
        else throw new Error();
      });

      localStorage.setItem('token', body.accessToken);
      localStorage.setItem('userId', body.id);
      localStorage.setItem('type', body.type);
      localStorage.setItem('username', body.username);
      localStorage.setItem('email', body.email);

      if (body.type === 'user') {
        navigate('/');
      } else if (body.type === 'admin') {
        navigate('/admin');
      }
      localStorage.setItem('logout', false);
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed!!");
    }
  };

  const register = async () => {
    const inputs = { username, email, type, password };
    console.log(inputs);
    try {
      const body = await fetchApi('/user/register', 'POST', inputs).then(res => {
        if (res.ok) return res.json();
        else throw new Error();
      });

      localStorage.setItem('userId', body.id);
      localStorage.setItem('type', body.type);
      localStorage.setItem('username', body.username);
      localStorage.setItem('email', body.email);

      if (body.type === 'user') {
        navigate('/');
      } else if (body.type === 'admin') {
        navigate('/admin');
      }
      localStorage.setItem('logout', false);
    } catch (err) {
      alert("Registration failed!!");
      console.error(err.response?.data || err.message);
    }
  }

  const refresh = async () => {
    if (localStorage.get('logout')) return;
    const res = await fetchApi('/user/refresh', 'POST').then(res => {
      console.log(res);
      if (res.ok) return res.json();
      else navigate('/');
    });;

    localStorage.setItem('token', res.accessToken);
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
        type: type, setType,
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

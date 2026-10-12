import React, { useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';

const Login = ({ setIsLogin }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    await login();
  }

  return (
    <form className="authForm" onSubmit={handleLogin}>
      <h2>Login</h2>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Email address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Password</label>
      </div>

      <button type="submit" className="btn btn-primary">Sign in</button>

      <p>Not registered? <span onClick={() => setIsLogin(false)}>Register</span></p>
    </form>
  );
}

export default Login;

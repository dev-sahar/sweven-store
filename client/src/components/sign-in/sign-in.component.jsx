import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './sign-in.styles.css';

const SignIn = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { email, password } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/user/signin', { ...user });

      localStorage.setItem('firstLogin', true);

      window.location.href = '/';
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className='sign_in'>
      <form onSubmit={signIn}>
        {/*<h2>I already have an account</h2>
        <h5>Sign in with your email and password</h5>*/}
        <h2>Sign In</h2>
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={email}
          onChange={handleChange}
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          autoComplete='on'
          value={password}
          onChange={handleChange}
          required
        />

        <div className='row'>
          <button type='submit'>Sign In</button>
          <Link to='/register'>Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

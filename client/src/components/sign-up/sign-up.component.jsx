import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './sign-up.styles.css';

const SignUp = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { name, email, password } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const signUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/user/register', { ...user });

      localStorage.setItem('firstLogin', true);

      window.location.href = '/';
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className='sign_in'>
      <form onSubmit={signUp}>
        {/*<h2>I do not have an account</h2>
        <h5>Sign up with your email and password</h5>*/}
        <h2>Sign Up</h2>
        <input
          type='text'
          name='name'
          placeholder='Name'
          value={name}
          onChange={handleChange}
          required
        />
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
          <button type='submit'>Sign Up</button>
          <Link to='/signin'>Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

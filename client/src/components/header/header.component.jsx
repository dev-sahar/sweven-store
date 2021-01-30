import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Menu from '../../assets/menu-icon.svg';
import Close from '../../assets/close-icon.svg';
import Cart from '../../assets/shopping-cart-icon.svg';
import Logo from '../../assets/logo.svg';

import useStateValue from '../../consumer/state.consumer';

import './header.styles.css';

const Header = () => {
  const { usersAPI } = useStateValue();
  const [isLoggedIn] = usersAPI.isLoggedIn;
  const [isAdmin] = usersAPI.isAdmin;
  const [cart] = usersAPI.cart;

  const [menu, setMenu] = useState(false);

  const signout = async () => {
    await axios.get('/user/signout');

    localStorage.removeItem('firstLogin');

    window.location.href = '/';
  };

  const signOutPanel = () => {
    return (
      <>
        <li>
          <Link to='/history'>History</Link>
        </li>
        <li>
          <Link to='/' onClick={signout}>
            Sign Out
          </Link>
        </li>
      </>
    );
  };

  const adminPanel = () => {
    return (
      <>
        <li>
          <Link to='/add_product'>Add Products</Link>
        </li>
        <li>
          <Link to='/category'>Categories</Link>
        </li>
      </>
    );
  };

  const styleMenu = {
    left: menu ? 0 : '-100%',
  };

  return (
    <header>
      <div className='menu' onClick={() => setMenu(!menu)}>
        <img src={Menu} alt='' width='30' />
      </div>

      <div className='logo'>
        {isAdmin ? (
          <h1>
            <Link to='/'>Admin Panel</Link>
          </h1>
        ) : (
          <Link to='/' className='sweven_logo'>
            <img src={Logo} alt='SWEVEN' width='40' />
            <h1>SWEVEN</h1>
          </Link>
        )}
      </div>

      <div className='menu_links'>
        <ul style={styleMenu}>
          <li>
            <Link to='/'>{isAdmin ? 'Products' : 'Shop'}</Link>
          </li>

          {isAdmin && adminPanel()}

          {isLoggedIn ? (
            signOutPanel()
          ) : (
            <li>
              <Link to='/signin'>Sign In</Link>
            </li>
          )}

          <li onClick={() => setMenu(!menu)}>
            <img src={Close} alt='' width='30' className='menu' />
          </li>
        </ul>
      </div>

      {isAdmin ? (
        ''
      ) : (
        <div className='cart-icon'>
          <span>{cart.length}</span>
          <Link to='/cart'>
            <img src={Cart} alt='' width='30' />
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

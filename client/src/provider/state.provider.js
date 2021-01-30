import React, { useState, useEffect } from 'react';
import axios from 'axios';

import StateContext from '../context/state.context';

import ProductsAPI from '../api/products-api';
import UsersAPI from '../api/users-api';
import CategoriesAPI from '../api/categories-api';

const StateProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');

    if (firstLogin) {
      const refreshToken = async () => {
        const response = await axios.get('/user/refresh_token');

        setToken(response.data.accesstoken);

        setTimeout(() => {
          refreshToken();
        }, 10 * 60 * 1000);
      };

      refreshToken();
    }
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    usersAPI: UsersAPI(token),
    categoriesAPI: CategoriesAPI(),
  };

  return (
    <StateContext.Provider value={state}>{children}</StateContext.Provider>
  );
};

export default StateProvider;

import { useState, useEffect } from 'react';
import axios from 'axios';

const UsersAPI = (token) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const response = await axios.get('/user/info', {
            headers: { Authorization: token },
          });

          setIsLoggedIn(true);

          response.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

          setCart(response.data.cart);

          //console.log(response);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };

      getUser();
    }
  }, [token]);

  const addToCart = async (product) => {
    if (!isLoggedIn) return alert('Please login to continue shopping');

    const checkCart = cart.every((item) => item._id !== product._id);

    if (checkCart) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        '/user/addtocart',
        { cart: [...cart, { ...product, quantity: 1 }] },
        { headers: { Authorization: token } }
      );
    } else {
      alert('Item added to cart');
    }
  };

  return {
    isLoggedIn: [isLoggedIn, setIsLoggedIn],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addToCart: addToCart,
    history: [history, setHistory],
  };
};

export default UsersAPI;

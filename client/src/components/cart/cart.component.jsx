import React, { useState, useEffect } from 'react';
import axios from 'axios';

import useStateValue from '../../consumer/state.consumer';

import PayPalBtn from '../paypal-btn/paypal-btn.component';

import './cart.styles.css';

const Cart = () => {
  const { usersAPI, token: stateToken } = useStateValue();
  const [cart, setCart] = usersAPI.cart;
  const [token] = stateToken;

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce(
        (previous, item) => previous + item.price * item.quantity,
        0
      );

      setTotal(total);
    };

    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      '/user/addtocart',
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const incrementQuantity = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }

      setCart([...cart]);
      addToCart(cart);
    });
  };

  const decrementQuantity = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }

      setCart([...cart]);
      addToCart(cart);
    });
  };

  const deleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      cart.forEach((item, index) => {
        if (item._id === id) cart.splice(index, 1);
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };

  const paymentHandler = async (details, data) => {
    const { id: paymentID, purchase_units } = details;
    const address = purchase_units[0].shipping.address;
    const name = purchase_units[0].shipping.name;

    await axios.post(
      '/api/payment',
      { cart, paymentID, address, name },
      {
        headers: { Authorization: token },
      }
    );

    setCart([]);
    addToCart([]);
    alert('Thank you! Your order has been sent successfully.');

    //console.log('id: ', id, 'address: ', purchase_units[0].shipping.address);
  };

  return cart.length !== 0 ? (
    <div>
      {cart.map((item) => {
        const {
          images,
          title,
          price,
          description,
          content,
          quantity,
          _id,
        } = item;

        return (
          <div key={_id} className='details cart'>
            <img src={images.url} alt='Product' className='img_container' />

            <div className='details_box'>
              <h2>{title}</h2>
              <h3>${price * quantity}</h3>
              <p>{description}</p>
              <p>{content}</p>

              <div className='amount'>
                <button onClick={() => decrementQuantity(_id)}> - </button>
                <p>{quantity}</p>
                <button onClick={() => incrementQuantity(_id)}> + </button>
              </div>

              <div className='delete' onClick={() => deleteItem(_id)}>
                x
              </div>
            </div>
          </div>
        );
      })}

      <div className='total'>
        <h3>Total: ${total}</h3>
        <PayPalBtn amount={total} currency={'USD'} onSuccess={paymentHandler} />
      </div>
    </div>
  ) : (
    <h2 style={{ textAlign: 'center', fontSize: '3rem', marginTop: '100px' }}>
      Cart is Empty
    </h2>
  );
};

export default Cart;

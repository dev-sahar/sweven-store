import React from 'react';
import { Link } from 'react-router-dom';

import useStateValue from '../../consumer/state.consumer';

import './buttons.styles.css';

const Buttons = ({ product, deleteProduct }) => {
  const { _id, images } = product;
  const { usersAPI } = useStateValue();

  const [isAdmin] = usersAPI.isAdmin;
  const addToCart = usersAPI.addToCart;

  return (
    <div className='row_btn'>
      {isAdmin ? (
        <>
          <Link
            className='delete_btn'
            to='#!'
            onClick={() => deleteProduct(_id, images.public_id)}
          >
            Delete
          </Link>
          <Link className='edit_btn' to={`/edit_product/${_id}`}>
            Edit
          </Link>
        </>
      ) : (
        <>
          <Link className='buy_btn' to='#!' onClick={() => addToCart(product)}>
            Add To Cart
          </Link>
          <Link className='view_btn' to={`/details/${_id}`}>
            View
          </Link>
        </>
      )}
    </div>
  );
};

export default Buttons;

import React from 'react';

import Buttons from '../buttons/buttons.component';

import './product-item.styles.css';

const ProductItem = ({ product, isAdmin, deleteProduct, handleChecked }) => {
  const { images, title, price, checked, _id } = product;

  return (
    <div className='product_card'>
      {isAdmin && (
        <input
          type='checkbox'
          checked={checked}
          onChange={() => handleChecked(_id)}
        />
      )}

      <img src={images.url} alt='Product' />

      <div className='product_box'>
        <h2 title={title}>{title}</h2>
        <span>${price}</span>
      </div>

      <Buttons product={product} deleteProduct={deleteProduct} />
    </div>
  );
};

export default ProductItem;

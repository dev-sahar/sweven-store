import React, { useState } from 'react';
import axios from 'axios';

import useStateValue from '../../consumer/state.consumer';

import ProductItem from '../product-item/product-item.component';
import Filters from '../filters/filters.component';
import ViewMore from '../view-more/view-more.component';
import Spinner from '../spinner/spinner.component';

import './products.styles.css';

const Products = () => {
  const { productsAPI, usersAPI, token: stateToken } = useStateValue();

  const [products, setProducts] = productsAPI.products;
  const [callback, setCallback] = productsAPI.callback;
  const [isAdmin] = usersAPI.isAdmin;
  const [token] = stateToken;

  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleChecked = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setIsLoading(true);

      const destroyImg = axios.post(
        '/api/destroy',
        { public_id },
        {
          headers: { Authorization: token },
        }
      );

      const deleteProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });

      await destroyImg;
      await deleteProduct;

      setCallback(!callback);
      setIsLoading(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const selectAll = () => {
    products.forEach((product) => {
      product.checked = !isChecked;
    });

    setProducts([...products]);
    setIsChecked(!isChecked);
  };

  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  return !isLoading ? (
    <>
      <Filters />

      {isAdmin && (
        <div className='delete_all'>
          <input type='checkbox' checked={isChecked} onChange={selectAll} />
          <span>Select all</span>
          <button onClick={deleteAll}>Delete ALL</button>
        </div>
      )}

      <div className='products'>
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleChecked={handleChecked}
            />
          );
        })}
      </div>

      <ViewMore />

      {products?.length === 0 && <Spinner />}
    </>
  ) : (
    <Spinner />
  );
};

export default Products;

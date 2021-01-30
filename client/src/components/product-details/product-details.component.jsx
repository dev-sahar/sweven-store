import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import useStateValue from '../../consumer/state.consumer';

import ProductItem from '../product-item/product-item.component';

import './product-details.styles.css';

const ProductDetails = () => {
  const params = useParams();
  const { productsAPI, usersAPI } = useStateValue();

  const [products] = productsAPI.products;
  const [productsDetails, setProductDetails] = useState([]);

  const addToCart = usersAPI.addToCart;

  useEffect(() => {
    params.id &&
      products.forEach(
        (product) => product._id === params.id && setProductDetails(product)
      );
  }, [params.id, products]);

  const {
    images,
    title,
    price,
    description,
    content,
    sold,
    category,
    _id,
  } = productsDetails;

  return productsDetails?.length !== 0 ? (
    <>
      <div className='details'>
        <img src={images.url} alt='Product' />
        <div className='details_box'>
          <div className='row'>
            <h2>{title}</h2>
            <h6>#id: {_id}</h6>
          </div>
          <span>${price}</span>
          <p>{description}</p>
          <p>{content}</p>
          <p>Sold: {sold}</p>
          <Link
            to='/cart'
            className='cart'
            onClick={() => addToCart(productsDetails)}
          >
            Add To Cart
          </Link>
        </div>
      </div>

      <div className='related_products'>
        <h2>Related Products</h2>
        <div className='products'>
          {products.map(
            (product) =>
              product.category === category && (
                <ProductItem key={product._id} product={product} />
              )
          )}
        </div>
      </div>
    </>
  ) : null;
};

export default ProductDetails;

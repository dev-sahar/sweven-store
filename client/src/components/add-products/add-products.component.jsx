import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

import useStateValue from '../../consumer/state.consumer';

import Spinner from '../spinner/spinner.component';

import './add-products.styles.css';

const INITIAL_STATE = {
  product_id: '',
  title: '',
  price: 0,
  description: '',
  content: '',
  category: '',
  _id: '',
};

const AddProducts = () => {
  const {
    categoriesAPI,
    usersAPI,
    token: stateToken,
    productsAPI,
  } = useStateValue();

  const [categories] = categoriesAPI.categories;
  const [isAdmin] = usersAPI.isAdmin;
  const [token] = stateToken;
  const [callback, setCallback] = productsAPI.callback;
  const [products] = productsAPI.products;

  const [product, setProduct] = useState(INITIAL_STATE);
  const [images, setImages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);

  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      setOnEdit(true);

      products.forEach((product) => {
        if (product._id === params.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(INITIAL_STATE);
      setImages(false);
    }
  }, [params.id, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      if (!isAdmin)
        return alert("Access Denied! You don't have Admin privileges.");

      const file = e.target.files[0];

      if (!file) return alert('Please upload an image.');

      if (file.size > 1024 * 1024) return alert('File size is too large.');

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert('File format is not supported.');

      let formData = new FormData();
      formData.append('file', file);

      setIsLoading(true);

      const res = await axios.post('/api/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token,
        },
      });

      setIsLoading(false);
      setImages(res.data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin)
        return alert("Access Denied! You don't have Admin privileges.");

      setIsLoading(true);

      await axios.post(
        '/api/destroy',
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );

      setIsLoading(false);
      setImages(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isAdmin)
        return alert("Access Denied! You don't have Admin privileges.");

      if (!images) return alert('Please upload an image.');

      if (onEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.post(
          '/api/products',
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      }
      setCallback(!callback);
      history.push('/');
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className='add_product'>
      <div className='upload'>
        <input
          type='file'
          name='file'
          id='file_upload'
          onChange={handleUpload}
        />
        {isLoading ? (
          <div id='file_img'>
            <Spinner />
          </div>
        ) : (
          <div id='file_img' style={{ display: images ? 'block' : 'none' }}>
            <img src={images ? images.url : ''} alt='Product' />
            <span onClick={handleDestroy}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className='row'>
          <label htmlFor='product_id'>Product Id</label>
          <input
            type='text'
            name='product_id'
            id='product_id'
            value={product.product_id}
            onChange={handleChange}
            disabled={onEdit}
            required
          />
        </div>

        <div className='row'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            name='title'
            id='title'
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className='row'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            name='price'
            id='price'
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className='row'>
          <label htmlFor='description'>Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            rows='5'
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className='row'>
          <label htmlFor='content'>Content</label>
          <textarea
            type='text'
            name='content'
            id='content'
            rows='7'
            value={product.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className='row'>
          <label htmlFor='categories'>Category </label>
          <select
            name='category'
            value={product.category}
            onChange={handleChange}
            className='select_css'
          >
            <option value=''>Please select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type='submit' className='submit_btn'>
          {onEdit ? 'Update' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default AddProducts;

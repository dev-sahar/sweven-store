import React, { useState } from 'react';
import axios from 'axios';

import useStateValue from '../../consumer/state.consumer';

import './add-categories.styles.css';

const AddCategories = () => {
  const { categoriesAPI, token: stateToken } = useStateValue();
  const [categories] = categoriesAPI.categories;
  const [callback, setCallback] = categoriesAPI.callback;
  const [token] = stateToken;

  const [category, setCategory] = useState('');
  const [onEdit, setOnEdit] = useState(false);
  const [id, setId] = useState('');

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert(res.data.msg);
      } else {
        const res = await axios.post(
          '/api/category',
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert(res.data.msg);
      }
      setOnEdit(false);
      setCategory('');
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const editCategory = async (id, name) => {
    setId(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.msg);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className='categories'>
      <form onSubmit={addCategory}>
        <label htmlFor='category'>Category</label>
        <input
          type='text'
          name='category'
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type='submit'>{onEdit ? 'Update' : 'Add'}</button>
      </form>

      <div className='col'>
        {categories.map((category) => {
          const { _id, name } = category;
          return (
            <div className='row' key={_id}>
              <p>{name}</p>
              <div>
                <button onClick={() => editCategory(_id, name)}>Edit</button>
                <button onClick={() => deleteCategory(_id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddCategories;

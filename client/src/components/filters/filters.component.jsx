import React from 'react';

import useStateValue from '../../consumer/state.consumer';

import './filters.style.css';

const Filters = () => {
  const { productsAPI, categoriesAPI } = useStateValue();
  const [category, setCategory] = productsAPI.category;
  const [sort, setSort] = productsAPI.sort;
  const [search, setSearch] = productsAPI.search;
  const [categories] = categoriesAPI.categories;

  const handleChange = (e) => {
    setCategory(e.target.value);
    setSearch('');
  };

  return (
    <div className='filters_menu'>
      <input
        type='text'
        placeholder='Enter your search key word'
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <div className='row filter'>
        <select value={category} onChange={handleChange} className='select_css'>
          <option value=''>All Products</option>
          {categories.map((category) => (
            <option key={category._id} value={`category=${category._id}`}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className='row sort'>
        <select
          name='sort'
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className='select_css'
        >
          <option value='' disabled>
            Sort By
          </option>
          <option value='sort=-createdAt'>Latest</option>
          <option value='sort=oldest'>Oldest</option>
          <option value='sort=-sold'>Top sales</option>
          <option value='sort=-price'>Price: High - Low</option>
          <option value='sort=price'>Price: Low - High</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;

import { useState, useEffect } from 'react';
import axios from 'axios';

const CategoriesAPI = () => {
  const [categories, setCategories] = useState([]);
  const [callback, setCallback] = useState(false);

  const getCategories = async () => {
    const response = await axios.get('/api/category');
    setCategories(response.data);
  };

  useEffect(() => {
    getCategories();
  }, [callback]);

  return {
    categories: [categories, setCategories],
    callback: [callback, setCallback],
  };
};

export default CategoriesAPI;

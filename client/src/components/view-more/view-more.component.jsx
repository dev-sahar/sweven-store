import React from 'react';

import useStateValue from '../../consumer/state.consumer';

import './view-more.styles.css';

const ViewMore = () => {
  const { productsAPI } = useStateValue();
  const [page, setPage] = productsAPI.page;
  const [result] = productsAPI.result;

  return (
    <div className='view_more'>
      {result < page * 9 ? (
        ''
      ) : (
        <button onClick={() => setPage(page + 1)}>View More</button>
      )}
    </div>
  );
};

export default ViewMore;

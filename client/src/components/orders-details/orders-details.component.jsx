import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import useStateValue from '../../consumer/state.consumer';

import './orders-details.styles.css';

const OrdersDetails = () => {
  const { usersAPI } = useStateValue();
  const [history] = usersAPI.history;

  const [orderDetails, setOrderDetails] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) setOrderDetails(item);
      });
    }
  }, [params.id, history]);

  const { address, name, cart } = orderDetails;

  return orderDetails.length !== 0 ? (
    <div className='order_details'>
      <table className='user'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Postal Code</th>
            <th>Country Code</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{name}</td>
            <td>
              {address.address_line_1 +
                ' - ' +
                address.admin_area_2 +
                ' - ' +
                address.admin_area_1}
            </td>
            <td>{address.postal_code}</td>
            <td>{address.country_code}</td>
          </tr>
        </tbody>
      </table>

      <table className='order' style={{ margin: '30px 0px' }}>
        <thead>
          <tr>
            <th></th>
            <th>Products</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item._id}>
              <td>
                <img src={item.images.url} alt='' />
              </td>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>$ {item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;
};

export default OrdersDetails;

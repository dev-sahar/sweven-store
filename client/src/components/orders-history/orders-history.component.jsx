import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import useStateValue from '../../consumer/state.consumer';

import './orders-history.styles.css';

const OrdersHistory = () => {
  const { usersAPI, token: stateToken } = useStateValue();
  const [history, setHistory] = usersAPI.history;
  const [isAdmin] = usersAPI.isAdmin;
  const [token] = stateToken;

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const response = await axios.get('/api/payment', {
            headers: { Authorization: token },
          });
          setHistory(response.data);
        } else {
          const response = await axios.get('/user/history', {
            headers: { Authorization: token },
          });
          setHistory(response.data);
        }
      };

      getHistory();
    }
  }, [token, isAdmin, setHistory]);

  return (
    <div className='history'>
      <h2>Orders History</h2>
      <h4>You have {history?.length} order(s).</h4>

      <table>
        <thead>
          <tr>
            <th>Payment Id</th>
            <th>Purchase Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {history.map((order) => {
            const { _id, paymentID, createdAt } = order;
            return (
              <tr key={_id}>
                <td>{paymentID}</td>
                <td>{new Date(createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/history/${_id}`}>View</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersHistory;

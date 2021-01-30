import React from 'react';
import { PayPalButton } from 'react-paypal-button-v2';

const PayPalBtn = (props) => {
  const { amount, onSuccess, currency } = props;

  let style = {
    size: 'medium',
    color: 'blue',
    shape: 'rect',
    label: 'checkout',
    tagline: false,
  };

  return (
    <PayPalButton
      amount={amount}
      currency={currency}
      onSuccess={(details, data) => onSuccess(details, data)}
      style={style}
    />
  );
};

export default PayPalBtn;

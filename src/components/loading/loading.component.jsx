import React from 'react';

import './loading.styles.css'

import trainIcon from '../../assets/train-icon.svg';

const Loading = () => {
  return (
    <div className="loader-overlay">
      <div className='loader-container'>
        <div className="smoke"></div>
        <img src="/train-icon.svg" alt="Train Loading" className='train' />
      </div>
    </div>
  );
};


export default Loading
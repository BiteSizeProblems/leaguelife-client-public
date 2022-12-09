import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const Loading = () => {

  return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center'
        }}>
        <ProgressSpinner />
      </div>   
  );
};

export default Loading;
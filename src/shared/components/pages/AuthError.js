import React from 'react';
import { BiMessageAltError } from 'react-icons/bi';

const AuthError = (props) => {
  console.log('AuthError Props: ' + props);
  console.log(props);

  const errorMessage = props.message;

  console.log(errorMessage);

  return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
        }} >
          <div >
            <BiMessageAltError style={{fontSize:'72px'}} />
          </div>
          <div style={{fontWeight: 'bold'}}>
            <p>Oops... We've experienced an error: "{errorMessage}".</p>
          </div>
          <div >
            <p>Try restarting your browser, or clearing your cache before reloading the site.</p>
          </div>
      </div>   
  );
};

export default AuthError;
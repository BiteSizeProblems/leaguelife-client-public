import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "primereact/button";

import './LoginButton.css'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button 
            onClick={() => loginWithRedirect()} 
            label="SIGN IN" 
            className="p-button-info p-button-text login_btn" 
            />
};

export default LoginButton;
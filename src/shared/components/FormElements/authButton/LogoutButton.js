import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "primereact/button";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return <Button 
            onClick={() => logout({ returnTo: window.location.origin })} 
            label="LOG OUT" 
            className="p-button-info p-button-text"
            style={{marginBottom:'2rem'}}
            />
};

export default LogoutButton;
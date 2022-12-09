import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "primereact/button";

//import Button from "../button/Button";

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button 
            label="Start Building" 
            icon="pi pi-angle-right"
            className="p-button p-button-warning" 
            onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
            style={{color:'#2c303d', fontSize: '1.2em'}}
            />
};

export default SignupButton;
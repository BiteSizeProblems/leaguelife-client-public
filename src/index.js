import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";
import App from './App';
import "primereact/resources/themes/vela-purple/theme.css";
import "primereact/resources/primereact.min.css";  
import "primeicons/primeicons.css";
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
 <BrowserRouter>
   <Auth0Provider domain="dev-8lt2-cil.us.auth0.com" clientId="7sl5oWn6enWfu3bdkInjMv3OW9hQ7vB7" redirectUri={window.location.origin}>
     <App tab="home" />
   </Auth0Provider>
 </BrowserRouter>
);

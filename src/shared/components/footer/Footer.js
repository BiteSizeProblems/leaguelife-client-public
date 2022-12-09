import React from 'react';

import { TiSocialFacebook, TiSocialGithub, TiSocialTwitter, TiSocialInstagram, TiSocialYoutube } from 'react-icons/ti';
import { FaDiscord } from 'react-icons/fa';

import './Footer.css';

const socialIconContainerStyle = { fontSize: '1.5em', padding: '5px'};
const socialIconStyle = { margin: ' 0px 10px' };

const Footer = () => {

  return (
    <div className='bg-grey-900 text-black-100 p-3 footer'>

      <div className="flex justify-content-between lg:justify-content-center align-items-center flex-wrap ">
          <div className="align-items-center hidden lg:flex">
              <span className="line-height-3"><b>League Life</b></span>
          </div>
      </div>

      <br/>

      <div className="align-items-center lg:flex center">
        <span className="line-height-3" style={socialIconContainerStyle}>
          <TiSocialFacebook style={socialIconStyle}/>
          <TiSocialGithub style={socialIconStyle}/>
          <TiSocialTwitter style={socialIconStyle}/>
          <TiSocialInstagram style={socialIconStyle}/>
          <TiSocialYoutube style={socialIconStyle}/>
          <FaDiscord style={socialIconStyle}/>
        </span>
      </div>

    </div>
    
  );
};

export default Footer;































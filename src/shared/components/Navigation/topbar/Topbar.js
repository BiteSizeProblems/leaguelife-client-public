import React from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';

import { Menubar } from 'primereact/menubar';
import { classNames } from 'primereact/utils';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';

import LoginButton from '../../FormElements/authButton/LoginButton';

import './Topbar.css';

const Topbar = (props) => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const { user } = props;

  let userId, image;
  if(props.user) {
    userId = user.id;
    if (user.properties.avatar) {
      image = user.properties.avatar
    } else {
      image = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
    };
  };

  const UserAvatarIcon = () => { return <Avatar image={image} shape="circle" /> };

  const handleNavigateToProfile = async event => {
    navigate(`/user/${userId}/myaccount`);
  };

  let activeStyle = { color: '#b41b5a', fontWeight:'600' };
  let iconStyle = { fontSize:'1.2em', marginRight: '15px' };

    const items = [
        {
            label: 'Search',
            template: (item, options) => {
              return (
                <NavLink to={`/search/${userId}`} className={options.className} style={({ isActive }) => isActive ? activeStyle : undefined }>
                    <span className={classNames(options.iconClassName, 'pi pi-search')}></span>
                    <span className={options.labelClassName}>{item.label}</span>
                </NavLink>
              );
            }
        },
        {
            label: 'Message',
            template: (item, options) => {
              return (
                <NavLink to={`/user/${userId}/notifications`} className={options.className} style={({ isActive }) => isActive ? activeStyle : undefined }>
                    <span className={classNames(options.iconClassName, 'pi pi-envelope')}></span>
                    <span className={options.labelClassName}>{item.label}</span>
                </NavLink>
              );
            }
        },
        {
          label: 'Help', 
          template: (item, options) => {
            return (
              <NavLink to='/help' className={options.className} style={({ isActive }) => isActive ? activeStyle : undefined }>
                  <span className={classNames(options.iconClassName, 'pi pi-question')}></span>
                  <span className={options.labelClassName}>{item.label}</span>
              </NavLink>
            );
          }
        }
    ];

    const start = (
      <div className='topbar__start'>
        <NavLink className='topbar__title' to='/'>League Life</NavLink>
      </div>
    );

    const end = <Button icon={UserAvatarIcon} className="p-button-rounded p-button-secondary mr-3" onClick={handleNavigateToProfile} />;

    const login = <LoginButton />

    if (isAuthenticated){
      return <Menubar model={items} start={start} end={end} className="topbar__container" />;
    } else {
      return <Menubar start={start} end={login} className="topbar__container" />;
    }
}

export default Topbar;
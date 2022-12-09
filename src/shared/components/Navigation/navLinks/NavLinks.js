import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';

import LoginButton from "../../FormElements/authButton/LoginButton";
import LogoutButton from "../../FormElements/authButton/LogoutButton";
import { Button } from 'primereact/button';

import { Avatar } from 'primereact/avatar';
import { FaSearch, FaQuestion } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';

import './NavLinks.css';

const NavLinks = props => {
    const { isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    const user = props.user;

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

    let activeStyle = { color: '#ba68c8' };
    
    if (isAuthenticated){

        return (
            <ul className="nav-links">

                <NavLink to={`/search/${userId}`} style={({ isActive }) => isActive ? activeStyle : undefined }>
                    <FaSearch/>
                </NavLink>

                <NavLink to={`/user/${userId}/notifications`} style={({ isActive }) => isActive ? activeStyle : undefined }>
                    <RiMessage2Fill/>
                </NavLink>

                <NavLink to='/help' style={({ isActive }) => isActive ? activeStyle : undefined }>
                    <FaQuestion/>
                </NavLink>

                <Button icon={UserAvatarIcon} className="p-button-rounded p-button-secondary" onClick={handleNavigateToProfile} />

            </ul>
        )
    } else {
        return <LoginButton />
    };
};

export default NavLinks;
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import MainHeader from "../mainHeader/MainHeader";
import NavLinks from "../navLinks/NavLinks";
import SideDrawer from "../sideDrawer/SideDrawer";
import Backdrop from '../../UIElements/backdrop/Backdrop';

import { AiOutlineMenu } from 'react-icons/ai';

import './MainNavigation.css';

const MainNavigation = props => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const openDrawerHandler = () => { setDrawerIsOpen(true); }
    const closeDrawerHandler = () => { setDrawerIsOpen(false); }
    const user = props.user;

    return (
        <React.Fragment>

            {/*{drawerIsOpen && <Backdrop onClick={closeDrawerHandler}/>}
            
            <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks />
                </nav>
            </SideDrawer>*/}

            <MainHeader>

                <div className="header-left">
                    <AiOutlineMenu className="main-nav__drawer_icon" onClick={openDrawerHandler}/>
                    <NavLink className='main-nav__title' to='/'><h3>League Life</h3></NavLink>
                </div>
                
                <nav className="main-nav__navlinks">
                    <NavLinks  user={user}/>
                </nav>
            </MainHeader>

        </React.Fragment>
    );
};

export default MainNavigation;
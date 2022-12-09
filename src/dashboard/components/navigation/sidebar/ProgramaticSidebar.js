import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Menu } from 'primereact/menu';
import { MdAdminPanelSettings, MdBarChart, MdOutlineAccountTree, MdOutlineEvent, MdChatBubble, MdManageAccounts, MdSupervisorAccount } from 'react-icons/md';
import { FaTrophy, FaCog } from 'react-icons/fa';

import './Sidebar.css';

export default function ProgramaticSidebar(props) {

  const league = props.league;

  const [visibleLeft, setVisibleLeft] = useState(false);

  const menuStyle = {
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    overflowX: 'hidden',
    height: '100%',
    padding: ' 0px 25px',
    width: 'fit-content'
  }

  const menuStyle2 = {
    height:'100%', 
    position:'fixed',
    overflowX: 'hidden',
    border: 0,
    zIndex: 1,
    width: '200px',
    backdropFilter: 'blur(50%)',
    backgroundColor: 'rgb(152,152,242, 0.25)'
  }

  let activeStyle = { color: '#b41b5a', marginBottom:'15px', width: '100%', fontWeight:'600' };
  let inactiveStyle = { marginBottom:'15px', width: '100%', fontWeight:'600' };
  let iconStyle = { fontSize:'1.2em', marginRight: '15px'}

  const items = [
    {
      label: `${league.properties.title}`, 

      template: (item, options) => {
        return (
          <div style={{height:'100px', display:'flex', alignItems:'stretch', justifyContent:'flex-end'}}>
          <NavLink to="" end className={options.className} style={({ isActive }) => isActive ? activeStyle : inactiveStyle } >
              {item.icon}
              {item.label}
          </NavLink>
          </div>
        );
      }
    },
    {
      label: 'Members', 
      icon: <MdSupervisorAccount style={iconStyle} />,
      template: (item, options) => {
        return (
          <NavLink to="members" className={options.className} style={ ({ isActive }) => isActive ? activeStyle : inactiveStyle }>
              {item.icon}
              {item.label}
          </NavLink>
        );
      }
    },
    {
      label: 'Series', 
      icon: <MdOutlineAccountTree style={iconStyle}/>,
      template: (item, options) => {
        return (
          <NavLink to="series" className={options.className} style={({ isActive }) => isActive ? activeStyle : inactiveStyle } >
                {item.icon}
                {item.label}
          </NavLink>
        );
      }
    },
    {
      label: 'Events', 
      icon: <MdOutlineEvent style={iconStyle}/>,
      template: (item, options) => {
        return (
          <NavLink to="events" className={options.className} style={({ isActive }) => isActive ? activeStyle : inactiveStyle } >
                {item.icon}
                {item.label}
          </NavLink>
        );
      }
    },
    {
      label: 'Results', 
      icon: <FaTrophy style={iconStyle}/>,
      template: (item, options) => {
        return (
          <NavLink to="results" className={options.className} style={({ isActive }) => isActive ? activeStyle : inactiveStyle } >
                {item.icon}
                {item.label}
          </NavLink>
        );
      }
    },
    {
      label: 'Messages', 
      icon: <MdChatBubble style={iconStyle}/>,
      template: (item, options) => {
        return (
          <NavLink to="notifications" className={options.className} style={({ isActive }) => isActive ? activeStyle : inactiveStyle }>
            {item.icon}
            {item.label}
          </NavLink>
        );
      }
    },
    {
      label: 'Analytics', 
      icon: <MdBarChart style={iconStyle}/>,
      template: (item, options) => {
        return (
          <NavLink to="analytics" className={options.className} style={({ isActive }) => isActive ? activeStyle : inactiveStyle }>
            {item.icon}
            {item.label}
          </NavLink>
        );
      }
    },
    {
      label: 'Settings', 
      icon: <FaCog style={iconStyle}/>,
      template: (item, options) => {
        return (
          <NavLink to="settings" className={options.className} style={({ isActive }) => isActive ? activeStyle : inactiveStyle }>
            {item.icon}
            {item.label}
          </NavLink>
        );
      }
    }
  ];

  return (
    <>

      <Sidebar visible={visibleLeft} onHide={() => setVisibleLeft(false)} className="prog_sidebar" style={{width:'fit-content'}}>
        <Menu model={items} style={menuStyle}/>
      </Sidebar>

      <Button icon="pi pi-arrow-right" onClick={() => setVisibleLeft(true)} className="prog_sidebar_btn"/>


    </>
  )
};

{/*      <div style={{backgroundColor:'#333943'}}>
        <Menu model={items} style={menuStyle}/>
      </div>*/}
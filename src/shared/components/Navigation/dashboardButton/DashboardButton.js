import React from "react";
import { useNavigate } from "react-router-dom";

import { Button } from 'primereact/button';
import { MdAdminPanelSettings } from 'react-icons/md';

export default function DashboardButton(props) {
  const league = props.league;
  const leagueId = league._id;

  let navigate = useNavigate();

  function goToDashboard () { 
    navigate(`/leagues/${leagueId}/dashboard`, { replace: true }) 
  };

  return <Button 
          label="Dashboard" 
          onClick={goToDashboard} 
          icon={<MdAdminPanelSettings 
          style={{fontSize:'1.5em'}}/>}
          className="p-button-outlined p-button-help"
          />
};
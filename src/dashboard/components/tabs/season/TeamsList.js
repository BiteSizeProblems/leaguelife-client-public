import React, { useState } from "react";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from "primereact/avatar";

import { DUMMY_TEAMS } from "../../../../shared/data/DUMMY_DATA";

import TeamIconTemplate from "../../../../shared/components/templates/TeamIconTemplate";

import alfaromeo from '../../../../shared/images/team_icons/alfaromeo.jpg';
import alphatauri from '../../../../shared/images/team_icons/alphatauri.jpg';
import alpine from '../../../../shared/images/team_icons/alpine.png';
import astonmartin from '../../../../shared/images/team_icons/astonmartin.png';
import ferrari from '../../../../shared/images/team_icons/ferrari.jpg';
import haas from '../../../../shared/images/team_icons/haas.png';
import mclaren from '../../../../shared/images/team_icons/mclaren.png';
import mercedes from '../../../../shared/images/team_icons/mercedes.jpg';
import redbull from '../../../../shared/images/team_icons/redbull.jpg';
import williams from '../../../../shared/images/team_icons/williams.jpg';

export default function TeamsList(props) {
 const drivers = props.drivers;

 const [loadedTeams, setLoadedTeams] = useState(getTeams());

 function getTeams() {
  var holder = {};

  drivers.forEach(function(d) {

    if (d.role === "Full-Time") {
      if (holder.hasOwnProperty(d.team)) {
        holder[d.team] = holder[d.team] + " , " + d.username;
      } else {
        holder[d.team] = d.username;
      }
    }
  }); 

  var teams = [];

  for (var prop in holder) {
    teams.push({ team: prop, drivers: holder[prop] });
  };

  return teams;
 };

  const teamNameTemplate = (option) => { return <TeamIconTemplate team={option}/> };

  return (
    <DataTable value={loadedTeams} sortField="startDate" sortOrder={1} dataKey="id" >
      <Column field="team" body={teamNameTemplate} header="Team" sortable /> 
      <Column field="drivers" header="Drivers" />
    </DataTable>
  );
};
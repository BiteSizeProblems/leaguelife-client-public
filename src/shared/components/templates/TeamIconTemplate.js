import React from "react";

import { Avatar } from "primereact/avatar";

import { DUMMY_TEAMS } from "../../data/DUMMY_DATA";

import alfaromeo from '../../images/team_icons/alfaromeo.jpg';
import alphatauri from '../../images/team_icons/alphatauri.jpg';
import alpine from '../../images/team_icons/alpine.png';
import astonmartin from '../../images/team_icons/astonmartin.png';
import ferrari from '../../images/team_icons/ferrari.jpg';
import haas from '../../images/team_icons/haas.png';
import mclaren from '../../images/team_icons/mclaren.png';
import mercedes from '../../images/team_icons/mercedes.jpg';
import redbull from '../../images/team_icons/redbull.jpg';
import williams from '../../images/team_icons/williams.jpg';
import { Divider } from "primereact/divider";

export default function TeamIconTemplate(props) {
  //console.log(props);

  if (props.team || props.label) {

    const team = props.team;
    const teamName = team.team;
    const label = props.label;

    const propType = typeof team;

    let icon;
    if(propType === 'object') {
      switch(teamName) {
        case 'Alfa Romeo':
          icon = alfaromeo
          break;
        case 'McLaren':
          icon = mclaren
          break;
        case 'Ferrari':
            icon = ferrari
            break;
        case 'Red Bull Racing':
            icon = redbull
            break;
        case 'Mercedes':
            icon = mercedes
            break;
        case 'Alpine':
            icon = alpine
            break;
        case 'Haas':
            icon = haas
            break;
        case 'AlphaTauri':
            icon = alphatauri
            break;
        case 'Aston Martin':
            icon = astonmartin
            break;
        case 'Williams':
            icon = williams
            break;
        default:
          icon = undefined
      }

      return (
        <div>
    
          <Avatar 
            image={icon} 
            shape="circle" 
            imageAlt={teamName}
            style={{ verticalAlign: 'middle', marginRight:'10px' }} 
            />
    
          <span className="image-text" >
              {teamName}
          </span>
    
        </div>
      );

    } else {
      switch(team) {
        case 'Alfa Romeo':
          icon = alfaromeo
          break;
        case 'McLaren':
          icon = mclaren
          break;
        case 'Ferrari':
            icon = ferrari
            break;
        case 'Red Bull Racing':
            icon = redbull
            break;
        case 'Mercedes':
            icon = mercedes
            break;
        case 'Alpine':
            icon = alpine
            break;
        case 'Haas':
            icon = haas
            break;
        case 'AlphaTauri':
            icon = alphatauri
            break;
        case 'Aston Martin':
            icon = astonmartin
            break;
        case 'Williams':
            icon = williams
            break;
        default:
          icon = undefined
      }

      return (
        <div>

          <Divider style={{margin:5}} />

          <Avatar 
            image={icon} 
            shape="circle" 
            imageAlt={team}
            style={{ verticalAlign: 'middle', marginRight:'5px' }} 
            />

          <span className="image-text" >
              {label}
          </span>
    
        </div>
      );

    };

  } else {
    return (
      <div>

      </div>
    )
  }
};
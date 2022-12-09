import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { FaSave } from "react-icons/fa";

import TeamIconTemplate from "../../../../shared/components/templates/TeamIconTemplate";

import { ManageDrivers } from "../../../../shared/components/templates/ManageDrivers";

import { DUMMY_TEAMS, DUMMY_DRIVER_ROLES } from "../../../../shared/data/DUMMY_DATA";

export default function DriversList(props) {
  const { sendRequest } = useHttpClient();
  let navigate = useNavigate();
  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;
  const divisionId = useParams().did;

  const season = props.season;
  const seasonId = season.id;

  const [loadedDrivers, setLoadedDrivers] = useState(props.drivers);

  const division = props.division;

  const manageDriversHandler = async (props) => {
    try {
        await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/drivers`, 
            'PATCH', 
            JSON.stringify({ drivers: props }),
            { 'Content-Type': 'application/json' }
        );
        navigate(0);
    } catch (err) {}
  };

  function updateDrivers () {
    const driversUpdateHandler = async event => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/update-drivers`, 
              'PATCH', 
              JSON.stringify({ drivers: loadedDrivers }),
              { 'Content-Type': 'application/json' }
          );
          navigate(0);
      } catch (err) {}
    };
    driversUpdateHandler();
  };

  

  const AddDrivers = () => {
    let existingDrivers = loadedDrivers;
    let existingDriverIds = existingDrivers.map(driver => driver._id);

    let availableDrivers = division.drivers.filter(
      parentDriver => !existingDriverIds.includes(parentDriver._id)
    );

    existingDrivers = existingDrivers.map((driver) => {
      return {
        _id: driver._id,
        username: driver.username,
        role: driver.role,
        team: driver.team
      }
    })

    availableDrivers = availableDrivers.map((driver) => {
      return {
        _id: driver._id,
        username: driver.properties.username,
        role: driver.role,
        team: driver.team
      }
    });

    const handleCallback = (childData) => { manageDriversHandler(childData.target); }

    return (
      <div>
        <ManageDrivers 
              eventName={season.properties.title} 
              available={availableDrivers} 
              existing={existingDrivers} 
              parentCallback={handleCallback} 
              />
      </div>
    )
  }

  const SaveDrivers = () => {

    const handleSave = async () => {
      console.log(loadedDrivers);
    }

    return <Button icon={<FaSave/>} className="p-button-rounded p-button-warning" onClick={updateDrivers}/>
  }

  const header = (
    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
      <div>
        <AddDrivers />
      </div>
      <div>
        <SaveDrivers />
      </div>
    </div>
  )

  const onRowEditComplete = (e) => {
    let _loadedDrivers = [...loadedDrivers];
    let { newData, index } = e;

    _loadedDrivers[index] = newData;

    setLoadedDrivers(_loadedDrivers);

    //updateDriver(newData);
  };

  const teamNameTemplate = (option) => { return <TeamIconTemplate team={option}/> };

  const roleBodyTemplate = (option) => { 
    let role, color;
    switch(option.role) {
      case 'Full-Time':
        role = 'FT'
        color = '#54D5E1'
        break;
      case 'Reserve':
        role = 'R'
        color = '#beab6e'
        break;
      case 'Inactive':
        role = 'IN'
        color = '#8f8f8f'
        break;
      case 'Pending':
        role = '...'
        color = '#ebff57'
        break;
      default:
        role = '?'
        color = '#8f8f8f'
    }
    return <Avatar label={role} className="mr-2" style={{ backgroundColor: color, color: '#ffffff' }} shape="circle" />
  };

  const teamsEditor = (options) => {
      return (
          <Dropdown value={options.value} options={DUMMY_TEAMS} optionLabel="name" optionValue="name"
              onChange={(e) => options.editorCallback(e.value)} placeholder="Assign to Team"
              itemTemplate={(option) => { return <span>{option.name}</span> }} />
      );
  };

  const rolesEditor = (options) => {
      return (
          <Dropdown value={options.value} options={DUMMY_DRIVER_ROLES} optionLabel="label" optionValue="value"
              onChange={(e) => options.editorCallback(e.value)} placeholder="Assign a role"
              itemTemplate={(option) => { return <span>{option.label}</span> }} />
      );
  };

  const actionsEditor = (options) => {
    let driverId = options.rowData._id;
    let index = options.rowIndex;

    const setDrivers = async event => {
      let _loadedDrivers = [...loadedDrivers];
      _loadedDrivers.splice(index, 1);
      setLoadedDrivers(_loadedDrivers);
    };

    const confirmDelete = (event) => {
      confirmPopup({
          target: event.currentTarget,
          message: 'Do you want to delete this driver?',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger',
          accept: () => handleRowDriverDelete()
      });
    };

    const handleRowDriverDelete = async event => {
      console.log("handling driver removal...")
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/remove-driver/${driverId}`, 
              'PATCH'
          );
            await setDrivers();
            navigate(0);
      } catch (err) {}
    };

    return (
      <div>
        <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" 
                aria-label="Cancel" onClick={confirmDelete} label='Delete'/>
        <ConfirmPopup />
      </div>
    )
  };

  return (
            <DataTable value={loadedDrivers} dataKey="id" header={header} 
                 size='small' responsiveLayout="stack" editMode="row" onRowEditComplete={onRowEditComplete}>

              <Column field="username" header="Username" sortable />
              <Column field="role" header="Role" body={roleBodyTemplate} editor={(options) => rolesEditor(options)} sortable />
              <Column field="team" header="Team" body={teamNameTemplate} editor={(options) => teamsEditor(options)} sortable />
              <Column field="races" header="Races" sortable />
              <Column editor={(options) => actionsEditor(options)} />
              <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
              
            </DataTable>
  );
};
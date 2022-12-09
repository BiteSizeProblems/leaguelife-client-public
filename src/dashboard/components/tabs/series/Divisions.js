import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import { Create as CreateDivision} from "../../modals/division/Create";
import { Delete } from "../../modals/division/Delete";
import { Create as CreateSeason} from "../../modals/season/Create";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from "primereact/dropdown";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

import { ManageDrivers } from "../../../../shared/components/templates/ManageDrivers";

export default function Divisions(props) {
  const { sendRequest } = useHttpClient();
  let navigate = useNavigate();
  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;

  const parentSeries = props.series;
  const [loadedDivisions, setLoadedDivisions] = useState(props.divisions);

  const leftContents = (
    <div style={{ width:'15rem' }}>
      <CreateDivision series={parentSeries}/>
    </div>
  );

  const onDivisionEditComplete = (e) => {
    let _loadedDivisions = [...loadedDivisions];
    let { newData, index } = e;

    _loadedDivisions[index] = newData;

    setLoadedDivisions(_loadedDivisions);

    let divisionId = newData.id;

    const updateDivisionHandler = async () => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}`, 
              'PATCH', 
              JSON.stringify({ division: newData }),
              { 'Content-Type': 'application/json' }
          );
      } catch (err) {}
    }

    updateDivisionHandler();
  };

  const seasonBodyTemplate = (props) => { 
    let divisionId = props.id;

    const handleSeasonSelected = (e) => {
      let seasonId = e._id;
      navigate(`/leagues/${leagueId}/dashboard/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}`, { replace: true })
    };

    return <Dropdown value={props} options={props.seasons} optionLabel='properties.title' filter onChange={(e) => handleSeasonSelected(e.value)} placeholder="View a season"/>
  };

  const driversTemplate = (props) => { return <p>{props.drivers.length}</p> };
  
  const divisionDriversEditor = (options) => {
    const division = options.rowData;

    let existingDrivers = division.drivers;
    let existingDriverIds = existingDrivers.map(driver => driver._id);

    let availableDrivers = parentSeries.drivers.filter(
      parentDriver => !existingDriverIds.includes(parentDriver._id)
    );

    existingDrivers = existingDrivers.map((driver) => {
      return {
        _id: driver._id,
        username: driver.properties.username,
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

    const handleCallback = (childData) => { manageDivisionDrivers(childData.target); }

    const manageDivisionDrivers = async (props) => {
      try {
        await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${division.id}/drivers`, 
            'PATCH', 
            JSON.stringify({ drivers: props.map(driver => driver._id) }),
            { 'Content-Type': 'application/json' }
        );
      } catch (err) {}
      navigate(0);
    }

    return (
      <ManageDrivers 
        eventName={division.title} 
        available={availableDrivers} 
        existing={existingDrivers} 
        parentCallback={handleCallback} 
        />
    )
  }

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} 
    onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const addSeason = (options) => { return <CreateSeason division={options.rowData}/> };

  const actionsEditor = (options) => {
    let divisionId = options.rowData.id;
    let index = options.rowIndex;

    const setDivisions = async event => {
      let _loadedDivisions = [...loadedDivisions];
      _loadedDivisions.splice(index, 1);
      setLoadedDivisions(_loadedDivisions);
    };

    const confirmDelete = (event) => {
      confirmPopup({
          target: event.currentTarget,
          message: 'Do you want to delete this division?',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger',
          accept: () => handleRowDriverDelete()
      });
    };

    const handleRowDriverDelete = async event => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}`, 
              'DELETE'
          );
            await setDivisions();
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
      <DataTable  value={loadedDivisions} responsiveLayout="stack" header={<Toolbar left={leftContents} />} dataKey="id" size='small'
                  editMode="row" onRowEditComplete={onDivisionEditComplete}>
                    
          <Column field="title" header="Division" editor={(options) => textEditor(options)} />
          <Column field="description" header="Description" editor={(options) => textEditor(options)} />
          <Column field="seasons" header="Seasons" body={seasonBodyTemplate} editor={(options) => addSeason(options)}/>
          <Column field="drivers" header="Drivers" body={driversTemplate} editor={(options) => divisionDriversEditor(options)}/>
          <Column rowEditor />
          <Column editor={(options) => actionsEditor(options)} />

      </DataTable>
  );
};
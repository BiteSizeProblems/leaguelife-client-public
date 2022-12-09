import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import { Create as CreateDivision} from "../../modals/division/Create";
import { Delete } from "../../modals/division/Delete";
import { Create as CreateSeason} from "../../modals/season/Create";

import { FaRegAddressCard, FaSave, FaPlus } from 'react-icons/fa';

import { Panel } from 'primereact/panel';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from "primereact/dropdown";

import { DUMMY_EVENT_STATUS } from "../../../../shared/data/DUMMY_DATA";

export default function Seasons(props) {
  const { sendRequest } = useHttpClient();
  let navigate = useNavigate();
  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;

  const series = props.series;
  const [loadedSeasons, setLoadedSeasons] = useState(props.seasons);

  const leftContents = (
    <React.Fragment>

    </React.Fragment>
  );

  // Season can add drivers from division
  
  const rightContents = (
      <React.Fragment>
        <Button icon={<FaSave />} className="p-button-link" />
      </React.Fragment>
  );

  const onSeasonEditComplete = (e) => {
    let _loadedSeasons = [...loadedSeasons];
    let { newData, index } = e;

    _loadedSeasons[index] = newData;

    setLoadedSeasons(_loadedSeasons);

    let seasonId = newData.id;
    let divisionId = newData.division.id;

    const updateSeasonHandler = async () => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}`, 
              'PATCH', 
              JSON.stringify({ season: newData }),
              { 'Content-Type': 'application/json' }
          );
      } catch (err) {}
    };

    updateSeasonHandler();
  };

  // <---------------------------

  const titleBodyTemplate = (season) => {
    let division = season.division.properties.title;
    let divisionId = season.division.id;
    let seasonId = season.id;

    const onViewSeasonClick = () => {
      navigate(`/leagues/${leagueId}/dashboard/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}`, { replace: true })
    };

    let customTitle = `${division}: Season ${season.title}`;

    return <Button label={customTitle} className="p-button-link" onClick={onViewSeasonClick} />
  };

  // <-------------------------

  const driversTemplate = (props) => { return <p>{props.drivers.length}</p> };

  const seasonDriversEditor = (options) => {

    //let seasonDrivers = options.value;
    //let divisionDrivers = options.rowData.division.refs.drivers;

    let seasonDrivers = options.value.map((sdriver) => {
      return {
        value: sdriver._id
      }
    });

    let divisionDrivers = options.rowData.division.refs.drivers.map((ddriver) => {
      return {
        label: ddriver.properties.username,
        value: ddriver._id
      }
    });

    return (
      <MultiSelect 
        display="chip"
        value={seasonDrivers} 
        options={ divisionDrivers } 
        //optionLabel="_id"
        onChange={(e) => options.editorCallback(e.value)} 
        placeholder="Select Drivers" 
        style={{ maxWidth: '8rem' }}
        selectedItemTemplate={selectedItemTemplate}
        maxSelectedLabels={5}
        filter
        showClear={true}
        />
    )
  };

  const recruitmentBodyTemplate = (season) => { return <Checkbox checked={season.isRecruiting}/> };

  const titleEditor = (options) => { 
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} showButtons buttonLayout="horizontal" step={1} placeholder={options.value}
            decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
  };
  
  const statusEditor = (options) => { 
    return <Dropdown value={options.value} options={DUMMY_EVENT_STATUS} optionLabel="label" optionValue="label" onChange={(e) => options.editorCallback(e.value)} placeholder="Select a Status"/>
  };
  
  const recruitmentEditor = (options) => { 
    return <Checkbox checked={options.value} onChange={(e) => options.editorCallback(e.value)}/>
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} 
    onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const selectedItemTemplate = (option) => {
    if(option !== undefined) {
      return (
        <p>{option.username}</p>
      )
    } else {
      <p></p>
    }
  };

  const seasonActionsTemplate = (division) => {
    const leagueId = division.league;
    const seriesId = division.series;
    const divisionId = division.id;

    const onViewDivisionClick = () => {
      navigate(`/leagues/${leagueId}/dashboard/series/${seriesId}/divisions/${divisionId}`, { replace: true })
    };

    return (
        <React.Fragment>
          <div className="row-actions-container">
            <Delete division={division}/>
          </div>
        </React.Fragment>
    );
  };

  return (
    <Panel>
      <h1>{`${series.properties.title}`}</h1>
      <DataTable  value={loadedSeasons} responsiveLayout="scroll" header={<Toolbar left={leftContents} right={rightContents} />} dataKey="id" size='small'
                  editMode="row" onRowEditComplete={onSeasonEditComplete}>      
          <Column field="title" header="Season" body={titleBodyTemplate} editor={(options) => titleEditor(options)}/>
          <Column field="status" header="Status" editor={(options) => statusEditor(options)}/>
          <Column field="isRecruiting" header="Recruiting" body={recruitmentBodyTemplate} editor={(options) => recruitmentEditor(options)}/>
          <Column field="events.length" header="Races" />
          <Column field="drivers" header="Drivers" body={driversTemplate} editor={(options) => seasonDriversEditor(options)} style={{ width: '10%', maxWidth: '8rem' }}/>
          <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
          <Column  body={seasonActionsTemplate} />

      </DataTable>
    </Panel>
  );
};
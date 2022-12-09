import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useHttpClient } from "../../../../../shared/hooks/http-hook";

import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from "primereact/dropdown";
import { Create } from "../../../modals/events/Create";
import { Calendar } from 'primereact/calendar';

import { Delete } from "../../../modals/events/Delete";
import { ManageDrivers } from "../../../../../shared/components/templates/ManageDrivers";
import { DUMMY_TRACKS, DUMMY_EVENT_STATUS } from "../../../../../shared/data/DUMMY_DATA";

import { AiOutlineCheckCircle, AiOutlineEllipsis } from 'react-icons/ai';
import { Avatar } from 'primereact/avatar';

export default function EventsList (props) {
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const season = props.season;
  const [events, setEvents] = useState(props.events);

  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;
  const divisionId = useParams().did;
  const seasonId = useParams().seid;

  const toolbarLeftContents = ( <Create season={season}/> );

  const rowIndexTemplate = (rowData, props) => { 
    let index = parseInt(props.rowIndex + 1, 10); 
    return <Avatar label={`R${index}`} className="mr-2" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} shape="circle" />
  };

  const statusTemplate = (event) => {
    if (event.status === "complete") {
      return <Avatar icon={<AiOutlineCheckCircle style={{fontSize:'2em'}}/>} className="mr-2" style={{ backgroundColor: 'green'}} shape="circle" />
    } else {
      return <Avatar icon={<AiOutlineEllipsis style={{fontSize:'2em'}}/>} className="mr-2" style={{ backgroundColor: 'gray'}} shape="circle" />
    }
  }

  const dateTemplate = (event) => { 
    let date = new Date(event.start);
    date = date.toISOString().split('T')[0]
    return <p>{date}</p>
  };

  const optionsBodyTemplate = (event) => { 
    let selectedEvent = event.rowData;

    let existingDrivers = selectedEvent.drivers;
    let existingDriverIds = existingDrivers.map(driver => driver._id);

    let availableDrivers = season.drivers.filter(
      parentDriver => !existingDriverIds.includes(parentDriver._id));

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
        username: driver.username,
        role: driver.role,
        team: driver.team
      }
    });

    const updateEventDrivers = async () => {

      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/events/${selectedEvent.id}/drivers`, 
              'PATCH', 
              JSON.stringify({ drivers: selectedEvent.drivers }),
              { 'Content-Type': 'application/json' }
          );
          navigate(0);
      } catch (err) {}
    };

    const handleCallback = (childData) => {

      selectedEvent.drivers = childData.target;

      updateEventDrivers();

    }

    return (
      <div>
        <ManageDrivers eventName={selectedEvent.title} available={availableDrivers} existing={existingDrivers} parentCallback = {handleCallback} />
      </div>
    )
  };

  const driversTemplate = (event) => { return <p>{event.drivers.length}</p> };

  const onRowEditComplete = (e) => {
    let _events = [...events];
    let { newData, index } = e;

    _events[index].status = newData.status;
    _events[index].title = newData.title;
    _events[index].start = newData.start;
    _events[index].end = newData.end;

    setEvents(_events);

    const updateEventsHandler = async () => {

      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/events/${newData.id}`, 
              'PATCH', 
              JSON.stringify({ event: newData }),
              { 'Content-Type': 'application/json' }
          );
      } catch (err) {}
    }

    updateEventsHandler();
  };

  const statusEditor = (options) => { 
    return (
      <Dropdown value={options.value} options={DUMMY_EVENT_STATUS} optionLabel='label' optionValue='label' 
                onChange={(e) => options.editorCallback(e.value)} placeholder="Select a Status"/>
    ) 
  };

  const trackEditor = (options) => { return <Dropdown value={options.value} options={DUMMY_TRACKS} optionLabel='label' optionValue='label' onChange={(e) => options.editorCallback(e.value)} placeholder="Select a Circuit" filter showClear filterBy="label"/> };

  const dateEditor = (options) => { let date = new Date(options.value); return <Calendar value={date} onChange={(e) => options.editorCallback(e.value)} dateFormat="dd/mm/yy" placeholder={date} showTime /> };

  const actionsEditor = (event) => { return <Delete event={event.rowData}/> };

  return (
    <React.Fragment>

          <Toolbar left={toolbarLeftContents} />

          <DataTable 
            value={events} 
             size='small' responsiveLayout="stack"
            editMode="row" onRowEditComplete={onRowEditComplete} 
            >

            <Column field="Index" body={rowIndexTemplate} />
            <Column field="status" body={statusTemplate} header="Status" editor={(options) => statusEditor(options)} />
            <Column field="title" header="Circuit" editor={(options) => trackEditor(options)} />
            <Column field="start" header="Date" body={dateTemplate} 
                    editor={(options) => dateEditor(options)} />
            <Column field="drivers" header="# Drivers" body={driversTemplate} editor={(options) => optionsBodyTemplate(options)}/>
            <Column editor={(options) => actionsEditor(options)}/>
            <Column rowEditor bodyStyle={{ textAlign: 'center' }} />

          </DataTable>

    </React.Fragment>
  );
};
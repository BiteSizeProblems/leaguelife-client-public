import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useHttpClient } from "../../../shared/hooks/http-hook";

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list' // a plugin!

import { TabView, TabPanel } from 'primereact/tabview';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';

export default function EventCalendar(props) {
  const { sendRequest } = useHttpClient();

  const leagueId = useParams().leagueId;

  const [ loadedEvents, setLoadedEvents ] = useState();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const responseData = await sendRequest( `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/events` );
        setLoadedEvents(responseData.events.map((event) => {
          return {
            id: event.id,
            title: event.properties.title,
            start: event.properties.start,
            end: event.properties.end,
            status: event.properties.status,
            backgroundColor: event.properties.backgroundColor,
            drivers: event.drivers,
            refs: event.refs
          }
        }));
      } catch (err) {}
    };
    fetchEvents();
  }, [sendRequest, leagueId]);

 const dateTemplate = (event) => { 
  let date = new Date(event.start);
  return ( <Calendar value={date} disabled/> )
 };

 const driversTemplate = (event) => {
  return <p>{event.drivers.length}</p>
 };

  const newEventData = (eventData) => {
    return eventData.properties;
  };
  
  class EventsCalendar extends React.Component {
    
    render() {
      return (
        <FullCalendar
          plugins={[ dayGridPlugin, listPlugin ]}
          initialView="dayGridMonth"
          events={loadedEvents}
          timeZone='local'
          nextDayThreshold='09:00:00'
          eventDataTransform={newEventData}
          />
        )
      }
    }

  return (
    <React.Fragment>
      <Panel header="EVENTS">
        <TabView>

          <TabPanel header="List">
            <DataTable value={loadedEvents} scrollable sortField="start" sortOrder={1} size='small' >
              <Column field="status" header="Status" />
              <Column field="series" header="Series" />
              <Column field="season" header="Season" />
              <Column field="title" header="Track" />
              <Column field="start" header="Date" body={dateTemplate} />
              <Column field="drivers" header="# Drivers" body={driversTemplate} />
            </DataTable>
          </TabPanel>

          <TabPanel header="Calendar">
            <EventsCalendar />
          </TabPanel>

        </TabView>
      </Panel>
    </React.Fragment>
  );
};
import React from "react";

import EventsList from "./schedule/EventsList";
import EventsCalendar from './schedule/EventsCalendar';

import { TabView, TabPanel } from 'primereact/tabview';

export default function Schedule(props) {

  const season = props.season;
  const events = props.season.events.map((event) => {
    return {
      id: event.id,
      title: event.properties.title,
      start: event.properties.start,
      end: event.properties.end,
      status: event.properties.status,
      backgroundColor: event.properties.backgroundColor,
      halfPoints: event.properties.halfPoints,
      isSprint: event.properties.isSprint,
      drivers: event.drivers,
      league: event.league,
      season: event.season
    }
  });

  return (
      <TabView>

        <TabPanel header="List">
          <EventsList events={events} season={season}/>
        </TabPanel>

        <TabPanel header="Calendar">
          <EventsCalendar events={events}/>
        </TabPanel>
        
      </TabView>
  );
};
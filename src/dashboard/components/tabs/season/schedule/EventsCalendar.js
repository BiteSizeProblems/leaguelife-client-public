import React, { useState } from "react";

import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list' // a plugin!

export default function Schedule(props) {
  const events = props.events;

  const newEventData = (eventData) => { return eventData.properties };
  
  class EventsCalendar extends React.Component {
    
    render() {
      return (
        <FullCalendar
          plugins={[ dayGridPlugin, listPlugin ]}
          initialView="dayGridMonth"
          events={events}
          timeZone='local'
          nextDayThreshold='09:00:00'
          eventDataTransform={newEventData}
          />
        )
      }
    }

  if (props.events) {
    return <EventsCalendar /> 
  }
    
};
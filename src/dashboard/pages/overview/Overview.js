import React from "react";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import ErrorModal from "../../../shared/components/UIElements/errorModal/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/loadingSpinner/LoadingSpinner";
import { Card } from 'primereact/card';

const Overview = props => {
    const { isLoading, error, clearError } = useHttpClient();

    const loadedLeague = props.league;
    const loadedEvents = props.events;

    const eventDates = props.events.map((event) => {
      let date = new Date(event.properties.start).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
      return {
        track: event.properties.title,
        date: date
      };
    });

    let nextRace;
    if(eventDates.length > 0) {
      nextRace = `${eventDates[0].date} at ${eventDates[0].track}`
    } else {
      nextRace = 'No Upcoming Events'
    };

    let currentDate = new Date();

    let scheduledEvents = loadedEvents.filter(event => event.properties.start[0] > currentDate)

    if (isLoading) {
      return (
        <div className="center">
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {loadedLeague && (
          <div>

            <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
              <div>
                  <div className="font-medium text-3xl text-900">The Gravel Trap</div>
                  <div className="flex align-items-center text-800 flex-wrap">
                      <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-users mr-2"></i>
                          <span>{loadedLeague.members.length} Members</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-briefcase mr-2"></i>
                          <span>{loadedLeague.staff.length} Staff</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-globe mr-2"></i>
                          <span>{loadedLeague.series.length} Series</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-envelope mr-2"></i>
                          <span>{loadedLeague.events.length} Messages</span>
                      </div>
                      <div className="mr-5 flex align-items-center mt-3">
                          <i className="pi pi-calendar mr-2"></i>
                          <span>{scheduledEvents} Scheduled Events</span>
                      </div>
                      <div className="flex align-items-center mt-3">
                          <i className="pi pi-calendar mr-2"></i>
                          <span>Next Race: {nextRace}</span>
                      </div>
                  </div>
              </div>
            </div>

            <Card subTitle='RECENT WINNERS:' style={{margin:'2em'}}>Coming Soon...</Card>

            <Card subTitle='NEXT EVENT:' style={{margin:'2em'}} className='bg-pink-400 opacity-50'>Coming Soon...</Card>

            <Card subTitle='NEXT EVENT:' style={{margin:'2em'}} className='bg-bluegray-400'>Coming Soon...</Card>

          </div>
        )}
      </React.Fragment>
    );
};

export default Overview;
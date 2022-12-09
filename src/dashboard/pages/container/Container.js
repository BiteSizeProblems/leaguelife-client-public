import React, { useState, useEffect } from "react";
import { useParams, Route, Routes } from "react-router-dom";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { useAuth0 } from '@auth0/auth0-react';

import InConstruction from "../../../shared/components/templates/inConstruction/InConstruction";
import Sidebar from '../../components/navigation/sidebar/Sidebar';
import ProgramaticSidebar from "../../components/navigation/sidebar/ProgramaticSidebar";
import { Card } from "primereact/card";

import Overview from "../overview/Overview";
import {Settings} from "../settings/Settings";
import Members from "../members/Members";
import SeriesList from "../series/SeriesList";
import SeriesItem from "../series/SeriesItem";
import Season from "../season/Season";
import EventCalendar from "../events/EventCalendar";
import Notifications from "../notifications/Notifications";
import Loading from "../../../shared/components/pages/Loading";

import './Container.css';

export default function Container() {
  const { user } = useAuth0();
  let { leagueId } = useParams();
  const { isLoading, sendRequest } = useHttpClient();
  const [loadedLeague, setLoadedLeague] = useState();
  const [loadedEvents, setLoadedEvents] = useState();

  let userId = user.sub.replaceAll("|", "");

  useEffect(() => {
    const fetchLeague = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}`
        );
        setLoadedLeague(responseData.league);
        setLoadedEvents(responseData.events);
      } catch (err) {}
    };
    fetchLeague();
  }, [sendRequest, leagueId ]);

  if (isLoading) {
    return <Loading />;
  }

  if (loadedLeague && loadedLeague.staff.includes(userId)) {

    let dashboardRoutes = (
        <Routes>
          <Route path='/*' element={<Overview league={loadedLeague} events={loadedEvents}/>}/>
          <Route path='members' element={<Members league={loadedLeague}/>}/>
          <Route path='analytics' element={<InConstruction league={loadedLeague}/>}/>
          <Route path='settings' element={<Settings league={loadedLeague} userId={userId}/>}/>
          <Route path='series' element={<SeriesList league={loadedLeague}/>}/>
          <Route path='series/:sid' element={<SeriesItem league={loadedLeague}/>}/>
          <Route path='series/:sid/divisions/:did/seasons/:seid' element={<Season league={loadedLeague}/>}/>
          <Route path='events' element={<EventCalendar league={loadedLeague}/>}/>
          <Route path='results' element={<InConstruction/>}/>
          <Route path='notifications' element={<Notifications league={loadedLeague}/>}/>
          <Route path='feedback' element={<InConstruction/>}/>
        </Routes>
    )

    return (
      <div className='dashboard-container'>

        <ProgramaticSidebar leagueId={leagueId} league={loadedLeague} />
        <Sidebar leagueId={leagueId} league={loadedLeague} />

        <div className='dashboard-content'>
          {dashboardRoutes}
        </div>
          
      </div>
    )
  }
};
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from '../../../shared/hooks/http-hook';

import { Panel } from 'primereact/panel';
import { Fieldset } from 'primereact/fieldset';
import { TabView, TabPanel } from 'primereact/tabview';
import { BreadCrumb } from 'primereact/breadcrumb';

import Overview from "../../components/tabs/season/Overview";
import Schedule from "../../components/tabs/season/Schedule";
import DriversList from "../../components/tabs/season/DriversList";
import TeamsList from "../../components/tabs/season/TeamsList";
import ResultsList from "../../components/tabs/season/ResultsList";
import Standings from "../../components/tabs/season/Standings";
import IncidentsList from "../../components/tabs/season/IncidentsList";

import { MdOutlineAccountTree } from 'react-icons/md';

import './Season.css';

export default function Season() {
  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;
  const divisionId = useParams().did;
  const seasonId = useParams().seid;

  const { sendRequest } = useHttpClient();
  let navigate = useNavigate();
  
  const [seriesTitle, setSeriesTitle] = useState();
  const [loadedDivision, setLoadedDivision] = useState();
  const [loadedSeason, setLoadedSeason] = useState();

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const responseData = await sendRequest( `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}` );
        setSeriesTitle(responseData.series);
        setLoadedDivision(responseData.division);
        setLoadedSeason(responseData.season);
      } catch (err) {}
    };
    fetchSeason();
  }, [sendRequest, divisionId]);

  const SeasonTabHeader = () => {
    const homeUrl = `/leagues/${leagueId}/dashboard/series`;
    const seriesUrl = `/leagues/${leagueId}/dashboard/series/${seriesId}`;

    const home = { icon: () => <MdOutlineAccountTree /> , command:()=>{ navigate(homeUrl, { replace: true }) } }

    const items = [
      { label: `${seriesTitle}`, command:()=>{ navigate(seriesUrl, { replace: true }) } },
      { label: `${loadedDivision.properties.title}`},
      { label: `Season: ${loadedSeason.properties.identifier}`}
    ];

    return <BreadCrumb model={items} home={home}/>;
  }

  return (
    <div>
      {loadedSeason && loadedDivision &&(
        <div>
          <SeasonTabHeader />
          <br/>
          <Panel>
            <TabView>
              <TabPanel header="Overview" >
                <Overview division={loadedDivision} season={loadedSeason}/>
              </TabPanel>
              <TabPanel header="Schedule" >
                <Schedule season={loadedSeason} />
              </TabPanel>
              <TabPanel header="Drivers" >
                <DriversList drivers={loadedSeason.drivers} season={loadedSeason} division={loadedDivision}/>
              </TabPanel>
              <TabPanel header="Teams" >
                <TeamsList drivers={loadedSeason.drivers} season={loadedSeason}/> 
              </TabPanel>
              <TabPanel header="Results" >
                <ResultsList season={loadedSeason} />
              </TabPanel>
              <TabPanel header="Standings" >
                <Standings season={loadedSeason} />
              </TabPanel>
              <TabPanel header="Incidents" >
                <IncidentsList season={loadedSeason} />
              </TabPanel>
            </TabView>
          </Panel>
        </div>
        )}
    </div>
  );
}
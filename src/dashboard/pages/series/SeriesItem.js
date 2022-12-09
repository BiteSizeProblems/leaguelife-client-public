import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from '../../../shared/hooks/http-hook';

import { Panel } from "primereact/panel";
import { Fieldset } from "primereact/fieldset";
import { TabView, TabPanel } from 'primereact/tabview';
import { BreadCrumb } from 'primereact/breadcrumb';

import Overview from "../../components/tabs/series/Overview";
import Drivers from "../../components/tabs/series/Drivers";
import Divisions from "../../components/tabs/series/Divisions";
import Regulations from '../../components/tabs/series/Regulations';

import { MdOutlineAccountTree } from 'react-icons/md';

import './Series.css';

export default function SeriesItem() {
  const { sendRequest } = useHttpClient();
  let navigate = useNavigate();

  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;

  const [ loadedSeries, setLoadedSeries ] = useState();
  const [ loadedDivisions, setLoadedDivisions ] = useState();
  const [ loadedDrivers, setLoadedDrivers ] = useState();
  const [ leagueDrivers, setLeagueDrivers ] = useState();

  useEffect(() => {
    const fetchSeries = async () => {
        try {const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}`
          );
            setLoadedSeries(responseData.series);
            setLoadedDivisions(responseData.divisions);
            setLoadedDrivers(responseData.drivers);
            setLeagueDrivers(responseData.leagueDrivers);
        } catch (err) {} 
    };
    fetchSeries();
  }, [sendRequest, seriesId]);

  const SeriesTabHeader = () => {
    const homeUrl = `/leagues/${leagueId}/dashboard/series`;
    const seriesUrl = `/leagues/${leagueId}/dashboard/series/${seriesId}`;

    const home = { icon: () => <MdOutlineAccountTree /> , command:()=>{ navigate(homeUrl, { replace: true }) } }

    const items = [
      { label: `${loadedSeries.properties.title}`, command:()=>{ navigate(seriesUrl, { replace: true }) }}
    ];

    return <BreadCrumb model={items} home={home}/>;
  }

  return (
    <div className="tabpaneltest">
      {loadedSeries && (
        <div>
        <SeriesTabHeader />
        <br/>
        <Panel>
        <TabView>
          <TabPanel header="Overview" >
            <Overview series={loadedSeries}/>
          </TabPanel>
          <TabPanel header="Drivers" >
            <Drivers series={loadedSeries} drivers={loadedDrivers} leagueDrivers={leagueDrivers}/>
          </TabPanel>
          <TabPanel header="Divisions" >
            <Divisions series={loadedSeries} divisions={loadedDivisions}/>
          </TabPanel>
          <TabPanel header="Regulations" >
            <Regulations series={loadedSeries}/>
          </TabPanel>
        </TabView>
        </Panel>
        </div>
      )}
    </div>
  );
}
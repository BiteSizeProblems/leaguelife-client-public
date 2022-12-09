import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from '../../../shared/hooks/http-hook';

import { Fieldset } from "primereact/fieldset";
import { BreadCrumb } from 'primereact/breadcrumb';
import ErrorModal from "../../../shared/components/UIElements/errorModal/ErrorModal";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';

import { MdOutlineAccountTree } from 'react-icons/md';

import { Create as CreateSeries } from '../../components/modals/series/Create';
import { Delete as DeleteSeries } from '../../components/modals/series/Delete';

import './Series.css';

export default function SeriesList(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  let navigate = useNavigate();
  const [loadedSeries, setLoadedSeries] = useState();
  const [loadedDrivers, setLoadedDrivers] = useState();

  const leagueId = useParams().leagueId;

  const loadedLeague = props.league;

    useEffect(() => {
      const fetchSeries = async () => {
          try {const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series`);
              setLoadedSeries(responseData.seriesList);
          } catch (err) {} 
      };
      fetchSeries();
    }, [sendRequest, leagueId]);

    useEffect(() => {
      const fetchLeagueDrivers = async () => {
          try {
              const responseData = await sendRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/drivers`
              );
              setLoadedDrivers(responseData.drivers);
          } catch (err) {} 
      };
      fetchLeagueDrivers();
    }, [sendRequest, leagueId]);

    const SeriesHeader = () => {
      const home = { icon: () => <MdOutlineAccountTree /> , command:()=>{ navigate(`/leagues/${leagueId}/dashboard/series`, { replace: true }) } }

      return (
        <div style={{display:'flex', justifyContent:'space-between'}}>
        <BreadCrumb home={home}/>
        </div>
      );
    };

    const onSeriesEditComplete = (e) => {
      let _loadedSeries = [...loadedSeries];
      let { newData, index } = e;
  
      _loadedSeries[index] = newData;
  
      setLoadedSeries(_loadedSeries);
  
      let seriesId = newData.id;
  
      const updateSeriesHandler = async () => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}`, 
                'PATCH', 
                JSON.stringify({ series: newData }),
                { 'Content-Type': 'application/json' }
            );
        } catch (err) {}
      }
  
      updateSeriesHandler();
    };

    const textEditor = (options) => {
      return <InputText type="text" value={options.value} 
      onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const titleBodyTemplate = (props) => {
      let seriesId = props.id;

      const onViewSeriesClick = () => {
        navigate(`/leagues/${leagueId}/dashboard/series/${seriesId}`, { replace: true })
      };

      return <Button label={`${props.title}`} className="p-button-help p-button-text" onClick={onViewSeriesClick} />
    };

    const seriesDeleteTemplate = (options) => {
      return (
        <div className="row-actions-container">
          <DeleteSeries series={options.rowData}/>
        </div>
      );
    };

    return (
        <React.Fragment>
          <ErrorModal error={error} onClear={clearError} />
          {loadedSeries && (
            <div>
                <SeriesHeader />
                <br/>
                <DataTable value={loadedSeries} responsiveLayout="stack" dataKey="id" header={<CreateSeries/>}
                           editMode="row" onRowEditComplete={onSeriesEditComplete} style={{height:'65vh'}}>

                  <Column field="sim" header="Sim" sortable />
                  <Column field="title" header="Series" body={titleBodyTemplate} bodyStyle={{color:'#E513E2'}} editor={(options) => textEditor(options)}/>
                  <Column field="description" header="Description" editor={(options) => textEditor(options)}/>
                  <Column field="drivers.length" header="Drivers" /*body={driversTemplate}*/ />
                  <Column field="divisions.length" header="Divisions" />
                  <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
                  <Column editor={(options) => seriesDeleteTemplate(options)} />

                </DataTable>
            </div>
          )}
      </React.Fragment>
    );
}
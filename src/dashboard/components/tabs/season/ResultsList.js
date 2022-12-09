import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';

import { ClassificationEditor } from "../../modals/events/ClassificationEditor";
import { ResultsChart } from "../../modals/events/Chart";

export default function ResultsList(props) {
  const { sendRequest } = useHttpClient();
  
  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;
  const divisionId = useParams().did;

  const season = props.season;
  const seasonId = season.id;

  const completedEvents = season.events.filter(event => event.properties.status === "complete");

  const [loadedEvents, setLoadedEvents] = useState(completedEvents.map((event) => {
    return {
      id: event.id,
      title: event.properties.title,
      status: event.properties.status,
      start: event.properties.start,
      end: event.properties.end,
      backgroundColor: event.properties.backgroundColor,
      halfPoints: event.properties.halfPoints,
      isSprint: event.properties.isSprint,
      pole: event.summary.pole,
      fastestLap: event.summary.fastestLap,
      winner: event.summary.winner,
      league: event.league,
      season: event.season,
      drivers: event.drivers
    }
  }));

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
  const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

  const rowIndexTemplate = (rowData, props) => { let index = parseInt(props.rowIndex + 1, 10); return <span>{index}</span> };

  const dateTemplate = (event) => { 
    let date = new Date(event.start);
    date = date.toISOString().split('T')[0]
    return <p>{date}</p>
  };

  const reportTemplate = (event) => { 
    return ( 
      <div style={{display:'flex'}}>
        <ClassificationEditor event={event} />
        <ResultsChart event={event} drivers={event.drivers}/>
      </div>
    )
  };

  const [filters, setFilters] = useState(true);

  return (
            <DataTable value={loadedEvents} dataKey="id" responsiveLayout="stack" 
                 paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20]}
                 paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} filters={filters} filterDisplay="menu" alwaysShowPaginator={false}
                 size="small">

              <Column field="Index" header="" style={{ width: "2rem" }} body={rowIndexTemplate} />
              <Column field="title" header="Track" />
              <Column field="start" header="Date" body={dateTemplate} />
              <Column field="drivers.length" header="Drivers" />
              {/*<Column field="pole" header="Pole" />
              <Column field="winner" header="Winner" />
  <Column field="fastestLap" header="F-Lap" />*/}
              <Column body={reportTemplate} />

            </DataTable>
  );
}
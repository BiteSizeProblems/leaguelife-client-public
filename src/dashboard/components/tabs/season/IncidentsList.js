import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Avatar } from 'primereact/avatar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaTrophy, FaSave, FaTrashAlt } from 'react-icons/fa';
import { Dropdown } from "primereact/dropdown";

import { Create } from "../../modals/incidents/Create";

import { DUMMY_TEAMS, DUMMY_DRIVER_ROLES } from "../../../../shared/data/DUMMY_DATA";

import InConstruction from "../../../../shared/components/templates/inConstruction/InConstruction";

export default function IncidentsList(props) {
  const {isLoading, sendRequest } = useHttpClient();
  let navigate = useNavigate();
  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;
  const divisionId = useParams().did;
  const seasonId = useParams().seid;

  const season = props.season;

  const [loadedIncidents, setLoadedIncidents] = useState();

  /*useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/incidents`);
        setLoadedIncidents(responseData.incidents);
      } catch (err) {} 
    };
    fetchIncidents();
  }, [sendRequest, seasonId]);*/

  const updateIncidentHandler = async event => {
    navigate(0);
    try {
        await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/drivers/update`, 
            'PATCH', 
            JSON.stringify({ incidents: loadedIncidents }),
            { 'Content-Type': 'application/json' }
        );
    } catch (err) {}
  }

  const leftContents = (<Create season={season}/>);

  const rightContents = ( <Button icon={<FaSave />} onClick={updateIncidentHandler} /> );

   const actionsTemplate = (event) => {

    const removeIncidentHandler = (e) => {

      let _loadedIncidents = [...loadedIncidents];

        let { newData, index } = e;

        _loadedIncidents[index] = newData;

        setLoadedIncidents(_loadedIncidents);
    };

     return (
        <div className="row-actions-container">
          <FaTrashAlt onClick={removeIncidentHandler}/>
        </div>
     );
   };

    const onRowEditComplete = (e) => {
        let _loadedIncidents = [...loadedIncidents];
        let { newData, index } = e;

        _loadedIncidents[index] = newData;

        setLoadedIncidents(_loadedIncidents);
    };

    return <InConstruction style={{color:'white'}}/>;

  /*return (
    <React.Fragment>

            <Toolbar left={leftContents} right={rightContents}/>

            <DataTable value={loadedIncidents} sortField="username" sortOrder={1} dataKey="id"
                 size='small' responsiveLayout="scroll" editMode="row" onRowEditComplete={onRowEditComplete}>

              <Column field="submitter" header="Submitted By" sortable />
              <Column field="round" header="Round" sortable />
              <Column field="lap" header="Lap" />
              <Column field="description" header="Description" sortable />
              <Column field="offenderType" header="Offender Type" sortable />
              <Column field="offender" header="Offender" sortable />
              <Column field="evidence" header="Evidence" sortable />
              <Column field="resolved" header="Resolved" sortable />
              <Column field="outcome" header="Outcome" sortable />
              <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
              <Column body={actionsTemplate} />

            </DataTable>

    </React.Fragment>
  );*/
};
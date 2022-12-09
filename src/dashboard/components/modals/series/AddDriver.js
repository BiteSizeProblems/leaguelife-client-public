import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { GiFullMotorcycleHelmet } from 'react-icons/gi';
import '../ModalForms.css';

export const AddDrivers = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const {isLoading, sendRequest } = useHttpClient();
    const navigate = useNavigate();

    const leagueId = useParams().leagueId;
    const series = props.series;
    const seriesId = series.id;

    const [loadedDrivers, setLoadedDrivers] = useState({});
    const [selectedDrivers, setSelectedDrivers] = useState({});

    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    useEffect(() => {
     const fetchDrivers = async () => {
       try {
         const responseData = await sendRequest(
           `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/drivers`
         );
         setLoadedDrivers(responseData.drivers);
       } catch (err) {}
     };
     fetchDrivers();
   }, [sendRequest, leagueId ]);

   const addDriversHandler = async event => {
     navigate(0);
     try {
         await sendRequest(
             `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/drivers`, 
             'PATCH', 
             JSON.stringify({ drivers: selectedDrivers, series: seriesId }),
             { 'Content-Type': 'application/json' }
         );
     } catch (err) {}
   };

   const isSelectable = (value, field) => {
       let isSelectable = true;
       switch (field) {
           case 'quantity':
               isSelectable = value > 10;
               break;
           case 'name':
           case 'category':
               isSelectable = value.startsWith('B') || value.startsWith('A');
               break;

           default:
               break;
       }
       return isSelectable;
   };

    return (
        <div className="dialog-demo">
            <Button icon={<GiFullMotorcycleHelmet />} className="mr-2" onClick={() => onClick("displayBasic")} tooltip="Add Drivers" tooltipOptions={{position: 'top'}} disabled={props.disabledState}/>
              <Dialog header={`Add drivers to ${series.properties.title}`} visible={displayBasic} style={{ width: '55vw' }} onHide={() => onHide('displayBasic')}>
              <br/>
                 <DataTable value={loadedDrivers} selectionMode="multiple" dragSelection selection={selectedDrivers} onSelectionChange={e => setSelectedDrivers(e.value)} dataKey="id" responsiveLayout="scroll" size="small">
                    <Column field="properties.username" header="Username"></Column>
                  </DataTable>
                  <br/>
                  <div className="center">
                   <Button label="Add Drivers" type='submit' className="center" onClick={addDriversHandler}/>
                  </div>
                  <br/>
              </Dialog>
        </div>
    )
}
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectButton } from 'primereact/selectbutton';
import { FaReply, FaCircle } from 'react-icons/fa';

import { useHttpClient } from '../../../shared/hooks/http-hook';

export default function Notifications() {
  const { user, isAuthenticated } = useAuth0();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [sentNotifications, setSentNotifications] = useState();
  const [receivedNotifications, setReceivedNotifications] = useState();

  //let userId = user.sub.replaceAll("|", "");

  const leagueId = useParams().leagueId;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/notifications`);
        setSentNotifications(responseData.sent);
        setReceivedNotifications(responseData.received);
      } catch (err) {} 
    };
    fetchNotifications();
  }, [sendRequest, leagueId]);

  const readTemplate = (options) => {

    if ( options.read === false ) {
      return <FaCircle />
    } else {
      return <div></div>
    }
  };

  const actionsTemplate = (options) => {
    const notification = options;

    console.log(notification.applicationResponse)

    const denyApplicationHandler = async (e) => {
      try {
        await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/notifications/${notification.id}`, 
            'PATCH', 
            JSON.stringify({ originalMessage: notification, response: 'deny' }),
            { 'Content-Type': 'application/json' }
        );
      } catch (err) {}
    }

    const approveApplicationHandler = async (e) => {
      try {
        await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/notifications/${notification.id}`, 
            'PATCH', 
            JSON.stringify({ originalMessage: notification, response: 'approve' }),
            { 'Content-Type': 'application/json' }
        );
      } catch (err) {}
    }

     return (
        <div className="row-actions-container">
          <Button icon="pi pi-check" className="p-button-rounded p-button-text" aria-label="Submit" onClick={approveApplicationHandler} disabled={notification.applicationResponse === ''}/>
          <Button value="deny" icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel" onClick={denyApplicationHandler} disabled={notification.applicationResponse === ''}/>
        </div>
     );
  };

   const onReceivedRowEditComplete = (e) => {
    let _receivedNotifications = [...receivedNotifications];
    let { newData, index } = e;

    newData.read = true;

    _receivedNotifications[index] = newData;

    setReceivedNotifications(_receivedNotifications);
  };

  return (
    <Panel >
        <TabView style={{ height:'50%' }}>

          <TabPanel header="Inbox" >
            <DataTable value={receivedNotifications} sortField="createdAt" sortOrder={1} dataKey="id"
                 size='small' responsiveLayout="stack" style={{ height: '75vh' }}>

              <Column field="read" body={readTemplate} header="Status"sortable />
              <Column field="createdAt" header="Date" sortable />
              <Column field="title" header="Title" sortable />
              <Column field="subject" header="Subject" sortable />
              <Column field="content" header="Body" sortable />
              <Column body={actionsTemplate} />

            </DataTable>
          </TabPanel>

          <TabPanel header="Sent" >
            <DataTable value={sentNotifications} sortField="createdAt" sortOrder={1} dataKey="id"
                        responsiveLayout="stack" editMode="row" onRowEditComplete={onReceivedRowEditComplete} >

              <Column field="createdAt" header="Date" sortable />
              <Column field="title" header="Title" sortable />
              <Column field="subject" header="Subject" sortable />
              <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />

            </DataTable>
          </TabPanel>

        </TabView>
    </Panel>
  );
};
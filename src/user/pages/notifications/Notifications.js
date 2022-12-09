import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaReply, FaCircle } from 'react-icons/fa';
import { IoMailOpen } from 'react-icons/io5';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

import { useHttpClient } from '../../../shared/hooks/http-hook';

import '../UserPages.css';

export default function Notifications() {
  const { user } = useAuth0();
  const { sendRequest } = useHttpClient();
  const [sentNotifications, setSentNotifications] = useState();
  const [receivedNotifications, setReceivedNotifications] = useState();

  let userId = user.sub.replaceAll("|", "");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/notifications`);
        setSentNotifications(responseData.sent);
        setReceivedNotifications(responseData.received);
      } catch (err) {} 
    };
    fetchNotifications();
  }, [sendRequest, userId]);

  const readTemplate = (options) => {

    if ( options.read === false ) {
      return <FaCircle />
    } else {
      return <div></div>
    }
  };

  const dateTemplate = (options) => {

    const date = new Date(options.createdAt[0]).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})

    return date;
  };

  const actionsTemplate = (options) => {
    const notification = options;

    const acceptInvitationHandler = async (e) => {
      const response = "accepted";

      console.log("Accepting Invitation...");
      console.log(notification);

      try {
        await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/invitation-response`, 
            'POST', 
            JSON.stringify({ original: notification, response: response }),
            { 'Content-Type': 'application/json' }
        );
      } catch (err) {
        console.log('err', err);
      }
    };

    const declineInvitationHandler = async (e) => {
      const response = "declined";

      console.log("Declining Invitation...");
      console.log(notification);

      try {
        await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/invitation-response`, 
            'POST', 
            JSON.stringify({ original: notification, response: response }),
            { 'Content-Type': 'application/json' }
        );
      } catch (err) {
        console.log('err', err);
      }
    };

    const message = (
      <div>
        <p style={{fontWeight:'bold', color:'#9fdaa8'}}>Invited to join {notification.subject}</p>
      </div>
    );

    const icon = (<IoMailOpen />)

    const replyPopup = (event) => {
      confirmPopup({
          target: event.currentTarget,
          message: message,
          icon: icon,
          acceptLabel: 'Accept',
          rejectLabel: 'Decline',
          acceptClassName:'p-button-success p-button-text',
          rejectClassName:'p-button-danger p-button-text',
          accept: () => acceptInvitationHandler(),
          reject: () => declineInvitationHandler()
      });
    };

    return (
      <>
        <ConfirmPopup />
        <Button onClick={replyPopup} icon={<FaReply style={{marginRight:'5px'}}/>} className="p-button-success p-button-text"></Button>
      </>
      
    ) 
  };

   const onReceivedRowEditComplete = (e) => {
    let _receivedNotifications = [...receivedNotifications];
    let { newData, index } = e;

    newData.read = true;

    _receivedNotifications[index] = newData;

    setReceivedNotifications(_receivedNotifications);
  };

  return (
    <Card className='user-page-container' style={{width:'95%', display:'flex', justifyContent:'center', textAlign:'center'}} title="Messages">
        <TabView>

          <TabPanel header="Inbox">
            <DataTable value={receivedNotifications} sortField="createdAt" sortOrder={1} dataKey="id"
                 size='small' responsiveLayout="scroll" style={{height:'55vh', width:'75vw'}}>

              <Column field="read" body={readTemplate} header="Status"sortable />
              <Column field="createdAt" body={dateTemplate} header="Date" sortable />
              <Column field="title" header="Title" sortable />
              <Column field="subject" header="Subject" sortable />
              <Column body={actionsTemplate} />

            </DataTable>
          </TabPanel>

          <TabPanel header="Sent">
            <DataTable value={sentNotifications} sortField="createdAt" sortOrder={1} dataKey="id"
                        responsiveLayout="scroll" editMode="row" size='small' onRowEditComplete={onReceivedRowEditComplete} style={{height:'55vh', width:'75vw'}}>

              <Column field="createdAt" header="Date" sortable />
              <Column field="title" header="Title" sortable />
              <Column field="subject" header="Subject" sortable />
              <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />

            </DataTable>
          </TabPanel>

        </TabView>
    </Card>
  );
};
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { useHttpClient } from '../../shared/hooks/http-hook';

export default function IncidentReport() {
  const { user, isAuthenticated } = useAuth0();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedSeason, setLoadedSeason] = useState();

  let userId = user.sub.replaceAll("|", "");;

  const header = (
    <>
    <br/>
    <Avatar image="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png" label="Avatar" className="mr-2" size="xlarge" shape="circle" />
    <h5>Incident Report</h5>
    </>
  );
  const footer = (
      <span>
        <Button label="Cancel" icon="pi pi-times" className="p-button-secondary ml-2" disabled={true} style={{margin:'2%'}}/>
        <Button label="Save" icon="pi pi-check" disabled={true} style={{margin:'2%'}}/>
      </span>
  );

    useEffect(() => {
    const fetchDriver = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`);
      } catch (err) {} 
    };
    fetchDriver();
  }, [sendRequest, userId]);

  return (
    isAuthenticated && (
      <React.Fragment>
        <div className="center">
          <Card subTitle={user.nickname} style={{ width: "25em", marginTop:'5%' }} footer={footer} header={header} >

            <br/>

            <div className="field col-12 md:col-4">
              <span className="p-float-label p-input-icon-right">
                <InputText id="userId" value={userId} disabled={true}/>
                <label htmlFor="userId">Submitter</label>
              </span>
            </div>

            <br/>

            <div className="field col-12 md:col-4">
              <span className="p-float-label p-input-icon-right">
                <InputText id="name" disabled={true}/>
                <label htmlFor="name">Round</label>
              </span>
            </div>

            <br/>

            <div className="field col-12 md:col-4">
              <span className="p-float-label p-input-icon-right">
                <InputText id="username" value={user.nickname} disabled={true}/>
                <label htmlFor="username">Lap</label>
              </span>
            </div>

            <br/>

            <div className="field col-12 md:col-4">
              <span className="p-float-label p-input-icon-right">
                <InputText id="email" value={user.email} disabled={true}/>
                <label htmlFor="email">Description</label>
              </span>
            </div>

            <br/>

            <div className="field col-12 md:col-4">
              <span className="p-float-label p-input-icon-right">
                <InputText id="email" value={user.email} disabled={true}/>
                <label htmlFor="email">Offender Type</label>
              </span>
            </div>

            <br/>

            <div className="field col-12 md:col-4">
              <span className="p-float-label p-input-icon-right">
                <InputText id="email" value={user.email} disabled={true}/>
                <label htmlFor="email">Offender</label>
              </span>
            </div>

            <br/>

            <div className="field col-12 md:col-4">
              <span className="p-float-label p-input-icon-right">
                <InputText id="email" value={user.email} disabled={true}/>
                <label htmlFor="email">Evidence</label>
              </span>
            </div>

            <br/>

          </Card>
        </div>
      </React.Fragment>
    )
  );
};
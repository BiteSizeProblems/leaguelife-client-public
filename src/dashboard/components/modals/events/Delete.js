import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FaTrashAlt } from 'react-icons/fa';

import '../ModalForms.css';

export const Delete = (props) => {
    const {isLoading, sendRequest } = useHttpClient();
    const navigate = useNavigate();
    const leagueId = useParams().leagueId;
    const seriesId = useParams().sid;
    const divisionId = useParams().did;
    const seasonId = useParams().seid;
    
    const event = props.event;
    const eventId = event.id;

    const eventDeleteHandler = async event => {
      console.log("Deleting event...");
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/events/${eventId}`,
          'DELETE'
        );
        navigate(0);
      } catch (err) {}
    };

    const message = (
      <div>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>Are you sure? </p>
        <p>Confirming this message will:</p>
        <ul>
          <li>Permanently delete this event.</li>
          <li>Permanently delete it's results.</li>
        </ul>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>You cannot reverse this action.</p>
        <p style={{fontSize:'50%', color:'#8C8C8C'}}>* Actions taken following this message will have no effect on any associated discord accounts or servers.</p>
      </div>
    );

    const confirmDelete = () => {
      confirmDialog({
          message: message,
          header: `Delete ${event.title}?`,
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger p-button-text',
          accept: () => eventDeleteHandler()
      });
    };

    return (
        <div className="dialog-demo">
          <Button onClick={confirmDelete} className="p-button-danger p-button-text" icon={<FaTrashAlt style={{marginRight:'5px'}}/>} />
          <ConfirmDialog />
        </div>
    )
};
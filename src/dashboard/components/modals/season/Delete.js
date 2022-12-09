import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import '../ModalForms.css';

export const Delete = (props) => {
    const {isLoading, sendRequest } = useHttpClient();
    const navigate = useNavigate();
    const leagueId = useParams().leagueId;
    const seriesId = useParams().sid;
    const divisionId = useParams().did;
    const seasonId = useParams().seid;
    
    const season = props.season;

    const seasonDeleteHandler = async event => {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}`,
          'DELETE'
        );
        navigate(`/leagues/${leagueId}/dashboard/series/${seriesId}`, { replace: true });
      } catch (err) {}
    };

    const message = (
      <div>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>Are you sure? </p>
        <p>Confirming this message will:</p>
        <ul>
          <li>Permanently delete this season.</li>
          <li>Permanently delete any events within this season.</li>
        </ul>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>You cannot reverse this action.</p>
        <p style={{fontSize:'50%', color:'#8C8C8C'}}>* Actions taken following this message will have no effect on any associated discord accounts or servers.</p>
      </div>
    );

    const confirmDelete = () => {
      confirmDialog({
          message: message,
          header: `Delete ${season.properties.title}?`,
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger p-button-text',
          accept: () => seasonDeleteHandler()
      });
    };

    return (
        <div className="dialog-demo">
          <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel" onClick={confirmDelete} label='Delete this season' />
          <ConfirmDialog />
        </div>
    )
};
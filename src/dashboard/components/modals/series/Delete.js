import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FaTrashAlt } from 'react-icons/fa';

import '../ModalForms.css';

/*export const Delete = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const {isLoading, sendRequest } = useHttpClient();
    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    
    const series = props.items;

    const navigate = useNavigate();
    
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const deleteSeriesHandler = async event => {
      onHide('displayBasic');
      navigate(0);
      console.log("Deleting series...");
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/leagues/${series.league}/dashboard/series/${series.id}`,
          'DELETE'
        );
        onHide('displayBasic');
      } catch (err) {}
    }

    return (
        <div className="dialog-demo">
          <Button icon={<FaTrashAlt />} className="mr-2" onClick={() => onClick("displayBasic")} tooltip="Delete Series" tooltipOptions={{position: 'top'}} />
              <Dialog visible={displayBasic} style={{ width: '30rem', border: '2px solid red' }} onHide={() => onHide('displayBasic')} >
                <div>
                  <h3 className='center'>Delete {series.title}?</h3>
                  <br/>
                  <div className='center'>
                    <i className="pi pi-exclamation-triangle" style={{'fontSize': '5em', 'color': 'red'}}/>
                  </div>
                  <br/>
                  <h4 className='center'>Are you sure?</h4>
                  <p className='center'>You can't undo this action.</p>
                  <br/>
                  <div className="center">
                  <Button style={{marginRight:'2%'}} onClick={() => onHide('displayBasic')}>Cancel</Button>
                  <Button style={{marginLeft:'2%'}} onClick={deleteSeriesHandler} >Confirm</Button>
                  </div>
                </div>
              </Dialog>
        </div>
    )
}*/

export const Delete = (props) => {
    const { sendRequest } = useHttpClient();
    const navigate = useNavigate();
    const leagueId = useParams().leagueId;
    
    const series = props.series;

    const seriesDeleteHandler = async event => {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${series.id}`,
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
          <li>Permanently delete this series.</li>
          <li>Permanently delete any its divisions, seasons, and events.</li>
        </ul>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>You cannot reverse this action.</p>
        <p style={{fontSize:'50%', color:'#8C8C8C'}}>* Actions taken following this message will have no effect on any associated discord accounts or servers.</p>
      </div>
    );

    const confirmDelete = () => {
      confirmDialog({
          message: message,
          header: `Delete ${series.title}?`,
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger p-button-text',
          accept: () => seriesDeleteHandler()
      });
    };

    return (
        <div className="dialog-demo">
          <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel" onClick={confirmDelete} label='Delete this season' />
          <ConfirmDialog />
        </div>
    )
};
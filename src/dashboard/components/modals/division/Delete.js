import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { FaTrashAlt } from 'react-icons/fa';
import '../ModalForms.css';

 
export const Delete = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const {isLoading, sendRequest } = useHttpClient();
    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    
    const leagueId = useParams().leagueId;
    const division = props.division;
    const divisionId = division.id;

    const seriesId = division.series;

    const navigate = useNavigate();
    
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const deleteDivisionHandler = async event => {
      console.log("Deleting division...");
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}`,
          'DELETE'
        );
        navigate(0);
      } catch (err) {}
    }

    return (
        <div className="dialog-demo">
          <Button icon={<FaTrashAlt />} className="mr-2" onClick={() => onClick("displayBasic")} tooltip="Delete" tooltipOptions={{position: 'top'}} disabled={props.disabledState}/>
              <Dialog visible={displayBasic} style={{ width: '30rem', border: '2px solid red' }} onHide={() => onHide('displayBasic')}>
                <div>
                  <h3 className='center'>Delete {division.title}?</h3>
                  <br/>
                  <div className='center'>
                    <i className="pi pi-exclamation-triangle" style={{'fontSize': '5em', 'color': 'red'}}/>
                  </div>
                  <br/>
                  <h4 className='center'>Are you sure?</h4>
                  <p className='center'>You can't undo this action.</p>
                  <br/>
                  <div className="center">
                  <Button onClick={() => onHide('displayBasic')}>Cancel</Button>
                  <Button onClick={deleteDivisionHandler} >Confirm</Button>
                  </div>
                </div>
              </Dialog>
        </div>
    )
  }
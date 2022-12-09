import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FaTrashAlt } from 'react-icons/fa';
import '../ModalForms.css';

export const Remove = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const {isLoading, sendRequest } = useHttpClient();
    const dialogFuncMap = { 'displayBasic': setDisplayBasic };

    const leagueId = useParams().leagueId
    
    const drivers = props.drivers;

    const navigate = useNavigate();
    
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const removeDriversHandler = async event => {
      onHide('displayBasic');
      navigate(0);
      console.log("Removing drivers...");
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/drivers/remove`,
          'DELETE'
        );
        onHide('displayBasic');
      } catch (err) {}
    };

    return (
        <div className="dialog-demo">
          <Button className="action-button center" onClick={() => onClick('displayBasic')} icon={<FaTrashAlt />} />
              <Dialog visible={displayBasic} style={{ width: '30rem', border: '2px solid red' }} onHide={() => onHide('displayBasic')}>
                <div>
                  <h3 className='center'>remove all drivers?</h3>
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
                  <Button style={{marginLeft:'2%'}} onClick={removeDriversHandler} >Confirm</Button>
                  </div>
                </div>
              </Dialog>
        </div>
    )
}
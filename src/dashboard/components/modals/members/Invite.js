import React, { useState } from 'react';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FaUserPlus, FaShare, FaDiscord, FaLink } from 'react-icons/fa';
import { FiDownload } from 'react-icons/fi';

import '../ModalForms.css';

export const Invite = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const {isLoading, sendRequest } = useHttpClient();
    const dialogFuncMap = { 'displayBasic': setDisplayBasic };
    
    const series = props.items;
    
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    return (
        <div className="dialog-demo">
          <Button onClick={() => onClick('displayBasic')} icon={<FaUserPlus style={{ marginRight: '5px' }}/>} label='Invite' style={{ marginRight: '5px' }} />
              <Dialog visible={displayBasic} style={{ width: '30rem' }} onHide={() => onHide('displayBasic')} header='Invite a friend'>
               <div className='center' style={{ marginTop: '10%', marginBottom: '10%' }}>
                 <div style={{ marginLeft: '2%', marginRight: '3%' }}>
                  <Button icon={<FaShare />} />
                  <p style={{ fontSize:'small' }}>Share</p>
                 </div>
                 <div style={{ marginLeft: '3%', marginRight: '3%' }}>
                  <Button icon={<FaLink />} />
                  <p style={{ fontSize:'small' }}>Copy Link</p>
                 </div>
                 <div style={{ marginLeft: '3%', marginRight: '3%' }}>
                  <Button icon={<FaDiscord />} />
                  <p style={{ fontSize:'small' }} >Discord</p>
                 </div>
                 <div style={{ marginLeft: '3%', marginRight: '2%' }}>
                  <Button icon={<FiDownload />} />
                  <p style={{ fontSize:'small' }}>Import</p>
                 </div>
               </div>
              </Dialog>
        </div>
    )
};
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FaTrashAlt } from 'react-icons/fa';

export default function MembersList(props) {
  const { sendRequest } = useHttpClient();
  const leagueId = useParams().leagueId;
  const [loadedMembers, setLoadedMembers] = useState(props.members);
  const league = props.league;

  function updateMember (member) {

    const membersUpdateHandler = async event => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/member`, 
              'PATCH', 
              JSON.stringify({ member: member, leagueId: leagueId }),
              { 'Content-Type': 'application/json' }
          );
      } catch (err) {}
    };
    membersUpdateHandler();
  }

  const RemoveMemberDialog = (props) => {
    const { member } = props;
    const memberId = member.id;

    const setMembers = async event => {
      let _loadedMembers = [...loadedMembers];
      _loadedMembers = _loadedMembers.filter(member => member.id !== memberId);
      setLoadedMembers(_loadedMembers);
    };

    const removeMemberHandler = async event => {
      try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/members/${memberId}`, 
                'PATCH',
                JSON.stringify({ member: member }),
                { 'Content-Type': 'application/json' }
            );
              await setMembers();
        } catch (err) {}
    };

    const message = (
      <div>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>This action is not reversible.</p>
        <p style={{fontSize:'50%', color:'#8C8C8C'}}>* Actions taken following this message will have no effect on any associated discord accounts or servers.</p>
      </div>
    )

    const confirmRemove = () => {
      confirmDialog({
          message: message,
          header: `Remove ${member.username}?`,
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger',
          accept: () => removeMemberHandler()
      });
    };

    return (
      <>
        <Button icon="pi pi-times" onClick={confirmRemove} label="Remove" className="p-button-danger p-button-text"/>
        <ConfirmDialog />
      </>
    )
  };

  const avatarTemplate = (member) => {
    return (
        <React.Fragment>
            <Avatar image={member.avatar} shape="circle" imageAlt='N/A' onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} style={{ verticalAlign: 'middle', marginRight:'10px' }} />
            <span className="image-text" style={{color:'#E513E2'}}>{member.username}</span>
        </React.Fragment>
    );
  };

  const actionsTemplate = (option) => { 
    const memberId = option.id;

    if (memberId !== league.owner) { return <RemoveMemberDialog member={option}/> }
  };

  return (
    <DataTable value={loadedMembers} responsiveLayout="stack" dataKey="_id" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
      emptyMessage='Error: No Members Found.' alwaysShowPaginator={false}>

      <Column field="username" header="Username" body={avatarTemplate} sortable />
      <Column body={actionsTemplate} />
      
    </DataTable>
  );
  
}
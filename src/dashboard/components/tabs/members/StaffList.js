import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { MultiSelect } from "primereact/multiselect";

import { FaTrashAlt } from 'react-icons/fa';

export default function StaffList(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const leagueId = useParams().leagueId;
  const [loadedMembers, setLoadedMembers] = useState(props.members);
  const [loadedStaff, setLoadedStaff] = useState(props.staff);

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

  const avatarTemplate = (member) => {
    return (
        <React.Fragment>
            <Avatar image={member.avatar} shape="circle" imageAlt='N/A' onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} style={{ verticalAlign: 'middle', marginRight:'10px' }} />
            <span className="image-text" style={{color:'#E513E2'}}>{member.username}</span>
        </React.Fragment>
    );
  };

  const actionsEditor = (options) => {
    let memberId = options.rowData.id;
    let index = options.rowIndex;

    const setMembers = async event => {
      let _loadedMembers = [...loadedMembers];
      _loadedMembers.splice(index, 1);
      setLoadedMembers(_loadedMembers);
    };

    const handleRowMemberDelete = async event => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/remove-member/${memberId}`, 
              'DELETE'
          );
            await setMembers();
      } catch (err) {}
    };

    return <Button style={{ margin: '2%' }} icon={<FaTrashAlt />} onClick={handleRowMemberDelete} disabled={true}/>
  };

  const onRowEditComplete = (e) => {
    let _loadedMembers = [...loadedMembers];
    let { newData, index } = e;

    _loadedMembers[index] = newData;

    setLoadedMembers(_loadedMembers);

    updateMember(newData);
  };

  const staffMenuBar = () => {
    const items = [
      {
        label: 'Add & Remove Staff Members: ',
        disabled: true
      },
      {
        label: 'Add & Remove',
        template: (item, options) => {
          return (
            <div style={{display:'flex', alignItems:'center', width:'100%' }}>
              <MultiSelect value={loadedStaff} options={loadedMembers} onChange={(e) => setLoadedStaff(e.value)} 
                           optionLabel="username" placeholder="Select Staff" filter className="multiselect-custom" />
            </div>
          );
        }
      }
  ];
    return <Menubar model={items} />;
  }

  return (
    <DataTable value={loadedStaff} responsiveLayout="stack" dataKey="_id" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]} header={staffMenuBar}
      editMode="row" onRowEditComplete={onRowEditComplete} emptyMessage='No drivers found. Try creating or importing some.' alwaysShowPaginator={false}>

      <Column field="username" header="Username" body={avatarTemplate} sortable />
      <Column header="Permissions (Coming Soon...)" />
      <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
      <Column editor={(options) => actionsEditor(options)}/>

    </DataTable>
  );
  
}
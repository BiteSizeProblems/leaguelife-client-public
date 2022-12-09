import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from '../../../../shared/hooks/http-hook'

import { Menubar } from 'primereact/menubar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { FaDiscord } from 'react-icons/fa';
import { BiLink, BiUnlink } from 'react-icons/bi';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dropdown } from "primereact/dropdown";

import { Create } from "../../modals/drivers/Create";
import { ImportExcel } from "../../modals/drivers/ImportExcel";
import { ImportDiscord } from "../../modals/drivers/ImportDiscord";

export default function Drivers(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedDrivers, setLoadedDrivers] = useState(props.drivers);
  const [loadedMembers, setLoadedMembers] = useState(props.members);
  const leagueId = useParams().leagueId;

    function updateDriver (driver) {

      const driversUpdateHandler = async event => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/driver`, 
                'PATCH', 
                JSON.stringify({ driver: driver, leagueId: leagueId }),
                { 'Content-Type': 'application/json' }
            );
        } catch (err) {}
      };
      driversUpdateHandler();
    }

    const driverMenuBar = () => {
      const items = [
        {
          label: 'Create',
          icon: 'pi pi-fw pi-plus',
          template: (item, options) => {
            return (
                <Create item={item} options={options} members={loadedMembers}/>
            );
        }
        },
        {
            label: 'Import/Export',
            icon: 'pi pi-fw pi-file',
            items: [
                {
                    label: 'Import',
                    icon: 'pi pi-fw pi-plus',
                    items: [
                        {
                          label: 'Discord',
                          icon: <FaDiscord />,
                          template: (item, options) => {
                              return (
                                  <ImportDiscord item={item} options={options} leagueMembers={loadedMembers}/>
                              );
                          }
                        },
                        {
                          label: 'Excel',
                          icon: 'pi pi-fw pi-file-excel',
                          template: (item, options) => {
                              return (
                                <ImportExcel item={item} options={options} />
                              );
                          }
                        }
                    ]
                },
                {
                    separator: true
                },
                {
                    label: 'Export',
                    icon: 'pi pi-fw pi-external-link'
                }
            ]
        }
      ];
      return <Menubar model={items} />;
    }

    const linkTemplate = (option) => {
      if(option.link){
        return <BiLink style={{color:'green'}}/>
      } else {
        return <BiUnlink style={{color:'gray'}}/>
      }

    };

    const linkEditor = (options) => {
      const driver = options.rowData;
      return (
          <Dropdown value={options.value} options={loadedMembers} optionLabel="username"
              onChange={(e) => options.editorCallback(e.value)} placeholder="Link"
              itemTemplate={(option) => { return <span>{option.username}</span> }} 
              showClear={true} filter={true}/>
      );
    }

    const avatarTemplate = (driver) => {
        return (
            <React.Fragment>
                <Avatar image={driver.properties.avatar} shape="circle" imageAlt='N/A' onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} style={{ verticalAlign: 'middle', marginRight:'10px' }} />
                <span className="image-text" style={{color:'#E513E2'}}>{driver.properties.preferredName}</span>
            </React.Fragment>
        );
    };

    const tagsTemplate = (driver) => {
      let tagsChips = driver.tags.map((tag) => { 
        return ( <Chip key={`${driver.id}.${tag}`} label={tag} style={{marginRight:'5px', color:'#54D5E1', fontSize:'5px' }} /> )  
      });
        return ( tagsChips );
    };

    const tagsEditor = (options) => {
      let tagsChips = options.value.map((tag) => { 
        return ( <Chip label={tag} style={{marginRight:'5px', color:'#54D5E1', fontSize:'5px' }} removable={true}/> )  
      });
        return ( tagsChips );
    };

    const actionsEditor = (options) => {
      console.log(options);

      let driverId = options.rowData._id;
      let index = options.rowIndex;

      const setDrivers = async event => {
        let _loadedDrivers = [...loadedDrivers];
        _loadedDrivers.splice(index, 1);
        setLoadedDrivers(_loadedDrivers);
      };

      const confirmDelete = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this driver?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => handleRowDriverDelete()
        });
      };

      const handleRowDriverDelete = async event => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/remove-driver/${driverId}`, 
                'DELETE'
            );
              await setDrivers();
        } catch (err) {}
      };

      return (
        <div>
          <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" 
                  aria-label="Cancel" onClick={confirmDelete} label='Delete'/>
          <ConfirmPopup />
        </div>
      )
    };

    const onRowEditComplete = (e) => {
      let _loadedDrivers = [...loadedDrivers];
      let { newData, index } = e;

      _loadedDrivers[index] = newData;

      setLoadedDrivers(_loadedDrivers);

      updateDriver(newData);
    };

    return (
        <React.Fragment>

          {!isLoading && (
            <div className="datagrid-container">
                  <DataTable value={loadedDrivers} 
                              responsiveLayout="stack" breakpoint="960px" 
                              dataKey="_id" 
                              paginator currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={8} rowsPerPageOptions={[10,20,50]} alwaysShowPaginator={false}
                              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                              header={driverMenuBar} size='small'
                              editMode="row" onRowEditComplete={onRowEditComplete} 
                              emptyMessage='No drivers found. Try creating or importing some.' >
                    
                    <Column field="link" header="Link" body={linkTemplate} editor={(options) => linkEditor(options)}/>
                    <Column field="properties.preferredName" header="Username" body={avatarTemplate} sortable filter/>
                    <Column field="tags" header="Tags" body={tagsTemplate} sortable editor={(options) => tagsEditor(options)} filter/>
                    <Column field="refs.series.length" header="Series" sortable />
                    <Column editor={(options) => actionsEditor(options)}/>
                    <Column rowEditor />
                    

                  </DataTable>

            </div>
            )}
      </React.Fragment>
    );
  
}
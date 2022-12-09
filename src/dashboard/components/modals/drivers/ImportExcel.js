import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import readXlsxFile from 'read-excel-file';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputSwitch } from 'primereact/inputswitch';
import { MultiSelect } from 'primereact/multiselect';
import { Chips } from 'primereact/chips';
import { Chip } from 'primereact/chip';
import { Avatar } from 'primereact/avatar';
import { FaTrashAlt } from 'react-icons/fa';
import { DUMMY_LEAGUE_ROLES } from '../../../../shared/data/DUMMY_DATA';
import { classNames } from "primereact/utils";

import '../ModalForms.css';

export const ImportExcel = (props) => {
  const navigate = useNavigate();
    const [displayBasic, setDisplayBasic] = useState(false);
    const {isLoading, sendRequest } = useHttpClient();
    const dialogFuncMap = { 'displayBasic': setDisplayBasic };
    const [driverList, setDriverList] = useState(null);
    const [drivers, setDrivers] = useState(null);
    const [useNicknames, setUseNicknames] = useState(false);

    const leagueId = useParams().leagueId;

    const { item, options } = props;
    
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const myUploader = async event => { const myFile = event.files[0]; readXlsxFile(myFile).then((rows) => {setDriverList(rows); }); importDrivers(); };

    const importDrivers = async event => {
      let formattedList = driverList.map((driver) => { 

        let formattedTags;
          if(driver[4]){
            formattedTags = driver[4].replace(/;/g, ",").toLowerCase();
            formattedTags = formattedTags.split(",");
          } else {
            formattedTags = [];
          };

        return { 
          username: driver[1], 
          nickname: driver[3],
          preferredName: driver[1],
          roles: ['driver'],
          tags: formattedTags, 
          avatar: driver[6], 
          joinedAt: driver[8], 
          leagues: [leagueId], 
          isLinked: false 
        } 
      });

      setDrivers(formattedList);
    };

    const driversSubmitHandler = async event => {
      navigate(0);
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/drivers/excel-import`, 
              'POST', 
              JSON.stringify({ drivers: drivers, leagueId: leagueId }),
              { 'Content-Type': 'application/json' }
          );
      } catch (err) {}
    };

    const nicknamesChangeHandler = async event => {
      setUseNicknames(event);

      /*let newDrivers = drivers.map((driver) => {
        console.log(driver);
        if (event == true){
          if (driver.nickname == null){
            driver.preferredName = driver.username
          } else {
            driver.preferredName = driver.nickname
          }
        } else {
          driver.preferredName = driver.username
        }
      });
        
        console.log(newDrivers);
      /*let newPreferredName = driverList.map((driver) => { 

        return { 
          username: driver[1], 
          nickname: driver[3],
          preferredName: driver[1],
        } 
      });

      setUseNicknames(newPreferredName);*/
    };

    const header = (
      <div className="table-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center'}}>
          <p style={{marginRight:'5px'}}>Use Nicknames?</p>
          <InputSwitch checked={useNicknames} onChange={(e) => nicknamesChangeHandler(e.value)} label='Use Nicknames?' style={{marginRight:'5px'}}/>
        </div>
        <div>
          <Button label='Submit' onClick={driversSubmitHandler}/>
        </div>
      </div>
  );

    const rowIndexTemplate = (rowData, props) => {
      let index = parseInt(props.rowIndex + 1, 10);
      return (
        <React.Fragment>
          <span>{index}</span>
        </React.Fragment>
      );
    };

    //const avatarTemplate = (driver) => { return ( <Avatar image={driver.avatar} size="large" shape="circle" imageAlt='N/A'/> ); }

    const avatarTemplate = (driver) => {

      let preferredName;
      if(useNicknames == true){
        if(driver.nickname == null){
          preferredName = driver.username;
        } else {
          preferredName = driver.nickname;
        }
      } else {
        preferredName = driver.username;
      };

        return (
            <React.Fragment>
                <Avatar image={driver.avatar} shape="circle" imageAlt='N/A' onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} style={{ verticalAlign: 'middle', marginRight:'10px' }} />
                <span className="image-text" style={{color:'#E513E2'}}>{preferredName}</span>
            </React.Fragment>
        );
    };

    const onRowEditComplete = (e) => {
        let _drivers = [...drivers];
        let { newData, index } = e;

        _drivers[index] = newData;

        setDrivers(_drivers);
    };

    const onDeleteDriver = (e) => {
      let index = e.rowIndex;
      let _drivers = [...drivers];
      _drivers.splice(index, 1);

      setDrivers(_drivers);
  };

  const rolesTemplate = (driver) => {
    let rolesChips = driver.roles.map((role) => { 
      return ( <Chip label={role} style={{marginRight:'5px', color:'#54D5E1'}} /> )  
    });
    return ( rolesChips );
  };

  const tagsTemplate = (driver) => {
    let tagsChips = driver.tags.map((tag) => { 
      return ( <Chip label={tag} style={{marginRight:'5px', marginTop:'5px', color:'#54D5E1'}} /> )  
    });
    return ( tagsChips );
  };

    const actionsTemplate = (driver, props) => {
      const deleteDriver = () => onDeleteDriver(props);

      return (
            <div className="row-actions-container">
              <Button icon={<FaTrashAlt />} onClick={deleteDriver}/>
            </div>
      );
    };

    const avatarEditor = (options) => {
        return ( <Avatar image={options.value} size="large" shape="circle" imageAlt='N/A'/> );
    };

    const rolesEditor = (options) => {
        return ( <MultiSelect display="chip" optionLabel="label" value={options.value} options={DUMMY_LEAGUE_ROLES} onChange={(e) => options.editorCallback(e.value)} /> );
    };

    const tagsEditor = (options) => {
        return <Chips value={options.value} onChange={(e) => options.editorCallback(e.target.value)} separator="," allowDuplicate={false} max={10}/>;
    };

    if (options && item) {

    return (
        <div className="dialog-demo">
          <a className={options.className} target={item.target} onClick={() => onClick('displayBasic')} >
            <span className={classNames(options.iconClassName, 'pi pi-fw pi-discord')}></span>
            <span className={options.labelClassName}>{item.label}</span>
          </a>
              <Dialog visible={displayBasic} style={{ width: '90rem' }} onHide={() => onHide('displayBasic')} header='Import Drivers'>
                <div className='center' style={{ marginTop: '10%', marginBottom: '10%' }}>
                  <div style={{ marginLeft: '2%', marginRight: '3%' }}>
                    <FileUpload customUpload uploadHandler={myUploader} url='./images' name="demo" accept=".csv, .xml, .xlsx" ></FileUpload>
                  </div>
                </div>
                <DataTable value={drivers} dataKey="id" responsiveLayout="scroll" editMode="row" onRowEditComplete={onRowEditComplete} header={header}>
                  <Column field="Index" header="" style={{ width: "2rem" }} body={rowIndexTemplate} />
                  <Column field="avatar" header="Avatar" body={avatarTemplate} editor={(options) => avatarEditor(options)} />
                  <Column field="username" header="Username" sortable />
                  <Column field="nickname" header="Server Name" sortable />
                  <Column field="roles" header="Roles" body={rolesTemplate} editor={(options) => rolesEditor(options)} sortable />
                  <Column field="tags" header="Tags" body={tagsTemplate} editor={(options) => tagsEditor(options)} sortable />
                  <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }} />
                  <Column body={actionsTemplate} />
                </DataTable>
                
              </Dialog>
        </div>
      )
    }
  };
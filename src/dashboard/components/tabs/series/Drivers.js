import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hooks/http-hook";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { MultiSelect } from 'primereact/multiselect';
import { Avatar } from 'primereact/avatar';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dropdown } from "primereact/dropdown";

import { ManageDrivers } from "../../../../shared/components/templates/ManageDrivers";

import { FaRegAddressCard, FaSave } from 'react-icons/fa';

export default function Drivers(props) {
  const { sendRequest } = useHttpClient();
  let navigate = useNavigate();
  const leagueId = useParams().leagueId;
  const seriesId = useParams().sid;

  const series = props.series;
  const [loadedDrivers, setLoadedDrivers] = useState(props.drivers);
  const [leagueDrivers, setLeagueDrivers] = useState(props.leagueDrivers);
  const [selectedDrivers, setSelectedDrivers] = useState(props.drivers);

  const addDriversToSeries = async (props) => {
    try {
        await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/drivers`, 
            'PATCH', 
            JSON.stringify({ drivers: props }),
            { 'Content-Type': 'application/json' }
        );
        console.log("complete");
        navigate(0);
    } catch (err) {}
  };

  function updateDriver (driver) {

    const driversUpdateHandler = async event => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}driver`, 
              'PATCH', 
              JSON.stringify({ driver: driver, leagueId: leagueId }),
              { 'Content-Type': 'application/json' }
          );
      } catch (err) {}
    };
    driversUpdateHandler();
  };

  function handleDriversSelected(drivers) {
    if(drivers.length < 1) {
      setSelectedDrivers(undefined);
    } else {
      const loadedDriverIds = loadedDrivers.map(driver => driver._id);
      let newDrivers = drivers.filter(newDriver => !loadedDriverIds.includes(newDriver._id));
      setSelectedDrivers(newDrivers);
    }
  }

  const addDrivers = () => {
    let existingDrivers = loadedDrivers;
    let existingDriverIds = existingDrivers.map(driver => driver._id);

    let availableDrivers = leagueDrivers.filter(
      parentDriver => !existingDriverIds.includes(parentDriver._id)
    );

    existingDrivers = existingDrivers.map((driver) => {
      return {
        _id: driver._id,
        username: driver.properties.username,
        role: driver.role,
        team: driver.team
      }
    })

    availableDrivers = availableDrivers.map((driver) => {
      return {
        _id: driver._id,
        username: driver.properties.username,
        role: driver.role,
        team: driver.team
      }
    });

    const handleCallback = (childData) => {
      setSelectedDrivers(childData.target);
      addDriversToSeries(childData.target);
    }

    return (
      <div>
        <ManageDrivers 
              eventName={series.properties.title} 
              available={availableDrivers} 
              existing={existingDrivers} 
              parentCallback={handleCallback} 
              />
      </div>
    )
  }

  const avatarTemplate = (driver) => {
    return (
        <React.Fragment>
            <Avatar image={driver.properties.avatar} shape="circle" imageAlt='N/A' onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} style={{ verticalAlign: 'middle', marginRight:'10px' }} />
            <span>{driver.properties.username}</span>
        </React.Fragment>
    );
  };

  const driversLicenseTemplate = (driver) => {
    return <Button className="p-button-link" icon={<FaRegAddressCard style={{fontSize:'1.5em'}}/> } /> 
  };

  const actionsEditor = (options) => {
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
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/remove-driver/${driverId}`, 
              'PATCH'
          );
            await setDrivers();
            navigate(0);
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

    // updateDriver(newData);
  };

  const paginatorTemplate = {
    layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
    'RowsPerPageDropdown': (options) => {
        const dropdownOptions = [
            { label: 10, value: 10 },
            { label: 20, value: 20 },
            { label: 50, value: 50 }
        ];

        return (
            <React.Fragment>
                <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Items per page: </span>
                <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
            </React.Fragment>
        );
    },
    'CurrentPageReport': (options) => {
        return (
            <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                {options.first} - {options.last} of {options.totalRecords}
            </span>
        )
    }
  };

  return (
      <DataTable  value={loadedDrivers} dataKey="id" 
                  responsiveLayout="stack" size='small'
                  header={<Toolbar left={addDrivers} />} 
                  editMode="row" onRowEditComplete={onRowEditComplete}
                  paginator paginatorTemplate={paginatorTemplate} rows={10} >
          <Column field="properties.username" header="Driver" body={avatarTemplate}/>
          <Column header="License" body={driversLicenseTemplate}/>
          <Column editor={(options) => actionsEditor(options)}/>
          <Column rowEditor />

      </DataTable>
  );
};
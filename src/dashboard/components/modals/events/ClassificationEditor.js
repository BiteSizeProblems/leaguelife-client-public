import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { Button }  from 'primereact/button';
import { Dropdown } from "primereact/dropdown";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import { Checkbox } from 'primereact/checkbox';
import { InputSwitch } from 'primereact/inputswitch';
import { SplitButton } from 'primereact/splitbutton';
import { FaSave, FaQuestion, FaFlagCheckered, FaRunning, FaStopwatch } from 'react-icons/fa';

import { useHttpClient } from '../../../../shared/hooks/http-hook';

import { DUMMY_ATTENDANCE_STATUS, DUMMY_TEAMS } from '../../../../shared/data/DUMMY_DATA';
import TeamIconTemplate from '../../../../shared/components/templates/TeamIconTemplate';

import getPoints from '../../../../shared/util/getPoints';

export const ClassificationEditor = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const dialogFuncMap = { 'displayBasic': setDisplayBasic };
    const onClick = (name) => { dialogFuncMap[`${name}`](true) };
    const onHide = (name) => { dialogFuncMap[`${name}`](false) };
    const navigate = useNavigate();

    const { sendRequest } = useHttpClient();

    const event = props.event;
    const eventId = event.id;

    const leagueId = useParams().leagueId;
    const seriesId = useParams().sid;
    const divisionId = useParams().did;
    const seasonId = event.season;

    const [ drivers, setDrivers ] = useState(
      event.drivers.map((driver) => {
        return {
          _id: driver._id,
          username: driver.username,
          attendance: driver.attendance,
          role: driver.role,
          team: driver.team,
          qualifying: driver.result.qualifying,
          sprint: driver.result.sprint,
          race: driver.result.race,
          points: driver.result.points,
          fastestLap: driver.result.fastestLap,
          finished: driver.result.finished,
          warning: driver.incidents.warning,
          penalty: driver.incidents.penalty,
          penaltyAwarded: driver.incidents.penaltyAwarded,
          incidentDescription: driver.incidents.description,
        }
      })
    );

    const [fastestLap, setFastestLap] = useState(event.fastestLap);
    const [sprintRace, setSprintRace] = useState(event.isSprint);
    const [halfPoints, setHalfPoints] = useState(event.halfPoints);

    const onRowEditComplete = (e) => {
      let _drivers = [...drivers];
      let { newData, index } = e;
  
      _drivers[index] = newData;
  
      setDrivers(_drivers);
    };

    const dialogHeader = (
      <div style={{ display:'flex', alignItems:'center', height: 'fit-content'}}>
        <p style={{ marginRight:'5px' }}>{`${event.title}: Final Classification`}</p>
        <Button icon={<FaQuestion />} className="p-button-rounded p-button-info p-button-text" aria-label="User" />
      </div>
    );

    const headerItemStyle = { margin: '0px 10px', display: 'flex', alignItems: 'center' };

    const tableHeader = () => {

      const submitQualifyingResults = async () => {

        let _drivers = drivers.map(
          function(currentelement, index) {
            let position = index + 1;

            return { ...currentelement, qualifying: position }
          }
        );

        setDrivers(_drivers);
      }

      const submitSprintResults = async () => {

        let _drivers = drivers.map(
          function(currentelement, index) {
            let position = index + 1;

            let points;
            if(currentelement.attendance == "Attended") {
              points  = getPoints(currentelement.sprint, currentelement.race, fastestLap, sprintRace, halfPoints);
            } else {
              points = 0;
            }

            return { ...currentelement, sprint: position, points: points }
          }
        );

        setDrivers(_drivers);
      }

      const submitRaceResults = async () => {
        let _drivers = drivers.map(
          function(currentelement, index) {
            let position = index + 1;

            let hasFastestLap;
            if (fastestLap == currentelement.username){
              hasFastestLap = true;
            } else {
              hasFastestLap = false;
            }

            let points;
            if(currentelement.attendance == "Attended") {
              points  = getPoints(currentelement.sprint, currentelement.race, hasFastestLap, sprintRace, halfPoints);
            } else {
              points = 0;
            }

            return { ...currentelement, race: position, points: points }
          }
        );

        setDrivers(_drivers);
      }

      const saveResults = async () => {
        console.log(drivers)
        try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/events/${eventId}/results`, 
              'PATCH', 
              JSON.stringify(
                { 
                  results: drivers, 
                  fastestLap: fastestLap, 
                  sprint: sprintRace, 
                  halfPoints: halfPoints 
                }
              ),
              { 'Content-Type': 'application/json' }
          );
          navigate(0);
        } catch (err) {}
      }

      const items = [
        {
            label: 'Submit Qualifying Results',
            icon: <FaStopwatch style={{marginRight:'10px', fontSize:'1.5em'}}/>,
            command: () => {
              submitQualifyingResults();
            }
        },
        {
            label: 'Submit Sprint Results',
            icon: <FaRunning style={{marginRight:'10px', fontSize:'1.5em'}}/>,
            command: () => {
              submitSprintResults();
            }
        },
        {
            label: 'Submit Race Results',
            icon: <FaFlagCheckered style={{marginRight:'10px', fontSize:'1.5em'}}/>,
            command: () => {
              submitRaceResults();
            }
        }
      ];

      return (
        <div 
        style={
          {
            display:'flex', 
            justifyContent:'space-between',
            margin:'0px 50px',
            padding: '15px',
            alignItems: 'center',
            filter: 'brightness(125%)'
          }
        } >

        <div style={{display:'flex', width:'100%' , alignItems: 'center' }}>

          <div style={headerItemStyle}>
            <Dropdown value={fastestLap} options={drivers}
                        onChange={(e) => setFastestLap(e.value)}
                        optionLabel='username' optionValue="username"
                        placeholder="Fastest Lap" 
                        filter showClear filterBy="username" />
          </div>

          <div style={headerItemStyle}>
            <p style={{marginRight:'5px'}}>Sprint:</p>
            <InputSwitch checked={sprintRace} onChange={(e) => setSprintRace(e.value)} />
          </div>

          <div style={headerItemStyle}>
            <p style={{marginRight:'5px'}}>Half Points</p>
            <InputSwitch checked={halfPoints} onChange={(e) => setHalfPoints(e.value)} />
          </div>

        </div>

        <div>
        <SplitButton icon={<FaSave style={{fontSize:'1.5em'}}/>} model={items} className="p-button-success mr-2 mb-2" onClick={saveResults} />
        </div>
        
      </div>
      )
    }

    const rowIndexTemplate = (rowData, props) => { let index = parseInt(props.rowIndex + 1, 10); return <span>{index}</span> };

    const statusEditor = (options) => { 
      return (
        <Dropdown value={options.value} options={DUMMY_ATTENDANCE_STATUS} 
                  optionLabel='label' optionValue='label' 
                  onChange={(e) => options.editorCallback(e.value)} 
                  placeholder="Select a Status" 
                  itemTemplate={(option) => {
                    return <span>{option.label}</span>
                  }} />
      ) 
    };

    const teamBody = (options) => { 
      return (
        <TeamIconTemplate team={options.team} label={options.team}/>
      ) 
    };

    const teamEditor = (options) => { 
      return (
        <Dropdown value={options.value} options={DUMMY_TEAMS} 
                  optionLabel='name' optionValue='name' 
                  onChange={(e) => options.editorCallback(e.value)} 
                  placeholder="Select a Status" 
                  itemTemplate={(option) => {
                    return <span>{option.name}</span>
                  }} />
      ) 
    };

    const finishedBody = (options) => { 
      return (
        <Checkbox checked={options.finished} readOnly/>
      ) 
    };

    const finishedEditor = (options) => {
      return (
        <Checkbox onChange={(e) => options.editorCallback(e.checked)} checked={options.value}/>
      ) 
    };

    const onRowReorder = (e) => { 
      setDrivers(e.value); 
      drivers[e.dropIndex].race = e.dropIndex;
    };

    return (
        <div className="dialog-demo">
              <Button label='Classification' onClick={() => onClick("displayBasic")} className="p-button-outlined p-button-info" style={{marginRight:'5px'}} disabled={event.drivers.length < 1}/>
              <Dialog header={dialogHeader} visible={displayBasic} style={{ width: '90vw', height: '80vh' }} onHide={() => onHide('displayBasic')}>

              <DataTable value={drivers} header={tableHeader}
                          dataKey="id" responsiveLayout="scroll" size='small' stripedRows={true}
                          editMode="row" onRowEditComplete={onRowEditComplete}
                          reorderableRows onRowReorder={onRowReorder} rowHover={true}
                          >

                <Column rowReorder />
                <Column field="Index" header="Order" body={rowIndexTemplate} />
                <Column field="attendance" header="Status" editor={(options) => statusEditor(options)} />
                <Column field="username" header="Driver" />
                <Column field="team" header="Team" body={teamBody} editor={(options) => teamEditor(options)} />
                <Column field="qualifying" header={<FaStopwatch/>} />
                <Column field="sprint" header={<FaRunning/>}  />
                <Column field="race" header={<FaFlagCheckered/>} />
                <Column field="finished" header="Finished" body={finishedBody} editor={(options) => finishedEditor(options)}/>
                <Column field="points" header="Pts" />
                <Column rowEditor bodyStyle={{ textAlign: 'center' }}/>

              </DataTable>

              </Dialog>
        </div>
    )
};
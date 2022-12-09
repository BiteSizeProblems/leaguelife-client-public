import React, { useState } from 'react';
import { Chart } from 'primereact/chart';
import { Dialog } from 'primereact/dialog';
import { Button }  from 'primereact/button';
import { FaQuestion } from 'react-icons/fa';
import { BiBarChart } from 'react-icons/bi';

export const ResultsChart = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const dialogFuncMap = { 'displayBasic': setDisplayBasic };
    const onClick = (name) => { dialogFuncMap[`${name}`](true) };
    const onHide = (name) => { dialogFuncMap[`${name}`](false) };

    const event = props.event;

    const [drivers, setDrivers] = useState(props.drivers.map((driver) => {

      let randomColor = Math.floor(Math.random()*16777215).toString(16);

      return {
        id: driver._id,
        label: driver.username,
        data: [ driver.result.qualifying, driver.result.sprint, driver.result.race],
        fill: false,
        borderColor: `#${randomColor}`,
        attendance: driver.attendance,
        role: driver.role,
        team: driver.team
      }
    }));

    const dialogHeader = (
      <div style={{ display:'flex', alignItems:'center' }}>
        <p style={{ marginRight:'50px' }}>{`${event.title}: Charts`}</p>
        <Button style={{height:'fit-content'}} icon={<FaQuestion />} disabled/>
      </div>
    );

    const [basicData] = useState({
      labels: ['Qualifying', 'Sprint', 'Race'],
      datasets: drivers
    });

    let basicOptions = {
      type: 'line',
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          },
          tooltip: {
            mode: 'index',
            intersect: true
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            },
            grid: {
              color: '#ebedef'
            },
            min: 1,
            max: drivers.length,
            ticks: {
              stepSize: 1
            }
          }
      }
    }

    const [multiAxisData] = useState({
      labels: ['Qualifying', 'Sprint', 'Race'],
      datasets: drivers
    });

    let multiAxisOptions = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: .6,
      plugins: {
          legend: {
            position: 'left',
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
        x: {
            type: 'category',
            labels: ['January', 'February', 'March', 'April', 'May', 'June']
        }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              type: 'linear',
              display: true,
              position: 'left',
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: 'transparent'
              },
              min: 1,
              ticks: {
                stepSize: 1
              },
              reverse: 'true'
          },
          y1: {
              type: 'linear',
              display: true,
              position: 'right',
              ticks: {
                  color: '#495057'
              },
              grid: {
                  drawOnChartArea: false,
                  color: '#ebedef'
              },
              min: 1,
              ticks: {
                stepSize: 1
              }
          }
      }
  };

    return (
        <div className="dialog-demo">
              <Button icon={<BiBarChart style={{fontSize:'1.5em'}}/>} onClick={() => onClick("displayBasic")} className="p-button-outlined p-button-info"/>
              <Dialog header={dialogHeader} visible={displayBasic} style={{ width: '90vw', height: '80vh' }} onHide={() => onHide('displayBasic')}>
              
                <Chart type="line" data={multiAxisData} options={multiAxisOptions}  height={'100%'}/>
              
              </Dialog>
        </div>
    )
};
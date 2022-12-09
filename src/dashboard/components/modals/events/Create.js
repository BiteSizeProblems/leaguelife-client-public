import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { Button }  from 'primereact/button';
import { useFormik } from 'formik';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { MdConstruction } from 'react-icons/md';
import {InputText} from 'primereact/inputtext';

export const Create = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const { sendRequest } = useHttpClient();

    const leagueId = useParams().leagueId;
    const seriesId = useParams().sid;
    const divisionId = useParams().did;
    const seasonId = props.season.id;

    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const navigate = useNavigate();

    const eventSubmitHandler = async event => {

        let events = formik.values.dates.map((event) => {

          event.setSeconds(0);

          var today = new Date();

          var dateInPast = function(firstDate, secondDate) {
            if (firstDate <= secondDate) {
              return true;
            }
            return false;
          };

          let backgroundColor, status;
          if(dateInPast(event, today) === true) {
            backgroundColor = 'white'
            status = 'complete'
          } else {
            backgroundColor = 'green'
            status = 'scheduled'
          };

          return {
            date: event,
            status,
            backgroundColor
          };

        });

        events = events.sort(function(a, b){return a.date - b.date});

        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons/${seasonId}/events`, 
                'POST', 
                JSON.stringify({ events: events }),
                { 'Content-Type': 'application/json' }
            );
            //onHide('displayBasic');
            navigate(0);
        } catch (err) {}
      }

    const formik = useFormik({
        initialValues: {
            dates: ''
        },
        validate: (data) => {
            let errors = {};

            if (!data.dates) {
              errors.dates = 'Event dates are required.';
            };
  
            return errors;
        },
        onSubmit: (data) => {
          eventSubmitHandler(data);
          formik.resetForm();
        }
      });
  
      const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
      const getFormErrorMessage = (name) => {
          return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
      };

      let firstRace, lastRace;
      if(formik.values.dates !== '') {
        let dates = formik.values.dates.sort(function(a, b){ return a - b });
        firstRace = new Date(dates[0]).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
        lastRace = new Date(dates.slice(-1)[0]).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"});
      } else {
        firstRace = '...';
        lastRace = '...'; 
      }; 

      let scheduleSummary = `Your proposed schedule will feature ${formik.values.dates.length} race(s), beginning on ${firstRace} and finishing on ${lastRace}.`;

    return (
      <div className="dialog-demo">
        <Button label="EVENT BUILDER" icon={<MdConstruction style={{marginRight:'5px', fontSize:'1.5em'}}/>} className="p-button-warning p-button-text" onClick={() => onClick("displayBasic")} />
        <Dialog header="EVENT BUILDER" visible={displayBasic} style={{ width: '80vw' }} onHide={() => onHide('displayBasic')}>
            <form onSubmit={formik.handleSubmit} >

              <div className="grid" style={{ width: '100%'}}>
              
                <div className="col-5 flex align-items-center justify-content-center">

                    <div className="field">
                      <Calendar id="dates" 
                                value={formik.values.dates}
                                onChange={formik.handleChange} 
                                selectionMode="multiple" 
                                readOnlyInput 
                                showTime
                                hourFormat="24" 
                                inline />
                    </div>

                </div>

                <div className="col-1">
                  <Divider layout="vertical" />
                </div>

                <div className="col-6">

                    <div className="field">
                      <h3>Summary</h3>
                      <p>{scheduleSummary}</p>
                    </div>

                    <br/>

                    <div className="field">
                      <Button type='submit' className='p-button-outlined p-button-info center'>Confirm Schedule</Button>
                    </div>

                </div>

              </div>
                            
            </form>
        </Dialog>
      </div>
    )
};
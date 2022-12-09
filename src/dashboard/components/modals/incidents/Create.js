import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Dialog } from 'primereact/dialog';
import { Button }  from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { Editor } from 'primereact/editor';

export const Create = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);

    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const { sendRequest } = useHttpClient();

    const currentDate = new Date().toLocaleDateString("en-US", { "year": "numeric", "month": "numeric", "day": "numeric" });
    const leagueId = useParams().leagueId;

    const [loadedSeason, setLoadedSeason] = useState(props.season);

    const navigate = useNavigate();

    const submitIncidentReport = async event => {
      console.log("submitting incident report...");

      console.log(formik.values);


      /*try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series`, 
              'POST', 
              JSON.stringify({
                  title: formik.values.name,
                  league: leagueId,
                  description: formik.values.description,
                  sim: formik.values.sim,
                  registeredAt: currentDate,
                  divisions: []
              }),
              { 'Content-Type': 'application/json' }
          );
          onHide("displayBasic");
      } catch (err) {}*/
    }

    const formik = useFormik({
      initialValues: {
          season: loadedSeason.properties.title,
          event: '',
          lap: 1,
          author: '',
          offence: '',
          description: '',
          offenders: [],
          evidence: '', 
      },
      validate: (data) => {
          let errors = {};

          if (!data.event) {
            errors.event = 'Event is required.';
          }

          if (!data.lap) {
            errors.lap = 'Lap is required.';
          }

          if (!data.author) {
            errors.author = 'Author is required.';
          }

          if (!data.offence) {
            errors.offence = 'Offence is required.';
          }

          if (!data.offenders) {
            errors.offenders = 'Offenders is required.';
          }

          if (!data.description) {
            errors.description = 'Description is required.';
          }

          if (!data.evidence) {
            errors.evidence = 'Evidence is required.';
          }

          return errors;
      },
      onSubmit: (data) => {
        submitIncidentReport(data);
        navigate(0);
        formik.resetForm();
      }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const formLabelStyle = { fontWeight:'bold', paddingTop:'1%', marginBottom:0 }

    return (
      
        <div className="dialog-demo">
              <Button label="CREATE NEW INCIDENT" className="p-button-link" onClick={() => onClick("displayBasic")} style={{width:'15rem'}}/>

              <Dialog header="INCIDENT REPORT FORM" visible={displayBasic} style={{ width: '55vw' }} onHide={() => onHide('displayBasic')}>
              {loadedSeason && (
              <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div>
                  
                  <div className="field">
                    <label htmlFor="season" className={classNames({ "p-error": isFormFieldValid("season") })} style={formLabelStyle}>
                      SEASON
                    </label>
                    <span className="p-float-label">
                      <InputText id="season" name="season" value={`Season: ${loadedSeason.properties.title}`} readOnly />
                    </span>
                    {getFormErrorMessage("season")}
                  </div>

                  <br/>

                  <div className="field">
                    <label htmlFor="event" className={classNames({ "p-error": isFormFieldValid("event") })} style={{fontWeight:'bold'}}>
                      EVENT
                    </label>
                    <span className="p-float-label">
                      <Dropdown id="event" value={formik.values.event} options={loadedSeason.events} optionLabel="properties.title" onChange={formik.handleChange} filter showClear filterBy="label" placeholder="Select an Event" />
                    </span>
                    {getFormErrorMessage("event")}
                  </div>

                  <br/>

                  <div className="field">
                    <label htmlFor="lap" className={classNames({ "p-error": isFormFieldValid("lap") })} style={{fontWeight:'bold'}}>
                      LAP
                    </label>
                    <span className="p-float-label">
                    <InputNumber id="lap" inputId="lap" value={formik.values.lap} onValueChange={formik.handleChange} showButtons buttonLayout="horizontal" step={1} min={1}
                                  decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                    </span>
                    {getFormErrorMessage("lap")}
                  </div>

                  <br/>

                  <div className="field">
                    <label htmlFor="author" className={classNames({ "p-error": isFormFieldValid("evidence") })} style={{fontWeight:'bold'}}>
                      AUTHOR
                    </label>
                    <span className="p-float-label">
                    <Dropdown id="author" value={formik.values.author} options={loadedSeason.drivers} optionLabel="username" onChange={formik.handleChange} filter showClear filterBy="label" placeholder="Select an Author" />
                    </span>
                    {getFormErrorMessage("author")}
                  </div>

                  <br/>

                  <div className="field">
                    <label htmlFor="offenders" className={classNames({ "p-error": isFormFieldValid("offenders") })} style={{fontWeight:'bold'}}>
                      OFFENDERS
                    </label>
                    <span className="p-float-label">
                      <MultiSelect id="offenders" display="chip" optionLabel="username" value={formik.values.offenders} options={loadedSeason.drivers} onChange={formik.handleChange} />
                    </span>
                    {getFormErrorMessage("offenders")}
                  </div>

                  <br/>

                  <div className="field">
                    <label htmlFor="offence" className={classNames({ "p-error": isFormFieldValid("offence") })} style={{fontWeight:'bold'}}>
                      OFFENCE
                    </label>
                    <span className="p-float-label">
                      <Dropdown id="offence" value={formik.values.event} options={loadedSeason.events} optionLabel="properties.title" onChange={formik.handleChange} filter showClear filterBy="label" placeholder="Select an Event" />
                    </span>
                    {getFormErrorMessage("offence")}
                  </div>

                  <br/>

                  <div className="field">
                    <label htmlFor="description" className={classNames({ "p-error": isFormFieldValid("description") })} style={{fontWeight:'bold'}}>
                      DESCRIPTION
                    </label>
                    <span className="p-float-label">
                      <InputTextarea id="description" rows={5} cols={30} value={formik.values.description} onChange={formik.handleChange} autoResize className={classNames({ "p-invalid": isFormFieldValid("description") })}/>
                    </span>
                    {getFormErrorMessage("description")}
                  </div>

                  <br/>

                  <div className="field">
                    <label htmlFor="evidence" className={classNames({ "p-error": isFormFieldValid("evidence") })} style={{fontWeight:'bold'}}>
                      EVIDENCE
                    </label>
                    <span className="p-float-label">
                      <InputText id="evidence" name="evidence" value={formik.values.evidence} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("evidence") })} />
                    </span>
                    {getFormErrorMessage("evidence")}
                  </div>

                  <br/>

                </div>

                <Divider />

                <div className="center">
                  <Button type="submit" className="center"> Submit </Button>
                </div>         
              </form>)}
            </Dialog>
        </div>
        )
}
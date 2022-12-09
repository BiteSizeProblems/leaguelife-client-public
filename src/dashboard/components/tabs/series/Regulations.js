import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';

import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Editor } from 'primereact/editor';
import { InputTextarea } from 'primereact/inputtextarea';
import { Fieldset } from 'primereact/fieldset';
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';

export default function Regulations() {

  //const regulationsSubmitHandler = async event => {
    //console.log("generating regulations...");
    //console.log(formik.values);
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
    } catch (err) {}*/
  //}

  const formik = useFormik({
    initialValues: {
        updated: '',
        introduction: '',
        officials: '',
        communication: '',
        participationRequirements: '',
        reserveRules: '',
        weatherSettings: '',
        carPerformanceSettings: '',
        assistRestrictions: '',
        setupRestrictions: '',
        aiSettings: '',
        tractionControl: true,
        preRaceSettings: '',
        practiceSettings: '',
        qualifyingSettings: '',
        sprintSettings: '',
        raceSettings: '',
        postRaceSettings: '',
        additional: ''
    },
    validate: (data) => {
        let errors = {};

        if (!data.introduction) {
          errors.introduction = 'An introduction is required.';
        }

        return errors;
    },
    onSubmit: (data) => {
      console.log(formik.values)
      //regulationsSubmitHandler();
    }
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
      return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  const regPanelStyle = { marginTop:'2%' };
  const regDividerStyle = { marginTop:'5%' , marginBottom:'2%'};

  return (
    <div className="regulations">
      <form onSubmit={formik.handleSubmit} className="p-fluid" style={{ margin:'5%', marginLeft:'15%', marginRight:'15%' }}>
        
        <h1 className="center">REGULATIONS EDITOR</h1>
        
        <Button type="submit" label="Update Regulations" className="mt-2" />

        <Fieldset legend="1. INTRODUCTION" style={regPanelStyle} toggleable collapsed={true}>
          <Editor id="introduction" style={{ height: '200px' }} value={formik.values.introduction} onChange={formik.handleChange} />
        </Fieldset>

        <Fieldset legend="OFFICIALS" style={regPanelStyle} toggleable collapsed={true}>
          <Editor id="officials" style={{ height: '200px' }} value={formik.values.officials} onChange={formik.handleChange} />
        </Fieldset>

        <Fieldset legend="DRIVER ENROLLMENT & PARTICIPATION" style={regPanelStyle} toggleable collapsed={true}>

          <Divider align="center" type="dashed" style={regDividerStyle}>
            <b>REQUIREMENTS TO PARTICIPATE</b>
          </Divider>

          <h4>DRIVER REGISTRATION</h4>
          <InputTextarea id="participationRequirements" value={formik.values.participationRequirements} onChange={formik.handleChange} rows={5} cols={120} autoResize />
          
          <h4>RESERVE POLICY</h4>
          <div className="field-checkbox">
            <Checkbox inputId="binary" name="acceptsReserves" checked={formik.values.acceptsReserves} onChange={formik.handleChange} />
            <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("acceptsReserves") })}>
              {" "}Does this league accept reserve drivers?{" "}
            </label>
            {getFormErrorMessage("acceptsReserves")}
          </div>

          <br/>

          <InputTextarea id="reserveRules" value={formik.values.reserveRules} onChange={formik.handleChange} rows={5} cols={60} autoResize />

          <h4>ATTENDANCE</h4>
          <InputTextarea id="reserveRules" value={formik.values.reserveRules} onChange={formik.handleChange} rows={5} cols={60} autoResize />

        </Fieldset>

        <Fieldset legend="DRIVER CONDUCT" style={regPanelStyle} toggleable collapsed={true}>

        </Fieldset>

        <Fieldset legend="EVENT FORMAT & PROCEDURES" style={regPanelStyle} toggleable collapsed={true}>

          <h4>RACE SCHEDULE</h4>

          <table>

            <tr>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Sunday{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Monday{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Tuesday{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Wednesday{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Thursday{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Friday{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Saturday{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
            </tr>

          </table>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="weather" value={formik.values.weather} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="weather" className={classNames({ "p-error": isFormFieldValid("weather") })} >
                {" "}RESCHEDULING POLICY{" "}
              </label>
            </span>
            {getFormErrorMessage("weather")}
          </div>

          <h4>LOBBY SETTINGS</h4>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="weather" value={formik.values.weather} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="weather" className={classNames({ "p-error": isFormFieldValid("weather") })} >
                {" "}WEATHER{" "}
              </label>
            </span>
            {getFormErrorMessage("weather")}
          </div>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="carPerformanceSettings" value={formik.values.carPerformanceSettings} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="carPerformanceSettings" className={classNames({ "p-error": isFormFieldValid("carPerformanceSettings") })} >
                {" "}CAR PERFORMANCE TYPE{" "}
              </label>
            </span>
            {getFormErrorMessage("carPerformanceSettings")}
          </div>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="setupRestrictions" value={formik.values.setupRestrictions} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="setupRestrictions" className={classNames({ "p-error": isFormFieldValid("setupRestrictions") })} >
                {" "}SET-UP RESTRICTIONS{" "}
              </label>
            </span>
            {getFormErrorMessage("setupRestrictions")}
          </div>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="weather" value={formik.values.weather} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="weather" className={classNames({ "p-error": isFormFieldValid("weather") })} >
                {" "}AI Settings{" "}
              </label>
            </span>
            {getFormErrorMessage("weather")}
          </div>

          <Divider align="center" type="dashed" style={regDividerStyle}>
            <b>ASSIST RESTRICTIONS</b>
          </Divider>

          <table>

            <tr>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Steering Assist{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Braking Assist{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Anti-Lock Brakes{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Traction Control{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Dynamic Racing Line{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Dynamic Racing Line Type{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Gearbox{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Pit Assist{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}Pit Release Assist{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}ERS Assist{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
              <td>
                <div className="field-checkbox">
                  <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                  <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                    {" "}DRS Assist{" "}
                  </label>
                  {getFormErrorMessage("tractionControl")}
                </div>
              </td>
            </tr>

          </table>

          <Divider align="left" type="dashed" style={regDividerStyle}>
            <b>RACE PROCEDURES</b>
          </Divider>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="preRaceSettings" value={formik.values.preRaceSettings} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="preRaceSettings" className={classNames({ "p-error": isFormFieldValid("preRaceSettings") })} >
                {" "}PRE-RACE{" "}
              </label>
            </span>
            {getFormErrorMessage("preRaceSettings")}
          </div>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="practiceSettings" value={formik.values.practiceSettings} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="practiceSettings" className={classNames({ "p-error": isFormFieldValid("practiceSettings") })} >
                {" "}PRACTICE{" "}
              </label>
            </span>
            {getFormErrorMessage("practiceSettings")}
          </div>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="qualifyingSettings" value={formik.values.qualifyingSettings} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="qualifyingSettings" className={classNames({ "p-error": isFormFieldValid("qualifyingSettings") })} >
                {" "}QUALIFYING{" "}
              </label>
            </span>
            {getFormErrorMessage("qualifyingSettings")}
          </div>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="sprintSettings" value={formik.values.sprintSettings} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="sprintSettings" className={classNames({ "p-error": isFormFieldValid("sprintSettings") })} >
                {" "}SPRINT{" "}
              </label>
            </span>
            {getFormErrorMessage("sprintSettings")}
          </div>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="raceSettings" value={formik.values.raceSettings} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("weather") })} autoResize />
              <label htmlFor="raceSettings" className={classNames({ "p-error": isFormFieldValid("raceSettings") })} >
                {" "}RACE{" "}
              </label>
            </span>
            {getFormErrorMessage("raceSettings")}
          </div>

          <div className="field" style={{marginTop:'4%'}}>
            <span className="p-float-label">
              <InputTextarea id="postRaceSettings" value={formik.values.postRaceSettings} onChange={formik.handleChange} rows={5} cols={60} className={classNames({ "p-invalid": isFormFieldValid("postRaceSettings") })} autoResize />
              <label htmlFor="postRaceSettings" className={classNames({ "p-error": isFormFieldValid("postRaceSettings") })} >
                {" "}POST-RACE{" "}
              </label>
            </span>
            {getFormErrorMessage("postRaceSettings")}
          </div>

        </Fieldset>

        <Fieldset legend="POINTS SYSTEM" style={regPanelStyle} toggleable collapsed={true}>

        <table>

          <tr>
            <td>
              <div className="field-checkbox">
                <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                  {" "}Current (Post-2010): 25-18-15-12-10-8-6-4-2-1{" "}
                </label>
                {getFormErrorMessage("tractionControl")}
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div className="field-checkbox">
                <Checkbox inputId="binary" name="tractionControl" checked={formik.values.tractionControl} onChange={formik.handleChange} />
                <label htmlFor="binary" className={classNames({ "p-error": isFormFieldValid("tractionControl") })}>
                  {" "}Classic (Pre-2010): 10-8-6-5-4-3-2-1{" "}
                </label>
                {getFormErrorMessage("tractionControl")}
              </div>
            </td>
          </tr>

          </table>

        </Fieldset>

        <Fieldset legend="INCIDENT PROCEDURES" style={regPanelStyle} toggleable collapsed={true}>
          
        </Fieldset>

        <Fieldset legend="PLAN B's" style={regPanelStyle} toggleable collapsed={true}>
          
        </Fieldset>

        <Fieldset legend="COMMUNICATION" style={regPanelStyle} toggleable collapsed={true}>

          <InputTextarea id="communication" value={formik.values.communication} onChange={formik.handleChange} rows={5} cols={120} autoResize 
                         placeholder="example: // " />

        </Fieldset>

        <Fieldset legend="ADDITIONAL REGULATIONS" style={regPanelStyle} toggleable collapsed={true}>
          <Editor id="additional" style={{ height: '200px' }} value={formik.values.additional} onChange={formik.handleChange} />
        </Fieldset>

      </form>
    </div>
  );
};
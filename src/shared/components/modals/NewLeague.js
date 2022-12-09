import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useHttpClient } from '../../hooks/http-hook';
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useAuth0 } from '@auth0/auth0-react';

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { MdConstruction } from 'react-icons/md';

import { DUMMY_REGIONS } from '../../data/DUMMY_DATA';

import './Modals.css';

export const NewLeague = (props) => {
  const [displayBasic, setDisplayBasic] = useState(false);
  const { sendRequest } = useHttpClient();
  const { user } = useAuth0();
  let userId = user.sub.replaceAll("|", "");

  let navigate = useNavigate();

  let existingLeagueNames, existingLeagueAcronyms;
  if(props.leagues) {
    existingLeagueNames = props.leagues.map(league => league.title.toLowerCase());
    existingLeagueAcronyms = props.leagues.map(league => league.acronym.toLowerCase());
  } else {
    existingLeagueNames = [];
    existingLeagueAcronyms = [];
  }

  const dialogFuncMap = { displayBasic: setDisplayBasic };
  const onClick = (name) => { dialogFuncMap[`${name}`](true); };
  const onHide = (name) => { dialogFuncMap[`${name}`](false); /*formik.resetForm();*/ };

  const leagueSubmitHandler = async (event) => {
    console.log("creating your new league");
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/leagues`,
        "POST",
        JSON.stringify({
          title: formik.values.name,
          acronym: formik.values.acronym.toUpperCase(),
          tagline: formik.values.tagline,
          description: formik.values.description,
          region: formik.values.region,
          owner: userId,
        }),
        { "Content-Type": "application/json" }
      );
      onHide("displayBasic");
    } catch (err) {}
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      acronym: '',
      tagline: '',
      description: '',
      region: '',
    },
    validate: (data) => {
      let errors = {};

      if (!data.name || data.name.length < 6 || data.name.length > 40) {
        errors.name = "This league needs a name between 6 and 40 characters long.";
      }

      if (existingLeagueNames.includes(data.name.toLowerCase()) ) {
        errors.name = "This name has already been taken.";
      }

      if (!data.acronym || data.acronym.length > 5 || data.acronym.length < 3) {
        errors.acronym = "Your league needs an acronym between 3 and 5 characters long.";
      }

      if (existingLeagueAcronyms.includes(data.acronym.toLowerCase()) ) {
        errors.acronym = "This acronym has already been taken.";
      }

      if (data.tagline.length > 55) {
        errors.tagline = `Taglines cannot contain more than 55 characters.`;
      }

      if (data.description.length > 300) {
        errors.description = `${data.description.length}/300 Characters (Descriptions cannot contain more than 300 characters).`;
      }

      if (!data.region) {
        errors.region = "You must declare a local region for this league.";
      }

      return errors;
    },
    onSubmit: (data) => {
      leagueSubmitHandler(data);
      onHide('displayBasic')
      navigate(0);
      formik.resetForm();
    },
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

  return (
    <div className="dialog-demo">
      <Button label="LEAGUE BUILDER" icon={<MdConstruction style={{marginRight:'5px', fontSize:'1.5em'}}/>} className="p-button-outlined p-button-warning" onClick={() => onClick("displayBasic")} style={{ margin:'2em 0em'}}/>
      <Dialog visible={displayBasic} onHide={() => onHide("displayBasic")} header='LEAGUE BUILDER' className="modal__container">
        <div className="form-demo center">
          <div className="flex justify-content-center">
            <div className="newCard">
              <form onSubmit={formik.handleSubmit} className="p-fluid">

                <br/>

                <div className="field">
                  <span className="p-float-label">
                    <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name"), })} />
                    <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name"), })} > League Name * (6-12 characters) </label>
                  </span>
                  {getFormErrorMessage("name")}
                </div>

                <br/>

                <div className="field">
                  <span className="p-float-label">
                    <InputText id="acronym" name="acronym" value={formik.values.acronym} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("acronym"), })} />
                    <label htmlFor="acronym" className={classNames({ "p-error": isFormFieldValid("acronym"), })} > Acronym * (3-5 characters) </label>
                  </span>
                  {getFormErrorMessage("acronym")}
                </div>

                <p style={{fontSize:'small', width:'100%', textAlign:'left'}}>Shorten your league name for search optimization.</p>

                <br/>

                <div className="field">
                  <span className="p-float-label">
                    <InputText id="tagline" name="tagline" value={formik.values.tagline} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("tagline"), })} />
                    <label htmlFor="tagline" className={classNames({ "p-error": isFormFieldValid("tagline"), })} > Tagline: ({formik.values.tagline.length} characters) </label>
                  </span>
                  {getFormErrorMessage("tagline")}
                </div>

                <p style={{fontSize:'small', width:'100%', textAlign:'left'}}>Something short and memorable to capture a driver's attention.</p>

                <br/>

                <div className="field">
                  <span className="p-float-label">
                    <InputText id="description" name="description" value={formik.values.description} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("description"), })} />
                    <label htmlFor="description" className={classNames({ "p-error": isFormFieldValid("description"), })} > Description ({formik.values.description.length} characters)</label>
                  </span>
                  {getFormErrorMessage("description")}
                </div>

                <p style={{fontSize:'small', width:'100%', textAlign:'left'}}>Something a little longer for those wanting more information.</p>

                <br />

                <div className="field">
                  <span className="p-float-label">
                   <Dropdown id="region" value={formik.values.region} options={DUMMY_REGIONS} onChange={formik.handleChange} filter showClear filterBy="label" placeholder="Select your local region" className={classNames({ "p-invalid": isFormFieldValid("region"), })} required/>
                   <label htmlFor="region" className={classNames({ "p-error": isFormFieldValid("region"), })}>Your local region</label>
                  </span>
                  {getFormErrorMessage("region")}
                </div>

                <br/>
                <br/>

                <Button type="submit" icon="pi pi-check" className="p-button-rounded p-button-info p-button-outlined" aria-label="User" />

                <br/>
                <br/>

              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

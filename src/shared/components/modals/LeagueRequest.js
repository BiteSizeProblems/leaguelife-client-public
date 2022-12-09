import React, { useState } from 'react';

import { useFormik } from 'formik';
import { useHttpClient } from '../../hooks/http-hook';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from "primereact/dropdown";

import { DUMMY_EXPERIENCE_LEVELS, DUMMY_SKILL_LEVELS } from '../../data/DUMMY_DATA';

export const LeagueRequest = (props) => {
    const { error, sendRequest, clearError } = useHttpClient();
    const [displayBasic, setDisplayBasic] = useState(false);
    const dialogFuncMap = { 'displayBasic': setDisplayBasic };
    
    const onClick = (name) => { dialogFuncMap[`${name}`](true); };
    const onHide = (name) => { dialogFuncMap[`${name}`](false); };

    const league = props.league;
    const user = props.user;

    const leagueApplicationHandler = async event => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/users/${user._id}/league-application`, 
                'POST', 
                JSON.stringify({ 
                    applicantId: user._id,
                    application: formik.values,
                    league: league
                 }),
                { 'Content-Type': 'application/json' }
            );
            formik.resetForm();
            onHide('displayBasic');
        } catch (err) {}
    };

    const formik = useFormik({
        initialValues: {
            applicantId: user._id,
            username: user.username,
            league: league.title,
            experience: 'Beginner',
            skill: 'Slow',
            additionalInfo: ''
        },
        validate: (data) => {
            let errors = {};
    
            if (!data.username) {
              errors.username = 'Username is required.';
            };
    
            if (!data.experience) {
              errors.experience = 'Experience level is required.';
            };

            if (!data.skill) {
                errors.skill = 'Skill level is required.';
            };
    
            return errors;
        },
        onSubmit: () => {
          leagueApplicationHandler();
        }
    });
  
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <div className="dialog-demo">
          <Button onClick={() => onClick('displayBasic')} label='Join (Beta)' className="p-button-outlined p-button-info"/>
              <Dialog visible={displayBasic} style={{ width: '35vw' }} onHide={() => onHide('displayBasic')} header={`${league.title}: Driver Application`}>
               
               <p>This league requires the following information from applicants before granting enrollment.</p>

                <br/>

                <form onSubmit={formik.handleSubmit} className="p-fluid">

                    <br/>

                    <div className="field">
                        <span className="p-float-label p-input-icon-right">
                        <InputText id="username" value={formik.values.username} onChange={formik.handleChange} disabled={true}/>
                        <label htmlFor="username">Username</label>
                        </span>
                    </div>

                    <br/>

                    <div className="field">
                        <span className="p-float-label p-input-icon-right">
                        <InputText id="league" value={formik.values.league} onChange={formik.handleChange} disabled={true} />
                        <label htmlFor="league">Applying to</label>
                        </span>
                    </div>

                    <br/>

                    <div className="field">
                        <span className="p-float-label">
                        <Dropdown id="experience" value={formik.values.experience} options={DUMMY_EXPERIENCE_LEVELS} 
                                    onChange={formik.handleChange} optionLabel='value' />
                        <label htmlFor="experience">Sim Racing Experience</label>
                        </span>
                    </div>

                    <br/>

                    <div className="field">
                        <span className="p-float-label">
                        <Dropdown id="skill" value={formik.values.skill} options={DUMMY_SKILL_LEVELS} 
                                    onChange={formik.handleChange} optionLabel='value' />
                        <label htmlFor="skill">Sim Racing Skill Level</label>
                        </span>
                    </div>

                    <br/>

                    <div className="field">
                        <span className="p-float-label p-input-icon-right">
                            <InputTextarea id="additionalInfo" value={formik.values.additionalInfo} onChange={formik.handleChange} rows={5} cols={120} autoResize />
                        <label htmlFor="additionalInfo">Additional Information (optional)</label>
                        </span>
                    </div>

                    <br/>

                    <Button label="Submit" type='submit' icon="pi pi-check" />

                </form>
              </Dialog>
        </div>
    )
};
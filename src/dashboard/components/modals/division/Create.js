import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { Button }  from 'primereact/button';
import { useFormik } from 'formik';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { MdConstruction } from 'react-icons/md';

export const Create = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const {sendRequest } = useHttpClient();
    const navigate = useNavigate();
    const leagueId = useParams().leagueId;
    const seriesId = props.series.id;

    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const divisionSubmitHandler = async event => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions`, 
                'POST', 
                JSON.stringify({
                    title: formik.values.name,
                    description: formik.values.description
                }),
                { 'Content-Type': 'application/json' }
            );
        } catch (err) {}
      }

    const formik = useFormik({
        initialValues: {
            name: '',
            description: ''
        },
        validate: (data) => {
            let errors = {};
  
            if (!data.name) {
              errors.name = 'Name is required.';
            }
  
            return errors;
        },
        onSubmit: (data) => {
          divisionSubmitHandler();
          onHide('displayBasic');
          navigate(0);
          formik.resetForm();
        }
      });
  
      const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
      const getFormErrorMessage = (name) => {
          return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
      };

    return (
        <div className="dialog-demo">
          <Button label="DIVISION BUILDER" icon={<MdConstruction style={{marginRight:'5px', fontSize:'1.5em'}}/>} className="p-button-warning p-button-text" onClick={() => onClick("displayBasic")} />
              <Dialog header="DIVISION BUILDER" visible={displayBasic} style={{ width: '55vw' }} onHide={() => onHide('displayBasic')}>
                <div className="form-demo center">
                  <div className="flex justify-content-center">
                    <div className='newCard'>
                        <form onSubmit={formik.handleSubmit} className="p-fluid">

                            <div>

                                <br/>

                                <div className="field">
                                  <span className="p-float-label">
                                      <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name"), })} />
                                      <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name"), })} > Name* </label>
                                  </span>
                                  {getFormErrorMessage("name")}
                                </div>

                                <p style={{fontSize:'small', width:'100%', textAlign:'left'}}><i>example: "Tier 2"</i></p>

                                <br/>

                                <div className="field">
                                  <span className="p-float-label">
                                      <InputText id="description" name="description" value={formik.values.description} onChange={formik.handleChange} />
                                      <label htmlFor="description" > Description </label>
                                  </span>
                                </div>

                                <p style={{fontSize:'small', width:'100%', textAlign:'left'}}><i>What makes this division unique?</i></p>


                                <br/>
                                
                            </div>

                            <Divider />

                            <div className='center'>
                                <Button type='submit' className='center'>Submit</Button>
                            </div>
                            
                        </form>
                    </div>
                  </div>
                </div>
              </Dialog>
        </div>
    )
};
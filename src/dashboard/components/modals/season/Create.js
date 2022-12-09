import React, { useState } from "react";
import { Dialog } from 'primereact/dialog';
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from "primereact/button";
import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { classNames } from 'primereact/utils';
import { SelectButton } from 'primereact/selectbutton';
import { MdConstruction } from 'react-icons/md';
import { Divider } from 'primereact/divider';
import '../ModalForms.css';

export const Create = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const {isLoading, sendRequest } = useHttpClient();
    const navigate = useNavigate();

    const division = props.division;

    const leagueId = useParams().leagueId;
    const seriesId = useParams().sid;
    const divisionId = division.id;

    const statusOptions = ['scheduled', 'active', 'completed'];

    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    const onClick = (name) => { dialogFuncMap[`${name}`](true) };
    const onHide = (name) => { dialogFuncMap[`${name}`](false); formik.resetForm() };

    const seasonSubmitHandler = async event => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series/${seriesId}/divisions/${divisionId}/seasons`, 
              'POST', 
              JSON.stringify({ season: formik.values }),
              { 'Content-Type': 'application/json' }
          );
          onHide('displayBasic');
      } catch (err) {}
    };

    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        divisionTitle: division.title,
        title: 1,
        isRecruiting: true,
        status: 'scheduled'
      },
      validate: (data) => {
          let errors = {};

          if (!data.title) {
            errors.title = "An identifier is required to create this season.";
          }

          return errors;
      },
      onSubmit: (data) => {
        seasonSubmitHandler();
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
        <Button label="SEASON BUILDER" icon={<MdConstruction style={{marginRight:'5px', fontSize:'1.5em'}}/>} className="p-button-warning p-button-text" onClick={() => onClick("displayBasic")} />
        <Dialog header="SEASON BUILDER" visible={displayBasic} style={{ width: '60vw' }} onHide={() => onHide('displayBasic')}>
            <form onSubmit={formik.handleSubmit} >

              <div className="grid" style={{ width: '100%'}}>
              
                <div className="col-6" style={{display:'flex', flexDirection:'column', alignItems:'baseline'}}>

                  <br/>

                    <div className="field">
                      <label style={{width:'100%', textAlign:'left'}} htmlFor="title" className={classNames({ 'p-error': isFormFieldValid('title') })}>Identifier</label>
                      <InputNumber id="title" inputId="title" value={formik.values.title} onValueChange={formik.handleChange} showButtons buttonLayout="horizontal" step={1} min={1}
                                    decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" style={{textAlign:'center'}}/>
                    </div>

                    <br/>
                    <br/>
                    <br/>

                    <div className="field-checkbox">
                        <Checkbox inputId="isRecruiting" name="isRecruiting" checked={formik.values.isRecruiting} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('isRecruiting') })} />
                        <label htmlFor="isRecruiting" 
                                className={classNames({ 'p-error': isFormFieldValid('isRecuiting') })}
                                style={{marginLeft:'5px'}}>
                                  Are you actively recruiting for this season?
                        </label>
                    </div>

                    <br/>
                    <br/>

                    <div className="field">
                      <label htmlFor="status" className={classNames({ 'p-error': isFormFieldValid('status') })} >
                        Scheduling Status:
                      </label>
                      <SelectButton id="status" value={formik.values.status} options={statusOptions} onChange={formik.handleChange} required/>
                    </div>

                    <br/>

                </div>

                <div className="col-1">
                  <Divider layout="vertical" />
                </div>

                <div className="col-5">

                    <div className="field">
                      <p>Once you're ready, click confirm to add Season {formik.values.title} to your division: {formik.values.divisionTitle}.</p>
                    </div>

                    <br/>

                    <div className="field">
                      <Button type='submit' className='p-button-outlined p-button-info center'>Confirm Season</Button>
                    </div>

                </div>

              </div>
                            
            </form>
        </Dialog>
      </div>
    )

  /*return (
    <div className="dialog-demo">
      <Button label="SERIES BUILDER" icon="pi pi-plus" className="p-button-text p-button-warning mr-2 mb-2" aria-label="AddSeries" onClick={() => onClick('displayBasic')}/>
      <Dialog header='Season Builder' visible={displayBasic} style={{ width: '55vw' }} onHide={() => onHide('displayBasic')}>
        <div className="form-demo center">
          <div className="flex justify-content-center">
            <div className='newCard'>
              <form onSubmit={formik.handleSubmit} className="p-fluid">

                <br/>

                <div className="field">
                  <label htmlFor="division" style={{width:'100%', textAlign:'left'}} >Division *</label>
                  <InputText id="division" value={formik.values.divisionTitle} disabled/>
                </div>

                <br/>
                <br/>

                <div className="field col-12 md:col-3">
                    <label style={{width:'100%', textAlign:'left'}} htmlFor="title" className={classNames({ 'p-error': isFormFieldValid('title') })}>Identifier *</label>
                    <InputNumber id="title" inputId="title" value={formik.values.title} onValueChange={formik.handleChange} showButtons buttonLayout="horizontal" step={1} min={1}
                                  decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                </div>

                <br/>
                <br/>

                <div className="field-checkbox">
                    <Checkbox inputId="isRecruiting" name="isRecruiting" checked={formik.values.isRecruiting} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('isRecruiting') })} />
                    <label htmlFor="isRecruiting" 
                            className={classNames({ 'p-error': isFormFieldValid('isRecuiting') })}
                            style={{marginLeft:'5px'}}>
                              Are you actively recruiting for this season? *
                    </label>
                </div>

                <br/>
                <br/>

                <label htmlFor="status" className={classNames({ 'p-error': isFormFieldValid('status') })} >
                  This season is: *
                </label>
                <SelectButton id="status" value={formik.values.status} options={statusOptions} onChange={formik.handleChange} required/>
                
                <br/>
                <br/>

                <Button className="center" type='submit'>Create Season</Button>

                <br/>

              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )*/
}
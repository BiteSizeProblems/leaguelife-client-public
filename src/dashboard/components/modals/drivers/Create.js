import React, { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import { Button }  from 'primereact/button';
import { useFormik } from 'formik';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Chips } from 'primereact/chips';

export const Create = (props) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const { sendRequest } = useHttpClient();
    const Navigate = useNavigate();

    const loadedMembers = props.members;
    const { item, options } = props;

    const leagueId = useParams().leagueId;
    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); Navigate(0)}

    const createDriverHandler = async event => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/driver`, 
                'POST', 
                JSON.stringify({ 
                  link: formik.values.link,
                  username: formik.values.username,
                  tags: formik.values.tags,
                  leagueId: leagueId
                 }),
                { 'Content-Type': 'application/json' }
            );
        } catch (err) {}
    };

    const formik = useFormik({
        initialValues: {
            link: undefined,
            username: '',
            tags: ['Rookie'],
        },
        validate: (data) => {
            let errors = {};
  
            if (!data.username) {
              errors.username = 'This driver must have a username.';
            }
  
            return errors;
        },
        onSubmit: () => {
          createDriverHandler();
          formik.resetForm();
        }
      });
  
      const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
      const getFormErrorMessage = (name) => {
          return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
      };

    return (
        <div className="dialog-demo">
              <a className={options.className} target={item.target} onClick={() => onClick('displayBasic')} >
                <span className={classNames(options.iconClassName, 'pi pi-fw pi-plus')}></span>
                <span className={options.labelClassName}>{item.label}</span>
              </a>
              <Dialog header="League Driver Builder" visible={displayBasic} style={{ width: '55vw' }} onHide={() => onHide('displayBasic')}>

                  <div className="flex justify-content-center">
                    <div className='newCard'>
                        <form onSubmit={formik.handleSubmit} className="p-fluid">

                            <div>

                                <br/>

                                <div className="field">

                                  <span className="p-float-label">
                                    <Dropdown id="link" value={formik.values.link} options={loadedMembers} 
                                              optionLabel="username"
                                              onChange={formik.handleChange} 
                                              filter showClear filterBy="label" 
                                              emptyMessage='No user accounts to select from.' />
                                    <label htmlFor="link" className={classNames({ "p-error": isFormFieldValid("link")})} >
                                      Linked User Profile
                                    </label>
                                  </span>
                                  {getFormErrorMessage("link")}
                                </div>

                                <p style={{fontSize:'small', width:'100%', textAlign:'left'}}>Assign this driver profile to a user account you have accepted into your league.</p>

                                <br/>

                                <div className="field">
                                <span className="p-float-label">
                                    <InputText id="username" value={formik.values.username} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("username"), })} />
                                    <label htmlFor="username" className={classNames({ "p-error": isFormFieldValid("username"), })} > Username* </label>
                                </span>
                                {getFormErrorMessage("username")}
                                </div>

                                <br/>
                                <br/>

                                <div className="field">
                                <span className="p-float-label">
                                  <Chips id="tags" value={formik.values.tags} separator="," 
                                          onChange={formik.handleChange} 
                                          className={classNames({ "p-invalid": isFormFieldValid("tags") })}
                                          style={{marginRight:'5px', color:'#54D5E1'}}/>
                                  <label htmlFor="tags" className={classNames({ "p-error": isFormFieldValid("tags"), })} > Tags </label>
                                </span>
                                {getFormErrorMessage("tags")}
                                </div>

                                <p style={{fontSize:'small', width:'100%', textAlign:'left'}}>Enter tags for this driver. Seperate values with a comma to enter individually.</p>

                                <br/>
                                
                            </div>

                            <Divider />

                            <br/>

                            <div className='center'>
                                <Button type='submit' className='center'>Submit</Button>
                            </div>
                            
                        </form>
                    </div>
                  </div>

              </Dialog>
        </div>
    )
};
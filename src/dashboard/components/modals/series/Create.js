import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import { useHttpClient } from '../../../../shared/hooks/http-hook';
import { Dialog } from 'primereact/dialog';
import { Button }  from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { DUMMY_SIMS } from '../../../../shared/data/DUMMY_DATA';
import { MdConstruction } from 'react-icons/md';

export const Create = () => {
    const [displayBasic, setDisplayBasic] = useState(false);

    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    const { sendRequest } = useHttpClient();

    const leagueId = useParams().leagueId;

    const navigate = useNavigate();

    const seriesSubmitHandler = async event => {
      console.log("generating new series...");
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/series`, 
              'POST', 
              JSON.stringify({
                  title: formik.values.name,
                  league: leagueId,
                  description: formik.values.description,
                  sim: formik.values.sim,
                  divisions: []
              }),
              { 'Content-Type': 'application/json' }
          );
          onHide("displayBasic");
      } catch (err) {}
    }

    const formik = useFormik({
      initialValues: {
          name: '',
          description: '',
          sim: null
      },
      validate: (data) => {
          let errors = {};

          if (!data.name) {
            errors.name = 'Name is required.';
          }

          if (!data.sim) {
            errors.description = 'Your series needs a Sim.';
          }

          return errors;
      },
      onSubmit: (data) => {
        seriesSubmitHandler(data);
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
              <Button label="SERIES BUILDER" icon={<MdConstruction style={{marginRight:'5px', fontSize:'1.5em'}}/>} className="p-button-warning p-button-text" onClick={() => onClick("displayBasic")} />
              <Dialog header="Building Your New Series..." visible={displayBasic} style={{ width: '55vw' }} onHide={() => onHide('displayBasic')}>
                <div className="form-demo center">
                  <div className="flex justify-content-center">
                    <div className='newCard'>
                          <form onSubmit={formik.handleSubmit} className="p-fluid">
                            <div>

                              <br />

                              <div className="field">
                                <span className="p-float-label">
                                  <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") })} />
                                  <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })} >
                                    {" "}Name*{" "}
                                  </label>
                                </span>
                                {getFormErrorMessage("name")}
                              </div>

                              <p style={{ fontSize: "small", width: "100%", textAlign: "left" }} >
                                <i>example: "F1 Official Series"</i>
                              </p>

                              <br />

                              <div className="field">
                                <span className="p-float-label">
                                  <InputText
                                    id="description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    className={classNames({
                                      "p-invalid": isFormFieldValid("description"),
                                    })}
                                  />
                                  <label htmlFor="description" >
                                    {" "}Description{" "}
                                  </label>
                                </span>
                              </div>

                              <p style={{ fontSize: "small", width: "100%", textAlign: "left" }} >
                                <i>example: "A fun series for all skill levels"</i>
                              </p>

                              <br />

                              <div className="field">
                                <span className="p-float-label">
                                  <Dropdown
                                    id="sim"
                                    value={formik.values.sim}
                                    options={DUMMY_SIMS}
                                    onChange={formik.handleChange}
                                    filter
                                    showClear
                                    filterBy="label"
                                    placeholder="Select a Sim Title"
                                    className={classNames({ "p-invalid": isFormFieldValid("description") })}
                                    required
                                  />
                                  <label htmlFor="sim">Select a Sim*</label>
                                  {getFormErrorMessage("sim")}
                                </span>
                              </div>

                              <br />
                            </div>

                            <Divider />

                            <div className="center">
                              <Button type="submit" className="center"> Submit </Button>
                            </div>
                          </form>
                    </div>
                  </div>
                </div>
              </Dialog>
        </div>
    )
}
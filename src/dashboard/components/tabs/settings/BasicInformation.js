import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';

const regions = [
  { label: "North America", value: "North America" },
  { label: "South America", value: "South America" },
  { label: "Africa", value: "Africa" },
  { label: "Europe", value: "Europe" },
  { label: "Asia", value: "Asia" },
  { label: "Middle East", value: "Middle East" },
  { label: "Australia", value: "Australia" },
  { label: "Central America", value: "Central America" },
];

export default function BasicInformation(props) {
  let navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const leagueId = useParams().leagueId;
  const loadedLeague = props.league;
  const userId = props.userId;

  let isOwner;
  if(loadedLeague.owner == userId) {
    isOwner = true;
  } else {
    isOwner = false;
  }

  const leagueUpdateHandler = async (e) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}`,
        "PATCH",
        JSON.stringify({
          title: formik.values.name,
          acronym: formik.values.acronym,
          tagline: formik.values.tagline,
          description: formik.values.description,
          region: formik.values.region,
          guildId: formik.values.guildId,
        }),
        { "Content-Type": "application/json" }
      );
      navigate(0);
      formik.resetForm();
    } catch (err) {}
  };

  const leagueDeleteHandler = async event => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}`,
        'DELETE'
      );
      navigate("/search");
    } catch (err) {}
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: loadedLeague.properties.title,
      acronym: loadedLeague.properties.acronym,
      tagline: loadedLeague.properties.tagline,
      description: loadedLeague.properties.description,
      region: loadedLeague.properties.region,
      guildId: loadedLeague.properties.guildId
    },
    validate: (data) => {
      let errors = {};

      if (!data.name) {
        errors.name = "Your league needs a name.";
      }

      if (!data.acronym) {
        errors.acronym = "Your league needs an acronym between 3 and 5 characters long.";
      }

      return errors;
    },
    onSubmit: (data) => {
      leagueUpdateHandler(data);
    },
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {return (isFormFieldValid(name) && (<small className="p-error">{formik.errors[name]}</small> ))};

  const DeleteModal = () => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const dialogFuncMap = { 'displayBasic': setDisplayBasic }
    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    return (
        <React.Fragment>
          {!isLoading && loadedLeague && (
            <div className="dialog-demo">
              <Button 
                icon="pi pi-times" 
                className="p-button-rounded p-button-danger p-button-text" 
                aria-label="Cancel" 
                onClick={() => onClick('displayBasic')} 
                label='Delete this league' 
                disabled={!isOwner}
                />
              <Dialog header='Warning' visible={displayBasic} style={{ width: '30rem', border: '2px solid red' }} onHide={() => onHide('displayBasic')}>
                <div>
                  <br/>
                  <h3 className='center'>Delete {loadedLeague.properties.title}?</h3>
                  <br/>
                  <br/>
                  <div className='center'>
                    <i className="pi pi-exclamation-triangle" style={{'fontSize': '5em', 'color': 'red'}}/>
                  </div>
                  <br/>
                  <br/>
                  <h5 className='center'>Are you sure? You can't undo this action.</h5>
                  <br/>
                  <br/>
                  <div className="center">
                  <Button label='Cancel' onClick={() => onHide('displayBasic')} style={{margin:'3%', border:'none'}}/>
                  <Button label='Delete' onClick={leagueDeleteHandler} style={{margin:'3%', backgroundColor:'red', border:'none'}}/>
                  </div>
                </div>
              </Dialog>
            </div>
          )}
        </React.Fragment>
    );
  };
  

    return (
      <div style={{padding:'0em 2em'}}>
        {!isLoading && loadedLeague && (
          <div>
            <br />

            <form onSubmit={formik.handleSubmit} className="p-fluid">
              <h3 className="center">Basic Information</h3>

              <br />
              <div className="field">
                <span className="p-float-label">
                  <InputText
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": isFormFieldValid("name"),
                    })}
                  />
                  <label
                    htmlFor="name"
                    className={classNames({
                      "p-error": isFormFieldValid("name"),
                    })}
                  >
                    {" "}
                    Name*{" "}
                  </label>
                </span>
                {getFormErrorMessage("name")}
              </div>

              <br />

              <div className="field">
                <span className="p-float-label">
                  <InputText
                    id="acronym"
                    name="acronym"
                    value={formik.values.acronym}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": isFormFieldValid("acronym"),
                    })}
                  />
                  <label
                    htmlFor="acronym"
                    className={classNames({
                      "p-error": isFormFieldValid("acronym"),
                    })}
                  >
                    {" "}
                    Acronym* (3-5 letters){" "}
                  </label>
                </span>
                {getFormErrorMessage("acronym")}
              </div>

              <br />

              <div className="field">
                <span className="p-float-label">
                  <InputText
                    id="tagline"
                    name="tagline"
                    value={formik.values.tagline}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": isFormFieldValid("tagline"),
                    })}
                  />
                  <label
                    htmlFor="tagline"
                    className={classNames({
                      "p-error": isFormFieldValid("tagline"),
                    })}
                  >
                    {" "}
                    Tagline ( A short description ){" "}
                  </label>
                </span>
                {getFormErrorMessage("tagline")}
              </div>

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
                  <label
                    htmlFor="description"
                    className={classNames({
                      "p-error": isFormFieldValid("description"),
                    })}
                  >
                    {" "}
                    Description{" "}
                  </label>
                </span>
                {getFormErrorMessage("description")}
              </div>

              <br />

              <div className="field">
                <span className="p-float-label">
                  <Dropdown
                    id="region"
                    value={formik.values.region}
                    options={regions}
                    onChange={formik.handleChange}
                    filter
                    showClear
                    filterBy="label"
                    placeholder="Select a Region"
                    required
                    emptyMessage="No Regions"
                  />
                  <label htmlFor="region">Select a region</label>
                </span>
              </div>

              <br />
              <br />

              <Button type="submit" className="center" label="Update" />
            </form>

            <br />

            <br />

            <Divider />

            <br />

            <div className="center" style={{ width: "100%" }}>
              <DeleteModal isOwner={isOwner}/>
            </div>
          </div>
        )}
      </div>
    );
}
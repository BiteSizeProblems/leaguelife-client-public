import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useFormik } from 'formik';
import { useHttpClient } from '../../../shared/hooks/http-hook';

import { Avatar } from 'primereact/avatar';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import LogoutButton from '../../../shared/components/FormElements/authButton/LogoutButton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { DUMMY_STATES, DUMMY_COUNTRIES } from '../../../shared/data/DUMMY_DATA';

import '../UserPages.css';

export default function Account(props) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth0();
  const { sendRequest } = useHttpClient();

  const [loadedLeagues, setLoadedLeagues] = useState();

  let loadedUser, userId;
  if(props.user) {
    loadedUser = props.user;
    userId = loadedUser.id;
  };

  useEffect(() => {
    const getLeagues = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}/leagues`);
        setLoadedLeagues(responseData.leagues);
      } catch (err) {}
    };
    getLeagues();
  }, [sendRequest, userId]);

  const LeaveLeagueDialog = (props) => {
    const leagueId = props.league._id;
    const league = props.league;

    const leaveLeagueHandler = async event => {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/leagues/${leagueId}`,
          'PATCH',
          JSON.stringify({ league: league }),
          { 'Content-Type': 'application/json' }
        );
        //navigate(0);

      } catch (err) {}
    };

    const message = (
      <div>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>Are you sure? </p>
        <p>Confirming this message will:</p>
        <ul>
          <li>Remove you from this league.</li>
          <li>Require you to reapply for admission back into this league.</li>
        </ul>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>You cannot reverse this action.</p>
        <p style={{fontSize:'50%', color:'#8C8C8C'}}>* Actions taken following this message will have no effect on any associated discord accounts or servers.</p>
        
      </div>
      
    )

    const confirmLeave = () => {
      confirmDialog({
          message: message,
          header: 'Leave this league',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger',
          accept: () => leaveLeagueHandler()
      });
    };

    return (
      <>
        <Button onClick={confirmLeave} label="Leave" className="p-button-danger p-button-text"/>
        <ConfirmDialog />
      </>
    )
  };

  const DeleteAccountDialog = () => {

    const deleteAccountHandler = async event => {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
          'DELETE'
        );
        navigate(`${process.env.REACT_APP_BACKEND_URL}`, { replace: true });

      } catch (err) {}
    };

    const message = (
      <div>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>Are you sure? </p>
        <p>Confirming this message will:</p>
        <ul>
          <li>Permanently delete your account.</li>
          <li>Permanently delete any leagues you own.</li>
        </ul>
        <p style={{fontWeight:'bold', color:'#B93C3C'}}>You cannot reverse this action.</p>
        <p style={{fontSize:'50%', color:'#8C8C8C'}}>* Actions taken following this message will have no effect on any associated discord accounts or servers.</p>
        
      </div>
    )

    const confirmDelete = () => {
      confirmDialog({
          message: message,
          header: 'Delete Account',
          icon: 'pi pi-info-circle',
          acceptClassName: 'p-button-danger',
          accept: () => deleteAccountHandler()
      });
    };

    return (
      <>
        <Button onClick={confirmDelete} label="DELETE ACCOUNT" className="p-button-danger p-button-text"/>
        <ConfirmDialog />
      </>
    )
  };

  const Form = () => {

    const userUpdateHandler = async event => {
      try {
          await sendRequest(
              `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`, 
              'PATCH', 
              JSON.stringify({ 
                name: formik.values.name,
                username: formik.values.username,
                email: formik.values.email,
                city: formik.values.city,
                state: formik.values.state,
                country: formik.values.country,
                continent: formik.values.continent
               }),
              { 'Content-Type': 'application/json' }
          );
          formik.resetForm();
          navigate(0);
      } catch (err) {}
    };
    
    const formik = useFormik({
      initialValues: {
          name: loadedUser.properties.name,
          username: loadedUser.properties.username,
          email: loadedUser.properties.email,
          city: loadedUser.properties.city,
          state: loadedUser.properties.state,
          country: loadedUser.properties.country,
          continent: loadedUser.properties.continent
      },
      validate: (data) => {
          let errors = {};
  
          if (!data.username) {
            errors.username = 'Username is required.';
          };
  
          if (!data.email) {
            errors.email = 'Email is required.';
          };
  
          return errors;
      },
      onSubmit: () => {
        userUpdateHandler();
      }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
      return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const header = () => {

      let avatarImage;
      if (loadedUser.properties.avatar) {
        avatarImage = loadedUser.properties.avatar
      } else {
        avatarImage = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
      };
  
      return <Avatar image={avatarImage} label="Avatar" className="mr-2" size="xlarge" shape="circle" />
    };

    const handleReset = () => {
      formik.resetForm();
    }

    const dividerStyle = { marginTop:'3rem' , marginBottom:'3rem'};

    const leagueActionTemplate = (option) => {
      return <LeaveLeagueDialog league={option}/>
    }

    const formBody = (
      <div className='user-page-container center'>
        <Card 
          style={{ width:'80vw', padding:'2rem' }} 
          header={header}
          title='My Account' >
          <form onSubmit={formik.handleSubmit} >

            <Divider style={dividerStyle}/>

            <div className="grid" style={{ textAlign: 'left' }}>
            
              <div className="col-5 flex align-items-center justify-content-center">
                <div className="p-fluid">

                  <div className="field">
                    <label htmlFor="name">Full Name</label>
                    <InputText id="name" value={formik.values.name} onChange={formik.handleChange}/>
                  </div>

                  <div className="field">
                    <label htmlFor="username">Username</label>
                    <InputText id="username" value={formik.values.username} disabled={true}/>
                  </div>

                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={formik.values.email} disabled={true}/>
                  </div>

                </div>
              </div>

              <div className="col-2">
                <Divider layout="vertical" />
              </div>

              <div className="col-5 flex align-items-center justify-content-center">
                <div className="p-fluid">

                  <div className="grid">

                    <div className="col-5">
                      <div className="p-fluid">

                        <div className="field">
                          <label htmlFor="city">City</label>
                          <InputText id="city" value={formik.values.city} onChange={formik.handleChange}/>
                        </div>

                        <div className="field">
                          <label htmlFor="state">State</label>
                          <InputText id="state" value={formik.values.state} onChange={formik.handleChange}/>
                        </div>

                      </div>
                    </div>

                    <div className="col-5">
                      <div className="p-fluid">

                        <div className="field">
                          <label htmlFor="country">Country</label>
                          <InputText id="country" value={formik.values.country} onChange={formik.handleChange}/>
                        </div>

                        <div className="field">
                          <label htmlFor="continent">Continent</label>
                          <InputText id="continent" value={formik.values.continent} onChange={formik.handleChange}/>
                        </div>

                      </div>
                    </div>

                  </div>

                </div>
              </div>
            
            </div>

            <div style={{marginTop:'3%', marginBottom:'3%'}}>

              <Button 
                type='submit' 
                icon="pi pi-check" 
                disabled={!formik.dirty} 
                style={{marginRight:'3%'}}
                className="p-button-rounded p-button-success"/>

              <Button 
                icon="pi pi-refresh" 
                disabled={!formik.dirty}
                className="p-button-rounded p-button-secondary"
                onClick={handleReset}/>
            </div>

            <Divider style={dividerStyle}/>

          </form>

          <Card style={{padding:'2rem' }} title='My Leagues' >

            <DataTable value={loadedLeagues} responsiveLayout="scroll" dataKey="_id" stripedRows 
              paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" alwaysShowPaginator={false}
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]} size='small'>
              <Column field="properties.title" header="Leagues"  />
              <Column body={leagueActionTemplate} />
            </DataTable>

          </Card>

          <Divider style={dividerStyle}/>

          <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'1rem'}}>
            <LogoutButton />
            <DeleteAccountDialog />
          </div>

        </Card>
      </div>
    );

    return (
      <React.Fragment>{formBody}</React.Fragment>
    );
  };

  return (
    <React.Fragment>
      {isAuthenticated && loadedUser && (
        <Form />
      )}
    </React.Fragment>
  );
};
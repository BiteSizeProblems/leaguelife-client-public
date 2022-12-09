import React, { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useHttpClient } from '../../hooks/http-hook';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import { FiMail } from 'react-icons/fi';
import { MdEmail } from 'react-icons/md';
import { Dropdown } from "primereact/dropdown";
import { useFormik } from 'formik';

import { DUMMY_LEAGUE_ROLES } from '../../data/DUMMY_DATA';

export const LeagueInvite = (props) => {
    const { user } = useAuth0();
    const [displayBasic, setDisplayBasic] = useState(false);
    const {isLoading, sendRequest } = useHttpClient();
    const dialogFuncMap = { 'displayBasic': setDisplayBasic };
    const [loadedLeagues, setLoadedLeagues] = useState(); // map this out to make dropdown work correctly.

    let userId = user.sub.replaceAll("|", "");

    const selectedUser = props.user;

    const inviteSubmitHandler = async (event) => {
      console.log("Sending league invite...");

      let leagueId = formik.values.league.id;
      let leagueTitle = formik.values.league.title;

      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/invite`,
          "POST",
          JSON.stringify({
            title: 'League Invite',
            subject: leagueTitle,
            type: 'Initial',
            author: userId,
            recipient: props.user._id,
            league: formik.values.league._id,
            additionalContent: formik.values.permissions
          }),
          { "Content-Type": "application/json" }
        );
        onHide("displayBasic");
      } catch (err) {}
    };

    useEffect(() => {
      const fetchLeagues = async () => {
          try {
              const responseData = await sendRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/search/${userId}/league-invite`
              );
              setLoadedLeagues(responseData.leagues);
          } catch (err) {}
      };
      fetchLeagues();
    }, [sendRequest, userId]);

    const formik = useFormik({
      initialValues: {
          league: '',
          permissions: 'member'
      },
      validate: (data) => {
          let errors = {};

          if (!data.league) {
            errors.league = 'League is required.';
          };

          return errors;
      },
      onSubmit: () => {
        inviteSubmitHandler();
        onHide('displayBasic');
        formik.resetForm();
      }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    
    const onClick = (name) => { dialogFuncMap[`${name}`](true) };
    const onHide = (name) => { dialogFuncMap[`${name}`](false) };

    let eligibleLeagues;
    if(loadedLeagues) {
      eligibleLeagues = loadedLeagues.filter(league => !selectedUser.leagues.includes(league._id));
    } else {
      eligibleLeagues = [];
    }
    
    return (
        <div className="dialog-demo">
          <Button style={{margin:'2%' }} onClick={() => onClick('displayBasic')} icon={<MdEmail style={{ marginRight: '5%' }}/>} label='Invite' />
              <Dialog header='League Invitation' style={{width:'35vw'}}
                      visible={displayBasic} onHide={() => onHide('displayBasic')} >

                <form onSubmit={formik.handleSubmit} className="p-fluid">

                  <br/>

                  <div className="field">
                    <span className="p-float-label">
                    <Dropdown id="league" value={formik.values.league} options={eligibleLeagues} 
                                onChange={formik.handleChange} optionLabel='title'
                                emptyMessage='No leagues to share...'/>
                    <label htmlFor="league">Select a league</label>
                    </span>
                  </div>

                  <br/>

                  <div className="field">
                    <span className="p-float-label">
                    <Dropdown id="permissions" value={formik.values.permissions} options={DUMMY_LEAGUE_ROLES} 
                                onChange={formik.handleChange} optionLabel='label' />
                    <label htmlFor="permissions">Select a permission level</label>
                    </span>
                  </div>

                  <br/>

                  <Button type="submit" disabled={!formik.dirty} className='center' label="Send Invite" icon={<MdEmail />}/>

                  <br/>

                </form>

              </Dialog>
        </div>
    )
  };
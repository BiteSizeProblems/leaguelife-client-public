import React from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../../../../shared/hooks/http-hook";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';

import { FaDiscord } from 'react-icons/fa';

export default function DiscordSettings(props) {
  const { user } = useAuth0();
  let navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = user.sub.replaceAll("|", "");

  const leagueId = useParams().leagueId;
  const loadedLeague = props.league;

  const onLinkToDiscord = () => {
    window.open('https://discord.com/api/oauth2/authorize?client_id=1031614546894389310&permissions=8&scope=bot%20applications.commands', '_blank').focus()
  };

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

  let isOwner;
  if (userId == loadedLeague.owner) {
    isOwner = true;
  } else {
    isOwner = false;
  }

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

      if (data.guildId.length < 17 || data.guildId.length > 25) {
        errors.guildId = "Discord Server IDs must be between 17 and 25 characters long.";
      }

      return errors;
    },
    onSubmit: (data) => {
      leagueUpdateHandler(data);
    },
  });

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {return (isFormFieldValid(name) && (<small className="p-error">{formik.errors[name]}</small> ))};
  
    const header = <h6>Pick a password</h6>;
    const footer = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{lineHeight: '1.5'}}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
      <div style={{color:'white', padding:'0em 2em'}}>
        {!isLoading && loadedLeague && (
          <div>
            <h3 className="center">DISCORD INTEGRATION</h3>

            <Divider />

            <div className="center">
              <h5 style={{color:'white'}}>Step 1: Authorize the Discord Bot to access your server.</h5>
            </div>

            <br />

            <div className="center">
              <Button
                icon={<FaDiscord style={{ marginRight: "5px" }} />}
                label="connect"
                className="center"
                onClick={onLinkToDiscord}
                disabled={!isOwner}
              />
            </div>

            <br />

            <Divider />

            <div className="center">
              <h5 style={{color:'white'}}>Step 2: Enter your Discord Server's ID for future reference.</h5>
            </div>

            <br />

            <div className="center">
              <br />

              <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className="">
                  <span className="p-float-label">
                    <Password
                      id="guildId"
                      name="guildId"
                      value={formik.values.guildId} 
                      onChange={formik.handleChange} 
                      header={header} 
                      footer={footer}
                      toggleMask={isOwner}
                      className={classNames({
                        "p-invalid": isFormFieldValid("guildId"),
                      })}
                    />
                    <label
                      htmlFor="guildId"
                      className={classNames({
                        "p-error": isFormFieldValid("guildId"),
                      })}
                    >
                      {" "}
                      Guild / Server ID{" "}
                    </label>
                  </span>
                  {getFormErrorMessage("guildId")}
                </div>

                <br />
                <br />

                <Button
                  id="discordIntegration"
                  name="discordIntegration"
                  type="submit"
                  className="center"
                  label="Save"
                />
              </form>
            </div>

            <br />
          </div>
        )}
      </div>
    );
}
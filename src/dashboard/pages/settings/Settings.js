import React from "react";
import { useHttpClient } from '../../../shared/hooks/http-hook';

import { Fieldset } from 'primereact/fieldset';
import { TabView, TabPanel } from 'primereact/tabview';

import BasicInformation from "../../components/tabs/settings/BasicInformation";
import DiscordSettings from "../../components/tabs/settings/DiscordSettings";

export const Settings = (props) => {
  const { error } = useHttpClient();

  const loadedLeague = props.league;
  const userId = props.userId;

  if(error) {
    console.log(error);
  }

  return (
      <Fieldset legend='SETTINGS' >
        <TabView >

          <TabPanel header="Basic Information" >
            <BasicInformation league={loadedLeague} userId={userId}/>
          </TabPanel>

          <TabPanel header="Discord" >
            <DiscordSettings league={loadedLeague} userId={userId}/>
          </TabPanel>

        </TabView>
      </Fieldset>
  );
}
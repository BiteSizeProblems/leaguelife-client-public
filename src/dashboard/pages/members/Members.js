import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from '../../../shared/hooks/http-hook';

import { Panel } from 'primereact/panel';
import Loading from "../../../shared/components/pages/Loading";
import { Fieldset } from 'primereact/fieldset';
import { TabView, TabPanel } from 'primereact/tabview';

import MembersList from '../../components/tabs/members/MembersList';
import Drivers from "../../components/tabs/members/Drivers";
import StaffList from "../../components/tabs/members/StaffList";

import './Members.css';

export default function Members(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedMembers, setLoadedMembers] = useState();
  const [loadedDrivers, setLoadedDrivers] = useState();
  const [loadedStaff, setLoadedStaff] = useState();

  const league = props.league;
  const leagueId = useParams().leagueId;

    useEffect(() => {
      const fetchMembers = async () => {
          try {
              const responseData = await sendRequest(
                  `${process.env.REACT_APP_BACKEND_URL}/leagues/${leagueId}/members`
              );
              setLoadedMembers(responseData.members);
              setLoadedDrivers(responseData.drivers);
              setLoadedStaff(responseData.staff);
          } catch (err) {} 
      };
      fetchMembers();
    }, [sendRequest, leagueId]);

    if (isLoading) {
      return (
        <div className="center">
          <Loading />
        </div>
      );
    }

    return (
      <Panel>
        <TabView>
          <TabPanel header="Members">
            <MembersList members={loadedMembers} league={league}/>
          </TabPanel>
          <TabPanel header="Drivers">
            <Drivers drivers={loadedDrivers} members={loadedMembers}/>
          </TabPanel>
          <TabPanel header="Staff">
            <StaffList staff={loadedStaff} members={loadedMembers}/>
          </TabPanel>
        </TabView>
      </Panel>
    );
}
import React, { useEffect, useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from "react-router-dom";

import { useHttpClient } from "../../../shared/hooks/http-hook";
import { FilterMatchMode } from 'primereact/api';

import { FaUserSlash } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { MultiSelect } from 'primereact/multiselect';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";

import DashboardButton from "../../../shared/components/Navigation/dashboardButton/DashboardButton";

import { NewLeague } from '../../../shared/components/modals/NewLeague';
import { LeagueRequest } from '../../../shared/components/modals/LeagueRequest';
import { LeagueInvite } from "../../../shared/components/modals/LeagueInvite";

import '../UserPages.css';

const isMemberFilters = [
  { label: 'Member', value: true },
  { label: 'Not a member', value: false }
];

export const DUMMY_REGIONS = [ 'North America', 'South America', 'Africa', 'Europe', 'Asia', 'Middle East', 'Australia', 'Central America' ];

const UsersAndLeagues = (props) => {
    const { user } = useAuth0();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    let navigate = useNavigate();
    const [loadedUsers, setLoadedUsers] = useState();
    const [loadedLeagues, setLoadedLeagues] = useState();
    const [currentUser, setCurrentUser] = useState(props.currentUser);

    let userId = user.sub.replaceAll("|", "");

    const [userFilters, setUserFilters] = useState(null);

    const [leagueFilters, setLeagueFilters] = useState({
      'isMember': { value: null, matchMode: FilterMatchMode.EQUALS },
      'region': { value: null, matchMode: FilterMatchMode.EQUALS }
    })

    useEffect(() => {
        const fetchMembersAndLeagues = async () => {
          try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/search/${userId}`);
            setLoadedUsers(responseData.users);
            setLoadedLeagues(responseData.leagues);
            setCurrentUser(responseData.users.find(element => element._id === userId));
          } catch (err) {}
        };
        fetchMembersAndLeagues();
      }, [sendRequest, userId]);

      // USERS DATATABLE

      const avatarTemplate = (options) => {
        
        let username;
        if(userId == options._id){
          username = `${options.username} (me)`;
        } else {
          username = options.username;
        }

        return (
            <React.Fragment>
                <Avatar image={options.avatar} shape="circle" imageAlt='N/A' 
                        onError={(e) => e.target.src = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'} 
                        style={{ verticalAlign: 'middle', marginRight:'10px'}} />
                <span className="image-text" >{username}</span>
            </React.Fragment>
        );
      };

      const memberActionsTemplate = (options) => {
        if(currentUser.leagues.length > 0) {
          return (
            <div className="row-actions-container">
              {userId !== options._id && ( <LeagueInvite user={options} /> )}
            </div>
          );
        }
      };
      
      const MembersDataTable = () => {

        return (
            <DataTable value={loadedUsers} responsiveLayout="stack" dataKey="id" stripedRows filters={userFilters} filterDisplay="menu" style={{minheight:'55vh', width:'75vw'}}
              paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown" alwaysShowPaginator={false}
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]} size='small'>
              <Column field="properties.username" header="Username" body={avatarTemplate} filter />
              <Column field="leagues.length" header="Leagues" sortable />
              <Column body={memberActionsTemplate} />
            </DataTable>
        );
      };

      // LEAGUES DATATABLE

      const leagueHeader = ( <NewLeague leagues={loadedLeagues}/> );

      const isMemberBodyTemplate = (options) => {
        if (options.isMember === true) {
          return <AiOutlineCheckCircle style={{color:'#54D5E1', fontSize:'2em'}} value={true}/>
        } else {
          return <FaUserSlash style={{fontSize:'2em'}}/>
        }
      };

      const isMemberFilterTemplate = (options) => {
        return (
          <Dropdown value={options.value} options={isMemberFilters} optionValue='value' optionLabel='label'
                    onChange={(e) => options.filterCallback(e.value)} /> 
        );
      };

      const regionFilterTemplate = (options) => {
        return (
          <MultiSelect value={options.value} options={DUMMY_REGIONS} 
                        itemTemplate={regionItemTemplate} onChange={(e) => options.filterCallback(e.value)} 
                        placeholder="Any" className="p-column-filter" showClear
                        />
        );
      };

      const regionItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <span className="image-text">{option}</span>
            </div>
        );
      };

      const titleBodyTemplate = (league) => {
        const displayString = `${league.title} (${league.acronym})`;

        return <p>{displayString}</p>
      };

      const leagueActionsTemplate = (option) => {
        if(option.hasPermissions == true){
          return <DashboardButton league={option}/>;
        } else {
          return <LeagueRequest league={option} user={currentUser}/>
        }
      };

      const LeaguesDataTable = () => {

        return (
              <DataTable value={loadedLeagues} responsiveLayout="stack" loading={isLoading} dataKey="id" stripedRows filters={leagueFilters} filterDisplay="menu" header={leagueHeader}
                paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]} style={{minheight:'55vh', width:'75vw'}}
                alwaysShowPaginator={false} size='small'>

                <Column field="isMember" header="Your League" body={isMemberBodyTemplate} filter filterElement={isMemberFilterTemplate} />
                <Column field="region" header="Region" filter filterElement={regionFilterTemplate}/>
                <Column field="title" header="Name" body={titleBodyTemplate} />
                <Column field="tagline" header="Tagline" />
                <Column field="drivers" header="Drivers" sortable />
                <Column body={leagueActionsTemplate} />

              </DataTable>
        );
      };

    return (
      <Card className="user-page-container" style={{width:'95%', display:'flex', justifyContent:'center', textAlign:'center'}} title="Search">
        <TabView>
          <TabPanel header="Leagues">
            <LeaguesDataTable sortField={'id'} sortOrder={1} />
          </TabPanel>
          <TabPanel header="Users">
            <MembersDataTable sortField={'id'} sortOrder={1} />
          </TabPanel>
        </TabView>
      </Card>
    );
};

export default UsersAndLeagues;
import React, { useState , useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useHttpClient } from './shared/hooks/http-hook';

import Loading from './shared/components/pages/Loading';
import AuthError from './shared/components/pages/AuthError';
import Footer from './shared/components/footer/Footer';

import Topbar from './shared/components/Navigation/topbar/Topbar';

// NOT AUTH
import Landing from './user/pages/landing/Landing';
// SHARED
import IncidentReport from './league/pages/IncidentReport';
import InConstruction from './shared/components/templates/inConstruction/InConstruction';
// USER
import Home from './user/pages/home/Home';
import UsersAndLeagues from './user/pages/Search/UsersAndLeagues';
import Account from './user/pages/account/Account';
import Notifications from './user/pages/notifications/Notifications';
// DASHBOARD
import DashboardContainer from './dashboard/pages/container/Container';

import './App.css';

const App = () => {
    const { user, isAuthenticated, isLoading, error } = useAuth0();
    const { sendRequest } = useHttpClient();
    const [loadedUser, setLoadedUser] = useState();

    useEffect(() => {
      const fetchUser = async () => {
        const userId = user.sub.replaceAll("|", "");

        try {
          const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`);
          setLoadedUser(responseData.user);
        } catch (err) {
          console.log(err);
        }

      };
      if(isLoading == false && isAuthenticated == true) { fetchUser(); }
    }, [isLoading]);
  
    const AuthenticatedRoutes = () => {
      
      return (
        <div id="page-container">
          <Topbar user={loadedUser}/>
          <main id="content-wrap">
            <Routes>
              <Route path="/*" element={<Home/>}/>
              <Route path="/search/:uid" element={<UsersAndLeagues currentUser={loadedUser}/>}/>
              <Route path="user/:uid/myaccount" element={<Account user={loadedUser}/>}/>
              <Route path="user/:uid/notifications" element={<Notifications/>}/>
              <Route path="/help" element={<InConstruction/>}/>
              <Route path="/leagues/:leagueId/dashboard/*" element={<DashboardContainer user={loadedUser}/>}/>
              <Route path="/leagues/:leagueId/incident-report" element={<IncidentReport/>}/>
            </Routes>
          </main>
          <Footer />
        </div>
      )

    };

    const UnAuthenticatedRoutes = () => {
  
      return (
        <div id="page-container">
          <Topbar user={loadedUser}/>
          <main id="content-wrap">
            <Routes>
              <Route path="/*" element={<Landing/>} />
            </Routes>
          </main>
          <Footer />
        </div>
      )

    };

    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <AuthError message={error.message}/>;
    }

    return (
      <React.Fragment>
        {!isAuthenticated && (
          <UnAuthenticatedRoutes />
        )}
        {isAuthenticated && (
          <AuthenticatedRoutes />
        )}
      </React.Fragment>
    )

};

export default App;

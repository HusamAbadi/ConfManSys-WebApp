
import React from 'react';

import useFetchData from '../hooks/useFetchData';

import SessionList from '../components/Conference/SessionList';



const SessionsPage = ({ conferenceId }) => {

  const { data: sessions, loading } = useFetchData(

    `conferences/${conferenceId}/sessions`

  );



  return (

    <div>

      <h1>Sessions</h1>

      {loading ? <p>Loading...</p> : <SessionList sessions={sessions} />}


    </div>


  

)};
export default SessionsPage;


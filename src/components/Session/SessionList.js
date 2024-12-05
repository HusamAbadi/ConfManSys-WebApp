import React from 'react';

const SessionList = ({ sessions }) => {
  return (
    <div>
      <h2>Sessions</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            {session.title? session.title : ""} - {session.startTime} to {session.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;

import React from 'react';

const SessionDetail = ({ session }) => {
  return (
    <div>
      <h2>{session.title}</h2>
      <p>Start Time: {session.startTime}</p>
      <p>End Time: {session.endTime}</p>
      <p>Location: {session.location}</p>
      <h3>Chairpersons</h3>
      <ul>
        {session.chairpersons.map((chairperson) => (
          <li key={chairperson}>{chairperson}</li>
        ))}
      </ul>
    </div>
  );
};

export default SessionDetail;

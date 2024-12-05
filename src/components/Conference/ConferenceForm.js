import React, { useState, useEffect } from 'react';
import {
  addConference,
  updateConference,
} from '../../services/conferenceService';
import { useNavigate } from 'react-router-dom';

const ConferenceForm = ({ conference = null }) => {
  const [name, setName] = useState(conference ? conference.name : '');
  const [startDate, setStartDate] = useState(
    conference ? conference.startDate : ''
  );
  const [endDate, setEndDate] = useState(conference ? conference.endDate : '');
  const navigate = useNavigate();


  useEffect(() => {
    if (conference) {
      setName(conference.name);
      setStartDate(conference.startDate);
      setEndDate(conference.endDate);
    }
  }, [conference]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const conferenceData = {
      name,
      startDate,
      endDate,
    };

    try {
      if (conference) {
        await updateConference(conference.id, conferenceData);
      } else {
        await addConference(conferenceData);
      }
      navigate("/conferences");


    } catch (error) {
      console.error('Error saving conference: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <button type="submit">
        {conference ? 'Update' : 'Create'} Conference
      </button>
    </form>
  );
};

export default ConferenceForm;

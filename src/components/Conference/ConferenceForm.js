import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addConference, updateConference } from '../../services/conferenceService';
import { collection, addDoc, Timestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const ConferenceForm = ({ conference = null }) => {
  const [name, setName] = useState(conference ? conference.name : '');
  const [startDate, setStartDate] = useState(
    conference && conference.startDate
      ? new Date(conference.startDate.seconds * 1000).toISOString().split('T')[0]
      : ''
  );
  const [endDate, setEndDate] = useState(
    conference && conference.endDate
      ? new Date(conference.endDate.seconds * 1000).toISOString().split('T')[0]
      : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (conference) {
      setName(conference.name);
      if (conference.startDate) {
        setStartDate(new Date(conference.startDate.seconds * 1000).toISOString().split('T')[0]);
      }
      if (conference.endDate) {
        setEndDate(new Date(conference.endDate.seconds * 1000).toISOString().split('T')[0]);
      }
    }
  }, [conference]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const conferenceData = {
        name,
        startDate,
        endDate,
      };

      if (conference) {
        await updateConference(conference.id, conferenceData);
      } else {
        await addConference(conferenceData);
      }
      navigate("/conferences");
    } catch (error) {
      console.error('Error saving conference: ', error);
      alert('Error saving conference. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Conference Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          min={startDate}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {isSubmitting 
            ? 'Saving...' 
            : conference 
              ? 'Update Conference' 
              : 'Create Conference'
          }
        </button>
      </div>
    </form>
  );
};

export default ConferenceForm;

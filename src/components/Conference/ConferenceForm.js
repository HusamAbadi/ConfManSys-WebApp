import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addConference,
  updateConference,
} from '../../services/conferenceService';
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebase/config';

const ConferenceForm = ({ conference = null }) => {
  const [name, setName] = useState(conference ? conference.name : '');
  const [startDate, setStartDate] = useState(
    conference && conference.startDate
      ? new Date(conference.startDate.seconds * 1000)
          .toISOString()
          .split('T')[0]
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
        setStartDate(
          new Date(conference.startDate.seconds * 1000)
            .toISOString()
            .split('T')[0]
        );
      }
      if (conference.endDate) {
        setEndDate(
          new Date(conference.endDate.seconds * 1000)
            .toISOString()
            .split('T')[0]
        );
      }
    }
  }, [conference]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const conferenceData = {
        name,
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
      };

      let conferenceId;

      if (conference) {
        // Update existing conference
        await updateConference(conference.id, conferenceData);
        conferenceId = conference.id;
      } else {
        // Create new conference
        const conferenceDocRef = await addDoc(
          collection(db, 'conferences'),
          conferenceData
        );
        conferenceId = conferenceDocRef.id;

        // Automatically create days for the conference
        const daysRef = collection(db, 'conferences', conferenceId, 'days');
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (
          let current = new Date(start);
          current <= end;
          current.setDate(current.getDate() + 1)
        ) {
          const dayStart = new Date(current);
          dayStart.setHours(9, 0, 0); // 9:00 AM
          const dayEnd = new Date(current);
          dayEnd.setHours(17, 0, 0); // 5:00 PM

          await addDoc(daysRef, {
            startDate: Timestamp.fromDate(dayStart),
            endDate: Timestamp.fromDate(dayEnd),
            createdAt: Timestamp.now(),
          });
        }
      }

      navigate('/conferences');
    } catch (error) {
      console.error('Error saving conference: ', error);
      alert('Error saving conference. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
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
            : 'Create Conference'}
        </button>
      </div>
    </form>
  );
};

export default ConferenceForm;

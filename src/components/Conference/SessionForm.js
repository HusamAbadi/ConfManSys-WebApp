import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { FaPen } from 'react-icons/fa';
import { epochToDate, epochToDatetimeLocal } from '../../utils/epochConverter';

const SessionForm = ({
  sessionData,
  setSessionData,
  handleAddSession,
  handleEditSession,
  dayId,
  editSessionId,
  persons,
  papers,
  closeModal,
  setConflictingChairPersons,
  setConflictingPresenters
}) => {
  const [presenterSearch, setPresenterSearch] = useState('');
  const [chairPersonSearch, setChairPersonSearch] = useState('');
  const [paperSearch, setPaperSearch] = useState('');
  const [errors, setErrors] = useState({});

  // Filter persons and papers based on search inputs
  const filteredPresenters = persons.filter((person) =>
    person.name.toLowerCase().includes(presenterSearch.toLowerCase())
  );

  const filteredChairPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(chairPersonSearch.toLowerCase())
  );

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(paperSearch.toLowerCase())
  );

  const handleRemovePresenter = (personId) => {
    setSessionData({
      ...sessionData,
      presenters: sessionData.presenters.filter((id) => id !== personId),
    });
  };

  const handleRemoveChairPerson = (personId) => {
    setSessionData({
      ...sessionData,
      chairPersons: sessionData.chairPersons.filter((id) => id !== personId),
    });
  };

  const handleRemovePaper = (paperId) => {
    setSessionData({
      ...sessionData,
      papers: sessionData.papers.filter((id) => id !== paperId),
    });
  };

  // Add conflict checking logic
  const checkConflicts = () => {
    const conflicts = {
      presenters: [],
      chairPersons: [],
    };

    sessionData.presenters.forEach((presenterId) => {
      const person = persons.find((p) => p.id === presenterId);
      if (sessionData.presenters.includes(presenterId) && person) {
        conflicts.presenters.push(person.name);
      }
    });

    sessionData.chairPersons.forEach((chairId) => {
      const person = persons.find((p) => p.id === chairId);
      if (sessionData.chairPersons.includes(chairId) && person) {
        conflicts.chairPersons.push(person.name);
      }
    });

    return conflicts;
  };

  // Call checkConflicts before adding session
  const handleAddSessionWithConflictCheck = () => {
    const conflicts = checkConflicts();
    setConflictingPresenters(conflicts.presenters);
    setConflictingChairPersons(conflicts.chairPersons);
    
    if (editSessionId) {
      handleEditSession(dayId, editSessionId);
    } else {
      handleAddSession(dayId);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!sessionData.title || sessionData.title.trim() === '') {
      newErrors.title = 'Title is required.';
    }
    if (!sessionData.startTime) {
      newErrors.startTime = 'Start date and time are required.';
    }
    if (!sessionData.endTime) {
      newErrors.endTime = 'End date and time are required.';
    }
    if (
      sessionData.startTime &&
      sessionData.endTime &&
      sessionData.startTime.toDate() >= sessionData.endTime.toDate()
    ) {
      newErrors.time = 'End time must be after start time.';
    }
    if (!sessionData.location || sessionData.location.trim() === '') {
      newErrors.location = 'Location is required.';
    }
    if (!sessionData.isBreak) {
      if (!sessionData.presenters || sessionData.presenters.length === 0) {
        newErrors.presenters = 'At least one presenter is required.';
      }
      if (!sessionData.chairPersons || sessionData.chairPersons.length === 0) {
        newErrors.chairPersons = 'At least one chairperson is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (editSessionId) {
        handleEditSession(dayId, editSessionId);
      } else {
        handleAddSession(dayId);
      }
      closeModal();
      // window.location.reload();
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="mt-4 p-6 w-full max-w-3xl max-h-screen overflow-y-auto border rounded-lg shadow-lg bg-white flex flex-col items-center"
>
  <div className="w-full">
    <h3 className="text-lg font-bold text-blue-500 pb-6">
      {editSessionId ? 'Edit Session' : 'Add New Session'}
    </h3>
    <button
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      onClick={closeModal}
    >
      <strong>X</strong>
    </button>

    {/* Is Break */}
    <div className="mb-4">
      <label className="flex items-center text-gray-700 mb-2">
        <input
          type="checkbox"
          checked={sessionData.isBreak}
          onChange={(e) =>
            setSessionData({
              ...sessionData,
              isBreak: e.target.checked,
              title: e.target.checked ? 'Break' : '', // Default title for break session
              presenters: e.target.checked ? [] : sessionData.presenters,
              chairPersons: e.target.checked ? [] : sessionData.chairPersons,
              papers: e.target.checked ? [] : sessionData.papers,
            })
          }
          className="mr-2"
        />
        Is this a break session?
      </label>
    </div>

    {/* Title */}
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">
        Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={sessionData.title}
        onChange={(e) =>
          setSessionData({ ...sessionData, title: e.target.value })
        }
        className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
      />
      {errors.title && (
        <p className="text-red-500 text-xs mt-1">{errors.title}</p>
      )}
    </div>

    {!sessionData.isBreak && (
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Description
        </label>
        <textarea
          value={sessionData.description}
          onChange={(e) =>
            setSessionData({ ...sessionData, description: e.target.value })
          }
          className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
        />
      </div>
    )}

    {/* Location */}
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">
        Location <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={sessionData.location || ''}
        onChange={(e) =>
          setSessionData({ ...sessionData, location: e.target.value })
        }
        className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
      />
      {errors.location && (
        <p className="text-red-500 text-xs mt-1">{errors.location}</p>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      {/* Start Time */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Start Date and Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={
            sessionData.startTime
              ? epochToDatetimeLocal(sessionData.startTime.seconds)
              : ''
          }
          onChange={(e) => {
            const newStartTime = Timestamp.fromDate(new Date(e.target.value));
            setSessionData({
              ...sessionData,
              startTime: newStartTime,
            });
          }}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
        />
        {errors.startTime && (
          <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
        )}
      </div>

      {/* End Time */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          End Date and Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          value={
            sessionData.endTime
              ? epochToDatetimeLocal(sessionData.endTime.seconds)
              : ''
          }
          onChange={(e) => {
            const newEndTime = Timestamp.fromDate(new Date(e.target.value));
            setSessionData({
              ...sessionData,
              endTime: newEndTime,
            });
          }}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
        />
        {errors.endTime && (
          <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
        )}
      </div>
    </div>

    {!sessionData.isBreak && (
      <>
{/* Presenters */}
<div className="mb-4">
  <label className="block text-gray-700 font-medium mb-1">
    Presenters <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={presenterSearch}
    onChange={(e) => setPresenterSearch(e.target.value)}
    className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
    placeholder="Search presenters..."
  />
  {presenterSearch && (
    <ul className="mt-2 border rounded-md bg-white max-h-40 overflow-y-auto">
      {filteredPresenters.map((person) => (
        <li
          key={person.id}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setSessionData({
              ...sessionData,
              presenters: [...sessionData.presenters, person.id],
            });
            setPresenterSearch('');
          }}
        >
          {person.name}
        </li>
      ))}
    </ul>
  )}
  {/* Selected Presenters */}
  {sessionData.presenters.length > 0 && (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700">Selected Presenters:</p>
      <ul className="mt-2">
        {sessionData.presenters.map((id) => {
          const person = persons.find((p) => p.id === id);
          return (
            <li key={id} className="flex items-center justify-between">
              <span>{person?.name}</span>
              <button
                type="button"
                className="text-red-500 text-xs hover:underline"
                onClick={() => handleRemovePresenter(id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  )}
  {errors.presenters && (
    <p className="text-red-500 text-xs mt-1">{errors.presenters}</p>
  )}
</div>

{/* Chair Persons */}
<div className="mb-4">
  <label className="block text-gray-700 font-medium mb-1">
    Chair Persons <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    value={chairPersonSearch}
    onChange={(e) => setChairPersonSearch(e.target.value)}
    className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
    placeholder="Search chairpersons..."
  />
  {chairPersonSearch && (
    <ul className="mt-2 border rounded-md bg-white max-h-40 overflow-y-auto">
      {filteredChairPersons.map((person) => (
        <li
          key={person.id}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setSessionData({
              ...sessionData,
              chairPersons: [...sessionData.chairPersons, person.id],
            });
            setChairPersonSearch('');
          }}
        >
          {person.name}
        </li>
      ))}
    </ul>
  )}
  {/* Selected Chair Persons */}
  {sessionData.chairPersons.length > 0 && (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700">Selected Chair Persons:</p>
      <ul className="mt-2">
        {sessionData.chairPersons.map((id) => {
          const person = persons.find((p) => p.id === id);
          return (
            <li key={id} className="flex items-center justify-between">
              <span>{person?.name}</span>
              <button
                type="button"
                className="text-red-500 text-xs hover:underline"
                onClick={() => handleRemoveChairPerson(id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  )}
  {errors.chairPersons && (
    <p className="text-red-500 text-xs mt-1">{errors.chairPersons}</p>
  )}
</div>

{/* Papers */}
<div className="mb-4">
  <label className="block text-gray-700 font-medium mb-1">Papers</label>
  <input
    type="text"
    value={paperSearch}
    onChange={(e) => setPaperSearch(e.target.value)}
    className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
    placeholder="Search papers..."
  />
  {paperSearch && (
    <ul className="mt-2 border rounded-md bg-white max-h-40 overflow-y-auto">
      {filteredPapers.map((paper) => (
        <li
          key={paper.id}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setSessionData({
              ...sessionData,
              papers: [...sessionData.papers, paper.id],
            });
            setPaperSearch('');
          }}
        >
          {paper.title}
        </li>
      ))}
    </ul>
  )}
  {/* Selected Papers */}
  {sessionData.papers.length > 0 && (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700">Selected Papers:</p>
      <ul className="mt-2">
        {sessionData.papers.map((id) => {
          const paper = papers.find((p) => p.id === id);
          return (
            <li key={id} className="flex items-center justify-between">
              <span>{paper?.title}</span>
              <button
                type="button"
                className="text-red-500 text-xs hover:underline"
                onClick={() => handleRemovePaper(id)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  )}
</div>


      </>
    )}

    <button
      type="submit"
      className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-500"
    >
      <div className="flex items-center justify-center gap-2">
        <FaPen />
        {editSessionId ? 'Save Session' : 'Add Session'}
      </div>
    </button>
  </div>
</form>


  );
};

export default SessionForm;

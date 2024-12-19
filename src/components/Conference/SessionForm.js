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

  const handleSubmit = () => {
    if (validateForm()) {
      if (editSessionId) {
        handleEditSession(dayId, editSessionId);
      } else {
        handleAddSession(dayId);
      }
    }
  };

  return (
    <div className="mt-4 p-20 py-12 w-fit border rounded-lg shadow-lg bg-white flex flex-col items-center">
      <div className="w-fit">
        <h3 className="text-xl font-bold text-blue-500 pb-10">
          {editSessionId ? 'Edit Session' : 'Add New Session'}
        </h3>
        <div className="mb-8 border-b border-gray-900/10 py-4 border-t">
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
                  chairPersons: e.target.checked
                    ? []
                    : sessionData.chairPersons,
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
          <label className="block text-gray-700 font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={sessionData.title}
            onChange={(e) =>
              setSessionData({ ...sessionData, title: e.target.value })
            }
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {!sessionData.isBreak && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              value={sessionData.description}
              onChange={(e) =>
                setSessionData({ ...sessionData, description: e.target.value })
              }
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
            />
          </div>
        )}
        <div className="flex gap-2">
          {/* Start Time */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
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
                const newStartTime = Timestamp.fromDate(
                  new Date(e.target.value)
                );
                setSessionData({
                  ...sessionData,
                  startTime: newStartTime,
                });

                // Clear end time if it's invalid
                if (
                  sessionData.endTime &&
                  newStartTime.seconds >= sessionData.endTime.seconds
                ) {
                  setSessionData({
                    ...sessionData,
                    startTime: newStartTime,
                    endTime: null, // Reset end time
                  });
                  setErrors({ ...errors, endTime: null });
                }
              }}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-500 focus:outline-none"
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
            )}
          </div>

          {/* End Time */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              End Date and Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={
                sessionData.endTime
                  ? epochToDatetimeLocal(sessionData.endTime.seconds)
                  : ''
              }
              min={
                sessionData.startTime
                  ? epochToDatetimeLocal(sessionData.startTime.seconds)
                  : null
              } // Prevent selecting an end time earlier than the start time
              onChange={(e) => {
                const newEndTime = Timestamp.fromDate(new Date(e.target.value));
                if (
                  sessionData.startTime &&
                  newEndTime.seconds <= sessionData.startTime.seconds
                ) {
                  setErrors({
                    ...errors,
                    endTime: 'End time must be after start time.',
                  });
                } else {
                  setErrors({ ...errors, endTime: null });
                }
                setSessionData({
                  ...sessionData,
                  endTime: newEndTime,
                });
              }}
              className="w-full mb-2 p-2 border rounded focus:ring focus:ring-blue-500 focus:outline-none"
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
            )}
          </div>
        </div>
        {!sessionData.isBreak && (
          <>
            {/* Presenters Search and Selection */}
            <div className="relative mb-4 border-t border-gray-900/10 pt-8 mt-8">
              <label className="block text-gray-700 font-medium mb-2">
                Presenters <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={presenterSearch}
                onChange={(e) => setPresenterSearch(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
              />
              {errors.presenters && (
                <p className="text-red-500 text-sm mt-1">{errors.presenters}</p>
              )}
              {presenterSearch && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
                  {filteredPresenters.map((person) => (
                    <li
                      key={person.id}
                      onClick={() => {
                        if (!sessionData.presenters.includes(person.id)) {
                          setSessionData({
                            ...sessionData,
                            presenters: [...sessionData.presenters, person.id],
                          });
                        }
                        setPresenterSearch('');
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {person.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selected Presenters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sessionData.presenters.map((presenterId) => {
                const presenter = persons.find((p) => p.id === presenterId);
                return (
                  <span
                    key={presenterId}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {presenter?.name || 'Unknown'}
                    <button
                      onClick={() => handleRemovePresenter(presenterId)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Chair Persons Search and Selection */}
            <div className="relative mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Chair Persons <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={chairPersonSearch}
                onChange={(e) => setChairPersonSearch(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
              />
              {errors.chairPersons && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.chairPersons}
                </p>
              )}
              {chairPersonSearch && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
                  {filteredChairPersons.map((person) => (
                    <li
                      key={person.id}
                      onClick={() => {
                        if (!sessionData.chairPersons.includes(person.id)) {
                          setSessionData({
                            ...sessionData,
                            chairPersons: [
                              ...sessionData.chairPersons,
                              person.id,
                            ],
                          });
                        }
                        setChairPersonSearch('');
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {person.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selected Chair Persons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sessionData.chairPersons.map((chairPersonId) => {
                const chairPerson = persons.find((p) => p.id === chairPersonId);
                return (
                  <span
                    key={chairPersonId}
                    className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {chairPerson?.name || 'Unknown'}
                    <button
                      onClick={() => handleRemoveChairPerson(chairPersonId)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Papers Search and Selection */}
            <div className="relative mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Papers
              </label>
              <input
                type="text"
                value={paperSearch}
                onChange={(e) => setPaperSearch(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
              />
              {paperSearch && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
                  {filteredPapers.map((paper) => (
                    <li
                      key={paper.id}
                      onClick={() => {
                        if (!sessionData.papers.includes(paper.id)) {
                          setSessionData({
                            ...sessionData,
                            papers: [...sessionData.papers, paper.id],
                          });
                        }
                        setPaperSearch('');
                      }}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {paper.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selected Papers */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sessionData.papers.map((paperId) => {
                const paper = papers.find((p) => p.id === paperId);
                return (
                  <span
                    key={paperId}
                    className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {paper?.title || 'Unknown'}
                    <button
                      onClick={() => handleRemovePaper(paperId)}
                      className="ml-2 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </>
        )}
        <button
          onClick={handleSubmit}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <div className="flex gap-2 justify-center align-center text-center">
            <FaPen />
            {editSessionId ? 'Save Session' : 'Add Session'}
          </div>
        </button>
      </div>
    </div>
  );
};

export default SessionForm;

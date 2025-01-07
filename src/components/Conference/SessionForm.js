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
  const getAvailablePresenters = () => {
    if (!sessionData.papers || sessionData.papers.length === 0) {
      return [];
    }
    
    // Get all authors from selected papers
    const selectedPapersAuthors = sessionData.papers.reduce((authors, paperId) => {
      const paper = papers.find(p => p.id === paperId);
      return paper ? [...authors, ...paper.authors] : authors;
    }, []);

    // Filter persons who are authors of selected papers and not already selected
    return persons.filter(person => 
      selectedPapersAuthors.includes(person.id) &&
      !sessionData.presenters.includes(person.id) &&
      person.name.toLowerCase().includes(presenterSearch.toLowerCase())
    );
  };

  const getAvailableChairPersons = () => {
    // Only allow selection from presenters
    return persons.filter(person =>
      sessionData.presenters.includes(person.id) &&
      !sessionData.chairPersons.includes(person.id) &&
      person.name.toLowerCase().includes(chairPersonSearch.toLowerCase())
    );
  };

  const filteredPresenters = getAvailablePresenters();
  const filteredChairPersons = getAvailableChairPersons();
  const filteredPapers = papers.filter((paper) =>
    !sessionData.papers.includes(paper.id) &&
    paper.title.toLowerCase().includes(paperSearch.toLowerCase())
  );

  const handleRemovePresenter = (personId) => {
    // Remove from presenters and also from chairPersons if present
    setSessionData({
      ...sessionData,
      presenters: sessionData.presenters.filter((id) => id !== personId),
      chairPersons: sessionData.chairPersons.filter((id) => id !== personId), // Remove from chairPersons as well
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

  const handleTimeChange = (e, isStartTime) => {
    const selectedDateTime = new Date(e.target.value);
    const selectedHours = selectedDateTime.getHours();
    const selectedMinutes = selectedDateTime.getMinutes();

    // If we have an existing time, use its date, otherwise use the first selected date
    let existingDate;
    if (isStartTime) {
      existingDate = sessionData.startTime ? sessionData.startTime.toDate() : selectedDateTime;
    } else {
      existingDate = sessionData.endTime ? sessionData.endTime.toDate() : selectedDateTime;
    }

    // Create a new date with the existing date but new time
    const newDate = new Date(existingDate);
    newDate.setHours(selectedHours);
    newDate.setMinutes(selectedMinutes);

    // Update the state
    setSessionData({
      ...sessionData,
      [isStartTime ? 'startTime' : 'endTime']: Timestamp.fromDate(newDate)
    });
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
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={
                sessionData.startTime
                  ? epochToDatetimeLocal(sessionData.startTime.seconds)
                  : ''
              }
              onChange={(e) => handleTimeChange(e, true)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
              onFocus={(e) => {
                // If no start time is set, set it to current date
                if (!sessionData.startTime) {
                  const now = new Date();
                  setSessionData({
                    ...sessionData,
                    startTime: Timestamp.fromDate(now)
                  });
                }
              }}
            />
            {errors.startTime && (
              <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
            )}
          </div>

          {/* End Time */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={
                sessionData.endTime
                  ? epochToDatetimeLocal(sessionData.endTime.seconds)
                  : ''
              }
              onChange={(e) => handleTimeChange(e, false)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none"
              onFocus={(e) => {
                // If no end time is set, use the start time's date or current date
                if (!sessionData.endTime) {
                  const baseDate = sessionData.startTime ? 
                    sessionData.startTime.toDate() : 
                    new Date();
                  setSessionData({
                    ...sessionData,
                    endTime: Timestamp.fromDate(baseDate)
                  });
                }
              }}
            />
            {errors.endTime && (
              <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
            )}
            {errors.time && (
              <p className="text-red-500 text-xs mt-1">{errors.time}</p>
            )}
          </div>
        </div>

        {!sessionData.isBreak && (
          <>
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
                        // Clear presenters when papers change
                        setSessionData({
                          ...sessionData,
                          papers: [...sessionData.papers, paper.id],
                          presenters: [] // Reset presenters when papers change
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
                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-2">Selected Papers:</p>
                  <ul className="mt-2 space-y-2">
                    {sessionData.papers.map((id) => {
                      const paper = papers.find((p) => p.id === id);
                      return (
                        <li key={id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                          <span className="text-gray-700">{paper?.title}</span>
                          <button
                            type="button"
                            className="text-red-500 text-xs hover:text-red-700 hover:underline"
                            onClick={() => {
                              handleRemovePaper(id);
                              // Clear presenters when removing a paper
                              setSessionData(prev => ({
                                ...prev,
                                presenters: []
                              }));
                            }}
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

            {/* Presenters */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Presenters <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={presenterSearch}
                onChange={(e) => setPresenterSearch(e.target.value)}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none ${sessionData.papers.length === 0 ? 'bg-gray-100' : ''}`}
                placeholder={sessionData.papers.length === 0 ? "Select papers first..." : "Search presenters..."}
                disabled={sessionData.papers.length === 0}
              />
              {presenterSearch && sessionData.papers.length > 0 && (
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
                <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
                  <p className="text-sm font-medium text-green-700 mb-2">Selected Presenters:</p>
                  <ul className="mt-2 space-y-2">
                    {sessionData.presenters.map((id) => {
                      const person = persons.find((p) => p.id === id);
                      return (
                        <li key={id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                          <span className="text-gray-700">{person?.name}</span>
                          <button
                            type="button"
                            className="text-red-500 text-xs hover:text-red-700 hover:underline"
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
              {sessionData.papers.length === 0 && (
                <p className="text-gray-500 text-xs mt-1">Please select at least one paper to choose presenters</p>
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
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 border border-gray-300 focus:ring focus:ring-blue-500 focus:outline-none ${sessionData.presenters.length === 0 ? 'bg-gray-100' : ''}`}
                placeholder={sessionData.presenters.length === 0 ? "Select presenters first..." : "Search chairpersons..."}
                disabled={sessionData.presenters.length === 0}
              />
              {chairPersonSearch && sessionData.presenters.length > 0 && (
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
                <div className="mt-3 p-3 bg-purple-50 rounded-md border border-purple-100">
                  <p className="text-sm font-medium text-purple-700 mb-2">Selected Chair Persons:</p>
                  <ul className="mt-2 space-y-2">
                    {sessionData.chairPersons.map((id) => {
                      const person = persons.find((p) => p.id === id);
                      return (
                        <li key={id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                          <span className="text-gray-700">{person?.name}</span>
                          <button
                            type="button"
                            className="text-red-500 text-xs hover:text-red-700 hover:underline"
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
              {sessionData.presenters.length === 0 && (
                <p className="text-gray-500 text-xs mt-1">Please select at least one presenter to choose chairpersons</p>
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

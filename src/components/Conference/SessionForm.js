// components/conference/SessionForm.jsx
import React, { useState } from "react";
import { Timestamp } from "firebase/firestore";

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
  const [presenterSearch, setPresenterSearch] = useState("");
  const [chairPersonSearch, setChairPersonSearch] = useState("");
  const [paperSearch, setPaperSearch] = useState("");

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
  return (
    <div className="mt-4 p-4 border rounded-md">
      <h3 className="text-lg font-semibold mb-2">
        {editSessionId ? "Edit Session" : "Add New Session"}
      </h3>
      <label className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={sessionData.isBreak}
          onChange={(e) =>
            setSessionData({ ...sessionData, isBreak: e.target.checked, title: "Break" })
          }
          className="mr-2"
        />
        Is this a break session?
      </label>
      <input
        type="text"
        placeholder="Session Title"
        value={sessionData.title}
        onChange={(e) =>
          setSessionData({ ...sessionData, title: e.target.value })
        }
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="datetime-local"
        value={
          sessionData.startTime
            ? new Date(sessionData.startTime.seconds * 1000)
              .toISOString()
              .slice(0, 16)
            : ""
        }
        onChange={(e) =>
          setSessionData({
            ...sessionData,
            startTime: Timestamp.fromDate(new Date(e.target.value)),
          })
        }
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="datetime-local"
        value={
          sessionData.endTime
            ? new Date(sessionData.endTime.seconds * 1000)
              .toISOString()
              .slice(0, 16)
            : ""
        }
        onChange={(e) =>
          setSessionData({
            ...sessionData,
            endTime: Timestamp.fromDate(new Date(e.target.value)),
          })
        }
        className="w-full mb-2 p-2 border rounded"
      />
      {sessionData.isBreak
        ? null
        : <>
          <input
            type="text"
            placeholder="Location"
            value={sessionData.location}
            onChange={(e) =>
              setSessionData({ ...sessionData, location: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={sessionData.description}
            onChange={(e) =>
              setSessionData({ ...sessionData, description: e.target.value })
            }
            className="w-full mb-2 p-2 border rounded"
          />
        </>}
      {sessionData.isBreak === true
        ? null
        : <>
          {/* Presenters Search and Selection */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Presenters"
              value={presenterSearch}
              onChange={(e) => setPresenterSearch(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
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
                      setPresenterSearch("");
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
                  {presenter?.name || "Unknown"}
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
            <input
              type="text"
              placeholder="Search Chair Persons"
              value={chairPersonSearch}
              onChange={(e) => setChairPersonSearch(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {chairPersonSearch && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
                {filteredChairPersons.map((person) => (
                  <li
                    key={person.id}
                    onClick={() => {
                      if (!sessionData.chairPersons.includes(person.id)) {
                        setSessionData({
                          ...sessionData,
                          chairPersons: [...sessionData.chairPersons, person.id],
                        });
                      }
                      setChairPersonSearch("");
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
                  {chairPerson?.name || "Unknown"}
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
            <input
              type="text"
              placeholder="Search Papers"
              value={paperSearch}
              onChange={(e) => setPaperSearch(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
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
                      setPaperSearch("");
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
                  {paper?.title || "Unknown"}
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

        </>}
      <button
        onClick={() =>
          editSessionId
            ? handleEditSession(dayId, editSessionId)
            : handleAddSession(dayId)
        }
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {editSessionId ? "Save Session" : "Add Session"}
      </button>
    </div>
  );
};

export default SessionForm;

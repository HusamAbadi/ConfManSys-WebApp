// components/conference/SessionList.jsx
import React from "react";
import { FiClock, FiMapPin, FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { epochToTime } from "../../utils/epochConverter";

const SessionList = ({
  dayId,
  sessions,
  handleDeleteSession,
  setEditSessionId,
  setSelectedDayId,
  setSessionData,
  persons,
}) => {
  const getPersonName = (personId) => {
    const person = persons.find(p => p.id === personId);
    return person ? person.name : personId;
  };

  return (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <div
            key={session.id}
            className={`rounded-lg p-4 transition-all ${
              session.isBreak
                ? 'bg-green-50 hover:bg-gray-100 border-l-4 border-gray-400'
                : 'bg-blue-50 hover:bg-gray-100 border border-b-4 border-gray-400 shadow-sm hover:border-blue-200'
            }`}
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex-grow">
                <h5 className={`text-base font-semibold ${
                  session.isBreak ? 'text-gray-600' : 'text-gray-900'
                }`}>
                  {session.title}
                </h5>
                <div className="mt-2 space-y-2">
                  <p className={`text-sm ${
                    session.isBreak ? 'text-gray-500' : 'text-blue-600 font-medium'
                  }`}>
                    <FiClock className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
                    {session.startTime
                      ? epochToTime(session.startTime.seconds)
                      : "--:--"}{" "}
                    -{" "}
                    {session.endTime
                      ? epochToTime(session.endTime.seconds)
                      : "--:--"}
                  </p>
                  {session.description && (
                    <p className={`text-sm ${
                      session.isBreak ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {session.description}
                    </p>
                  )}
                  {session.location && !session.isBreak &&(
                    <p className={`text-sm ${
                      session.isBreak ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      <FiMapPin className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
                      {session.location}
                    </p>
                  )}
                  {!session.isBreak && session.chairPersons && session.chairPersons.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Chair: {session.chairPersons.map(id => getPersonName(id)).join(', ')}
                    </p>
                  )}
                  
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => {
                    setEditSessionId(session.id);
                    setSelectedDayId(dayId);
                    setSessionData({
                      title: session.title,
                      startTime: session.startTime,
                      endTime: session.endTime,
                      description: session.description,
                      location: session.location,
                      chairPersons: session.chairPersons,
                      papers: session.papers,
                      presenters: session.presenters,
                    });
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors"
                >
                  <FiEdit className="h-4 w-4 mr-1.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSession(dayId, session.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="h-4 w-4 mr-1.5" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-4">No sessions added yet.</p>
      )}
    </div>
  );
};

export default SessionList;

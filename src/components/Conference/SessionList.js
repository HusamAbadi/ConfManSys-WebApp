// components/conference/SessionList.jsx
import React from "react";
import { FiClock, FiMapPin, FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi";

const SessionList = ({
  dayId,
  sessions,
  handleDeleteSession,
  setEditSessionId,
  setSelectedDayId,
  setSessionData
}) => {
  return (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <div
            key={session.id}
            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h5 className="text-base font-semibold text-gray-900">
                  {session.title}
                </h5>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-500">
                    <FiClock className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
                    {session.startTime
                      ? new Date(session.startTime.seconds * 1000).toLocaleTimeString(navigator.language, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                      : "--:--"}{" "}
                    -{" "}
                    {session.endTime
                      ? new Date(session.endTime.seconds * 1000).toLocaleTimeString(navigator.language, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                      : "--:--"}
                  </p>
                  {session.description && (
                    <p className="text-sm text-gray-600">
                      {session.description}
                    </p>
                  )}
                  {session.location && (
                    <p className="text-sm text-gray-500">
                      <FiMapPin className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
                      {session.location}
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

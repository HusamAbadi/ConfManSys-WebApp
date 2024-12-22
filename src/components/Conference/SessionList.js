import React, { useMemo } from 'react';

const SessionList = ({
  dayId,
  sessions,
  handleDeleteSession,
  setEditSessionId,
  setSelectedDayId,
  setSessionData,
  persons,
  openModal
}) => {
  // Utility function to format time from epoch seconds
  const formatTime = (epochSeconds) => {
    const date = new Date(epochSeconds * 1000);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Helper function to check if two time ranges overlap
  const hasTimeOverlap = (start1, end1, start2, end2) => {
    return start1 < end2 && end1 > start2;
  };

  // Calculate conflicts for all sessions
  const conflicts = useMemo(() => {
    const conflictMap = new Map();

    sessions.forEach((session1) => {
      sessions.forEach((session2) => {
        if (session1.id !== session2.id && !session1.isBreak && !session2.isBreak) {
          const hasOverlap = hasTimeOverlap(
            session1.startTime.seconds,
            session1.endTime.seconds,
            session2.startTime.seconds,
            session2.endTime.seconds
          );

          if (hasOverlap) {
            // Check presenters conflicts
            session1.presenters?.forEach(presenterId => {
              if (session2.presenters?.includes(presenterId)) {
                conflictMap.set(presenterId, true);
              }
            });

            // Check chairperson conflicts
            session1.chairPersons?.forEach(chairId => {
              if (session2.chairPersons?.includes(chairId)) {
                conflictMap.set(chairId, true);
              }
            });

            // Check if a presenter in one session is a chairperson in another
            session1.presenters?.forEach(presenterId => {
              if (session2.chairPersons?.includes(presenterId)) {
                conflictMap.set(presenterId, true);
              }
            });
            session1.chairPersons?.forEach(chairId => {
              if (session2.presenters?.includes(chairId)) {
                conflictMap.set(chairId, true);
              }
            });
          }
        }
      });
    });

    return conflictMap;
  }, [sessions]);

  const getPersonName = (personId) => {
    const person = persons.find((p) => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  const PersonName = ({ personId, role }) => {
    const hasConflict = conflicts.get(personId);
    const person = persons.find(p => p.id === personId);
    const name = person ? person.name : 'Unknown';

    return (
      <span
        className={`inline-flex items-center gap-1 ${
          hasConflict ? 'text-red-600 font-medium' : 'text-gray-600'
        }`}
        title={hasConflict ? `${name} has conflicting sessions` : ''}
      >
        {name}
        {hasConflict && (
          <span className="text-red-500">⚠️</span>
        )}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <div
            key={session.id}
            className={`rounded-lg p-4 transition-all ${
              session.isBreak
                ? 'bg-green-50 hover:bg-green-100 border-l-4 border-green-400'
                : 'bg-blue-50 hover:bg-blue-100 border border-b-4 border-blue-400 shadow-sm hover:border-blue-500'
            }`}
          >
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex-grow">
                <h5 className="text-lg font-semibold text-gray-900">
                  {session.title}
                </h5>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-blue-600 font-medium">
                    <span className="mr-1.5">🕒</span>
                    {formatTime(session.startTime.seconds)} - {formatTime(session.endTime.seconds)}
                  </p>
                  
                  {!session.isBreak && (
                    <>
                      {session.location && (
                        <p className="text-sm text-gray-600">
                          <span className="mr-1.5">📍</span>
                          {session.location}
                        </p>
                      )}
                      
                      {session.chairPersons?.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500">Chair: </span>
                          <div className="flex flex-wrap gap-2">
                            {session.chairPersons.map((chairId, idx) => (
                              <React.Fragment key={chairId}>
                                <PersonName personId={chairId} role="chair" />
                                {idx < session.chairPersons.length - 1 && ", "}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      {session.presenters?.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500">Presenters: </span>
                          <div className="flex flex-wrap gap-2">
                            {session.presenters.map((presenterId, idx) => (
                              <React.Fragment key={presenterId}>
                                <PersonName personId={presenterId} role="presenter" />
                                {idx < session.presenters.length - 1 && ", "}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 sm:mt-0 flex space-x-2">
                <button
                  onClick={() => {
                    setEditSessionId(session.id);
                    setSelectedDayId(dayId);
                    setSessionData({
                      ...session
                    });
                    openModal();
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors"
                >
                  <span className="mr-1.5">✏️</span>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSession(dayId, session.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <span className="mr-1.5">🗑️</span>
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
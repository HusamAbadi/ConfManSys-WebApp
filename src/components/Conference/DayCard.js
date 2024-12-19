import React from 'react';
import SessionList from './SessionList';
import { FiEdit, FiTrash2, FiPlus, FiX } from 'react-icons/fi';

const DayCard = ({
  day,
  sessionsByDay,
  handleDeleteDay,
  setEditDayId,
  setStartDate,
  setEndDate,
  setSelectedDayId,
  selectedDayId,
  handleDeleteSession,
  setEditSessionId,
  setSessionData,
  persons,
  openModal,
}) => {
  const startDate = day.startDate
    ? new Date(day.startDate.seconds * 1000)
    : null;
  const endDate = day.endDate ? new Date(day.endDate.seconds * 1000) : null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-blue-100 transition-all mb-8">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-blue-900">
              {startDate
                ? startDate.toLocaleDateString(navigator.language, {
                    weekday: 'long',
                    month: 'short',
                    day: '2-digit',
                    year: '2-digit',
                  })
                : 'Date not available'}
            </h3>
            <p className="mt-2 text-md text-blue-600 font-medium">
              {startDate
                ? startDate.toLocaleTimeString(navigator.language, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--:--'}{' '}
              -{' '}
              {endDate
                ? endDate.toLocaleTimeString(navigator.language, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--:--'}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => {
                setEditDayId(day.id);
                if (startDate && endDate) {
                  setStartDate(startDate.toISOString().slice(0, 16));
                  setEndDate(endDate.toISOString().slice(0, 16));
                }
              }}
              className="inline-flex items-center px-3 py-1.5 border border-yellow-600 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors"
            >
              <FiEdit className="h-4 w-4 mr-1.5" />
              Edit
            </button>
            <button
              onClick={() => handleDeleteDay(day.id)}
              className="inline-flex items-center px-3 py-1.5 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <FiTrash2 className="h-4 w-4 mr-1.5" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900">Sessions</h4>
          {/* <button
            onClick={() => {
              setSelectedDayId(selectedDayId === day.id ? null : day.id);
              setSessionData({
                title: '',
                startTime: '',
                endTime: '',
                description: '',
                location: '',
                chairPersons: [],
                papers: [],
                presenters: [],
              });
              setEditSessionId(null);
            }}
            className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
              selectedDayId === day.id
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {selectedDayId === day.id ? (
              <>
                <FiX className="h-4 w-4 mr-1.5" />
                Cancel
              </>
            ) : (
              <>
                <FiPlus className="h-4 w-4 mr-1.5" />
                Add Session
              </>
            )}
          </button> */}
          <button
            onClick={() => {
              openModal(); // Open modal
              setSelectedDayId(day.id); // Optional: Pre-select the day
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Session
          </button>
        </div>

        <SessionList
          dayId={day.id}
          sessions={sessionsByDay[day.id] || []}
          handleDeleteSession={handleDeleteSession}
          setEditSessionId={setEditSessionId}
          setSelectedDayId={setSelectedDayId}
          setSessionData={setSessionData}
          persons={persons}
        />
      </div>
    </div>
  );
};

export default DayCard;

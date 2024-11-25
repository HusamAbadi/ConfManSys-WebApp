// components/conference/DayCard.jsx
import React from "react";
import SessionList from "./SessionList";
import { FiEdit, FiTrash2, FiPlus , FiX  } from "react-icons/fi";
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
}) => {
  const startDate = day.startDate
    ? new Date(day.startDate.seconds * 1000)
    : null;
  const endDate = day.endDate ? new Date(day.endDate.seconds * 1000) : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {startDate ? startDate.toDateString() : "Date not available"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {startDate ? startDate.toLocaleTimeString() : "--:--"} -{" "}
              {endDate ? endDate.toLocaleTimeString() : "--:--"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
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
          <button
            onClick={() => {
              setSelectedDayId(selectedDayId === day.id ? null : day.id);
              setSessionData({
                title: "",
                startTime: "",
                endTime: "",
                description: "",
                location: "",
                chairPersons: [],
                papers: [],
                presenters: [],
              });
              setEditSessionId(null);
            }}
            className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
              selectedDayId === day.id
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {selectedDayId === day.id ? (
              <>
                <FiX  className="h-4 w-4 mr-1.5" />
                Cancel
              </>
            ) : (
              <>
                <FiPlus  className="h-4 w-4 mr-1.5" />
                Add Session
              </>
            )}
          </button>
        </div>

        <SessionList
          dayId={day.id}
          sessions={sessionsByDay[day.id] || []}
          handleDeleteSession={handleDeleteSession}
          setEditSessionId={setEditSessionId}
          setSelectedDayId={setSelectedDayId}
          setSessionData={setSessionData}
        />
      </div>
    </div>
  );
};

export default DayCard;

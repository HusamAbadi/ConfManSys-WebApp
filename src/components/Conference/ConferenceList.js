import React from "react";
import { Link } from "react-router-dom";

const ConferenceList = ({ conferences, onEdit, onDelete }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Conferences</h2>
      <ul className="space-y-3 mb-8">
        {conferences.map((conference) => (
          <li
            key={conference.id}
            className="hover:bg-gray-50 rounded-lg transition-colors shadow"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <Link
                to={`/conferences/${conference.id}`}
                className="block text-blue-600 hover:text-blue-800 font-medium"
              >
                {conference.name}
              </Link>
              <div>
                <button
                  onClick={() => onEdit(conference)}
                  className="text-blue-500 hover:text-blue-700 mr-2 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(conference.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConferenceList;

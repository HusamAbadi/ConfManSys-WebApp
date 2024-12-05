import React from "react";

const KeywordsList = ({ keywords, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Keywords:</h2>
      <ul className="space-y-2">
        {keywords.map((keyword) => (
          <li key={keyword.id} className="flex justify-between items-center">
            <span>{keyword.name}</span>
            <div>
              <button
                onClick={() => onEdit(keyword)}
                className="text-blue-600 hover:text-blue-800 ml-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(keyword.id)}
                className="text-red-600 hover:text-red-800 ml-2"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeywordsList;

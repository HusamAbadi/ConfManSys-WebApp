import React from "react";

const AuthorList = ({ authors, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">All Authors</h2>
      <ul className="space-y-2">
        {authors.map((author) => (
          <li key={author.id} className="flex justify-between items-center">
            <span>{author.name}</span>
            <div>
              <button
                onClick={() => onEdit(author)}
                className="text-blue-600 hover:text-blue-800 ml-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(author.id)}
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

export default AuthorList;

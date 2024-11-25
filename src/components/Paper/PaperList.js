// PaperList.js
import React from "react";

import { Link } from "react-router-dom";
const PaperList = ({ papers, onEdit, onDelete }) => {
  return (
    <div>
      {papers.map((paper) => (
        <div key={paper.id} className="border-b mb-4 pb-4">
          <Link to={`/papers/${paper.id}`} state={{ paper }} className="text-xl font-semibold">
            {paper.title}
          </Link>
          <p className="overflow-hidden whitespace-nowrap text-ellipsis">
            {paper.abstract}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(paper)}
              className="bg-yellow-300 text-black px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(paper.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaperList;

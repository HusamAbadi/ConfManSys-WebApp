// PaperDetails.js
import React from "react";
import { useLocation } from "react-router-dom";

const PaperDetail = () => {
  const location = useLocation();
  const { paper } = location.state || {};

  if (!paper) {
    return <div>No paper details available</div>;
  }

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-semibold mb-2">{paper.title}</h1>
      <p className="text-gray-700">{paper.abstract}</p>
    </div>
  );
};


export default PaperDetail;

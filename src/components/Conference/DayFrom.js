// components/conference/DayForm.jsx
import React from "react";

const DayForm = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleAddDay,
  editDayId,
  handleEditDay,
}) => {
 return (
   <div className="bg-gray-50 rounded-lg p-6">
     <h2 className="text-xl font-semibold mb-4">
       {editDayId ? "Edit Day" : "Add New Day"}
     </h2>
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           Start Date & Time
         </label>
         <input
           type="datetime-local"
           value={startDate}
           onChange={(e) => setStartDate(e.target.value)}
           className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
         />
       </div>
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-1">
           End Date & Time
         </label>
         <input
           type="datetime-local"
           value={endDate}
           onChange={(e) => setEndDate(e.target.value)}
           className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
         />
       </div>
     </div>
     <div className="mt-4">
       <button
         onClick={editDayId ? () => handleEditDay(editDayId) : handleAddDay}
         className={`px-4 py-2 rounded-md text-white font-medium ${
           editDayId
             ? "bg-green-600 hover:bg-green-700"
             : "bg-blue-600 hover:bg-blue-700"
         } transition-colors`}
       >
         {editDayId ? "Save Changes" : "Add Day"}
       </button>
     </div>
   </div>
 );
};

export default DayForm;

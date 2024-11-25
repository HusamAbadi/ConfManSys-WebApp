// src/components/PasscodeEntry.js
import React, { useState } from "react";

const PasscodeEntry = ({ onSubmit }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === "1234") {
      onSubmit(true);
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Enter Passcode</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PasscodeEntry;

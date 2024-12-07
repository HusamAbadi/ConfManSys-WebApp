import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import ConferenceList from "../components/Conference/ConferenceList";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "../components/Shared/Tabs";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaListAlt } from "react-icons/fa";
import BackgroundEventsCalendar from "../components/Conference/Calendar";

const ConferencesPage = () => {
  const {
    data: conferences,
    loading: conferencesLoading,
    error: conferencesError,
  } = useFetchData("conferences");
  console.log(conferences)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingConferenceId, setEditingConferenceId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddOrUpdateConference = async () => {
    // Basic validation
    if (
      !name.trim() ||
      !description.trim() ||
      !location.trim() ||
      !startDate ||
      !endDate
    ) {
      setSubmitError("Please fill in all fields.");
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setSubmitError("End date must be after the start date.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newConference = {
        name: name.trim(),
        description: description.trim(),
        location: location.trim(),
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (editingConferenceId) {
        const conferenceRef = doc(db, "conferences", editingConferenceId);
        await updateDoc(conferenceRef, {
          ...newConference,
          updatedAt: Timestamp.now(),
        });
        setSuccessMessage("Conference updated successfully!");
      } else {
        const docRef = await addDoc(
          collection(db, "conferences"),
          newConference
        );
        setSuccessMessage("Conference added successfully!");
        console.log("Conference added successfully with ID:", docRef.id);
      }

      resetForm();
    } catch (error) {
      console.error("Error adding/updating conference:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditConference = (conference) => {
    setName(conference.name);
    setDescription(conference.description);
    setLocation(conference.location);
    setStartDate(conference.startDate.toDate().toISOString().slice(0, 16));
    setEndDate(conference.endDate.toDate().toISOString().slice(0, 16));
    setEditingConferenceId(conference.id);
  };

  const handleDeleteConference = async (conferenceId) => {
    setSubmitError(null);
    setSuccessMessage("");

    try {
      const conferenceRef = doc(db, "conferences", conferenceId);
      await deleteDoc(conferenceRef);
      setSuccessMessage("Conference deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting conference:", error);
      setSubmitError(error.message);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setEditingConferenceId(null);
  };

  if (conferencesLoading) return <div>Loading...</div>;
  if (conferencesError) return <div>Error: {conferencesError.message}</div>;

  const filteredConferences = conferences.filter((conference) => {
    const nameMatches =
      conference.name &&
      conference.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descriptionMatches =
      conference.description &&
      conference.description.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatches || descriptionMatches;
  });

  return (
    <div className="bg-gray-50 p-8 shadow-md rounded-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a Conference</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}

      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Conference Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddOrUpdateConference}
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors duration-200
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting
            ? "Processing..."
            : editingConferenceId
              ? "Update Conference"
              : "Add Conference"}
        </button>
      </div>
      <input
        type="text"
        placeholder="Search Conferences"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />


      <Tabs>
        <TabList>
          <Tab><p className="flex gap-2 justify-center"><FaListAlt /> List</p></Tab>
          <Tab><p className="flex gap-2 justify-center"><FaCalendarAlt /> Calendar</p></Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ConferenceList
              conferences={filteredConferences}
              onEdit={handleEditConference}
              onDelete={handleDeleteConference}
            />
          </TabPanel>
          <TabPanel>
            <BackgroundEventsCalendar />
          </TabPanel>
        </TabPanels>
      </Tabs>

    </div>
  );
};

export default ConferencesPage;

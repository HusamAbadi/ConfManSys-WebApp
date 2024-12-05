import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import KeywordsList from "../components/Keywords/KeywordsList";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import ImportButton from "../components/Shared/ImportButton";

const KeywordsPage = () => {
  const { data: keywords, loading } = useFetchData("keywords");
  const [newKeyword, setNewKeyword] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [editingKeywordId, setEditingKeywordId] = useState(null); // Track keyword being edited
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddKeyword = async () => {
    setSubmitError(null);
    setSuccessMessage("");

    if (!newKeyword.trim()) {
      setSubmitError("Please enter a keyword");
      return;
    }

    try {
      const keywordData = {
        name: newKeyword.trim(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (editingKeywordId) {
        // Update existing keyword
        const keywordRef = doc(db, "keywords", editingKeywordId);
        await updateDoc(keywordRef, {
          name: keywordData.name,
          updatedAt: Timestamp.now(),
        });
        setSuccessMessage("Keyword updated successfully!");
      } else {
        // Add new keyword
        await addDoc(collection(db, "keywords"), keywordData);
        setSuccessMessage("Keyword added successfully!");
      }

      // Reset form
      setNewKeyword("");
      setEditingKeywordId(null); // Reset editing state
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding/updating keyword:", error);
      setSubmitError(error.message);
    }
  };

  const handleEditKeyword = (keyword) => {
    setNewKeyword(keyword.name);
    setEditingKeywordId(keyword.id); // Set keyword ID for editing
  };

  const handleDeleteKeyword = async (keywordId) => {
    setSubmitError(null);
    setSuccessMessage("");

    try {
      const keywordRef = doc(db, "keywords", keywordId);
      await deleteDoc(keywordRef);
      setSuccessMessage("Keyword deleted successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting keyword:", error);
      setSubmitError(error.message);
    }
  };

  const filteredKeywords = keywords?.filter((keyword) =>
    keyword.name.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Keywords</h1>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="New Keyword"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleAddKeyword}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {editingKeywordId ? "Update Keyword" : "Add Keyword"}
        </button>

        {/* Import Keywords */}
        <ImportButton contentType={"keywords"} />

        {/* Search Keywords */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Keywords"
            value={keywordSearch}
            onChange={(e) => setKeywordSearch(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {keywordSearch.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
              {filteredKeywords?.map((keyword) => (
                <li
                  key={keyword.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <span
                    onClick={() => handleEditKeyword(keyword)} // Allow selection for editing
                    className="flex-1"
                  >
                    {keyword.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the edit on click
                      handleDeleteKeyword(keyword.id);
                    }}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {filteredKeywords?.length === 0 && (
                <li className="p-2 text-gray-500">No keywords found</li>
              )}
            </ul>
          )}
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <KeywordsList
          keywords={keywords}
          onEdit={handleEditKeyword}
          onDelete={handleDeleteKeyword}
        />
      )}
    </div>
  );
};

export default KeywordsPage;

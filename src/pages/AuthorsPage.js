import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import AuthorList from "../components/Author/AuthorList";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import ImportButton from "../components/Shared/ImportButton";

const AuthorsPage = () => {
  const { data: authors, loading } = useFetchData("persons");
  const [newAuthorName, setNewAuthorName] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingAuthorId, setEditingAuthorId] = useState(null); // Track author being edited

  const handleAddAuthor = async () => {
    setSubmitError(null);
    setSuccessMessage("");

    // Validation
    if (!newAuthorName.trim()) {
      setSubmitError("Please enter an author name");
      return;
    }

    setIsSubmitting(true);

    try {
      const newAuthor = {
        name: newAuthorName.trim(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (editingAuthorId) {
        // Update existing author
        const authorRef = doc(db, "persons", editingAuthorId);
        await updateDoc(authorRef, {
          name: newAuthor.name,
          updatedAt: Timestamp.now(),
        });
        setSuccessMessage("Author updated successfully!");
      } else {
        // Add new author
        await addDoc(collection(db, "persons"), newAuthor);
        setSuccessMessage("Author added successfully!");
      }

      // Reset form
      setNewAuthorName("");
      setEditingAuthorId(null); // Reset editing state

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding/updating author:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAuthor = (author) => {
    setNewAuthorName(author.name);
    setEditingAuthorId(author.id); // Set author ID for editing
  };

  const handleDeleteAuthor = async (authorId) => {
    setSubmitError(null);
    setSuccessMessage("");

    try {
      const authorRef = doc(db, "persons", authorId);
      await deleteDoc(authorRef);
      setSuccessMessage("Author deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting author:", error);
      setSubmitError(error.message);
    }
  };

  const handleDeleteAllAuthors = async () => {
    // Confirm before deleting all authors
    const confirmDelete = window.confirm("Are you sure you want to delete ALL authors? This action cannot be undone.");
    
    if (!confirmDelete) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage("");

    try {
      // Batch delete all authors
      const batch = writeBatch(db);
      authors.forEach((author) => {
        const authorRef = doc(db, "persons", author.id);
        batch.delete(authorRef);
      });

      await batch.commit();
      setSuccessMessage(`Successfully deleted ${authors.length} authors.`);
      
      // Reset form
      setNewAuthorName("");
      setEditingAuthorId(null);
    } catch (error) {
      console.error("Error deleting all authors:", error);
      setSubmitError("Failed to delete all authors. " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAuthors = authors?.filter((author) => {
    author.name.toLowerCase().includes(authorSearch.toLowerCase())
  })

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Authors</h1>

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
          placeholder="New Author Name"
          value={newAuthorName}
          onChange={(e) => setNewAuthorName(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleAddAuthor}
          disabled={isSubmitting}
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full
            ${isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
            }
          `}
        >
          {isSubmitting
            ? "Saving..."
            : editingAuthorId
              ? "Update Author"
              : "Add Author"}
        </button>

        {/* Import Authors */}
        <ImportButton contentType={"authors"} />

        {/* Search Authors */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Authors"
            value={authorSearch}
            onChange={(e) => setAuthorSearch(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {authorSearch.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded shadow max-h-48 overflow-y-auto">
              {filteredAuthors?.map((author) => (
                <li
                  key={author.id}
                  onClick={() => handleEditAuthor(author)} // Allow selection for editing
                  className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <span>{author.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the edit on click
                      handleDeleteAuthor(author.id);
                    }}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {filteredAuthors?.length === 0 && (
                <li className="p-2 text-gray-500">No authors found</li>
              )}
            </ul>
          )}
        </div>

        <button
          onClick={handleDeleteAllAuthors}
          className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
        >
          Delete All Authors
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <AuthorList
          authors={authors}
          onEdit={handleEditAuthor}
          onDelete={handleDeleteAuthor}
        />
      )}
    </div>
  );
};

export default AuthorsPage;

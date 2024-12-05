import React, { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import useFetchAuthors from "../hooks/useFetchAuthors";
import useFetchKeywords from "../hooks/useFetchKeywords";
import PaperList from "../components/Paper/PaperList";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import ImportButton from "../components/Shared/ImportButton";

const PaperPage = () => {
  const {
    data: papers,
    loading: papersLoading,
    error: papersError,
  } = useFetchData("papers");
  const {
    data: authors = [],
    loading: authorsLoading,
    error: authorsError,
  } = useFetchAuthors();
  const {
    data: keywords = [],
    loading: keywordsLoading,
    error: keywordsError,
  } = useFetchKeywords();

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [authorSearch, setAuthorSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingPaperId, setEditingPaperId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddOrUpdatePaper = async () => {
    // Basic validation
    if (
      !title.trim() ||
      !abstract.trim() ||
      selectedAuthors.length === 0 ||
      selectedKeywords.length === 0
    ) {
      setSubmitError(
        "Please fill in all fields and select at least one author and keyword"
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const paperData = {
        title: title.trim(),
        abstract: abstract.trim(),
        authors: selectedAuthors,
        keywords: selectedKeywords,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      if (editingPaperId) {
        // Update existing paper
        const paperRef = doc(db, "papers", editingPaperId);
        await updateDoc(paperRef, { ...paperData, updatedAt: Timestamp.now() });
        setSuccessMessage("Paper updated successfully!");

        // Update keyword and author documents
        await updateKeywordAndAuthorPapers(
          editingPaperId,
          selectedAuthors,
          selectedKeywords
        );
      } else {
        // Add new paper
        const docRef = await addDoc(collection(db, "papers"), paperData);
        setSuccessMessage("Paper added successfully!");
        console.log("Paper added successfully with ID:", docRef.id);

        // Update keyword and author documents with the new paper ID
        await updateKeywordAndAuthorPapers(
          docRef.id,
          selectedAuthors,
          selectedKeywords
        );
      }

      // Reset form after successful submission
      resetForm();
    } catch (error) {
      console.error("Error adding/updating paper:", error);
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateKeywordAndAuthorPapers = async (paperId, authors, keywords) => {
    try {
      // Update each keyword document
      for (const keywordId of keywords) {
        const keywordRef = doc(db, "keywords", keywordId);
        await updateDoc(keywordRef, {
          papers: arrayUnion(paperId), // Adds the paperId to the papers array
        });
      }

      // Update each author document
      for (const authorId of authors) {
        const authorRef = doc(db, "authors", authorId);
        await updateDoc(authorRef, {
          papers: arrayUnion(paperId), // Adds the paperId to the papers array
        });
      }
    } catch (error) {
      console.error("Error updating keyword and author papers:", error);
    }
  };

  const handleEditPaper = (paper) => {
    setTitle(paper.title);
    setAbstract(paper.abstract);
    setSelectedAuthors(paper.authors);
    setSelectedKeywords(paper.keywords);
    setEditingPaperId(paper.id);
  };

  const handleDeletePaper = async (paperId) => {
    setSubmitError(null);
    setSuccessMessage("");

    try {
      const paperRef = doc(db, "papers", paperId);
      await deleteDoc(paperRef);
      setSuccessMessage("Paper deleted successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting paper:", error);
      setSubmitError(error.message);
    }
  };

  const handleRemoveAuthor = (authorId) => {
    setSelectedAuthors(selectedAuthors.filter((id) => id !== authorId));
  };

  const handleRemoveKeyword = (keywordId) => {
    setSelectedKeywords(selectedKeywords.filter((id) => id !== keywordId));
  };

  const resetForm = () => {
    setTitle("");
    setAbstract("");
    setSelectedAuthors([]);
    setSelectedKeywords([]);
    setAuthorSearch("");
    setKeywordSearch("");
    setEditingPaperId(null);
  };

  if (papersLoading || authorsLoading || keywordsLoading)
    return <div>Loading...</div>;
  if (papersError) return <div>Error: {papersError.message}</div>;
  if (authorsError) return <div>Error: {authorsError.message}</div>;
  if (keywordsError) return <div>Error: {keywordsError.message}</div>;

  // Filter authors and keywords based on search inputs
  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(authorSearch.toLowerCase())
  );
  const filteredKeywords = keywords.filter((keyword) =>
    keyword.name.toLowerCase().includes(keywordSearch.toLowerCase())
  );

  // Filter papers based on the search query
  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-6 shadow-md rounded-lg max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Papers</h1>
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
          placeholder="Paper Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <textarea
          placeholder="Abstract"
          value={abstract}
          onChange={(e) => setAbstract(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
        />

        {/* Author Search and Selection */}
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
              {filteredAuthors.map((author) => (
                <li
                  key={author.id}
                  onClick={() => {
                    if (!selectedAuthors.includes(author.id)) {
                      setSelectedAuthors([...selectedAuthors, author.id]);
                    }
                    setAuthorSearch(""); // Clear search
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {author.name}
                </li>
              ))}
              {filteredAuthors.length === 0 && (
                <li className="p-2 text-gray-500">No authors found</li>
              )}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap space-x-2">
          {selectedAuthors.map((authorId) => {
            const author = authors.find((a) => a.id === authorId);
            return (
              <span
                key={authorId}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {author?.name || "Unknown"}
                <button
                  onClick={() => handleRemoveAuthor(authorId)}
                  className="ml-2 text-red-500"
                >
                  &times; {/* Close icon */}
                </button>
              </span>
            );
          })}
        </div>

        {/* Keyword Search and Selection */}
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
              {filteredKeywords.map((keyword) => (
                <li
                  key={keyword.id}
                  onClick={() => {
                    if (!selectedKeywords.includes(keyword.id)) {
                      setSelectedKeywords([...selectedKeywords, keyword.id]);
                    }
                    setKeywordSearch(""); // Clear search
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {keyword.name}
                </li>
              ))}
              {filteredKeywords.length === 0 && (
                <li className="p-2 text-gray-500">No keywords found</li>
              )}
            </ul>
          )}
        </div>
        <div className="flex flex-wrap space-x-2">
          {selectedKeywords.map((keywordId) => {
            const keyword = keywords.find((k) => k.id === keywordId);
            return (
              <span
                key={keywordId}
                className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {keyword?.name || "Unknown"}
                <button
                  onClick={() => handleRemoveKeyword(keywordId)}
                  className="ml-2 text-red-500"
                >
                  &times; {/* Close icon */}
                </button>
              </span>
            );
          })}
        </div>

        <button
          onClick={handleAddOrUpdatePaper}
          disabled={isSubmitting}
          className={`bg-blue-500 text-white px-4 py-2 rounded w-full
            ${isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
            }
          `}
        >
          {isSubmitting
            ? "Processing..."
            : editingPaperId
              ? "Update Paper"
              : "Add Paper"}
        </button>
        <ImportButton contentType={"papers"} />
      </div>

      <input
        type="text"
        placeholder="Search Papers"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border border-gray-300 p-2 rounded mb-4"
      />


      {/* Display filtered papers with edit and delete options */}
      <PaperList
        papers={filteredPapers}
        onEdit={handleEditPaper}
        onDelete={handleDeletePaper}
      />
    </div>
  );
};

export default PaperPage;

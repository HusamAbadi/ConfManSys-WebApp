import React, { useState } from 'react';

const PaperForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      abstract,
      authors: authors.split(',').map((a) => a.trim()),
    });
    // Reset form fields
    setTitle('');
    setAbstract('');
    setAuthors('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Paper</h2>
      <input
        type="text"
        placeholder="Paper Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Abstract"
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Authors (comma separated)"
        value={authors}
        onChange={(e) => setAuthors(e.target.value)}
        required
      />
      <button type="submit">Add Paper</button>
    </form>
  );
};

export default PaperForm;

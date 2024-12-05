import React, { useState } from 'react';

const AuthorForm = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
    // Reset form field
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Author</h2>
      <input
        type="text"
        placeholder="Author Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit">Add Author</button>
    </form>
  );
};

export default AuthorForm;

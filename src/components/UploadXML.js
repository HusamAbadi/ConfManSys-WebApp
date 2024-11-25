import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import * as xml2js from 'xml2js';

const UploadXML = () => {
  const [status, setStatus] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const xmlData = e.target.result;

      try {
        // Parse XML to JSON
        const parsedResult = await xml2js.parseStringPromise(xmlData);
        // Assuming the XML structure has a list of names, e.g., <names><name>John</name></names>
        const names = parsedResult.names?.name || [];

        if (names.length === 0) {
          setStatus('No names found in the file.');
          return;
        }

        // Save names to Firestore
        const batchPromises = names.map((name) =>
          addDoc(collection(db, 'names'), { name })
        );

        await Promise.all(batchPromises);

        setStatus('Names uploaded successfully!');
      } catch (err) {
        console.error('Error processing file:', err);
        setStatus('Error uploading names. Please check the file format.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Upload XML File</h2>
      <input
        type="file"
        accept=".xml"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {status && <p>{status}</p>}
    </div>
  );
};

export default UploadXML;

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa'; // Font Awesome for icons
import { handleImportSubmit } from '../../services/handleImportSubmit';
// import './ImportButton.css';
const ImportButton = ({ contentType }) => {
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      setShowModal(true)
      const reader = new FileReader();
      reader.onload = async () => {
        const content = reader.result;
        await handleImportSubmit(content, contentType, setShowModal);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <>
      {showModal && <>
        <div
          data-dialog-backdrop="modal"
          data-dialog-backdrop-close="true"
          className="fixed inset-0 z-[999] grid h-[calc(100vh+65px)] w-screen place-items-center bg-black bg-opacity-40 backdrop-blur-sm"
        >
          <div
            data-dialog="modal"
            className="relative m-4 p-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white shadow-sm"
          >
            <div className="relative p-4 w-full max-w-2xl max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Importing Content
                  </h3>
                  <button id='modal-close-button' onClick={() => setShowModal(false)} type="button" className="hidden text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLineJoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5">
                  <p className="text-center pb-5"><span id="completed-papers">0</span> / <span id='total-papers'>n</span></p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div id='modal-progress-bar' className="bg-blue-600 h-2.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>}
      <div id="default-modal" tabindex="-1" aria-hidden="true" className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      </div>

      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-white mx-auto"
      >
        <div className='flex justify-between items-center gap-4 w-full'>
          <input
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            type="file" accept=".xml" onChange={handleFileChange} />
          <button
            className="flex w-full items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold text-sm uppercase rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="submit">
            <FaPlus className="text-lg" />
            Import {contentType}
          </button>
        </div>
      </form>
    </>
  );
};

export default ImportButton;
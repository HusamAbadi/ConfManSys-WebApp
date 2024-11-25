import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  onSnapshot,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import DayForm from "./DayFrom";
import DayCard from "./DayCard";
import SessionForm from "./SessionForm";
import { FiMapPin, FiCalendar } from "react-icons/fi";
const ConferenceDetail = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sessionData, setSessionData] = useState({
    title: "",
    startTime: null,
    endTime: null,
    description: "",
    location: "",
    chairPersons: [],
    papers: [],
    presenters: [],
    isBreak: false,
  });
  
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionsByDay, setSessionsByDay] = useState({});
  const [persons, setPersons] = useState([]);
  const [papers, setPapers] = useState([]);
  const [personSearch, setPersonSearch] = useState("");
  const [paperSearch, setPaperSearch] = useState("");
  const [editDayId, setEditDayId] = useState(null);
  const [editSessionId, setEditSessionId] = useState(null);

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const docRef = doc(db, "conferences", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConference({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Conference not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConference();
  }, [id]);

  useEffect(() => {
    if (conference) {
      console.log("Conference:", conference);
      const daysRef = collection(db, "conferences", id, "days");
      const q = query(daysRef);
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const fetchedDays = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDays(fetchedDays);
        console.log("dats:", fetchedDays);
        // console.log("day:", new Date(conference["days"][0].startDate).toDateString());
        // console.log("conf:", new Date(days[0].startDate.seconds * 1000).toLocaleString());

        // Fetch sessions for each day
        const sessionsData = {};
        for (const day of fetchedDays) {
          const sessionsRef = collection(
            doc(db, "conferences", id, "days", day.id),
            "sessions"
          );
          const sessionsSnapshot = await getDocs(sessionsRef);
          sessionsData[day.id] = sessionsSnapshot.docs.map((sessionDoc) => ({
            id: sessionDoc.id,
            ...sessionDoc.data(),
          }));
        }
        setSessionsByDay(sessionsData);
        console.log("sessons",sessionsData);
      });

      return () => unsubscribe();
    }
  }, [conference]);

  useEffect(() => {
    const fetchPersons = async () => {
      const personsRef = collection(db, "persons");
      const personsSnapshot = await getDocs(personsRef);
      const personsList = personsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPersons(personsList);
    };

    const fetchPapers = async () => {
      const papersRef = collection(db, "papers");
      const papersSnapshot = await getDocs(papersRef);
      const papersList = papersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPapers(papersList);
    };

    fetchPersons();
    fetchPapers();
  }, []);

  const handleAddDay = async () => {
    if (new Date(startDate) >= new Date(endDate)) {
      alert("End date must be after the start date.");
      return;
    }

    try {
      const daysRef = collection(db, "conferences", id, "days");
      const newDay = {
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        createdAt: Timestamp.now(),
      };
      await addDoc(daysRef, newDay);
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      console.error("Error adding day:", err);
    }
  };

  const handleEditDay = async (dayId) => {
    // Ensure both start and end datetime inputs are provided
    if (!startDate || !endDate) {
      alert("Please provide both start and end dates with times.");
      return;
    }

    const fullStartDate = new Date(startDate);
    const fullEndDate = new Date(endDate);

    // Check if the start date and time is before the end date and time
    if (fullStartDate >= fullEndDate) {
      alert("Start date and time must be before end date and time.");
      return;
    }

    try {
      // Reference to the specific day document in the database
      const dayDoc = doc(db, "conferences", id, "days", dayId);

      // Update the day document with the new start and end dates
      await updateDoc(dayDoc, {
        startDate: Timestamp.fromDate(fullStartDate),
        endDate: Timestamp.fromDate(fullEndDate),
      });

      // Reset the edit state and clear date inputs
      setEditDayId(null);
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      console.error("Error editing day:", err);
    }
  };

  const handleDeleteDay = async (dayId) => {
    try {
      const dayDoc = doc(db, "conferences", id, "days", dayId);
      await deleteDoc(dayDoc);
    } catch (err) {
      console.error("Error deleting day:", err);
    }
  };

const handleAddSession = async (dayId) => {
  const dayDoc = doc(db, "conferences", id, "days", dayId);
  const sessionsRef = collection(dayDoc, "sessions");

  try {
    const newSession = { ...sessionData };

    await addDoc(sessionsRef, {
      ...newSession,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
    });
    setSessionData({
      title: "",
      startTime: null,
      endTime: null,
      description: "",
      location: "",
      chairPersons: [],
      papers: [],
      presenters: [],
      isBreak: false,
    });
    setSelectedDayId(null);
  } catch (err) {
    console.error("Error adding session:", err);
  }
};

  const handleDeleteSession = async (dayId, sessionId) => {
    try {
      const sessionDoc = doc(
        db,
        "conferences",
        id,
        "days",
        dayId,
        "sessions",
        sessionId
      );
      await deleteDoc(sessionDoc);
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const handleEditSession = async (dayId, sessionId) => {
    try {
      const sessionDoc = doc(
        db,
        "conferences",
        id,
        "days",
        dayId,
        "sessions",
        sessionId
      );

      await updateDoc(sessionDoc, {
        ...sessionData,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
      });
      setEditSessionId(null);
      setSessionData({
        title: "",
        startTime: null,
        endTime: null,
        description: "",
        location: "",
        chairPersons: [],
        papers: [],
        presenters: [],
        isBreak: false,
      });
    } catch (err) {
      console.error("Error editing session:", err);
    }
  };

  // Filtered lists for persons and papers
  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(personSearch.toLowerCase())
  );

  const filteredPapers = papers.filter((paper) =>
    paper.title.toLowerCase().includes(paperSearch.toLowerCase())
  );

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  console.log(sessionData);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Conference Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 sm:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {conference.name}
          </h1>
          <p className="text-blue-100 mb-4">{conference.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
            <div>
              <p className="flex items-center">
                <FiMapPin className="h-5 w-5 mr-2" />
                {conference.location}
              </p>
            </div>
            <div>
              <p className="flex items-center">
                <FiCalendar className="h-5 w-5 mr-2" />
                {new Date(
                  conference.startDate.seconds * 1000
                ).toLocaleDateString()}{" "}
                -
                {new Date(
                  conference.endDate.seconds * 1000
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 sm:px-8">
          <DayForm
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            handleAddDay={handleAddDay}
            editDayId={editDayId}
            handleEditDay={handleEditDay}
          />

          <div className="mt-8 space-y-6">
            {days.map((day) => (
              <div key={day.id}>
                <DayCard
                  day={day}
                  sessionsByDay={sessionsByDay}
                  handleDeleteDay={handleDeleteDay}
                  setEditDayId={setEditDayId}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  setSelectedDayId={setSelectedDayId}
                  selectedDayId={selectedDayId}
                  handleDeleteSession={handleDeleteSession}
                  setEditSessionId={setEditSessionId}
                  setSessionData={setSessionData}
                />

                {selectedDayId === day.id && (
                  <div className="mt-4 ml-4 border-l-4 border-blue-500 pl-4">
                    <SessionForm
                      sessionData={sessionData}
                      setSessionData={setSessionData}
                      handleAddSession={handleAddSession}
                      handleEditSession={handleEditSession}
                      dayId={day.id}
                      editSessionId={editSessionId}
                      persons={persons}
                      papers={papers}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConferenceDetail;

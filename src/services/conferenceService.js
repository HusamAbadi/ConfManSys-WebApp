import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { generateConferenceDays } from "./dayService";

export const addConference = async (conferenceData) => {
  try {
    // Convert date strings to Timestamps
    const conference = {
      ...conferenceData,
      startDate: Timestamp.fromDate(new Date(conferenceData.startDate)),
      endDate: Timestamp.fromDate(new Date(conferenceData.endDate)),
      createdAt: Timestamp.now(),
    };

    // Create the conference document
    const conferenceRef = await addDoc(collection(db, "conferences"), conference);
    
    // Explicitly create the days subcollection
    const daysRef = collection(db, "conferences", conferenceRef.id, "days");
    
    // Generate days for the conference
    await generateConferenceDays(conferenceRef.id, conference.startDate, conference.endDate);
    
    return conferenceRef.id;
  } catch (error) {
    console.error("Error adding conference: ", error);
    throw error;
  }
};

export const updateConference = async (id, conferenceData) => {
  try {
    const conference = {
      ...conferenceData,
      startDate: Timestamp.fromDate(new Date(conferenceData.startDate)),
      endDate: Timestamp.fromDate(new Date(conferenceData.endDate)),
      updatedAt: Timestamp.now(),
    };

    const conferenceRef = doc(db, "conferences", id);
    await updateDoc(conferenceRef, conference);
  } catch (error) {
    console.error("Error updating conference: ", error);
    throw error;
  }
};

export const deleteConference = async (id) => {
  try {
    const conferenceRef = doc(db, "conferences", id);
    await deleteDoc(conferenceRef);
  } catch (error) {
    console.error("Error deleting conference: ", error);
    throw error;
  }
};

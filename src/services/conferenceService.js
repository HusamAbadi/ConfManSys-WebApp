import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const addConference = async (conference) => {
  try {
    const docRef = await addDoc(collection(db, "conferences"), conference);
    console.log("Conference added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding conference: ", error);
  }
};

export const updateConference = async (id, conference) => {
  try {
    const conferenceRef = doc(db, "conferences", id);
    await updateDoc(conferenceRef, conference);
  } catch (error) {
    console.error("Error updating conference: ", error);
  }
};

export const deleteConference = async (id) => {
  try {
    const conferenceRef = doc(db, "conferences", id);
    await deleteDoc(conferenceRef);
  } catch (error) {
    console.error("Error deleting conference: ", error);
  }
};

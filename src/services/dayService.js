import { collection, addDoc, Timestamp, query, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// Function to check if days already exist for a conference
export const checkExistingDays = async (conferenceId) => {
  try {
    const daysRef = collection(db, "conferences", conferenceId, "days");
    const daysQuery = query(daysRef);
    const daysSnapshot = await getDocs(daysQuery);
    
    return !daysSnapshot.empty;
  } catch (error) {
    console.error("Error checking existing days:", error);
    return false;
  }
};

// Function to create a day document for a conference
export const createDay = async (conferenceId, date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0); // Set default start time to 9:00 AM

    const endOfDay = new Date(date);
    endOfDay.setHours(17, 0, 0, 0); // Set default end time to 5:00 PM

    const daysRef = collection(db, "conferences", conferenceId, "days");
    const dayData = {
      startDate: Timestamp.fromDate(startOfDay),
      endDate: Timestamp.fromDate(endOfDay),
      createdAt: Timestamp.now(),
    };

    const dayDocRef = await addDoc(daysRef, dayData);
    console.log(`Day created for conference ${conferenceId} on ${startOfDay.toDateString()}`);
    return dayDocRef;
  } catch (error) {
    console.error(`Error creating day for conference ${conferenceId}:`, error);
    throw error;
  }
};

// Function to generate days for a conference based on start and end dates
export const generateConferenceDays = async (conferenceId, startDate, endDate) => {
  try {
    // First, check if days already exist
    const daysExist = await checkExistingDays(conferenceId);
    if (daysExist) {
      console.log(`Days already exist for conference ${conferenceId}. Skipping generation.`);
      return;
    }

    const start = new Date(startDate.seconds * 1000);
    const end = new Date(endDate.seconds * 1000);
    
    const currentDate = new Date(start);
    const createdDays = [];
    
    // Generate a day for each date in the range
    while (currentDate <= end) {
      const dayDoc = await createDay(conferenceId, new Date(currentDate));
      createdDays.push(dayDoc);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Generated ${createdDays.length} days for conference ${conferenceId}`);
    return createdDays;
  } catch (error) {
    console.error(`Error generating conference days for ${conferenceId}:`, error);
    throw error;
  }
};

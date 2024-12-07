import {
  doc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const getSessions = async (conferences) => {
  const allData = [];

  for (const conference of conferences) {
    const daysRef = collection(db, "conferences", conference.id, "days");
    const daysSnapshot = await getDocs(daysRef);
    const fetchedDays = daysSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch sessions for each day
    const sessionsData = {};
    for (const day of fetchedDays) {
      const sessionsRef = collection(
        doc(db, "conferences", conference.id, "days", day.id),
        "sessions"
      );
      const sessionsSnapshot = await getDocs(sessionsRef);
      sessionsData[day.id] = sessionsSnapshot.docs.map((sessionDoc) => ({
        id: sessionDoc.id,
        ...sessionDoc.data(),
      }));
    }

    if (Object.keys(sessionsData).length > 0) {
      allData.push({ conferenceId: conference.id, sessions: sessionsData });
    }
  }

  return allData;
};

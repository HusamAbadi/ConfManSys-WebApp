import { db } from '../firebase/config';

export const addSession = (conferenceId, session) => db.collection(`conferences/${conferenceId}/sessions`).add(session);
export const updateSession = (conferenceId, sessionId, session) =>
  db.collection(`conferences/${conferenceId}/sessions`).doc(sessionId).update(session);
export const deleteSession = (conferenceId, sessionId) => 
  db.collection(`conferences/${conferenceId}/sessions`).doc(sessionId).delete();

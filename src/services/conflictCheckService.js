import { db } from '../firebase/config';

export const checkSessionConflict = async (authorId, session) => {
  const authorData = await db.collection('persons').doc(authorId).get();
  const sessionsPresenting = authorData.data()?.sessionsPresenting || [];

  return sessionsPresenting.some((s) => s !== session.id && s.location === session.location);
};
